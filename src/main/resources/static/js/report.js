
let currentPage = 1; //Текущая страница
const itemsPerPage = 700; //Количество строк на странице
let loadLines = 0; //Загружено строк

//Ресайз колонок
$('.table-header-resizer').on('mousedown', function (e) {
    e.preventDefault();

    const $resizer = $(this);
    const $parentHeader = $resizer.closest('[data-name]');
    const dataName = $parentHeader.data('name');
    const startX = e.clientX;
    const startWidth = parseFloat($parentHeader.css('width'));

    const minWidthValue = getComputedStyle(document.documentElement)
        .getPropertyValue(`--${'default-'+dataName}`)
        .trim();

    const minWidth = parseFloat(minWidthValue) * 16;

    function doResize(e) {
        let newWidth = startWidth + (e.clientX - startX);
        newWidth = Math.max(minWidth, newWidth);

        $(':root').css(`--${dataName}`, (newWidth/16) + 'rem');
    }

    function stopResize() {
        $(window).off('mousemove', doResize)
            .off('mouseup', stopResize);
    }

    $(window).on('mousemove', doResize)
        .on('mouseup', stopResize);
});
//Раскрытие вложенных строк
$(document).on('click', '.hamburger', function (e) {
    if ($(e.target).is('input')) {
        return;
    }
    e.preventDefault();

    const $checkbox = $(this).find('input[type="checkbox"]');
    const $currentRow = $(this).closest('.row');
    const $lineContainer = $currentRow.find('.line-container');
    const $thirdLine = $lineContainer.children('.third-line');
    const spinner = `
            <div class="dot-spinner">
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
            </div> `;

    (async () => {
        if (!$checkbox.prop('checked') && !$currentRow.hasClass('cached')) {
            $currentRow.children('.hamburger').addClass('none')
            $currentRow.prepend(spinner);
            await loadChild($currentRow);
            $currentRow.children('.dot-spinner').remove();
            $currentRow.children('.hamburger').removeClass('none');
        }
        const $innerRows = $currentRow.closest('.table-rows-items').children('.inner-rows')
            .children('.table-rows-items').children('.row');

        if ($currentRow.data('level') === 0) {
            $lineContainer.slideToggle();
        }

        $checkbox.prop('checked', !$checkbox.prop('checked'));
        $thirdLine.slideToggle(100);
        if ($currentRow.data('level') > 0 && !$lineContainer.hasClass('has-children')) {
            $lineContainer.addClass('has-children');
        } else if ($lineContainer.has('.has-children')) {
            $lineContainer.removeClass('has-children');
        }
        $innerRows.closest('.table-rows-items').closest('.inner-rows').slideToggle(1100);
    })();
});
//Загрузка доп строк
$(document).on('click', '.load-more', async function (e) {
    currentPage++;
    await displayPage(currentPage);
});
//Динамическая загрузка/удаление строк при скролле(не работает)
$('main').on('scroll', async function () {
    const rows = $(this);
    const rowHeight = 25;
    const visibleRows = Math.ceil(rows.height() / rowHeight);
    const buffer = 5; // Буферные строки сверху и снизу

    function renderRows() {
        const scrollTop = rows.scrollTop();
        const firstVisible = Math.floor(scrollTop / rowHeight) - buffer;
        const lastVisible = firstVisible + visibleRows + 2 * buffer;

        rows.empty();

        const topPlaceholder = $('<div>').addClass('placeholder');
        topPlaceholder.height(Math.max(0, firstVisible) * rowHeight);
        rows.append(topPlaceholder);

        // Добавляем видимые строки
        for (let i = Math.max(0, firstVisible); i <= Math.min(loadLines - 1, lastVisible); i++) {
            const row = $('<div>').addClass('row').text(data[i]);
            rows.append(row);
        }

        // Добавляем нижний плейсхолдер
        const bottomPlaceholder = $('<div>').addClass('placeholder');
        bottomPlaceholder.height(Math.max(0, loadLines - lastVisible - 1) * rowHeight);
        rows.append(bottomPlaceholder);
    }
});
//Создание строки
async function createRow(item, type, parentId, level, hasChildren, isLast, hasNext) {
    const hamburger = `
        <label class="hamburger">
            <input type="checkbox">
            <svg viewBox="0 0 32 32">
                <path class="line line-top-bottom"
                    d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
                <path class="line" d="M7 16 27 16"></path>
            </svg>
        </label>`
    let rowsContainer;
    let row;
    if (type === 'pd') {
        rowsContainer = $(".table-rows");
        row = `
            <div class="table-rows-items">
                <div class="row" data-parent-id="#" data-id="${item.jobComponent.id}" data-level="0" data-has-next="${String(hasNext)}" style="font-weight: bold;">
                    ${hasChildren ? hamburger : ""}
                    <div class="row-item" style="width: var(--primarydemand)" data-name="primarydemand">
                        <p>
                            ${item.name}
                            <span class="line-container">
                                <span class="third-line"></span>
                            </span>
                        </p>
                    </div>
                    <div class="row-item" style="width: var(--item)" data-name="item">${item.jobComponent.name}</div>
                    <div class="row-item" style="width: var(--mlm-node)" data-name="mlm-node"></div>
                    <div class="row-item" style="width: var(--description)" data-name="description"></div>
                    <div class="row-item numbers" style="width: var(--qty)" data-name="qty">${item.jobComponent.qty}</div>
                    <div class="row-item numbers" style="width: var(--qty-finished)" data-name="qty-finished">${item.jobComponent.qtyFinished}</div>
                    <div class="row-item numbers" style="width: var(--resourcetime)" data-name="resourcetime"></div>
                    <div class="row-item" style="width: var(--date-start)" data-name="date-start">${formatDate(item.jobComponent.dateStart)}</div>
                    <div class="row-item" style="width: var(--date-end)" data-name="date-end">${formatDate(item.jobComponent.dateEnd)}</div>
                    <div class="row-item" style="width: var(--date-calc-start)" data-name="date-calc-start"></div>
                    <div class="row-item" style="width: var(--date-calc-end)" data-name="date-calc-end"></div>
                </div>
                <div class="inner-rows"></div>
            </div>`;
        rowsContainer.append(row);
    } else {
        rowsContainer = $(`[data-id="${parentId}"]`).closest('.table-rows-items').children('.inner-rows');
        const primaryDemand = $(`[data-id="${parentId}"] .row-item[data-name="primarydemand"] p`).text().trim();
        row = `
            <div class="table-rows-items">
                <div class="row" data-parent-id="${parentId}" data-id="${item.id}" data-level="${level}" style="vertical-align: ${type === 'jc' ? "super" : "sub"};
                                                                                                                font-size: ${type === 'jc' ? "0.825rem" : "0.750rem"};
                                                                                                                ${type === "jc" ? " text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);" : ""}">
                    ${type === "jc" ? hasChildren ? hamburger : "" : ""}
                    <div class="row-item first-element" style="width: var(--primarydemand); padding-left: ${(1.5 + (level * 0.5)) + 'rem'}" data-name="primarydemand">
                        <p>
                            ${primaryDemand}
                            <span class="line-container ${isLast ? 'last-line' : ''}">
                                <span class="third-line"></span>
                                ${isLast && hasNext ? '<span class="second-line"></span>' : ''}
                            </span>
                        </p>
                    </div>
                    <div class="row-item" style="width: var(--item)" data-name="item">${item.name}</div>
                    <div class="row-item" style="width: var(--mlm-node);" data-name="mlm-node">${type === 'jc' ? "" : item.mlmNode}</div>
                    <div class="row-item" style="width: var(--description);" data-name="description">${type === 'jc' ? "" : item.description}</div>
                    <div class="row-item numbers" style="width: var(--qty);" data-name="qty">${item.qty}</div>
                    <div class="row-item numbers" style="width: var(--qty-finished);" data-name="qty-finished">${item.qtyFinished}</div>
                    <div class="row-item numbers" style="width: var(--resourcetime);" data-name="resourcetime">${type === 'jc' ? "" : item.resourceTime}</div>
                    <div class="row-item" style="width: var(--date-start);" data-name="date-start">${formatDate(item.dateStart)}</div>
                    <div class="row-item" style="width: var(--date-end);" data-name="date-end">${formatDate(item.dateEnd)}</div>
                    <div class="row-item" style="width: var(--date-calc-start);" data-name="date-calc-start">${type === 'jc' ? "" : formatDate(item.dateCalcStart)}</div>
                    <div class="row-item" style="width: var(--date-calc-end);" data-name="date-calc-end">${type === 'jc' ? "" : formatDate(item.dateCalcEnd)}</div>
                </div>
                <div class="inner-rows"></div>
            </div>`;
        rowsContainer.append(row);
    }
}
//Загрузка вложенных строк строки
async function loadChild(row) {
    const rowId = row.data('id');
    const parentId = row.data('parent-id');
    const level = row.data('level');
    let hasNext = Boolean(row.data('has-next'));

    const jobComponents = await $.get('/spm-api/getChildJobComponentForJobcomponentId', {jobComponentId: rowId});
    for (jc of jobComponents) {
        const isLast = (jobComponents.indexOf(jc) === jobComponents.length - 1) && (await $.get('spm-api/getJobStepsForJobComponentId', {jobComponentId: rowId})).length === 0;
        const hasChildren = (await $.get('/spm-api/getChildJobComponentForJobcomponentId', {jobComponentId: jc.id})).length > 0;
        hasNext = jobComponents.indexOf(jc) < jobComponents.length - 1 ? true : (await $.get('spm-api/getJobStepsForJobComponentId', {jobComponentId: rowId})).length > 0;

        await createRow(jc, 'jc', rowId, level + 1, hasChildren, isLast, hasNext);
    }
    const jobSteps = await $.get('spm-api/getJobStepsForJobComponentId', {jobComponentId: rowId});

    for (js of jobSteps) {
        const isLast = jobSteps.indexOf(js) === jobSteps.length - 1;
        await createRow(js, 'js', rowId, level + 1, false, isLast, hasNext && level > 0);
    }
    $(row).addClass('cached')
}
//Рекурсивная загрузка всех строк
async function makeChildRow(parentId, level, hasChildren, hasNext) {
    if (hasChildren) {
        const jobComponents = await $.get('/spm-api/getChildJobComponentForJobcomponentId', {jobComponentId: parentId});
        for (jc of jobComponents) {
            const isLast = (jobComponents.indexOf(jc) === jobComponents.length - 1) && (await $.get('spm-api/getJobStepsForJobComponentId', {jobComponentId: parentId})).length === 0;
            const hasChildren = (await $.get('/spm-api/getChildJobComponentForJobcomponentId', {jobComponentId: jc.id})).length > 0;
            await createRow(jc, 'jc', parentId, level + 1, hasChildren, isLast, hasNext);
            hasNext = jobComponents.indexOf(jc) < jobComponents.length - 1 ? true : (await $.get('spm-api/getJobStepsForJobComponentId', {jobComponentId: parentId})).length > 0;
            await makeChildRow(jc.id, level + 1, hasChildren, hasNext);
        }
    }

    const jobSteps = await $.get('spm-api/getJobStepsForJobComponentId', {jobComponentId: parentId});
    for (js of jobSteps) {
        const isLast = jobSteps.indexOf(js) === jobSteps.length - 1;
        await createRow(js, 'js', parentId, level + 1, false, isLast, hasNext && level > 0);
    }
}
//Загрузка страниц
async function displayPage(page) {
    async function loadPrimaryDemands(page) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/spm-api/getPrimaryDemandForCustomerOrderId',
                type: 'GET',
                data: {
                    customerOrderId: '73435423',
                    page: page,
                    size: itemsPerPage
                },
                success: function (data, textStatus, jqXHR) {
                    const totalCount = parseInt(jqXHR.getResponseHeader('X-Total-Count'));
                    resolve({
                        data: data,
                        total: totalCount
                    });
                }
            });
        });
    }

    const primaryDemandsAndTotalCount = await loadPrimaryDemands(page);
    const primaryDemands = primaryDemandsAndTotalCount.data;
    const totalCount = primaryDemandsAndTotalCount.total;
    loadLines += primaryDemands.length;
    const rowsContainer = $(".table-rows");

    if (page === 1) {
        $('#table-data').empty();
        [...('Всего записей: ' + totalCount)].forEach((c, i) => setTimeout(() => $('.total-count').append(c), 90 * i));
        [...('Загружено записей: ')].forEach((c, i) => setTimeout(() => $('.load-count span:eq(0)').append(c), 120 * i));
    }
    rowsContainer.children('.load-more').remove();

    const childrenData = await Promise.all(primaryDemands.map(pd =>
        $.get('/spm-api/getChildJobComponentForJobcomponentId', {jobComponentId: pd.jobComponent.id})
    ));
    const hasChildrenFlags = childrenData.map(data => data.length > 0);

    for (let i = 0; i < primaryDemands.length; i++) {
        await createRow(primaryDemands[i], 'pd', '#', 0, hasChildrenFlags[i]);
    }

    $('.load-count span:eq(1)').empty();
    setTimeout(() => {
        [...(String(loadLines))].forEach((c, i) => {setTimeout(() => {$('.load-count span:eq(1)').append(c);}, 120 * i);});},
        1600);


    if (loadLines < totalCount) {
        rowsContainer.append(`<div class="load-more"><span>Загрузить ещё...</span></div>`)
    }
}
//Форматирование дат
function formatDate(dateString) {
    if (!dateString) return "&nbsp;";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

$(document).ready(async function () {
    await displayPage(1);
    window.open(`/report/print?customerOrderId=73435423`);
});


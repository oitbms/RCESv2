//Раскрытие вложенных строк
$(document).on('click', '.hamburger', async function (e) {
    if ($(e.target).is('input')) {
        return;
    }

    const $checkbox = $(this).find('input[type="checkbox"]');
    const $currentRow = $(this).closest('.row');
    const $lineContainer = $currentRow.find('.line-container');
    const $thirdLine = $lineContainer.children('.third-line');
    const $innerRows = $currentRow.closest('.table-rows-items').children('.inner-rows')
        .children('.table-rows-items').children('.row');
    if ($innerRows.length === 0 || $innerRows.html().trim() === '') {
        $checkbox.prop('checked', !$checkbox.prop('checked'))
        return;
    }
    if ($currentRow.data('level') === 0) {
        $lineContainer.slideToggle();
    }
    if ($currentRow.data('level') > 0 && !$lineContainer.hasClass('has-children')) {
        $lineContainer.addClass('has-children');
    } else if ($lineContainer.has('.has-children')) {
        $lineContainer.removeClass('has-children');
    }
    $thirdLine.slideToggle();
    $innerRows.closest('.table-rows-items').closest('.inner-rows').slideToggle();
});

//Ресайз колонок
$('.table-header-resizer').on('mousedown', function (e) {
    e.preventDefault();

    const $resizer = $(this);
    const $parentHeader = $resizer.closest('[data-name]');
    const dataName = $parentHeader.data('name');
    const startX = e.clientX;
    const startWidth = parseFloat($parentHeader.css('width'));

    const minWidthValue = getComputedStyle(document.documentElement)
        .getPropertyValue(`--${dataName}`)
        .trim();

    const minWidth = parseFloat(minWidthValue) * 16;

    const $allElementsWithSameName = $(`[data-name="${dataName}"]`);

    function doResize(e) {
        let newWidth = startWidth + (e.clientX - startX);
        newWidth = Math.max(minWidth, newWidth);

        $allElementsWithSameName.css('width', newWidth + 'px');
    }

    function stopResize() {
        $(window).off('mousemove', doResize)
            .off('mouseup', stopResize);
    }

    $(window).on('mousemove', doResize)
        .on('mouseup', stopResize);
});

//Тестовые данные
$(document).ready(async function () {

    async function createRow(item, type, parentId, level, hasChildren, isLast, isLastAndHasNextChildren) {
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
                <div class="row" data-parent-id="#" data-id="${item.jobComponent.id}" data-level="0" style="font-weight: bold;">
                    ${hasChildren ? hamburger : ""}
                    <div class="row-item" style="width: 29.625rem;" data-name="primarydemand">
                        <p>
                            ${item.name}
                            <span class="line-container">
                                <span class="third-line"></span>
                            </span>
                        </p>
                    </div>
                    <div class="row-item" style="width: 25.125rem;" data-name="item">${item.jobComponent.name}</div>
                    <div class="row-item" style="width: 17.5625rem;" data-name="mlm-node"></div>
                    <div class="row-item" style="width: 15.9375rem;" data-name="description"></div>
                    <div class="row-item numbers" style="width: 6.25rem;" data-name="qty">${item.jobComponent.qty}</div>
                    <div class="row-item numbers" style="width: 7.25rem;" data-name="qty-finished">${item.jobComponent.qtyFinished}</div>
                    <div class="row-item numbers" style="width: 7.625rem;" data-name="resourcetime"></div>
                    <div class="row-item" style="width: 6.6875rem;" data-name="date-start">${formatDate(item.jobComponent.dateStart)}</div>
                    <div class="row-item" style="width: 8rem;" data-name="date-end">${formatDate(item.jobComponent.dateEnd)}</div>
                    <div class="row-item" style="width: 6.6875rem;" data-name="date-calc-start"></div>
                    <div class="row-item" style="width: 8rem;" data-name="date-calc-end"></div>
                </div>
                <div class="inner-rows"></div>
            </div>`;
            rowsContainer.append(row);
        } else {
            rowsContainer = $(`[data-id="${parentId}"]`).closest('.table-rows-items').children('.inner-rows');
            const primaryDemand = $(`[data-id="${parentId}"] .row-item[data-name="primarydemand"] p`).text().trim();
            const isLastAndHasNextChildren = isLast && rowsContainer.closest('.table-rows-items').next().length > 0;
            row = `
            <div class="table-rows-items">
                <div class="row" data-parent-id="${parentId}" data-id="${item.id}" data-level="${level}" style="vertical-align: ${type==='jc' ? "super" : "sub"};
                                                                                                                font-size: ${type==='jc' ? "0.825rem" : "0.750rem"};
                                                                                                                ${type === "jc" ? " text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);" : ""}">
                    ${type === "jc" ? hasChildren ? hamburger : "" : ""}
                    <div class="row-item first-element" style="width: 29.625rem; padding-left: ${(1.5 + (level * 0.5)) + 'rem'}" data-name="primarydemand">
                        <p>
                            ${primaryDemand}
                            <span class="line-container ${isLast ? 'last-line' : ''}">
                                <span class="third-line"></span>
                               ${isLastAndHasNextChildren ? '<span class="second-line"></span>' : ''}
                            </span>
                        </p>
                    </div>
                    <div class="row-item" style="width: 25.125rem;" data-name="item">${item.name}</div>
                    <div class="row-item" style="width: 17.5625rem;" data-name="mlm-node">${type === 'jc' ? "" : item.mlmNode}</div>
                    <div class="row-item" style="width: 15.9375rem;" data-name="description">${type === 'jc' ? "" : item.description}</div>
                    <div class="row-item numbers" style="width: 6.25rem;" data-name="qty">${item.qty}</div>
                    <div class="row-item numbers" style="width: 7.25rem;" data-name="qty-finished">${item.qtyFinished}</div>
                    <div class="row-item numbers" style="width: 7.625rem;" data-name="resourcetime">${type === 'jc' ? "" : item.resourceTime}</div>
                    <div class="row-item" style="width: 6.6875rem;" data-name="date-start">${formatDate(item.dateStart)}</div>
                    <div class="row-item" style="width: 8rem;" data-name="date-end">${formatDate(item.dateEnd)}</div>
                    <div class="row-item" style="width: 6.6875rem;" data-name="date-calc-start">${type === 'jc' ? "" : formatDate(item.dateCalcStart)}</div>
                    <div class="row-item" style="width: 8rem;" data-name="date-calc-end">${type === 'jc' ? "" : formatDate(item.dateCalcEnd)}</div>
                </div>
                <div class="inner-rows"></div>
            </div>`;
            rowsContainer.append(row);
        }
    }

    async function makeChildRow(parentId, level, hasChildren) {
        if (hasChildren) {
            const jobComponents = await $.get('/spm-api/getChildJobComponentForJobcomponentId', {jobComponentId: parentId});
            for (jc of jobComponents) {
                const isLast = (jobComponents.indexOf(jc) === jobComponents.length - 1) && (await $.get('spm-api/getJobStepsForJobComponentId', {jobComponentId: parentId})).length === 0;
                const hasChildren = (await $.get('/spm-api/getChildJobComponentForJobcomponentId', {jobComponentId: jc.id})).length > 0;
                // const isLastAndHasNextChildren = isLast &&
                await createRow(jc, 'jc', parentId, level + 1, hasChildren, isLast, );
                await makeChildRow(jc.id, level + 1);
            }
        }

        const jobSteps = await $.get('spm-api/getJobStepsForJobComponentId', {jobComponentId: parentId});
        for (js of jobSteps) {
            const isLast = jobSteps.indexOf(js) === jobSteps.length - 1;
            await createRow(js, 'js', parentId, level + 1, false, isLast);
        }
    }

    const primaryDemands = await $.get('/spm-api/getPrimaryDemandForCustomerOrderId', {customerOrderId: '60795221'});
    for (pd of primaryDemands) {
        const hasChildren = (await $.get('/spm-api/getChildJobComponentForJobcomponentId', {jobComponentId: pd.jobComponent.id})).length > 0;
        await createRow(pd, 'pd', '#', 0, hasChildren)
        await makeChildRow(pd.jobComponent.id, 0, hasChildren)
    }

});

function formatDate(dateString) {
    if (!dateString) return "&nbsp;";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}


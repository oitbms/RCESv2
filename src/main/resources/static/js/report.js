// Обработчик открытия модального окна
$(document).on('click', '.openModal', async function () {
    const primarilyEndpoint = $(this).data('primarilyendpoint');
    const searchEndpoint = $(this).data('endpoint');
    const inputId = $(this).data('input-id');
    const hiddenEntity = $(this).data('hidden-entity');
    const modalId = $(this).data('modal-id');
    const modal = $('#' + modalId);

    const headContainer = modal.find('#customerOrderModalHeadContainer');
    const dataContainer = modal.find('#customerOrderModalDataContainer');
    const searchInput = modal.find('#searchCustomerOrder');

    // Очистка контейнеров и поиска
    headContainer.empty();
    dataContainer.empty();
    searchInput.val('');

    // Показываем индикатор загрузки
    dataContainer.html('<div class="text-center p-4"><div class="spinner-border text-primary" role="status"></div></div>');

    // Переменная рендеринга строк
    const renderItems = items => {
        dataContainer.empty();

        if (items.length === 0) {
            dataContainer.html('<div class="text-center p-4 text-muted">Ничего не найдено</div>');
            return;
        }

        items.forEach(item => {
            const row = $(`
                <div class="row g-0 px-3 py-2 hover-row" data-id="${item.id}">
                    <div class="col d-flex align-items-center">
                        <div class="ms-2">${item.name || '-'}</div>
                    </div>
                </div>`
            );

            row.on('click', function () {
                $('#' + inputId).val(item.name);
                $('#' + hiddenEntity).val(item.id);
                modal.modal('hide');
            });

            dataContainer.append(row);
        });
    };

    // Первоначальные данные
    let primaryData = [];
    let fullData = [];

    if (primarilyEndpoint) {
        [primaryData, fullData] = await Promise.all([
            await $.get(`spm-api/${primarilyEndpoint}`),
            await $.get(`spm-api/${searchEndpoint}`)
        ]);

        // Сохраняем данные в объекте модального окна
        modal.data({
            primaryData,
            fullData
        });

        // Первоначально показываем primaryData
        renderItems(primaryData);
    } else {
        fullData = await $.get(`spm-api/${searchEndpoint}`);
        modal.data('fullData', fullData);
        renderItems(fullData);
    }

    // Обработчик поиска
    searchInput.off('input').on('input', function () {
        const value = $(this).val().toLowerCase();
        const {primaryData, fullData} = modal.data();

        if (!value) {
            if (primarilyEndpoint) {
                renderItems(primaryData);
            } else {
                renderItems(fullData);
            }
            return;
        }
        const filtered = fullData.filter(item =>
            item.name.toLowerCase().includes(value)
        );
        renderItems(filtered);

    });

    modal.modal('show');
});

async function createRow (item, type, parentId = 0, hasChild) {
    const table = $('.table-body');
    const style = "text-align: center; vertical-align: middle";
    const child = `<div class="hamburger">
            <input class="checkbox" type="checkbox"/>
            <svg fill="none" viewBox="0 0 50 50" height="15" width="15">
                <path class="lineTop line" stroke-linecap="round" stroke-width="4" stroke="black" d="M6 11L44 11"></path>
                <path stroke-linecap="round" stroke-width="4" stroke="black" d="M6 24H43" class="lineMid line"></path>
                <path stroke-linecap="round" stroke-width="4" stroke="black" d="M6 37H43" class="lineBottom line"></path>
            </svg>
        </div>`;

    const row = `
    <div class="row" data-id="${type === 'pd' ? item.jobComponent.id : item.id}" data-parent-id="${parentId}">
        ${child}
        <div class="cell">${type === 'pd' ? item.name : ''}</div>
        <div class="cell">${type === 'pd' ? item.jobComponent.name : type === 'js' ? '' : item.name}</div>
        <div class="cell" style="${style}">${type === 'js' ? item.mlmNode : ''}</div>
        <div class="cell" style="${style}">${type === 'js' ? item.description : ''}</div>
        <div class="cell" style="${style}">${type === 'pd' ? item.jobComponent.qty : item.qty}</div>
        <div class="cell" style="${style}">${type === 'pd' ? item.jobComponent.qtyFinished : item.qtyFinished}</div>
        <div class="cell" style="${style}">${type === 'js' ? item.resourceTime : ''}</div>
        <div class="cell" style="${style}">${type === 'pd' ? formatDate(item.jobComponent.dateStart) : formatDate(item.dateStart)}</div>
        <div class="cell" style="${style}">${type === 'pd' ? formatDate(item.jobComponent.dateEnd) : formatDate(item.dateEnd)}</div>
        <div class="cell" style="${style}">${type === 'js' ? formatDate(item.dateCalcStart) : ''}</div>
        <div class="cell" style="${style}">${type === 'js' ? formatDate(item.dateCalcEnd) : ''}</div>
        <div class="nested-rows">
        </div>
    </div>
    `;
    if (type==='pd') {
        table.append(row);
    } else {
        $(`div[data-id="${parentId}"] > div.nested-rows`).append(row);
    }
}

//Тестовые данные
document.addEventListener('DOMContentLoaded', async function () {
    const primaryDemands = await $.get('/spm-api/getPrimaryDemandForCustomerOrderId', {customerOrderId: '7886928'})
    let depth = 0;

    async function makeChild(parentId) {
        const childJobComponent = await $.get('spm-api/getChildJobComponentForJobcomponentId', {jobComponentId: parentId});
        for (const jc of childJobComponent) {
            await createRow(jc, 'jc', parentId, await $.get('spm-api/getJobStepsForJobComponentId', {jobComponentId: parentId}).length > 0);
            depth++;
            // await makeChild(jc.id, depth + 1);
        }
        const jobSteps = await $.get('spm-api/getJobStepsForJobComponentId', {jobComponentId: parentId});
        // for (const js of jobSteps) {
        //     await createRow(js, 'js', parentId);
        // }
    }

    for (pd of primaryDemands) {
        await createRow(pd, 'pd', 0, await $.get('spm-api/getChildJobComponentForJobcomponentId', {jobComponentId: pd.jobComponent.id}).length > 0);
        await makeChild(pd.jobComponent.id);
    }
    // for (let i = 0; i < depth; i++) {
    //     $(':root').css('--cell-width', (i, val) => parseFloat(val) + 0.5 + 'rem');
    // }
});


function formatDate(dateString) {
    if (!dateString) return "&nbsp;";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}


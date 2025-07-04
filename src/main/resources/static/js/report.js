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
//Изменение ширины колонок
document.addEventListener('DOMContentLoaded', function() {
    const titles = document.querySelectorAll('.title');
    const tableContent = document.querySelector('.table-content');
    let isResizing = false;
    let startX;
    let startWidth;
    let columnIndex;
    let initialGridTemplateColumns;
    const MIN_COLUMN_WIDTH = 85;

    titles.forEach(title => {
        title.addEventListener('mousedown', function(e) {
            if (e.offsetX > this.offsetWidth - 5) {
                initResize(e, this);
            }
        });
    });

    function initResize(e, title) {
        e.preventDefault();
        isResizing = true;
        startX = e.clientX;

        columnIndex = Array.from(title.parentElement.children).indexOf(title);
        initialGridTemplateColumns = getComputedStyle(tableContent).gridTemplateColumns.split(' ');
        startWidth = parseInt(initialGridTemplateColumns[columnIndex]);

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    }

    function resize(e) {
        if (!isResizing) return;

        const dx = e.clientX - startX;
        let newWidth = startWidth + dx;

        newWidth = Math.max(newWidth, MIN_COLUMN_WIDTH);

        const newGridTemplateColumns = [...initialGridTemplateColumns];
        newGridTemplateColumns[columnIndex] = `${newWidth}px`;

        tableContent.style.gridTemplateColumns = newGridTemplateColumns.join(' ');
    }

    function stopResize() {
        isResizing = false;
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }
});

//Создание дерева
async function makeTree(primaryDemands) {
    async function addRow(item, type, parentId = 0, depth) {
        const data = $('#data');
        const style = "text-align: center; vertical-align: middle";
        const row = $(`
        <div class="content-row" data-id="${type === 'pd' ? item.jobComponent.id : item.id}" data-parent-id="${parentId}" data-depth="${depth}">
            <div class="content-cell col-zk"   style="${style}">${type === 'pd' ? item.name : ''}</div>
            <div class="content-cell col-dse"  style="${style}">${type === 'pd' ? item.jobComponent.name : type === 'js' ? '' : item.name}</div>
            <div class="content-cell col-node" style="${style}">${type === 'js' ? item.mlmNode : ''}</div>
            <div class="content-cell col-desc" style="${style}">${type === 'js' ? item.description : ''}</div>
            <div class="content-cell col-plan" style="${style}">${type === 'pd' ? item.jobComponent.qty : item.qty}</div>
            <div class="content-cell col-done" style="${style}">${type === 'pd' ? item.jobComponent.qtyFinished : item.qtyFinished}</div>
            <div class="content-cell col-time" style="${style}">${type === 'js' ? item.resourceTime : ''}</div>
            <div class="content-cell col-date" style="${style}">${type === 'pd' ? formatDate(item.jobComponent.dateStart) : formatDate(item.dateStart)}</div>
            <div class="content-cell col-date" style="${style}">${type === 'pd' ? formatDate(item.jobComponent.dateEnd) : formatDate(item.dateEnd)}</div>
            <div class="content-cell col-date" style="${style}">${type === 'js' ? formatDate(item.dateCalcStart) : ''}</div>
            <div class="content-cell col-date" style="${style}">${type === 'js' ? formatDate(item.dateCalcEnd) : ''}</div>
        </div>
    `);
        data.append(row);
    }
    async function makeChild(parentId, depth) {
        const childJobComponent = await $.get('spm-api/getChildJobComponentForJobcomponentId', {jobComponentId: parentId});
        for (const jc of childJobComponent) {
            await addRow(jc, 'jc', parentId, depth);
            await makeChild(jc.id, depth + 1);
        }
        const jobSteps = await $.get('spm-api/getJobStepsForJobComponentId', {jobComponentId: parentId});
        for (const js of jobSteps) {
            await addRow(js, 'js', parentId, depth);
        }
    }
    for (const pd of primaryDemands) {
        await addRow(pd, 'pd', 0, 0);
        await makeChild(pd.jobComponent.id, 1);
    }
    setTimeout(() => {
        $('.table-container').hide().fadeIn('slow');
    }, 500);
}

// Обработчик нажатия на кнопку "Сформировать"
$('#btnGenerate').click(async function () {
    const customerOrderId = $('#spmCustomerOrder').val();
    if (!customerOrderId) {
        alert("Выберите заказ клиента");
        return;
    }

    // Анимация скрытия/показа
    $('#filterContainer').fadeOut('slow');

    const primaryDemands = await $.get('spm-api/getPrimaryDemandForCustomerOrderId', {customerOrderId});
    await makeTree(primaryDemands).then();
});

function formatDate(dateString) {
    if (!dateString) return "&nbsp;";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}


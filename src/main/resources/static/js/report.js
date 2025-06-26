// Функция загрузки данных
const loadData = async (url, params = {}) => {
    try {
        return await $.ajax({
            url: '/spm-api/' + url,
            method: 'GET',
            data: params
        });
    } catch (error) {
        console.error('Ошибка загрузки данных:' + url, error);
        return null;
    }
};

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

    // Функция загрузки данных
    const loadData = async (url) => {
        try {
            return await $.ajax({
                url: '/spm-api/' + url,
                method: 'GET'
            });
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            return [];
        }
    };

    // Первоначальные данные
    let primaryData = [];
    let fullData = [];

    if (primarilyEndpoint) {
        [primaryData, fullData] = await Promise.all([
            loadData(primarilyEndpoint),
            loadData(searchEndpoint)
        ]);

        // Сохраняем данные в объекте модального окна
        modal.data({
            primaryData,
            fullData
        });

        // Первоначально показываем primaryData
        renderItems(primaryData);
    } else {
        fullData = await loadData(searchEndpoint);
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

// Функция построения дерева
const buildTree = async (customerOrderId) => {

    // Индикатор загрузки
    $('#treeview').html('<div class="text-center p-4"><div class="spinner-border text-primary" role="status"></div></div>');

    // Загружаем PrimaryDemand
    const primaryDemands = await loadData('getPrimaryDemandForCustomerOrderId', {customerOrderId});
    if (!primaryDemands || primaryDemands.length === 0) {
        $('#treeview').html('<div class="alert alert-warning">У заказа нет строк</div>');
        return;
    }

    // Таблица
    const tableHead = $('#tableHead');
    const tableBody = $('#tableBody');

    // Формирование строки таблицы
    const createRow = (type,item, level, parentId) => {
        const padding = `padding-left: ${level}em`;
        tableBody.append(`
        <tr data-id="${item.id}" data-parent-id="${parentId}">
            <td style="${padding}">${type === "pd" ? item.name : ""}</td>
            <td style="${padding}">${type === "pd" ? "" : item.name}</td>
            <td style="${padding}">${type === "js" ? item.mlmNode : ""}</td>
            <td style="${padding}">${type === "js" ? item.description : ""}</td>
            <td style="${padding}">${type === "pd" ? "" : item.qty}</td>
            <td style="${padding}">${type === "js" ? item.qtyFinished : ""}</td>
            <td style="${padding}">${type === "js" ? item.resourceTime : ""}</td>
            <td style="${padding}">${type === "pd" ? "" : formatDate(item.dateStart)}</td>
            <td style="${padding}">${type === "pd" ? "" : formatDate(item.dateEnd)}</td>
            <td style="${padding}">${type === "js" ? formatDate(item.dateCalcStart) : ""}</td>
            <td style="${padding}">${type === "js" ? formatDate(item.dateCalcEnd) : ""}</td>
        </tr>
    `);
    }

    // Рекурсивная функция для загрузки дочерних компонентов
    const loadChildComponents = async (parentId, level) => {
        //Дочерние jobComponent
        const childJobComponents = await loadData('getChildJobComponentForJobcomponentId', {jobComponentId: parentId});
        for (const jc of childJobComponents) {
            createRow("jc", jc, level, parentId);
        }
        //Заходы
        const jobSteps = await loadData('getJobStepsForJobComponentId', {jobComponentId: parentId});
        for (js of jobSteps) {
            createRow("js", js, level, parentId)
        }

        for (const jc of childJobComponents) {
            await loadChildComponents(jc.id, level + 1);
        }
    };

    for (const pd of primaryDemands) {
        // const primaryNode = {
        //     text: `<span class="node-primary">Строка ЗК/Спрос: ${pd.name}</span>`,
        //     id: pd.id,
        //     level: 0,
        //     type: 'primaryDemand',
        //     icon: 'bi bi-file-earmark-text',
        //     children: []
        // };
        //Строка ЗК/Спрос
        createRow("pd", pd, 0, customerOrderId);

        // Main строка
        const mainJobComponent = await loadData('getMainJobComponentForPrimaryDemandId', {primaryDemandId: pd.id});
        createRow("jc", mainJobComponent, 1, pd.id);
        // const mainNode = {
        //     text: `<span class="node-jobcomponent">[${mainJobComponent.name}] ` +
        //         `План: ${mainJobComponent.qty}, ` +
        //         `Выполнено: ${mainJobComponent.qtyFinished}, ` +
        //         `Начало: ${formatDate(mainJobComponent.dateStart)}, ` +
        //         `Завершение: ${formatDate(mainJobComponent.dateEnd)}</span>`,
        //     id: mainJobComponent.id,
        //     type: 'jobComponent',
        //     icon: 'bi bi-diagram-2',
        //     children: []
        // };

        await loadChildComponents(mainJobComponent.id, 2);
    }


    // Инициализация дерева
    $('#treeview').treeview({
        data: tableBody,
        levels: 99, // Все уровни развернуты
        expandIcon: 'bi bi-plus-circle',
        collapseIcon: 'bi bi-dash-circle',
        emptyIcon: 'bi bi-circle',
        selectedBackColor: '#0d6efd',
        enableLinks: true,
        onNodeSelected: function (event, node) {
            $('#output').html(`<div class="alert alert-info">Выбран: <strong>${node.text}</strong></div>`);
        }
    });
};

// Обработчик кнопки "Сформировать"
$('#btnGenerate').click(async function () {
    const customerOrderId = $('#spmCustomerOrder').val();
    const customerOrderName = $('#customerOrderName').val();

    if (!customerOrderId) {
        alert('Пожалуйста, выберите заказ клиента');
        return;
    }

    // Показать информацию о выбранном заказе
    $('#output').html(`
        <div class="alert alert-info">
            Формирование дерева для заказа: <strong>${customerOrderName}</strong>
            <div class="spinner-border spinner-border-sm ms-2" role="status"></div>
        </div>
    `);

    // Скрываем лишние элементы
    $('.container > h2, .container-fluid').hide();
    $('.controls button:not(#btnBack)').hide();

    // Показываем контейнер дерева
    $('#treeview-container')
        .show()
        .addClass('fullscreen');

    // Показываем кнопку "Вернуться"
    $('#btnBack').show();

    // Строим дерево
    await buildTree(customerOrderId);
});

// Обработчик кнопки "Вернуться"
$('#btnBack').click(function () {
    // Показываем скрытые элементы
    $('.container > h2, .container-fluid').show();
    $('.controls button').show();

    // Скрываем контейнер дерева
    $('#treeview-container')
        .hide()
        .removeClass('fullscreen');

    // Скрываем кнопку "Вернуться"
    $(this).hide();

    // Очищаем дерево
    $('#treeview').treeview('remove');
});

// Функция для форматирования даты
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

// Обработчики кнопок
$('#btnExpandAll').click(function () {
    $('#treeview').treeview('expandAll');
});

$('#btnCollapseAll').click(function () {
    $('#treeview').treeview('collapseAll');
});

$('#btnGetSelected').click(function () {
    var selected = $('#treeview').treeview('getSelected');
    if (selected.length > 0) {
        var selectedTexts = selected.map(function (node) {
            return node.text;
        }).join(', ');
        $('#output').html('<div class="alert alert-success">Выбранные элементы: <strong>' + selectedTexts + '</strong></div>');
    } else {
        $('#output').html('<div class="alert alert-warning">Ничего не выбрано</div>');
    }
});
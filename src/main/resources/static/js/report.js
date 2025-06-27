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

document.addEventListener('DOMContentLoaded', function () {
    // Инициализация colResizable на вашей таблице
    $('#treetable').colResizable({
        liveDrag: true,      // Ширина меняется "на лету"
        resizeMode: 'fit',   // Подгоняет соседние столбцы
        minWidth: 0         // Минимальная ширина колонки
    });
});

$('#tree_container').jstree({
    'plugins': ['grid'],
    'grid': {
        'columns': [
            {width: 350, header: "Строка ЗК/Спрос", value: "col1"},
            {width: 350, header: "ДСЕ/№ захода", value: "col2"},
            {width: 200, header: "Узел ПЛМ", value: "col3"},
            {width: 200, header: "Описание захода", value: "col4"},
            {width: 100, header: "План брутто", value: "col5"},
            {width: 100, header: "Выполнено", value: "col6"},
            {width: 1400, header: "Общее время захода", value: "col7"},
            {width: 150, header: "Дата начала", value: "col8"},
            {width: 150, header: "Дата завершения", value: "col9"},
            {width: 150, header: "РД начала", value: "col10"},
            {width: 150, header: "РД завершения", value: "col11"}
        ],
        'resizable': true,
        'width': '100%'
    },
    'core': {
        'data': []
    }
});

// Правильный способ подписки на события
$('#tree_container').on('ready.jstree', function() {
    console.log('jsTree is ready!');
});

$('#tree_container').on('create_node.jstree', function(e, data) {
    console.log('Node created:', data.node);
});

const createRow = (item, type) => {
    const style = "text-align: center; vertical-align: middle"
    const row = `
    <tr>
        <td>${type === 'pd' ? item.name : ''}</td>
        <td>${type === 'pd' ? item.jobComponent.name : item.name}</td>
        <td style="${style}">${type === 'js' ? item.mlmNode : ''}</td>
        <td style="${style}">${type === 'js' ? item.description : ''}</td>
        <td style="${style}">${type === 'pd' ? item.jobComponent.qty : item.qty}</td>
        <td style="${style}">${type === 'pd' ? item.jobComponent.qtyFinished : item.qtyFinished}</td>
        <td style="${style}">${type === 'js' ? item.resourceTime : ''}</td>
        <td style="${style}">${type === 'pd' ? formatDate(item.jobComponent.dateStart) : formatDate(item.dateStart)}</td>
        <td style="${style}">${type === 'pd' ? formatDate(item.jobComponent.dateEnd) : formatDate(item.dateEnd)}</td>
        <td style="${style}">${type === 'js' ? formatDate(item.dateCalcStart) : ''}</td>
        <td style="${style}">${type === 'js' ? formatDate(item.dateCalcEnd) : ''}</td>
    </tr>`;
    return row;
};

const createNode = (item, type, parentId = null) => {
    const instance = $('#tree_container').jstree(true);
    const style = "text-align: center; vertical-align: middle"

    const newNode = {
        "id":     item.id,
        "text":   type === 'pd' ? "Строка ЗК/Спрос" : "Заход",
        "col1":   type === 'pd' ? item.name : '',
        "col2":   type === 'pd' ? item.jobComponent.name : item.name,
        "col3":  `<div style="${style}">${type === 'js' ? item.mlmNode : ''}</div>`,
        "col4":  `<div style="${style}">${type === 'js' ? item.description : ''}</div>`,
        "col5":  `<div style="${style}">${type === 'pd' ? item.jobComponent.qty : item.qty}</div>`,
        "col6":  `<div style="${style}">${type === 'pd' ? item.jobComponent.qtyFinished : item.qtyFinished}</div>`,
        "col7":  `<div style="${style}">${type === 'js' ? item.resourceTime : ''}</div>`,
        "col8":  `<div style="${style}">${type === 'pd' ? formatDate(item.jobComponent.dateStart) : formatDate(item.dateStart)}</div>`,
        "col9":  `<div style="${style}">${type === 'pd' ? formatDate(item.jobComponent.dateEnd) : formatDate(item.dateEnd)}</div>`,
        "col10": `<div style="${style}">${type === 'js' ? formatDate(item.dateCalcStart) : ''}</div>`,
        "col11": `<div style="${style}">${type === 'js' ? formatDate(item.dateCalcEnd) : ''}</div>`
    };
    instance.create_node(parentId, newNode, "last");
};

// Обработчик нажатия на кнопку "Сформировать"
$('#btnGenerate').click(async function () {
    const customerOrderId = $('#spmCustomerOrder').val();
    if (!customerOrderId) {
        alert("Выберите заказ клиента")
        return;
    }

    $('.table-container')
        .addClass('visible')
        .show();


    //Скрытие контейнера с выбором ЗК и показывание таблицы с задержкой в 750мс
    $('#filterContainer').fadeOut('slow');
    setTimeout(function () {
        $('.table-container')
            .addClass('visible')
            .hide()
            .fadeIn('slow');
    }, 750);

    const tree = $('#tree_container').jstree(true);

    const primaryDemands = await $.get('spm-api/getPrimaryDemandForCustomerOrderId', {customerOrderId: customerOrderId});
    for (pd of primaryDemands) {
        createNode(pd, 'pd');
    }

});

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}
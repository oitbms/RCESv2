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
            {width: 350, header: "<div style='text-align: center'>Строка ЗК/Спрос</div>", value: "col1"},
            {width: 350, header: "<div style='text-align: center'>ДСЕ/№ захода</div>", value: "col2"},
            {width: 225, header: "<div style='text-align: center'>Узел ПЛМ</div>", value: "col3"},
            {width: 205, header: "<div style='text-align: center'>Описание захода</div>", value: "col4"},
            {width: 100, header: "<div style='text-align: center'>План брутто</div>", value: "col5"},
            {width: 100, header: "<div style='text-align: center'>Выполнено</div>", value: "col6"},
            {width: 170, header: "<div style='text-align: center'>Общее время захода</div>", value: "col7"},
            {width: 155, header: "<div style='text-align: center'>Дата начала</div>", value: "col8"},
            {width: 155, header: "<div style='text-align: center'>Дата завершения</div>", value: "col9"},
            {width: 155, header: "<div style='text-align: center'>РД начала</div>", value: "col10"},
            {width: 155, header: "<div style='text-align: center'>РД завершения</div>", value: "col11"}
        ],
        'resizable': true,
        'width': '100%'
    },
    'core': {
        'data': []
    }
});

async function makeTree(treeData) {
    const createNode = (item, type, parentId = null) => {
        const style = "text-align: center; vertical-align: middle";
        return {
            id: type === 'pd' ? item.jobComponent.id : item.id,
            text: type === 'pd' ? item.name : "&nbsp;",
            parent: parentId || `#`,
            data: {
                col1: type === 'pd' ? item.name : '',
                col2: type === 'pd' ? item.jobComponent.name : item.name,
                col3: `<div style="${style}">${type === 'js' ? item.mlmNode : "&nbsp;"}</div>`,
                col4: `<div style="${style}">${type === 'js' ? item.description : "&nbsp;"}</div>`,
                col5: `<div style="${style}">${type === 'pd' ? item.jobComponent.qty : item.qty}</div>`,
                col6: `<div style="${style}">${type === 'pd' ? item.jobComponent.qtyFinished : item.qtyFinished}</div>`,
                col7: `<div style="${style}">${type === 'js' ? item.resourceTime : "&nbsp;"}</div>`,
                col8: `<div style="${style}">${type === 'pd' ? formatDate(item.jobComponent.dateStart) : formatDate(item.dateStart)}</div>`,
                col9: `<div style="${style}">${type === 'pd' ? formatDate(item.jobComponent.dateEnd) : formatDate(item.dateEnd)}</div>`,
                col10: `<div style="${style}">${type === 'js' ? formatDate(item.dateCalcStart) : "&nbsp;"}</div>`,
                col11: `<div style="${style}">${type === 'js' ? formatDate(item.dateCalcEnd) : "&nbsp;"}</div>`
            }
        };
    };
    for (pd of primaryDemands) {
        treeData.push(createNode(pd, 'pd'));

        await createNodes(pd.jobComponent.id);
        async function createNodes(parentId) {
            const childJobComponent = await $.get('spm-api/getChildJobComponentForJobcomponentId', {jobComponentId: parentId});
            for (childJc of childJobComponent) {
                treeData.push(createNode(childJc, 'jc', parentId));
                await createNodes(childJc.id);
            }

            const jobSteps = await $.get('spm-api/getJobStepsForJobComponentId', {jobComponentId: parentId});
            for (jobStep of jobSteps) {
                treeData.push(createNode(jobStep, 'js', parentId));
            }

        }

    }

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
    setTimeout(() => {
        $('.table-container').addClass('visible').hide().fadeIn('slow');
    }, 750);

    // Получаем экземпляр дерева
    const tree = $('#tree_container').jstree(true);

    // Показываем индикатор загрузки
    tree.settings.core.data = [{
        id: "loading",
        text: "Загрузка...",
        icon: "fa fa-spinner fa-spin"
    }];
    tree.refresh();

    // Загружаем данные
    const primaryDemands = await $.get('spm-api/getPrimaryDemandForCustomerOrderId', {customerOrderId});

    // Если нет строк ЗК
    if (!primaryDemands?.length) {
        tree.settings.core.data = [{
            id: "empty",
            text: "У заказа клиента нет строк",
            icon: "fa fa-exclamation-circle"
        }];
        tree.refresh();
        return;
    }
    const treeData = [];
    tree.settings.core.data = [];

    await makeTree(treeData);

    tree.settings.core.data = treeData;
    tree.refresh(true);
    tree.one('refresh.jstree', function() {
        tree.open_all({ duration: 300 });
    });
});

function formatDate(dateString) {
    if (!dateString) return "&nbsp;";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}
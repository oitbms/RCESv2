
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

const createRow = (item, type) => {
    const row = `
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    `
};

// Обработчик нажатия на кнопку "Сформировать"
$('#btnGenerate').click(async function () {
    const customerOrderId = $('#spmCustomerOrder').val();
    if (!customerOrderId) {
        alert("Выберите заказ клиента")
        return;
    }

    //Скрытие контейнера с выбором ЗК и показывание таблицы с задержкой в 750мс
    $('#filterContainer').fadeOut('slow');
    setTimeout(function () {
        $('#treetable').fadeIn('slow');
    }, 750);

    const body = $('#treetable tbody');

    const primaryDemands = await $.get('spm-api/getPrimaryDemandForCustomerOrderId', {customerOrderId: customerOrderId})

    primaryDemands.forEach(pd => {
        body.append(`
        <tr>
            <td>${pd.name}</td>    
        </tr>  
        `)
    });

});
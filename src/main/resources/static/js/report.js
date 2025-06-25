$(document).ready(function () {
    // Тестовые данные для дерева
    var treeData = [
        {
            text: "Документы",
            icon: "bi bi-folder",
            nodes: [
                {
                    text: "Работа",
                    icon: "bi bi-folder",
                    nodes: [
                        {text: "Отчет.pdf", icon: "bi bi-file-earmark-pdf"},
                        {text: "Презентация.pptx", icon: "bi bi-file-earmark-ppt"}
                    ]
                },
                {
                    text: "Личное",
                    icon: "bi bi-folder",
                    nodes: [
                        {text: "Фото.jpg", icon: "bi bi-file-earmark-image"},
                        {text: "Резюме.docx", icon: "bi bi-file-earmark-word"}
                    ]
                }
            ]
        },
        {
            text: "Музыка",
            icon: "bi bi-music-note-list",
            nodes: [
                {text: "Rock", icon: "bi bi-music-note"},
                {text: "Jazz", icon: "bi bi-music-note"}
            ]
        },
        {
            text: "Корзина",
            icon: "bi bi-trash",
            color: "#dc3545"
        }
    ];

    // Инициализация дерева
    $('#treeview').treeview({
        data: treeData,
        levels: 1,
        expandIcon: 'bi bi-plus-circle',
        collapseIcon: 'bi bi-dash-circle',
        emptyIcon: 'bi bi-circle',
        selectedBackColor: '#0d6efd',
        onNodeSelected: function (event, node) {
            $('#output').html('<div class="alert alert-info">Выбран: <strong>' + node.text + '</strong></div>');
        }
    });

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

        // Функция рендеринга строк
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

                row.on('click', function() {
                    $('#' + inputId).val(item.name);
                    $('[name="' + hiddenEntity + '"]').val(item.id);
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

        // Загрузка данных
        let primaryData = [];
        let fullData = [];

        if (primarilyEndpoint) {
            // Загрузка обоих наборов данных
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
            // Загрузка только основного набора данных
            fullData = await loadData(searchEndpoint);
            modal.data('fullData', fullData);
            renderItems(fullData);
        }

        // Обработчик поиска
        searchInput.off('input').on('input', function() {
            const term = $(this).val().toLowerCase();

            if (primarilyEndpoint) {
                const { primaryData, fullData } = modal.data();

                if (!term) {
                    // Если поиск пустой - показываем первоначальные данные
                    renderItems(primaryData);
                    return;
                }

                // Фильтрация полного набора данных
                const filtered = fullData.filter(item =>
                    item.name.toLowerCase().includes(term)
                );

                renderItems(filtered);
            } else {
                // Стандартная фильтрация
                const fullData = modal.data('fullData');
                const filtered = fullData.filter(item =>
                    item.name.toLowerCase().includes(term)
                );

                renderItems(filtered);
            }
        });

        modal.modal('show');
    });

    // Обработчик сохранения выбора
    // saveBtn.click(function () {
    //     if (selectedItem) {
    //         const inputId = $('.openModal').data('input-id');
    //         const hiddenId = $('.openModal').data('hidden-entity');
    //
    //         $(`#${inputId}`).val(selectedItem.name);
    //         $(`#${hiddenId}`).val(JSON.stringify(selectedItem));
    //         $('#output').html(`<div class="alert alert-success">Выбран заказ: <strong>${selectedItem.name}</strong></div>`);
    //         modal.hide();
    //     } else {
    //         alert('Пожалуйста, выберите заказ из списка');
    //     }
    // });
});
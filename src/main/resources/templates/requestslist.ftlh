<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Заявка на вызов</title>
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="/css/stylesMain.css">
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.21/css/jquery.dataTables.css">
    <script type="text/javascript" charset="utf8"
            src="https://cdn.datatables.net/1.10.21/js/jquery.dataTables.js"></script>
</head>
<body>
<div class="container mt-5">
    <h1 class="text-center">Список заявок</h1>
    <div class="d-flex justify-content-center">
        <table id="requestTable" class="table table-hover">
            <thead class="custom-bg-info">
            <tr class="form-check-input">
                <th style="background-color: #007bff; color: white;">
                    Создал
                    <button type="button" class="toggleInput">
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
                            <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                        </svg>
                    </button>
                    <div class="inputContainer">
                        <input type="text" class="form-control" id="createBy">
                    </div>
                </th>
                <th style="background-color: #007bff; color: white;">
                    Ответственный
                    <button type="button" class="toggleInput">
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
                            <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                        </svg>
                    </button>
                    <div class="inputContainer">
                        <input type="text" class="form-control" id="employeeBy">
                    </div>
                </th>
                <th style="background-color: #007bff; color: white;">
                    Тип детали
                    <button type="button" class="toggleInput">
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
                            <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                        </svg>
                    </button>
                    <div class="inputContainer">
                        <input type="text" class="form-control" id="item">
                    </div>
                </th>
                <th style="background-color: #007bff; color: white;">
                    Номер
                    <button type="button" class="toggleInput">
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
                            <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                        </svg>
                    </button>
                    <div class="inputContainer">
                        <input type="text" class="form-control" id="requestNumber">
                    </div>
                </th>
                <th style="background-color: #007bff; color: white;">
                    Заказ клиента
                    <button type="button" class="toggleInput">
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
                            <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                        </svg>
                    </button>
                    <div class="inputContainer">
                        <input type="text" class="form-control" id="customerOrder">
                    </div>
                </th>
                <th style="background-color: #007bff; color: white;">
                    Цех
                    <button type="button" class="toggleInput">
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
                            <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                        </svg>
                    </button>
                    <div class="inputContainer">
                        <input type="text" class="form-control" id="workShop">
                    </div>
                </th>
                <th style="background-color: #007bff; color: white;">
                    Причина вызова
                    <button type="button" class="toggleInput">
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
                            <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                        </svg>
                    </button>
                    <div class="inputContainer">
                        <input type="text" class="form-control" id="reason">
                    </div>
                </th>
                <th style="background-color: #007bff; color: white;">
                    Статус
                    <button type="button" class="toggleInput">
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
                            <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                        </svg>
                    </button>
                    <div class="inputContainer">
                        <input type="text" class="form-control" id="status">
                    </div>
                </th>
                <th style="background-color: #007bff; color: white;">
                    Дата изменения
                    <button type="button" class="toggleInput">
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
                            <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                        </svg>
                    </button>
                    <div class="inputContainer">
                        <input type="text" class="form-control" id="date">
                    </div>
                </th>
                <th style="background-color: #007bff; color: white;">
                    Дата создания заявки
                    <button type="button" class="toggleInput">
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
                            <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                        </svg>
                    </button>
                    <div class="inputContainer">
                        <input type="text" class="form-control" id="dateCreate">
                    </div>
                </th>
                <th style="background-color: #007bff; color: white;">
                    Изменил
                    <button type="button" class="toggleInput">
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
                            <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                        </svg>
                    </button>
                    <div class="inputContainer">
                        <input type="text" class="form-control" id="changedBy">
                    </div>
                </th>
                <#if type == 'otk'>
                    <th style="background-color: #007bff; color: white;">
                        Тип контроля
                        <button type="button" class="toggleInput">
                            <svg onclick="filter()" viewBox="0 0 24 24" width="16">
                                <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                            </svg>
                        </button>
                        <div class="inputContainer">
                            <input type="text" class="form-control" id="control">
                        </div>
                    </th>
                </#if>
                <th style="background-color: #007bff; color: white;">
                    История изменений
                </th>
            </tr>
            </thead>
            <tbody class="table-group-divider">
            <#list bidList as req>
                <#assign reqIndex = req_index>
                <tr class="clickable-row" data-request-number="${req.requestNumber}">
                    <td>${req.getCreatedBy().getName()}</td>
                    <td>${req.getEmployee().getName()}</td>
                    <td>${req.getItem().getName()}</td>
                    <td>${req.getRequestNumber()}</td>
                    <td>${req.customerOrder.getName()}</td>
                    <td>${(req.getMlmNode().getName()!"")}</td>
                    <#if type == 'otk'>
                        <td>${req.getReason_wr()}</td>
                    <#else >
                        <td>${req.getReason().getName()!""}</td>
                    </#if>
                    <td data-status-id="${req.getStatus().getId()}">${req.getStatus().getName()}</td>
                    <td>${updateDateList[reqIndex]!""}</td>
                    <td>${formattedBidList[reqIndex]!""}</td>
                    <td>${(req.getUpdateBy().getName())!"-"}</td>
                    <#if type == 'otk'>
                        <td>${req.getControl()!""}</td>
                    </#if>
                    <td><i class="history-icon bi bi-clock-history text-primary fs-4" data-id="${req.id}"></i></td>
                </tr>
            </#list>
            </tbody>
        </table>
    </div>
    <div id="pagination" class="pagination mt-4"></div>
</div>

<div class="context-menu" id="contextMenu">
    <div class="context-menu-item" id="editRequest">Редактировать</div>
</div>

<div class="modal fade" id="viewRequestModal" tabindex="-1" role="dialog" aria-labelledby="viewRequestModalLabel"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="viewRequestModalLabel">Просмотр заявки</h5>
            </div>
            <div class="modal-body">
                <div id="viewContent"></div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="viewRequestLogs" tabindex="-1" role="dialog" aria-labelledby="viewRequestLogsLabel"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">История изменений</h5>
            </div>
            <div class="modal-body">
                <div class="container">
                    <div id="logsHead" class="row align-items-start">
                        <!-- Заголовки -->
                    </div>
                    <div id="logsBody" class="row align-items-end">
                        <!-- Данные -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>

    <#--$('.history-icon').off("click").on("click", async function() {-->
    <#--    const modal = $('#viewRequestLogs');-->
    <#--    const head = $('#logsHead');-->
    <#--    const body = $('#logsBody');-->

    <#--    head.empty();-->
    <#--    body.empty();-->

    <#--    const data = await $.get('api/logs', {id: $(this).data('id')});-->
    <#--    if (!data || data.length === 0) {-->
    <#--        head.append('<div class="col">Объект не изменялся</div>');-->
    <#--        modal.modal('show');-->
    <#--        return;-->
    <#--    }-->

    <#--    head.append(`-->
    <#--    <div class="col">Дата изменения</div>-->
    <#--    <div class="col">Пользователь</div>-->
    <#--    <div class="col">Изменения</div>-->
    <#--`);-->

    <#--    data.forEach(log => {-->
    <#--        // Проверяем, что log существует-->
    <#--        if (!log) return;-->

    <#--        // Форматируем дату (если нужно)-->
    <#--        const date = log.date ? new Date(log.date).toLocaleString() : 'Нет данных';-->

    <#--        // Форматируем имя пользователя-->
    <#--        const userName = log.userName || 'Нет данных';-->

    <#--        // Обрабатываем metadata-->
    <#--        let metadataHtml = '';-->
    <#--        if (log.metadata && typeof log.metadata === 'object') {-->
    <#--            metadataHtml = Object.entries(log.metadata)-->
    <#--                .map(([key, value]) => {-->
    <#--                    // Проверяем key и value на null/undefined-->
    <#--                    const safeKey = key || 'null';-->
    <#--                    const safeValue = (value !== null && value !== undefined) ? value : 'null';-->
    <#--                    return `<div class="col">${safeKey}: ${safeValue}</div>`;-->
    <#--                })-->
    <#--                .join('');-->
    <#--        } else {-->
    <#--            metadataHtml = '<div class="col">Нет данных об изменениях</div>';-->
    <#--        }-->

    <#--        body.append(`-->
    <#--        <div class="row">-->
    <#--            <div class="col">${date}</div>-->
    <#--            <div class="col">${userName}</div>-->
    <#--            ${metadataHtml}-->
    <#--        </div>-->
    <#--    `);-->
    <#--    });-->

    <#--    modal.modal('show');-->
    <#--});-->

    $(document).ready(function () {
        const requestType = "${type?lower_case}";
        let selectedRequestNumber;
        const rowsPerPage = 15;
        let filteredRows = [];

        // Контекстное меню
        $('.clickable-row').on('contextmenu', function (event) {
            event.preventDefault();
            selectedRequestNumber = $(this).data('request-number');
            $('#contextMenu').css({
                display: 'block',
                left: event.pageX,
                top: event.pageY
            });
        });

        $(document).on('click', function () {
            $('#contextMenu').hide();
        });

        $('#editRequest').on('click', function () {
            $('#contextMenu').hide();
            openRequestModal(selectedRequestNumber);
        });

        $(document).on('keydown', function (e) {
            if (e.key === 'Escape') {
                $('#contextMenu').hide();
            }
        });

        function openRequestModal(requestNumber) {
            $.get(`/view/` + requestNumber, function (data) {
                $('#viewContent').html(data);
                $('#viewRequestModal').modal('show');
            }).fail(function () {
                alert("Ошибка загрузки данных.");
            });
        }

        $('#viewRequestModal').on('hidden.bs.modal', function () {
            location.reload();
        });

        // Фильтрация и пагинация
        const filterData = () => {
            filteredRows = $('#requestTable tbody tr').filter((index, row) => {
                return checkRowFilters(row);
            });
            showPage(1);
        };

        const checkRowFilters = (row) => {

            const createBy = $(row).find('td:nth-child(1)').text().toLowerCase();
            const employeeBy = $(row).find('td:nth-child(2)').text().toLowerCase();
            const item = $(row).find('td:nth-child(3)').text().toLowerCase();
            const requestNumber = $(row).find('td:nth-child(4)').text().toLowerCase();
            const customerOrder = $(row).find('td:nth-child(5)').text().toLowerCase();
            const workShop = $(row).find('td:nth-child(6)').text().toLowerCase();
            const reason = $(row).find('td:nth-child(7)').text().toLowerCase();
            const status = $(row).find('td:nth-child(8)').text().toLowerCase();
            const date = $(row).find('td:nth-child(9)').text().toLowerCase();
            const dateCreate = $(row).find('td:nth-child(10)').text().toLowerCase();
            const changedBy = $(row).find('td:nth-child(11)').text().toLowerCase();
            // Проверка наличия поля "Тип контроля" и его значения
            let controlMatch = true; // По умолчанию считаем, что совпадение есть
            const controlInput = $('#control'); // Получаем элемент ввода для типа контроля
            if (controlInput.length > 0) { // Проверяем, существует ли элемент
                const control = $(row).find('td:nth-child(12)').text().toLowerCase(); // Получаем текст из ячейки
                controlMatch = control.includes(controlInput.val().toLowerCase()); // Проверяем совпадение
            }


            return (
                createBy.includes($('#createBy').val().toLowerCase()) &&
                employeeBy.includes($('#employeeBy').val().toLowerCase()) &&
                item.includes($('#item').val().toLowerCase()) &&
                requestNumber.includes($('#requestNumber').val().toLowerCase()) &&
                customerOrder.includes($('#customerOrder').val().toLowerCase()) &&
                workShop.includes($('#workShop').val().toLowerCase()) &&
                reason.includes($('#reason').val().toLowerCase()) &&
                status.includes($('#status').val().toLowerCase()) &&
                date.includes($('#date').val().toLowerCase()) &&
                dateCreate.includes($('#dateCreate').val().toLowerCase()) &&
                changedBy.includes($('#changedBy').val().toLowerCase()) &&
                controlMatch // Включаем результат проверки типа контроля
            );
        };

        const showPage = (page) => {
            $('#requestTable tbody tr').hide();
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            filteredRows.slice(start, end).show();
            renderPagination(page);
        };

        const renderPagination = (currentPage) => {
            $('#pagination').empty();
            const totalFilteredRows = filteredRows.length;
            const totalFilteredPages = Math.ceil(totalFilteredRows / rowsPerPage);
            for (let i = 1; i <= totalFilteredPages; i++) {
                const pageLink = $('<button>')
                    .text(i)
                    .addClass('btn btn-secondary mx-1')
                    .click(() => showPage(i));
                if (i === currentPage) pageLink.addClass('active');
                $('#pagination').append(pageLink);
            }
        };

        // Инициализация слушателей событий для фильтров
        $('#createBy, #employeeBy, #item, #requestNumber, #customerOrder, #workShop, #reason, #status, #date, #dateCreate, #changedBy').on('keyup change', filterData);

        // Добавляем слушатель для поля "Тип контроля" только если оно существует
        const controlInput = $('#control');
        if (controlInput.length > 0) {
            controlInput.on('keyup change', filterData);
        }

        filterData();

        $('.toggleInput').on('click', function () {
            $(this).next('.inputContainer').toggle();
        });
    });
</script>
</body>
</html>
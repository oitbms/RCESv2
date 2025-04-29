<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Заявка на вызов</title>
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/stylesMain.css">
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.21/css/jquery.dataTables.css">
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.21/js/jquery.dataTables.js"></script>
    <style>
        .custom-bg-info {
            background-color: #17a2b8; /* голубой цвет */
            color: white; /* цвет текста */
        }
    </style>
</head>
<body>

<div class="container mt-5">
    <h1 class="text-center">Список заявок</h1>
    <div class="d-flex justify-content-center" style=" width: 100%;"> <!-- Используем flexbox для центрирования с отступом -->
        <table id="requestTable" class="table table-hover" style="max-width: 100%; width: auto;">
            <thead class="custom-bg-info">
            <tr>
                <th style="position: relative;">
                    Создал
                    <button type="button" class="toggleInput" style="margin-left: 5px;">↑</button>
                    <div class="inputContainer" style="display: none; margin-top: 5px;">
                        <input type="text" class="form-control" id="createBy">
                    </div>
                </th>
                <th style="position: relative;">
                    Ответственный
                    <button type="button" class="toggleInput" style="margin-left: 5px;">↑</button>
                    <div class="inputContainer" style="display: none; margin-top: 5px;">
                        <input type="text" class="form-control" id="employeeBy">
                    </div>
                </th>
                <th style="position: relative;">
                    Тип детали
                    <button type="button" class="toggleInput" style="margin-left: 5px;">↑</button>
                    <div class="inputContainer" style="display: none; margin-top: 5px;">
                        <input type="text" class="form-control" id="item">
                    </div>
                </th>
                <th style="position: relative;">
                    Номер заявки
                    <button type="button" class="toggleInput" style="margin-left: 5px;">↑</button>
                    <div class="inputContainer" style="display: none; margin-top: 5px;">
                        <input type="text" class="form-control" id="requestNumber">
                    </div>
                </th>
                <th style="position: relative;">
                    Заказ клиента
                    <button type="button" class="toggleInput" style="margin-left: 5px;">↑</button>
                    <div class="inputContainer" style="display: none; margin-top: 5px;">
                        <input type="text" class="form-control" id="customerOrder">
                    </div>
                </th>
                <th style="position: relative;">
                    Цех
                    <button type="button" class="toggleInput" style="margin-left: 5px;">↑</button>
                    <div class="inputContainer" style="display: none; margin-top: 5px;">
                        <input type="text" class="form-control" id="workShop">
                    </div>
                </th>
                <th style="position: relative;">
                    Причина вызова
                    <button type="button" class="toggleInput" style="margin-left: 5px;">↑</button>
                    <div class="inputContainer" style="display: none; margin-top: 5px;">
                        <input type="text" class="form-control" id="reason">
                    </div>
                </th>
                <th style="position: relative;">
                    Статус
                    <button type="button" class="toggleInput" style="margin-left: 5px;">↑</button>
                    <div class="inputContainer" style="display: none; margin-top: 5px;">
                        <input type="text" class="form-control" id="status">
                    </div>
                </th>
                <th style="position: relative;">
                    Дата изменения
                    <button type="button" class="toggleInput" style="margin-left: 5px;">↑</button>
                    <div class="inputContainer" style="display: none; margin-top: 5px;">
                        <input type="text" class="form-control" id="date">
                    </div>
                </th>
                <th style="position: relative;">
                    Дата создания заявки
                    <button type="button" class="toggleInput" style="margin-left: 5px;">↑</button>
                    <div class="inputContainer" style="display: none; margin-top: 5px;">
                        <input type="text" class="form-control" id="dateCreate">
                    </div>
                </th>
                <th style="position: relative;">
                    Изменил
                    <button type="button" class="toggleInput" style="margin-left: 5px;">↑</button>
                    <div class="inputContainer" style="display: none; margin-top: 5px;">
                        <input type="text" class="form-control" id="changedBy">
                    </div>
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
                    <td>${""}</td>
                    <td>${req.getReason_wr()!""}</td>
                    <td data-status-id="${req.getStatus().getId()}">${req.getStatus().getName()}</td>
                    <td>${updateDateList[reqIndex]!""}</td>
                    <td>${formattedBidList[reqIndex]!""}</td>
                    <td>${(req.getUpdateBy().getName())!"-"}</td>
                </tr>
            </#list>
            </tbody>
        </table>
    </div>
    <div id="pagination" class="d-flex justify-content-center pagination mt-4"></div>
</div>

<div class="context-menu" id="contextMenu">
    <div class="context-menu-item" id="editRequest">Редактировать</div>
</div>
<div class="modal fade" id="viewRequestModal" tabindex="-1" role="dialog" aria-labelledby="viewRequestModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
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

<script>
    $(document).ready(function () {
        const requestType = "${type?lower_case}";
        let selectedRequestNumber;
        const rowsPerPage = 15;
        let filteredRows = [];

        // Обработчик правого клика для контекстного меню
        $('.clickable-row').on('contextmenu', function (event) {
            event.preventDefault();
            selectedRequestNumber = $(this).data('request-number');
            $('#contextMenu').css({
                display: 'block',
                left: event.pageX,
                top: event.pageY
            });
        });

        // Скрыть контекстное меню при клике
        $(document).on('click', function () {
            $('#contextMenu').hide();
        });

        // Открытие модального окна для редактирования запроса
        $('#editRequest').on('click', function () {
            $('#contextMenu').hide();
            openRequestModal(selectedRequestNumber);
        });

        // Закрытие меню по нажатию клавиши Escape
        $(document).on('keydown', function (e) {
            if (e.key === 'Escape') {
                $('#contextMenu').hide();
            }
        });

        // Функция для открытия модального окна запроса
        function openRequestModal(requestNumber) {
            $.get(`/view/` + requestNumber, function (data) {
                $('#viewContent').html(data);
                $('#viewRequestModal').modal('show');
            }).fail(function () {
                alert("Ошибка загрузки данных. Попробуйте еще раз.");
            });
        }

        // Перезагрузка страницы при закрытии модального окна
        $('#viewRequestModal').on('hidden.bs.modal', function () {
            location.reload();
        });

        // Фильтрация запросов
        $('#applyFilter').on('click', function () {
            const selectedStatus = $('#statusSelect').val();
            filterRequests(selectedStatus);
            $('#filterModal').modal('hide');
        });

        function filterRequests(selectedStatus) {
            const rows = $('tbody tr');
            rows.each(function () {
                const statusId = $(this).find('td[data-status-id]').data('status-id');
                if (selectedStatus === "" || statusId == selectedStatus) {
                    $(this).show();
                    if ($(this).find('td[data-status-id]').text().trim() === "Закрыт") {
                        $(this).addClass('row-closed');
                    } else {
                        $(this).removeClass('row-closed');
                    }
                } else {
                    $(this).hide();
                }
            });
        }

        // Инициализация статусов "Закрыт"
        $('tbody tr').each(function () {
            if ($(this).find('td[data-status-id]').text().trim() === "Закрыт") {
                $(this).addClass('row-closed');
            }
        });

        // Перенаправление с применением фильтра
        $('#applyFilter, #apply').on('click', function () {
            const selectedStatus = $('#statusSelect').val();
            let customerOrderSelect = $('#customerOrderSelect').val();
            const pageNumber = 0;
            const url = `/requestslist/` + requestType + `/` + pageNumber +
                (selectedStatus ? `?status=` + selectedStatus : '') +
                (customerOrderSelect ? `&customerOrder=` + customerOrderSelect : '');

            window.location.href = url;
            $('#filterModal').modal('hide');
            $('#customerOrderModal').modal('hide');
        });

        // Функция для фильтрации данных в таблице с пагинацией
        const filterData = () => {
            filteredRows = $('#requestTable tbody tr').filter((index, row) => {
                return checkRowFilters(row);
            });

            const totalFilteredRows = filteredRows.length;
            const totalFilteredPages = Math.ceil(totalFilteredRows / rowsPerPage);

            renderPagination(1); // Сбрасываем пагинацию на первую страницу после фильтрации
            showPage(1); // Отображаем первую страницу отфильтрованных результатов
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
                changedBy.includes($('#changedBy').val().toLowerCase())
            );
        };

        const showPage = (page) => {
            $('#requestTable tbody tr').hide(); // Скрываем все строки
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            filteredRows.slice(start, end).show(); // Показываем только нужные строки
            renderPagination(page);
        };

        const renderPagination = (currentPage) => {
            const pagination = $('#pagination');
            pagination.empty();
            const totalFilteredRows = filteredRows.length;
            const totalFilteredPages = Math.ceil(totalFilteredRows / rowsPerPage);
            for (let i = 1; i <= totalFilteredPages; i++) {
                const pageLink = $('<button>')
                    .text(i)
                    .addClass('btn btn-secondary mx-1')
                    .click(() => showPage(i));
                if (i === currentPage) {
                    pageLink.addClass('active');
                }
                pagination.append(pageLink);
            }
        };

        // Обработчик событий для фильтров
        $('#createBy, #employeeBy, #item, #requestNumber, #customerOrder, #workShop, #reason, #status, #date, #dateCreate, #changedBy').on('keyup change', filterData);

        // Показать первую страницу при загрузке
        filterData();

        $('.toggleInput').on('click', function () {
            const inputContainer = $(this).next('.inputContainer'); // Найти следующий контейнер ввода
            inputContainer.toggle(); // Переключить видимость
        });
    });
</script>

</body>
</html>
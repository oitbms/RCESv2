<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Заявка на вызов</title>
    <link rel="stylesheet" href="/stylesMain.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.21/css/jquery.dataTables.css">
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.21/js/jquery.dataTables.js"></script>
</head>

<body>

<div class="container mt-5">
    <h1 class="text-center">Список заявок</h1>

    <div>
        <div class="card-body">
            <table class="table">
                <thead>
                <tr>
                    <th>Вызывающий</th>
                    <th>Номер заявки</th>
                    <th>Заказ клиента</th>
                    <th>Цех</th>
                    <th>Причина вызова</th>
                    <th class="position-relative">
                        Статус
                        <button class="btn btn-sm btn-secondary filter-button" data-toggle="modal" data-target="#filterModal">▼</button>
                    </th>
                    <th>Дата изменения</th>
                    <th>Дата создания заявки</th>
                    <th>Изменил</th>
                </tr>
                </thead>
                <tbody>
                <#list bidList as req>
                    <#assign reqIndex = req_index>
                    <tr class="clickable-row" data-request-number="${req.requestNumber}">
                        <td>${req.getEmployee().getName()}</td>
                        <td>${req.getRequestNumber()}</td>
                        <td>${req.customerOrder.getName()}</td>
                        <td>${(req.mlmNode.getName())!""}</td>
                        <td>${req.getComment()}</td>
                        <td data-status-id="${req.getStatus().getId()}">${req.getStatus().getName()}</td>
                        <td>${""}</td>
                        <td>${formattedBidList[reqIndex]!""}</td>
                        <td>${(req.getUpdateBy().getName())!""}</td>
                    </tr>
                </#list>
                </tbody>
            </table>
        </div>
    </div>
    <#if status>
        <div class="d-flex justify-content-center pagination">
            <#if booleanCurrentPage>
                <a class="btn btn-link" href="${currentPage - 1}">Предыдущая страница</a>
            </#if>
            <#if hasNextPage>
                <a class="btn btn-link" href="${currentPage + 1}">Следующая страница</a>
            </#if>
        </div>
    <#else>
        <div class="d-flex justify-content-center pagination">
            <#if booleanCurrentPage>
                <a class="btn btn-link" href="${currentPage - 1}${'?status=' + selectedStatus}">Предыдущая страница</a>
            </#if>
            <#if hasNextPage>
                <a class="btn btn-link" href="/requestslist/${type}/${currentPage + 1}${'?status=' + selectedStatus}">Следующая страница</a>
            </#if>
        </div>
    </#if>

</div>

<div class="modal fade" id="filterModal" tabindex="-1" role="dialog" aria-labelledby="filterModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="filterModalLabel">Фильтр по статусу</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body">
                <label for="statusSelect">Выберите статус:</label>
                <select id="statusSelect" class="form-control">
                    <option value="">Все</option>
                    <#list bidStatus as status>
                        <option value="${status.getName()}">${status.getName()}</option>
                    </#list>
                </select>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="applyFilter">Применить фильтр</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
            </div>
        </div>
    </div>
</div>

<div class="context-menu" id="contextMenu">
    <div class="context-menu-item" id="editRequest">Редактировать</div>
</div>

<div class="modal fade" id="viewRequestModal" tabindex="-1" role="dialog" aria-labelledby="viewRequestModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="viewRequestModalLabel">Просмотр заявки</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
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
                alert("Ошибка загрузки данных. Попробуйте еще раз.");
            });
        }

        $('#viewRequestModal').on('hidden.bs.modal', function () {
            location.reload();
        });

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
        $('tbody tr').each(function () {
            if ($(this).find('td[data-status-id]').text().trim() === "Закрыт") {
                $(this).addClass('row-closed');
            }
        });
        $('#applyFilter').on('click', function () {
            let selectedStatus = $('#statusSelect').val();
            const pageNumber = 0;
            const url = `/requestslist/` + requestType + `/` + pageNumber + (selectedStatus ? `?status=` + selectedStatus : '');

            window.location.href = url;
            $('#filterModal').modal('hide');
        });
    });
</script>

</body>
</html>
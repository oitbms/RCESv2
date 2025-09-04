<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Список заявок</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Table CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-table@1.24.1/dist/bootstrap-table.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.21/css/jquery.dataTables.css">
    <link rel="stylesheet" href="/css/stylesMain.css">
    <script src="/js/list.js" defer></script>
</head>
<body>
<div id="toolbar" class="mb-2">
    <#switch typeRequest>
        <#case 'otk'>
            <#assign titleText = "Список заявок для ОТК">
            <#break>
        <#case 'technologist'>
            <#assign titleText = "Список заявок для ОГТ">
            <#break>
        <#default>
            <#assign titleText = "Список заявок для ОГК">
    </#switch>
    <span class="custom-title ml-3">
  ${titleText}
  <a class="btn btn-info ml-2" href="/menu" aria-label="Home">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-fill" viewBox="0 0 16 16">
  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
  <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
    </svg>
  </a>
</span>
</div>
<table id="table"
       data-toolbar="#toolbar"
       data-search="true"
       data-show-export="true"
       data-show-columns="true"
       data-pagination="true"
       data-advanced-search="true"
       data-id-table="advancedTable"
       data-show-toggle="true"
       data-locale="ru-RU"
       data-buttons-class="info"
       class="table" >
    <thead>
    <tr>
        <th data-field="requestNumber" data-sortable="true">№</th>
        <th data-field="createdBy" data-sortable="true">Создал</th>
        <th data-field="employee" data-sortable="true">Ответственный</th>
        <th data-field="customerOrder" data-sortable="true">Заказа клиента</th>
        <th data-field="mlmNode" data-sortable="true">Цех</th>
        <th data-field="reason" data-sortable="true">Причина</th>
        <th data-field="item" data-sortable="true">Тип детали</th>
        <th data-field="status" data-sortable="true">Статус</th>
        <th data-field="createdDate" data-sortable="true">Дата создания</th>
        <th data-field="updatedDate" data-sortable="true">Дата изменения</th>
        <th data-field="updateUser" data-sortable="true">Изменил</th>
        <#if typeRequest == 'otk'>
        <th data-field="typeControl" data-sortable="true">Тип контроля</th>
        </#if>
        <th data-field="log" data-searchable="false">Функции</th>
    </tr>
    </thead>
    <tbody>
    <#list requestsList as req>
        <#assign reqIndex = req_index>
        <#if req.getStatus().getName() == "Выполнен" || req.getStatus().getName() == "Закрыт">
        <tr class="table-success" data-request-number="${req.requestNumber}">
        <#elseif req.getStatus().getName() == "В работе">
            <tr class="table-warning" data-request-number="${req.requestNumber}">
        <#elseif req.getStatus().getName() == "Отменен" || req.getStatus().getName() == "Забракована">
            <tr class="table-danger" data-request-number="${req.requestNumber}">
        </#if>
            <td>${req.getRequestNumber()}</td>
            <td>${req.getCreatedBy().getName()}</td>
            <td>${req.getEmployee().getName()}</td>
            <td>${(req.getCustomerOrder().getName())!"Нет"}</td>
            <td>${req.getMlmNode().getName()}</td>
            <#if typeRequest == 'otk'>
                <td>${(req.getReason_wr())!"-"}</td>
            <#else>
                <td>${(req.getReason().getName())!"-"}</td>
            </#if>
            <td>${(req.getItem().getName())!"-"}</td>
            <td>${req.getStatus().getName()}</td>
            <td>${formattedBidList[reqIndex]!"-"}</td>
            <td>${updateDateList[reqIndex]!"-"}</td>
            <td>${(req.getUpdateBy().getName())!"-"}</td>
            <#if typeRequest == 'otk'>
                <td>${(req.getControl())!"Нет"}</td>
            </#if>
            <td>
                <i class="history-icon bi bi-clock-history text-primary fs-4" data-id="${req.id}"></i>
                <a class="btn btn-info ml-3" href="/view/${req.getRequestNumber()}">Редактировать</a>
            </td>
        </tr>
    </#list>
    </tbody>
</table>

<div class="modal fade" id="viewRequestLogs" tabindex="-1" aria-labelledby="viewRequestLogsLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content">
            <div class="modal-header bg-light">
                <h5 class="modal-title fs-5 fw-semibold">История изменений</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" id="closeId" aria-label="Закрыть"></button>
            </div>
            <div class="modal-body p-0">
                <div class="container-fluid">
                    <div class="row gx-4 py-3 bg-light fw-semibold small border-bottom">
                        <div class="col-3">Дата изменения</div>
                        <div class="col-3">Пользователь</div>
                        <div class="col-6">Изменения</div>
                    </div>
                    <div id="logsBody" class="divide-y" style="--bs-border-opacity: 0.1;">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<!-- Popper.js -->
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.min.js"></script>
<!-- Bootstrap Table JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap-table@1.24.1/dist/bootstrap-table.min.js"></script>
<!-- Bootstrap Table JS Locale - RU-->
<script src="https://cdn.jsdelivr.net/npm/bootstrap-table@1.24.1/dist/locale/bootstrap-table-ru-RU.min.js"></script>
<!-- Auto-refresh extension -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap-table@1.24.1/dist/extensions/auto-refresh/bootstrap-table-auto-refresh.min.js"></script>
<!-- Печать в JSON и MS-Exel -->
<script src="https://cdn.jsdelivr.net/npm/tableexport.jquery.plugin@1.29.0/tableExport.min.js"></script>
<!-- Так же для поддержки печати -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap-table@1.24.1/dist/extensions/export/bootstrap-table-export.min.js"></script>
<!-- Фильтр через модальное окно -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap-table@1.24.1/dist/extensions/toolbar/bootstrap-table-toolbar.min.js"></script>

</body>
</html>

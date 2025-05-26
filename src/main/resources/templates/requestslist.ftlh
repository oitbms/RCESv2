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
    <script src="/js/list.js" defer></script>
</head>
<body>
<div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Функции</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
        <div class="list-group" style="width: 200px;">
            <a href="/menu" class="list-group-item list-group-item-action btn btn-primary mb-2">Меню</a>
            <#if user.getRole() == 'ADMIN' || user.getRole() == 'CONTROL' || user.getRole() == 'EVENT'>
                <a href="/sgi" class="list-group-item list-group-item-action btn btn-primary">СГИ</a>
            </#if>
            <#if user.getRole() != 'CONTROL' && user.getRole() != 'EVENT'>
                <div class="dropdown mt-3">
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        Формы заявок
                    </button>
                    <ul class="dropdown-menu">
                        <#if user.getRole() == 'ADMIN' || user.getRole() == 'MASTER'>
                            <li><a class="dropdown-item" href="requestslist/technologist">Заявки для ОГТ </a></li>
                            <li><a class="dropdown-item" href="requestslist/constructor">Заявки для ОГК</a></li>
                            <li><a class="dropdown-item" href="requestslist/otk">Заявки для ОТК</a></li>
                        <#elseif user.getRole() == 'TECHNOLOGIST'>
                            <li><a class="dropdown-item" href="requestslist/technologist">Заявки для ОГТ </a></li>
                        <#elseif user.getRole() == 'CONSTRUCTOR'>
                            <li><a class="dropdown-item" href="requestslist/constructor">Заявки для ОГК</a></li>
                        <#elseif user.getRole() == 'OTK'>
                            <li><a class="dropdown-item" href="requestslist/otk">Заявки для ОТК</a></li>
                        </#if>
                    </ul>
                </div>
            </#if>
        </div>
    </div>
</div>
<div class="container mt-5">
    <h1 class="text-center">
        Список заявок
        <button class="btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions" style="background: none; border: none;">
            <i class="bi bi-list" style="color: black"></i>
        </button>
    </h1>
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

<div class="modal fade" id="viewRequestLogs" tabindex="-1" aria-labelledby="viewRequestLogsLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content">
            <div class="modal-header bg-light">
                <h5 class="modal-title fs-5 fw-semibold">История изменений</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
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
</body>
</html>
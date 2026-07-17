<!doctype html>
<html lang="ru" xmlns="http://www.w3.org/1999/html">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Список авторского надзора</title>
    <link href="/css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <style>
        .fab-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1050;
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10px;
        }

        .fab-main,
        .fab-sub {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            padding: 0;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

    </style>
</head>
<body>
<nav class="navbar navbar-dark bg-primary fixed-top">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">Авторский надзор</a>
        <button class="btn btn-outline-light" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasMenu">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filter"
                 viewBox="0 0 16 16">
                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
            </svg>
        </button>
    </div>
</nav>
<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasMenu">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title">Фильтр</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
    </div>
    <div class="offcanvas-body">
        <form id="filterForm" action="/view/author-control" method="get">
            <!-- Поиск -->
            <input type="text" name="filterNumber" class="form-control mb-2"
                   placeholder="Поиск по номеру..."
                   value="${(filterNumber)!''}" data-filter-input>

            <!-- Статус -->
            <select name="filterStatus" class="form-select mb-2" data-filter-input>
                <option value="">Все статусы</option>
                <option value="Новый" <#if filterStatus?? && filterStatus == "Новый">selected</#if>>Новый</option>
                <option value="На согласовании" <#if filterStatus?? && filterStatus == "На согласовании">selected</#if>>На согласовании</option>
                <option value="Ожидает устранения" <#if filterStatus?? && filterStatus == "Ожидает устранения">selected</#if>>Ожидает устранения</option>
                <option value="Не согласовано" <#if filterStatus?? && filterStatus == "Не согласовано">selected</#if>>Не согласовано</option>
                <option value="Согласовано" <#if filterStatus?? && filterStatus == "Согласовано">selected</#if>>Согласовано</option>
                <option value="Аннулирован" <#if filterStatus?? && filterStatus == "Аннулирован">selected</#if>>Аннулирован</option>
                <option value="not-finished" <#if filterStatus?? && filterStatus == "not-finished">selected</#if>>Все незавершённые</option>
            </select>

            <!-- Сотрудник -->
            <input type="text" name="filterEmployee" class="form-control mb-2"
                   placeholder="Сотрудник"
                   value="${(filterEmployee)!''}" data-filter-input>

            <!-- Заказ -->
            <input type="text" name="filterOrder" class="form-control mb-2"
                   placeholder="Заказ"
                   value="${(filterOrder)!''}" data-filter-input>

            <!-- Подразделение -->
            <input type="text" name="filterSubDivision" class="form-control mb-2"
                   placeholder="Подразделение"
                   value="${(filterSubDivision)!''}" data-filter-input>

            <!-- Площадка -->
            <select name="filterSubDivisionSite" class="form-select mb-2" data-filter-input>
                <option value="">Все площадки</option>
                <option value="БорМаш" <#if filterSubDivisionSite?? && filterSubDivisionSite == "БорМаш">selected</#if>>БорМаш</option>
                <option value="Завод_БорМаш" <#if filterSubDivisionSite?? && filterSubDivisionSite == "Завод_БорМаш">selected</#if>>Завод БорМаш</option>
            </select>

            <!-- Дата создания (от) -->
            <label class="form-label mt-2">Дата создания (от):</label>
            <input type="date" name="filterCreateDateFrom" class="form-control mb-2"
                   value="${(filterCreateDateFrom)!''}" data-filter-input>

            <!-- Дата создания (до) -->
            <label class="form-label">Дата создания (до):</label>
            <input type="date" name="filterCreateDateTo" class="form-control mb-2"
                   value="${(filterCreateDateTo)!''}" data-filter-input>

            <!-- Дата обновления (от) -->
            <label class="form-label mt-2">Дата обновления (от):</label>
            <input type="date" name="filterUpdateDateFrom" class="form-control mb-2"
                   value="${(filterUpdateDateFrom)!''}" data-filter-input>

            <!-- Дата обновления (до) -->
            <label class="form-label">Дата обновления (до):</label>
            <input type="date" name="filterUpdateDateTo" class="form-control mb-2"
                   value="${(filterUpdateDateTo)!''}" data-filter-input>

            <!-- Размер страницы -->
            <select name="size" class="form-select mb-2" data-filter-input>
                <option value="25" <#if pageSize?? && pageSize == 25>selected</#if>>25 элементов на странице</option>
                <option value="50" <#if pageSize?? && pageSize == 50>selected</#if>>50 элементов на странице</option>
                <option value="100" <#if pageSize?? && pageSize == 100>selected</#if>>100 элементов на странице</option>
            </select>

            <!-- Кнопки -->
            <button type="submit" class="btn btn-primary w-100 mb-2" id="applyFilterBtn">Применить</button>
            <button type="button" class="btn btn-secondary w-100" onclick="resetFilters()">Сбросить</button>

            <div class="mt-3 p-2 bg-light text-dark rounded text-center">
                <small>Записей с отклонениями: <strong>${totalElements!0}</strong></small>
            </div>
        </form>
    </div>
</div>

<#list authorControlList as authors>
<div class="container mt-5 pt-4">
    <div class="row">
        <div class="col-12 mb-3">
            <#if authors.getStatusAuthor().getName() == "Новый">
            <div class="card shadow-sm border-secondary">
                <#elseif authors.getStatusAuthor().getName() == "Ожидает устранения">
                <div class="card shadow-sm border-warning">
                    <#elseif authors.getStatusAuthor().getName() == "На согласовании">
                    <div class="card shadow-sm border-info">
                        <#elseif authors.getStatusAuthor().getName() == "Нe согласовано">
                        <div class="card shadow-sm border-danger">
                            <#elseif authors.getStatusAuthor().getName() == "Согласовано">
                            <div class="card shadow-sm border-success">
                                </#if>
                                <div class="card-body">
                                    <h5 class="card-title">Акт № ААН-0${authors.getId()}</h5>
                                    <p class="card-text mb-1"><strong>Площадка
                                            изготовитель:</strong> ${authors.getSite().getName()}
                                    </p>
                                    <p class="card-text mb-1"><strong>Зав. №:</strong> ${(authors.getSiteCode())!"---"}
                                    </p>
                                    <p class="card-text mb-1"><strong>Заказ
                                            №:</strong> ${authors.getCustomerOrderStrCode()}</p>
                                    <p class="card-text mb-1"><strong>ФИО:</strong> ${authors.getEmployee().getName()}
                                    </p>
                                    <p class="card-text mb-1"><strong>Тип:</strong> ${authors.getTypeAuthor().getName()}
                                    </p>
                                    <p class="card-text mb-1">
                                        <strong>Виновник:</strong> ${authors.getSubDivision().getName()}</p>
                                    <p class="card-text mb-1"><strong>Наличие
                                            несоответствий:</strong> ${authors.getInconsistency()?string('Есть', 'Нет')}
                                    </p>
                                    <p class="card-text mb-1"><strong>Дата
                                            создания:</strong> ${(authors.getCreatedAt())!"-"}</p>
                                    <span <#switch authors.getStatusAuthor().getName()>
                                        <#case "Новый"> class="badge bg-secondary text-white" <#break >
                                        <#case "На согласовании"> class="badge text-dark bg-info" <#break >
                                        <#case "Ожидает устранения"> class="badge text-dark bg-warning" <#break >
                                        <#case "Не согласовано"> class="badge text-white bg-danger" <#break >
                                        <#case "Согласовано"> class="badge text-white bg-success" <#break >
                                    </#switch>
                                    >${authors.getStatusAuthor().getName()}</span>
                                    <a href="/view/author-control/${authors.getId()}" class="btn btn-outline-primary btn-sm float-end"><i
                                                class="bi bi-pencil"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </#list>

                <div class="fab-container">
                    <button type="button" class="btn btn-success rounded-circle fab-main" data-bs-toggle="modal"
                            data-bs-target="#exampleModalCenter">
                        <i class="bi bi-plus-lg"></i>
                    </button>
                    <button data-bs-toggle="modal" data-bs-target="#exampleModalEmpl"
                            class="btn btn-outline-primary fab-sub">
                        <i class="bi bi-person-lines-fill"></i>
                    </button>
                </div>

                <div class="modal fade" id="exampleModalCenter" tabindex="-1">
                    <div class="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Создание записи</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <select class="form-select" name="site" id="siteSelect" required="">
                                        <option value="" selected="">Выберите площадку изготовителя</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <select class="form-select" name="inconsistency" id="inconsistencySelect"
                                            required="">
                                        <option value="" selected="">Выберите тип акта</option>
                                        <option value="false">Есть несоответствие</option>
                                        <option value="true">Нет несоответствий</option>
                                    </select>
                                </div>
                                <div class="mb-2">
                                    <input type="text" class="form-control" name="siteCode" id="siteCodeId"
                                           placeholder="Заводской номер"
                                           required="">
                                </div>
                                <div class="mb-2">
                                    <input type="text" class="form-control" name="customerOrderStrCode"
                                           id="customerOrderStrCodeId" placeholder="Номер ЗК"
                                           required="">
                                </div>
                                <div class="mb-2">
                                    <select class="form-select" name="employee" id="employeeSelectId" required="">
                                        <option disabled="" selected="" value="">Выберите конструктора</option>
                                    </select>
                                </div>
                                <div class="mb-2">
                                    <select class="form-select" name="type" id="typeAuthor" required="">
                                        <option value="PLANNED">Плановый</option>
                                        <option value="UNPLANNED">Внеплановый</option>
                                    </select>
                                </div>
                                <div class="mb-2">
                                    <select name="subDivision" class="form-select mb-2" id="subDivisionSelectId">
                                        <option value="Отсутствует">Виновник отсутствует</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <select class="form-select" name="status" id="statusId" required="">
                                        <option value="NEW">Новый</option>
                                        <option value="PENDING_APPROVAL">На согласовании</option>
                                        <option value="AWAITING_FIX">Ожидает устранения</option>
                                        <option value="NOT_APPROVED">Не согласовано</option>
                                        <option value="APPROVED">Согласовано</option>
                                    </select>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <button id="saveId" class="btn btn-success w-50">Создать</button>
                                    <button type="button" class="btn btn-danger w-50" data-bs-dismiss="modal">
                                        Закрыть
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="/js/bootstrap/bootstrap.bundle.min.js"></script>
<script src="/js/author-control-list.js"></script>

</body>
</html>
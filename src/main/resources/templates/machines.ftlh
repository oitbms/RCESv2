<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><#if activeTab == "buildings">Управление зданиями<#else>Управление станками</#if></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="/css/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="/css/modern.css">
</head>
<body data-can-edit="${canEdit?c}" data-active-tab="${activeTab}">

<div class="container mt-4">
    <h1 id="equipment-title" class="page-title fade-in-up"><#if activeTab == "buildings">Управление зданиями<#else>Управление станками</#if></h1>

    <div class="card fade-in-up">
        <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div class="btn-group segmented" role="tablist">
                <a href="/machines" data-tab="machines" role="tab"
                   class="btn icon-text <#if activeTab == "machines">active</#if>">
                    <i class="bi bi-gear-wide-connected"></i>
                    <span>Оборудование</span>
                </a>
                <a href="/sub-division" data-tab="buildings" role="tab"
                   class="btn icon-text <#if activeTab == "buildings">active</#if>">
                    <i class="bi bi-building"></i>
                    <span>Здания</span>
                </a>
            </div>
            <div class="d-flex gap-2">
            <#if canEdit>
            <a href="/machines/new" data-tab-only="machines"
               class="btn btn-primary icon-text <#if activeTab != "machines">d-none</#if>">
                <i class="bi bi-plus-circle"></i>
                <span>Создать новый станок</span>
            </a>
            <a href="/sub-division/new" data-tab-only="buildings"
               class="btn btn-primary icon-text <#if activeTab != "buildings">d-none</#if>">
                <i class="bi bi-plus-circle"></i>
                <span>Добавить новое здание</span>
            </a>
            </#if>
            <a href="/menu" class="btn btn-outline-secondary icon-text">
                <i class="bi bi-menu-button-wide-fill"></i>
                <span>Перейти в меню</span>
            </a>
            </div>
        </div>
        <div class="card-body">
            <div data-tab-only="machines" class="<#if activeTab != "machines">d-none</#if>">
                <div class="list-filters">
                    <div class="input-group list-search">
                        <span class="input-group-text"><i class="bi bi-search"></i></span>
                        <input type="search" id="machines-search" class="form-control"
                               placeholder="Название, инвентарный номер, описание или цех" aria-label="Поиск" autocomplete="off">
                    </div>
                    <select id="machines-subdivision-filter" class="form-select" aria-label="Фильтр по цеху">
                        <option value="">Все цеха</option>
                    </select>
                </div>
                <div class="table-responsive table-frame d-none d-lg-block">
                    <table class="table table-hover table-striped align-middle">
                        <thead class="table-light">
                            <tr>
                                <th scope="col">Наименование</th>
                                <th scope="col">Инвентарный номер</th>
                                <th scope="col">Цех</th>
                                <th scope="col">Описание</th>
                                <th scope="col" class="text-end">Действия</th>
                            </tr>
                        </thead>
                        <tbody id="machines-table-body">

                        </tbody>
                    </table>
                </div>
                <div id="machines-card-view" class="d-lg-none">

                </div>
                <div id="machines-empty" class="list-empty d-none"></div>
                <div id="machines-loading-indicator" class="text-center" style="display: none;">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Загрузка...</span>
                    </div>
                </div>
            </div>

            <div data-tab-only="buildings" class="<#if activeTab != "buildings">d-none</#if>">
                <div class="list-filters">
                    <div class="input-group list-search">
                        <span class="input-group-text"><i class="bi bi-search"></i></span>
                        <input type="search" id="buildings-search" class="form-control"
                               placeholder="Название или подразделение" aria-label="Поиск" autocomplete="off">
                    </div>
                    <select id="buildings-subdivision-filter" class="form-select" aria-label="Фильтр по подразделению">
                        <option value="">Все подразделения</option>
                    </select>
                </div>
                <div class="table-responsive table-frame d-none d-lg-block">
                    <table class="table table-hover table-striped align-middle">
                        <thead class="table-light">
                            <tr>
                                <th scope="col">Название</th>
                                <th scope="col">Подразделение</th>
                                <th scope="col" class="text-end">Действия</th>
                            </tr>
                        </thead>
                        <tbody id="sub-division-table-body">

                        </tbody>
                    </table>
                </div>
                <div id="sub-division-card-view" class="d-lg-none">

                </div>
                <div id="buildings-empty" class="list-empty d-none"></div>
                <div id="buildings-loading-indicator" class="text-center" style="display: none;">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Загрузка...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div id="app-toast" class="toast align-items-center text-white border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body" id="app-toast-body"></div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>
</div>

<script src="/js/dist/equipment-tabs.js"></script>
<script src="/js/dist/machines.js"></script>
<script src="/js/dist/sub-division.js"></script>
</body>
</html>

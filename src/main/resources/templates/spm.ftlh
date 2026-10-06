<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/css/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="/css/base.css">
    <link rel="stylesheet" href="/css/spm.css">
    <#include "macros/registry-scripts.ftlh">
    <@registryScripts module="spm" />
    <title>СПМ</title>
</head>
<body>
<div class="container">
    <header>
        <div class="title">
            <h1>СПМ</h1>
        </div>
        <div class="toolbar">
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="searchInput" placeholder="Поиск...">
            </div>
            <div class="tool edit tooltip-trigger" id="edit-button" data-description="Переключить режим редактирования">
                <button>
                    <i class="fas fa-pencil-alt"></i>
                </button>
            </div>
            <div class="tool save tooltip-trigger" id="save-button" data-description="Сохранить записи">
                <button>
                    <i class="fas fa-floppy-disk"></i>
                </button>
            </div>
            <div class="tool create tooltip-trigger" id="create-button" data-description="Добавить запись">
                <button>
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="tool load-1c tooltip-trigger" id="load-1c-button" data-description="Загрузить строки из 1C в СЗЦ">
                <button type="button">
                    <i class="fas fa-cloud-download-alt"></i>
                </button>
            </div>
            <div class="tool spm-switch tooltip-trigger" id="spm-switch-button" data-description="Перейти в СЗЦ">
                <button type="button" onclick="window.location.href='/parts-directory'">
                    <i class="fas fa-arrow-left"></i>
                    <span>СЗЦ</span>
                </button>
            </div>
        </div>
    </header>
    <div class="data-container">
        <div class="table-header">
            <div class="table-header-cell" style="width: var(--customerOrderLine);">
                <div class="circle circle-header tooltip-trigger" data-description="Выделить все строки"></div>
                Строка заказа клиента
            </div>
            <div class="table-header-cell" style="width: var(--dateStart);">
                Дата начала
            </div>
            <div class="table-header-cell" style="width: var(--priority);">
                Приоритет
            </div>
            <div class="table-header-cell" style="width: var(--loaded);">
                Загружено
            </div>
        </div>
        <div class="table-body">
        </div>
    </div>
</div>
<dialog id="create-dialog">
    <div class="modal-header">
        <h2 class="modal-title">Создание записи СПМ</h2>
    </div>
    <form id="spmForm" enctype="multipart/form-data">
        <div class="modal-body">
            <div class="form-group">
                <label class="form-label">Строка заказа клиента</label>
                <input type="text" class="form-control" name="customerOrderLine" required>
            </div>
            <div class="form-group">
                <label class="form-label">Дата начала</label>
                <input type="date" class="form-control" name="dateStart">
            </div>
            <div class="form-group">
                <label class="form-label">Приоритет</label>
                <input type="number" class="form-control" name="priority" min="0">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" name="closeDialog">Отмена</button>
            <button type="submit" class="btn btn-primary" id="createBtn">Создать</button>
        </div>
    </form>
</dialog>
<dialog id="load-1c-dialog">
    <div class="modal-header">
        <h2 class="modal-title">Загрузка из 1C в СЗЦ</h2>
    </div>
    <form id="loadFrom1cForm">
        <div class="modal-body">
            <div class="form-group load-1c-form-group">
                <label class="form-label">Заказ</label>
                <div class="form-control load-1c-order-name" id="spm-load-order-name"></div>
            </div>
            <div class="load-1c-filters">
                <div class="load-1c-search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="loadFrom1cSearchInput" placeholder="Фильтр по всем строкам">
                </div>
                <div class="load-1c-search-box load-1c-steel-filter">
                    <i class="fas fa-filter"></i>
                    <input type="text" id="loadFrom1cSteelFilterInput" placeholder="Фильтр по стали">
                </div>
            </div>
            <div class="load-1c-results" id="load-1c-results" hidden>
                <div class="load-1c-results__summary" id="load-1c-result-summary"></div>
                <div class="load-1c-grid">
                    <div class="load-1c-grid__header">
                        <label class="load-1c-grid__cell load-1c-grid__cell--checkbox">
                            <input type="checkbox" id="load-1c-select-all" aria-label="Выбрать все строки">
                        </label>
                        <div class="load-1c-grid__cell">Номер заказа</div>
                        <div class="load-1c-grid__cell">ТМЦ</div>
                        <div class="load-1c-grid__cell">Кол-во</div>
                        <div class="load-1c-grid__cell">Размер</div>
                        <div class="load-1c-grid__cell">Сталь</div>
                    </div>
                    <div class="load-1c-grid__body" id="load-1c-rows"></div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" name="closeDialog">Отмена</button>
            <div class="load-1c-actions">
                <button type="button" class="btn btn-primary" id="loadFrom1cBtn">Загрузить</button>
                <button type="button" class="btn btn-primary" id="createFrom1cBtn" disabled>Создать</button>
            </div>
        </div>
    </form>
</dialog>
</body>
</html>

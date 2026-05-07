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
    <link rel="stylesheet" href="/css/pditem.css">
    <script src="/js/jquery.min.js"></script>
    <script src="/js/dist/base/dialog.js"></script>
    <script src="/js/dist/base/dialogTemplates.js"></script>
    <script src="/js/dist/base/cache.js"></script>
    <script src="/js/dist/base/type/generalType.js"></script>
    <script src="/js/dist/base/base.js"></script>
    <script src="/js/dist/pditem.js"></script>
    <title>Справочник</title>
</head>
<body>
<div class="container">
    <header>
        <div class="title">
            <h1>Справочник заготовительного цеха</h1>
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
            <div class="tool print tooltip-trigger" id="print-button" data-description="Печать отчета">
                <button>
                    <i class="fas fa-print"></i>
                </button>
            </div>
            <div class="tool create tooltip-trigger" id="create-button" data-description="Добавить запись">
                <button>
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="tool load-1c tooltip-trigger" id="load-1c-button" data-description="Открыть загрузку заказа из 1C">
                <button type="button" class="toolbar-text-button">
                    <i class="fas fa-file-import"></i>
                    <span>1C</span>
                </button>
            </div>
            <div class="tool teams tooltip-trigger" id="teams-button" data-description="Управление бригадами">
                <button>
                    <i class="fas fa-users"></i>
                </button>
            </div>
        </div>
    </header>
    <div class="data-container">
        <div class="table-header">
            <div class="table-header-cell" style="width: var(--customerorder);">
                <div class="circle circle-header tooltip-trigger" data-description="Выделить все строки"></div>
                Номер заказа
            </div>
            <div class="table-header-cell" style="width: var(--name);">
                Наименование
            </div>
            <div class="table-header-cell" style="width: var(--schema);">
                Чертеж
            </div>
            <div class="table-header-cell" style="width: var(--thickness);">
                Толщина
            </div>
            <div class="table-header-cell" style="width: var(--steel);">
                Сталь
            </div>
            <div class="table-header-cell" style="width: var(--qty);">
                Количество
            </div>
            <div class="table-header-cell center" style="width: var(--qtyCompleted);">
                Выполненное количество
            </div>
            <div class="table-header-cell" style="width: var(--dimensions);">
                Размеры
            </div>
            <div class="table-header-cell" style="width: var(--program);">
                Программа
            </div>
            <div class="table-header-cell" style="width: var(--comment);">
                Комментарий
            </div>
            <div class="table-header-cell last-child" style="width: var(--status);">
                Статус
            </div>
            <div class="table-header-cell" style="width: var(--team);">
                Бригада
            </div>
            <div class="table-header-cell" style="width: var(--dateCompletion);">
                Дата готовности
            </div>
            <div class="table-header-cell last-child" style="width: var(--ready);">
                Готовность
            </div>
        </div>
        <div class="table-body">
        </div>
    </div>
</div>
<dialog id="create-dialog">
    <div class="modal-header">
        <h2 class="modal-title">Создание записи</h2>
    </div>
    <form id="pdForm" enctype="multipart/form-data">
        <div class="modal-body">
            <div class="form-group">
                <label class="form-label">Номер заказа</label>
                <input type="text" class="form-control" name="customerOrder" required>
            </div>

            <div class="form-group">
                <label class="form-label">Наименование</label>
                <input type="text" class="form-control" name="name" required>
            </div>

            <div class="form-group">
                <label class="form-label">Толщина</label>
                <input type="text" class="form-control" name="thickness" required>
            </div>

            <div class="form-group">
                <label class="form-label">Размеры</label>
                <input type="text" class="form-control" name="measurements" required>
            </div>

            <div class="form-group">
                <label class="form-label">Сталь</label>
                <input type="text" class="form-control" name="steel" required>
            </div>

            <div class="form-group">
                <label class="form-label">Чертеж</label>
                <input type="text" class="form-control" name="scheme" required>
            </div>

            <div class="form-group">
                <label class="form-label">Количество</label>
                <input type="number" class="form-control" name="qty" min="1" step="1" required>
            </div>

            <div class="form-group">
                <label class="form-label">Выполненное количество</label>
                <input type="number" class="form-control" name="qtyCompleted" min="0" step="1" value="0">
            </div>

            <div class="form-group">
                <label class="form-label">Комментарий</label>
                <textarea class="form-control" name="comment"></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Станок</label>
                <input type="text" class="form-control" name="machine" required>
            </div>

            <div class="form-group">
                <label class="form-label">Программа</label>
                <input type="text" class="form-control" name="program">
            </div>

            <div class="form-group">
                <label class="form-label">Автор</label>
                <textarea class="area-modal form-control tooltip-trigger" data-description="Открыть модальное окно" data-field="employee" name="employee" readonly  required></textarea>
                <input type="hidden" name="hiddenEmployee">
            </div>

            <div class="form-group">
                <label class="form-label">Бригада</label>
                <textarea class="area-modal form-control tooltip-trigger" data-description="Открыть окно выбора бригады" data-field="team" name="team" readonly></textarea>
                <input type="hidden" name="hiddenTeam">
            </div>

            <div class="form-group">
                <label class="form-label">Дата готовности</label>
                <input type="datetime-local" class="form-control" name="dateCompletion">
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
        <h2 class="modal-title">Загрузка с 1C</h2>
    </div>
    <form id="loadFrom1cForm">
        <div class="modal-body">
            <div class="form-group load-1c-form-group">
                <label class="form-label">Номер заказа</label>
                <input type="text" class="form-control" name="orderNumber" placeholder="Введите номер заказа" required>
            </div>
            <div class="load-1c-search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="loadFrom1cSearchInput" placeholder="Фильтр по загруженным строкам">
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
<dialog id="employeeDialog">
    <div class="dialog-container">
        <div class="dialog-container-header">
            <div class="dialog-name">Окно выбора сотрудника</div>
            <div class="choice-field">
                <input type="text" placeholder="Введите фамилию сотрудника">
            </div>
        </div>
        <div class="dialog-container-content">
            <div class="dialog-content-header">
                <div class="dialog-content-header-column col-250">Имя</div>
                <div class="dialog-content-header-column col-250">Подразделение</div>
            </div>
            <div class="dialog-content-rows">
            </div>
        </div>
        <div class="dialog-container-footer">
            <button name="closeDialog" class="dialog-btn">
                Отмена
            </button>
            <button class="dialog-btn primary" id="changeEmployee">
                Выбрать
            </button>
        </div>
    </div>
</dialog>
<dialog id="teamDialog">
    <div class="dialog-container">
        <div class="dialog-container-header">
            <div class="dialog-name">Окно выбора бригады</div>
            <div class="choice-field">
                <input type="text" placeholder="Введите название бригады">
            </div>
        </div>
        <div class="dialog-container-content">
            <div class="dialog-content-header">
                <div class="dialog-content-header-column" style="width: 160px">Название бригады</div>
                <div class="dialog-content-header-column" style="width: 500px">Сотрудники</div>
            </div>
            <div class="dialog-content-rows">
            </div>
        </div>
        <div class="dialog-container-footer">
            <button name="closeDialog" class="dialog-btn">
                Отмена
            </button>
            <button class="dialog-btn primary" id="changeTeam">
                Выбрать
            </button>
        </div>
    </div>
</dialog>
<dialog id="teamEditDialog">
    <div class="dialog-container">
        <div class="dialog-container-header">
            <div class="dialog-name">Управление бригадами</div>
        </div>
        <div class="dialog-container-content">
            <div class="team-edit-tabs">
                <button type="button" class="team-tab active" data-tab="team-list">Список бригад</button>
                <button type="button" class="team-tab" data-tab="team-edit">Редактирование</button>
                <button type="button" class="team-tab" data-tab="team-create">Создание</button>
            </div>
            <!-- Tab: Team List -->
            <div class="team-tab-content active" data-tab-content="team-list">
                <div class="choice-field">
                    <input type="text" id="teamSearchInput" placeholder="Введите название бригады">
                </div>
                <div class="dialog-content-header">
                    <div class="dialog-content-header-column" style="width: 160px">Название бригады</div>
                    <div class="dialog-content-header-column" style="width: 500px">Сотрудники</div>
                </div>
                <div class="dialog-content-rows" id="teamListRows"></div>
            </div>
            <!-- Tab: Team Edit -->
            <div class="team-tab-content" data-tab-content="team-edit">
                <div class="form-group">
                    <label class="form-label">Название бригады</label>
                    <input type="text" class="form-control" id="editTeamName">
                </div>
                <div class="form-group">
                    <label class="form-label">Сотрудники</label>
                    <div class="employee-selection">
                        <div class="choice-field">
                            <input type="text" id="employeeSearchInput" placeholder="Введите фамилию сотрудника">
                        </div>
                        <div class="dialog-content-header">
                            <div class="dialog-content-header-column col-250">
                                <input type="checkbox" id="selectAllEmployees">
                                <label for="selectAllEmployees">Выбрать всех</label>
                            </div>
                            <div class="dialog-content-header-column col-250">Имя</div>
                            <div class="dialog-content-header-column col-250">Подразделение</div>
                        </div>
                        <div class="dialog-content-rows" id="employeeRows"></div>
                    </div>
                </div>
            </div>
            <!-- Tab: Team Create -->
            <div class="team-tab-content" data-tab-content="team-create">
                <div class="form-group">
                    <label class="form-label">Название бригады</label>
                    <input type="text" class="form-control" id="createTeamName">
                </div>
                <div class="form-group">
                    <label class="form-label">Сотрудники</label>
                    <div class="employee-selection">
                        <div class="choice-field">
                            <input type="text" id="createEmployeeSearchInput" placeholder="Введите фамилию сотрудника">
                        </div>
                        <div class="dialog-content-header">
                            <div class="dialog-content-header-column col-250">
                                <input type="checkbox" id="createSelectAllEmployees">
                                <label for="createSelectAllEmployees">Выбрать всех</label>
                            </div>
                            <div class="dialog-content-header-column col-250">Имя</div>
                            <div class="dialog-content-header-column col-250">Подразделение</div>
                        </div>
                        <div class="dialog-content-rows" id="createEmployeeRows"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="dialog-container-footer">
            <button name="closeDialog" class="dialog-btn">
                Закрыть
            </button>
            <button class="dialog-btn danger" id="deleteTeam">
                Удалить
            </button>
            <button class="dialog-btn primary" id="saveTeam">
                Сохранить
            </button>
            <button class="dialog-btn primary" id="createTeam">
                Создать
            </button>
        </div>
    </div>
</dialog>
<dialog id="readiness-dialog">
    <div class="modal-header">
        <h2 class="modal-title">Готовность</h2>
        <button class="close-btn" id="closeReadinessDialog">&times;</button>
    </div>
    <div class="modal-body">
        <div class="readiness-operation-checks">
            <label class="operation-checkbox">
                <input type="checkbox" id="operationThermal" value="thermal">
                <span>Термическая резка</span>
            </label>
            <label class="operation-checkbox">
                <input type="checkbox" id="operationLocksmith" value="locksmith">
                <span>Слесарные работы</span>
            </label>
            <label class="operation-checkbox">
                <input type="checkbox" id="operationBaikal" value="baikal">
                <span>Байкал</span>
            </label>
            <label class="operation-checkbox">
                <input type="checkbox" id="operationShearingPunching" value="shearingpunching">
                <span>Рубка, пробивка</span>
            </label>
            <label class="operation-checkbox">
                <input type="checkbox" id="operationDrilling" value="drilling">
                <span>Сверление</span>
            </label>
            <label class="operation-checkbox">
                <input type="checkbox" id="operationBending" value="bending">
                <span>Гибка</span>
            </label>
            <label class="operation-checkbox">
                <input type="checkbox" id="operationPressing" value="pressing">
                <span>Прессование</span>
            </label>
        </div>
    </div>
    <div class="modal-footer">
        <button class="btn btn-secondary" id="cancelReadiness">Отмена</button>
        <button class="btn btn-primary" id="saveReadiness">Сохранить</button>
    </div>
</dialog>
</body>
</html>

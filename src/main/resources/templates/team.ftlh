<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/css/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="/css/base.css">
    <link rel="stylesheet" href="/css/team.css">
    <script src="/js/jquery.min.js"></script>
    <script src="/js/base/dialog.js"></script>
    <script src="/js/base/cache.js"></script>
    <script src="/js/base/type/generalType.js"></script>
    <script src="/js/base/type/teamConstants.js"></script>
    <script src="/js/base/base.js"></script>
    <script src="/js/team.js"></script>
    <title>Бригады</title>
</head>
<body>
<div class="container">
    <header>
        <div class="title">
            <h1>Бригады</h1>
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
            <div class="tool create tooltip-trigger" id="create-button" data-description="Добавить бригаду">
                <button>
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    </header>
    <div class="data-container">
        <div class="table-header">
            <div class="table-header-cell" style="width: var(--no);">
                <div class="circle circle-header tooltip-trigger" data-description="Выделить все строки"></div>
                №
            </div>
            <div class="table-header-cell" style="width: var(--name);">
                Название бригады
            </div>
            <div class="table-header-cell" style="width: var(--employees);">
                Сотрудники
            </div>
        </div>
        <div class="table-body">
        </div>
    </div>
</div>

<!-- Диалог создания бригады -->
<dialog id="create-dialog">
    <div class="modal-header">
        <h2 class="modal-title">Создание бригады</h2>
    </div>
    <form id="teamForm">
        <div class="modal-body">
            <div class="form-group">
                <label class="form-label">Название бригады</label>
                <input type="text" class="form-control" name="name" required>
            </div>

            <div class="form-group">
                <label class="form-label">Сотрудники</label>
                <div class="employee-selection">
                    <textarea class="area-modal form-control tooltip-trigger"
                              data-description="Открыть окно выбора сотрудников"
                              data-field="employees"
                              name="employees"
                              readonly
                              required></textarea>
                    <input type="hidden" name="hiddenEmployees">
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" name="closeDialog" type="button">Отмена</button>
            <button type="submit" class="btn btn-primary" id="createBtn">Создать</button>
        </div>
    </form>
</dialog>

<!-- Диалог выбора сотрудников -->
<dialog id="employeeDialog">
    <div class="dialog-container">
        <div class="dialog-container-header">
            <div class="dialog-name">Окно выбора сотрудников</div>
            <div class="choice-field">
                <input type="text" placeholder="Введите фамилию сотрудника">
            </div>
        </div>
        <div class="dialog-container-content">
            <div class="dialog-content-header">
                <div class="dialog-content-header-column col-250">
                    <input type="checkbox" id="selectAllEmployees">
                    <label for="selectAllEmployees">Выбрать всех</label>
                </div>
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
</body>
</html>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="/css/base.css">
    <link rel="stylesheet" href="/css/pditem.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="/js/base/dialog.js"></script>
    <script src="/js/base/cache.js"></script>
    <script src="/js/base/base.js"></script>
    <script src="/js/pditem.js"></script>
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
            <div class="tool create tooltip-trigger" id="create-button" data-description="Добавить запись">
                <button>
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    </header>
    <div class="data-container">
        <div class="table-header">
            <div class="table-header-cell" style="width: var(--customerorder);">
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
            <div class="table-header-cell" style="width: var(--qtyCompleted);">
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
                <input type="text" class="form-control" name="qty" required>
            </div>

            <div class="form-group">
                <label class="form-label">Выполненное количество</label>
                <input type="text" class="form-control" name="qtyCompleted" required>
            </div>

            <div class="form-group">
                <label class="form-label">Комментарий</label>
                <textarea class="form-control" name="comment" required></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Станок</label>
                <input type="text" class="form-control" name="machine" required>
            </div>

            <div class="form-group">
                <label class="form-label">Программа</label>
                <input type="text" class="form-control" name="program" required>
            </div>

            <div class="form-group">
                <label class="form-label">Автор</label>
                <textarea class="area-modal form-control tooltip-trigger" data-description="Открыть модальное окно" data-field="employee" name="employee" readonly  required></textarea>
                <input type="hidden" name="hiddenEmployee">
            </div>


            <div class="form-group">
                <label class="form-label">Статус</label>
                <select class="form-control" name="status" required>
                    <option value="">Выберите статус</option>
                    <option value="NEW">Новый</option>
                    <option value="WORK">В работе</option>
                    <option value="REQUIRED">Требуется в строк</option>
                    <option value="COMPLETE">Готов</option>
                </select>
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
</body>
</html>
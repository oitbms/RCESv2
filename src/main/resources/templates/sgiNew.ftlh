<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Новый СГИ</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="/css/sgiNew.css">
    <script src="/js/cache.js" defer></script>
    <script src="/js/sgiNew.js" defer></script>
</head>

<body>
<main>
    <div class="table-wrapper">
        <div class="table-header">
            <div class="table-header-item no" style="width: var(--no);">
                № п/п
            </div>
            <div class="table-header-item" style="width: var(--workcenter);">
                № цеха
            </div>
            <div class="table-header-item" style="width: var(--event);">
                Мероприятие
            </div>
            <div class="table-header-item" style="width: var(--action);">
                Сопутствующие действия
            </div>
            <div class="table-header-item" style="width: var(--department);">
                Ответственный отдел
            </div>
            <div class="table-header-item" style="width: var(--employee);">
                Ответственное лицо
            </div>
            <div class="table-header-item" style="width: var(--desiredDate);">
                Желаемый срок
            </div>
            <div class="table-header-item" style="width: var(--note);">
                Примечание
            </div>
            <div class="table-header-item" style="width: var(--planDate);">
                Планируемый срок
            </div>
            <div class="table-header-item" style="width: var(--comment);">
                Комментарий
            </div>
            <div class="table-header-item" style="width: var(--editing);">

            </div>
            <div class="table-header-item" style="width: var(--executions);">
                Факт выполнения
            </div>
            <div class="table-header-item" style="width: var(--status);">
                Статус
            </div>
        </div>
        <div class="table-content">
            <div class="table-content-rows">
            </div>
        </div>
    </div>
</main>
<footer>
    <div class="footer-wrapper">
        <div class="footer-content">
            <div class="pagination">
                <button class="btn btn-secondary">1</button>
                <button class="btn btn-secondary">2</button>
            </div>
            <div class="buttons">
                <button class="btn btn-primary btn-action" id="createSGI">
                    <i class="bi bi-plus-circle"></i>
                    <span class="btn-text">Добавить</span>
                </button>
                <button class="btn btn-outline-primary btn-action">
                    <i class="bi bi-arrow-counterclockwise"></i>
                    <span class="btn-text">Фильтры</span>
                </button>
                <button class="btn btn-outline-secondary btn-action">
                    <i class="bi bi-list"></i>
                    <span class="btn-text">Меню</span>
                </button>
                <div class="print-container">
                    <button class="btn btn-outline-secondary btn-action print-button">
                        <i class="bi bi-three-dots-vertical"></i>
                        <span class="btn-text">Печать отчета</span>
                    </button>
                    <div class="print-menu">
                        <div class="print-menu-item" data-department="ОГМ">
                            <i class="bi bi-printer"></i> ОГМ
                        </div>
                        <div class="print-menu-item" data-department="ОРС">
                            <i class="bi bi-printer"></i> ОРС
                        </div>
                        <div class="print-menu-item" data-department="ОТиПК">
                            <i class="bi bi-printer"></i> ОТиПК
                        </div>
                        <div class="print-menu-item" data-department="ОГЭ">
                            <i class="bi bi-printer"></i> ОГЭ
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>
<dialog id="create-dialog">
    <div class="modal-header">
        <h2 class="modal-title">Создание мероприятия</h2>
    </div>

    <form action="/sgi/create" method="POST" enctype="multipart/form-data">
        <input type="hidden" name="parentId" id="parentIdInput">
        <div class="modal-body">
            <div class="form-group">
                <label class="form-label">№ цеха</label>
                <input type="text" class="form-control" name="workcenter" required>
            </div>

            <div class="form-group">
                <label class="form-label">Мероприятие</label>
                <textarea class="form-control" name="event" required></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Сопутствующие действия</label>
                <textarea class="form-control" name="actions" required></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Отдел</label>
                <select class="form-control" name="department" required>
                    <option value="">Выберите отдел</option>
                    <option value="mechanic">ОГМ</option>
                    <option value="builder">ОРС</option>
                    <option value="protection">ОТиПК</option>
                    <option value="energy">ОГЭ</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Ответственный</label>
                <select class="form-control" name="employee" required>
                    <option value="">Выберите сотрудника</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Желаемый срок</label>
                <input type="date" class="form-control" name="desiredDate" required>
            </div>

            <div class="form-group">
                <label class="form-label">Примечание</label>
                <textarea class="form-control" name="note"></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Прикрепленные фото</label>
                <div class="file-upload">
                    <div class="file-list">

                    </div>
                </div>
                <input type="file" multiple accept="image/*" style="display: none;" name="additionalFiles">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" onclick="document.getElementById('create-dialog').close()">Отмена</button>
            <button type="submit" class="btn btn-primary" id="saveBtn">Создать</button>
        </div>
    </form>

</dialog>
<dialog id="editing-dialog">
    <div class="modal-header">
        <h2 class="modal-title">Редактирование мероприятия</h2>
        <button class="close-btn" onclick="document.getElementById('editing-dialog').close()">&times;</button>
    </div>

    <div class="modal-body">
        <div class="form-group">
            <label class="form-label">№ цеха</label>
            <input type="text" class="form-control" data-field="workcenter">
        </div>

        <div class="form-group">
            <label class="form-label">Мероприятие</label>
            <textarea class="form-control" data-field="event"></textarea>
        </div>

        <div class="form-group">
            <label class="form-label">Сопутствующие действия</label>
            <textarea class="form-control" data-field="actions"></textarea>
        </div>

        <div class="form-group">
            <label class="form-label">Отдел</label>
            <select class="form-control" data-field="department">
                <option value="mechanic">ОГМ</option>
                <option value="builder">ОРС</option>
                <option value="protection">ОТиПК</option>
                <option value="energy">ОГЭ</option>
            </select>
        </div>

        <div class="form-group">
            <label class="form-label">Ответственный</label>
            <select class="form-control" data-field="employee">
            </select>
        </div>

        <div class="form-group">
            <label class="form-label">Желаемый срок</label>
            <input type="date" class="form-control" data-field="desiredDate">
        </div>

        <div class="form-group">
            <label class="form-label">Примечание</label>
            <textarea class="form-control" data-field="note">Примечание</textarea>
        </div>

        <div class="form-group">
            <label class="form-label">Прикрепленные фото</label>
            <div class="file-upload">
                <div>Кликните для редактирования фото-отчетов</div>
                <input type="file" multiple accept="image/*" style="display: none;">
            </div>
        </div>
    </div>

    <div class="modal-footer">
        <button class="btn btn-primary" id="saveBtn">Сохранить</button>
    </div>
</dialog>
<dialog id="execution-dialog">
    <div class="modal-header">
        <h2 class="modal-title">Факт выполнения</h2>
        <button class="close-btn" onclick="document.getElementById('execution-dialog').close()">&times;</button>
    </div>
    <div class="modal-body">
        <div class="form-group">
            <label class="form-label">Дата выполнения</label>
            <input type="date" class="form-control" data-field="executionDate">
        </div>
        <div class="form-group">
            <label class="form-label">Отчет</label>
            <textarea class="form-control" data-field="report"></textarea>
        </div>
        <div class="form-group">
            <label class="form-label">Прикрепленные фото</label>
            <div class="file-upload">
                <div>Фото-отчет</div>
                <input type="file" multiple accept="image/*" style="display: none;">
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <button class="btn btn-primary" id="saveBtn">Сохранить</button>
    </div>
</dialog>
</body>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</html>
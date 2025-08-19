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
            <div class="table-header-item" style="width: var(--ivent);">
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
                <div class="row-items">
                    <div class="row-items-row" data-id="">
                        <div class="row-item no" style="width: var(--no);">
                            <label class="hamburger">
                                <input type="checkbox">
                                <svg viewBox="0 0 32 32">
                                    <path class="line line-top-bottom"
                                          d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22">
                                    </path>
                                    <path class="line" d="M7 16 27 16"></path>
                                </svg>
                            </label>
                            1
                        </div>
                        <div class="row-item" style="width: var(--workcenter);">№6</div>
                        <div class="row-item" style="width: var(--ivent);">название или описание мероприятия</div>
                        <div class="row-item" style="width: var(--action);">действия</div>
                        <div class="row-item" style="width: var(--department);">ОГМ</div>
                        <div class="row-item" style="width: var(--employee);">Виктор Владимирович Виктрч</div>
                        <div class="row-item" style="width: var(--desiredDate);">30.05.2025</div>
                        <div class="row-item" style="width: var(--note);">примечание к задаче</div>
                        <div class="row-item" style="width: var(--planDate);">06.08.2025</div>
                        <div class="row-item" style="width: var(--comment);">Комментарий</div>
                        <div class="row-item" style="width: var(--editing);">
                            <button type="button" class="btn btn-info btn-sm" id="editing">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                        </div>
                        <div class="row-item" style="width: var(--executions);">
                            <button type="button" class="btn btn-info btn-sm">
                                ✔
                            </button>
                        </div>
                        <div class="row-item" style="width: var(--status)">
                            <div class="checkbox-wrapper-31">
                                <input type="checkbox">
                                <svg viewBox="0 0 35.6 35.6">
                                    <circle class="background" cx="17.8" cy="17.8" r="17.8"></circle>
                                    <circle class="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                                    <polyline class="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="row-items-inner-row">
                        <div class="row-items-row">
                            <div class="row-item no" style="width: var(--no);"></div>
                            <div class="row-item" style="width: var(--workcenter);">№6</div>
                            <div class="row-item" style="width: var(--ivent);">название или описание мероприятия
                            </div>
                            <div class="row-item" style="width: var(--action);">действия</div>
                            <div class="row-item" style="width: var(--department);">ОГМ</div>
                            <div class="row-item" style="width: var(--employee);">Виктор Владимирович Виктрч</div>
                            <div class="row-item" style="width: var(--desiredDate);">30.05.2025</div>
                            <div class="row-item" style="width: var(--note);">примечание к задаче</div>
                            <div class="row-item" style="width: var(--planDate);">06.08.2025</div>
                            <div class="row-item" style="width: var(--comment);">Комментарий</div>
                            <div class="row-item" style="width: var(--editing);">
                                <button type="button" class="btn btn-info btn-sm">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                            </div>
                            <div class="row-item" style="width: var(--executions);">
                                <button type="button" class="btn btn-info btn-sm">
                                    ✔
                                </button>
                            </div>
                            <div class="row-item" style="width: var(--status)">
                                <div class="checkbox-wrapper-31">
                                    <input type="checkbox">
                                    <svg viewBox="0 0 35.6 35.6">
                                        <circle class="background" cx="17.8" cy="17.8" r="17.8"></circle>
                                        <circle class="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                                        <polyline class="check" points="11.78 18.12 15.55 22.23 25.17 12.87">
                                        </polyline>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="row-items-row">
                            <div class="row-item no" style="width: var(--no);"></div>
                            <div class="row-item" style="width: var(--workcenter);">№6</div>
                            <div class="row-item" style="width: var(--ivent);">название или описание мероприятия
                            </div>
                            <div class="row-item" style="width: var(--action);">действия</div>
                            <div class="row-item" style="width: var(--department);">ОГМ</div>
                            <div class="row-item" style="width: var(--employee);">Виктор Владимирович Виктрч</div>
                            <div class="row-item" style="width: var(--desiredDate);">30.05.2025</div>
                            <div class="row-item" style="width: var(--note);">примечание к задаче</div>
                            <div class="row-item" style="width: var(--planDate);">06.08.2025</div>
                            <div class="row-item" style="width: var(--comment);">Комментарий</div>
                            <div class="row-item" style="width: var(--editing);">
                                <button type="button" class="btn btn-info btn-sm">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                            </div>
                            <div class="row-item" style="width: var(--executions);">
                                <button type="button" class="btn btn-info btn-sm">
                                    ✔
                                </button>
                            </div>
                            <div class="row-item" style="width: var(--status)">
                                <div class="checkbox-wrapper-31">
                                    <input type="checkbox">
                                    <svg viewBox="0 0 35.6 35.6">
                                        <circle class="background" cx="17.8" cy="17.8" r="17.8"></circle>
                                        <circle class="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                                        <polyline class="check" points="11.78 18.12 15.55 22.23 25.17 12.87">
                                        </polyline>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row-items">
                    <div class="row-items-row">
                        <div class="row-item no" style="width: var(--no);">
                            <label class="hamburger">
                                <input type="checkbox">
                                <svg viewBox="0 0 32 32">
                                    <path class="line line-top-bottom"
                                          d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22">
                                    </path>
                                    <path class="line" d="M7 16 27 16"></path>
                                </svg>
                            </label>
                            2
                        </div>
                        <div class="row-item" style="width: var(--workcenter);">№6</div>
                        <div class="row-item" style="width: var(--ivent);">название или описание мероприятия</div>
                        <div class="row-item" style="width: var(--action);">действия</div>
                        <div class="row-item" style="width: var(--department);">ОГМ</div>
                        <div class="row-item" style="width: var(--employee);">Виктор Владимирович Виктрч</div>
                        <div class="row-item" style="width: var(--desiredDate);">30.05.2025</div>
                        <div class="row-item" style="width: var(--note);">примечание к задаче</div>
                        <div class="row-item" style="width: var(--planDate);">06.08.2025</div>
                        <div class="row-item" style="width: var(--comment);">Комментарий</div>
                        <div class="row-item" style="width: var(--editing);">
                            <button type="button" class="btn btn-info btn-sm">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                        </div>
                        <div class="row-item" style="width: var(--executions);">
                            <button type="button" class="btn btn-info btn-sm">
                                ✔
                            </button>
                        </div>
                        <div class="row-item" style="width: var(--status)">
                            <div class="checkbox-wrapper-31">
                                <input type="checkbox">
                                <svg viewBox="0 0 35.6 35.6">
                                    <circle class="background" cx="17.8" cy="17.8" r="17.8"></circle>
                                    <circle class="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                                    <polyline class="check" points="11.78 18.12 15.55 22.23 25.17 12.87">
                                    </polyline>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="row-items-inner-row">
                        <div class="row-items-row">
                            <div class="row-item no" style="width: var(--no);"></div>
                            <div class="row-item" style="width: var(--workcenter);">№6</div>
                            <div class="row-item" style="width: var(--ivent);">название или описание мероприятия
                            </div>
                            <div class="row-item" style="width: var(--action);">действия</div>
                            <div class="row-item" style="width: var(--department);">ОГМ</div>
                            <div class="row-item" style="width: var(--employee);">Виктор Владимирович Виктрч</div>
                            <div class="row-item" style="width: var(--desiredDate);">30.05.2025</div>
                            <div class="row-item" style="width: var(--note);">примечание к задаче</div>
                            <div class="row-item" style="width: var(--planDate);">06.08.2025</div>
                            <div class="row-item" style="width: var(--comment);">Комментарий</div>
                            <div class="row-item" style="width: var(--editing);">
                                <button type="button" class="btn btn-info btn-sm">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                            </div>
                            <div class="row-item" style="width: var(--executions);">
                                <button type="button" class="btn btn-info btn-sm">
                                    ✔
                                </button>
                            </div>
                            <div class="row-item" style="width: var(--status)">
                                <div class="checkbox-wrapper-31">
                                    <input type="checkbox">
                                    <svg viewBox="0 0 35.6 35.6">
                                        <circle class="background" cx="17.8" cy="17.8" r="17.8"></circle>
                                        <circle class="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                                        <polyline class="check" points="11.78 18.12 15.55 22.23 25.17 12.87">
                                        </polyline>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                <button class="btn btn-primary btn-action">
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
<dialog id="editing-dialog">
    <div class="modal-header">
        <h2 class="modal-title">Редактирование мероприятия</h2>
        <button class="close-btn">&times;</button>
    </div>

    <div class="modal-body">
        <div class="form-group">
            <label class="form-label">№ цеха</label>
            <input type="text" class="form-control" value="№6">
        </div>

        <div class="form-group">
            <label class="form-label">Мероприятие</label>
            <input type="text" class="form-control" value="Название мероприятия">
        </div>

        <div class="form-group">
            <label class="form-label">Сопутствующие действия</label>
            <textarea class="form-control">Описание действий</textarea>
        </div>

        <div class="form-group">
            <label class="form-label">Отдел</label>
            <select class="form-control">
                <option>ОГМ</option>
                <option>ОРС</option>
                <option>ОТиПК</option>
                <option>ОГЭ</option>
            </select>
        </div>

        <div class="form-group">
            <label class="form-label">Ответственный</label>
            <input type="text" class="form-control" value="ФИО ответственного">
        </div>

        <div class="form-group">
            <label class="form-label">Желаемый срок</label>
            <input type="date" class="form-control" value="2025-05-30">
        </div>

        <div class="form-group">
            <label class="form-label">Примечание</label>
            <textarea class="form-control">Примечание</textarea>
        </div>

        <div class="form-group">
            <label class="form-label">Комментарий</label>
            <textarea class="form-control">Комментарий</textarea>
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
        <button class="close-btn">&times;</button>
    </div>
    <div class="modal-body">
        <div class="form-group">
            <label class="form-label">Дата выполнения</label>
            <input type="date" class="form-control" value="2025-08-06">
        </div>
        <div class="form-group">
            <label class="form-label">Отчет</label>
            <textarea class="form-control">Отчет</textarea>
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
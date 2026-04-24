<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Список заявок</title>
    <link rel="stylesheet" href="/css/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="/css/list.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet"
          href="${springMacroRequestContext.contextPath}/webjars/bootstrap-table/1.24.1/src/bootstrap-table.css">
    <link rel="stylesheet" href="/css/stylesMain.css">
    <link rel="stylesheet" href="/css/requestlistmobile.css">
</head>
<body>
<div id="toolbar" class="mb-2 ms-3">
    <span class="custom-title ml-3">
    Назначение смен для сотрудников ОТК
    <a class="btn btn-primary ml-2" href="/menu" aria-label="Home">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-fill"
             viewBox="0 0 16 16">
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
            <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
        </svg>
    </a>
    </span>
</div>

<div id="table-container">
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
           data-buttons-class="primary"
           class="table">
        <thead>
        <tr>
            <th data-field="employeeNumber" data-sortable="true">№</th>
            <th data-field="employeeName" data-sortable="true">Логин</th>
            <th data-field="subDivision" data-sortable="true">Цех</th>
            <th data-field="workShift" data-sortable="true">Смена</th>
            <th data-field="log" data-searchable="false">Функции</th>
        </tr>
        </thead>
        <tbody>
        <#list employeeDTOList as empl>
            <tr>
                <td class="employee-id">${empl.getId()}</td>
                <td class="employee-name">${empl.getUsername()}</td>
                <td>${empl.getSubDivisionName()}</td>
                <td class="shift-name">
                    <#if empl.getWorkDate()??>
                        <div class="shift-date"> Дата: ${empl.getWorkDate()}</div>
                        <div class="shift-time"> Время: ${empl.getWorkTime()!"не указано"}</div>
                    <#else>
                        <span class="text-muted">нет</span>
                    </#if>
                </td>
                <td>
                    <button class="btn btn-primary assign-shift-btn"
                            data-employee-id="${empl.getId()}"
                            data-employee-name="${empl.getUsername()}"
                            data-employee-department="${empl.getSubDivisionName()}"
                            data-user-shifts-id="${(empl.getUserShiftsId())!""}"
                    >
                        <i class="bi bi-calendar-plus"></i> Назначить смену
                    </button>
                </td>
            </tr>
        </#list>
        </tbody>
    </table>
</div>

<!-- Модальное окно для назначения смены -->
<div class="modal fade" id="assignShiftModal" tabindex="-1" aria-labelledby="assignShiftModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title" id="assignShiftModalLabel">
                    <i class="bi bi-calendar-plus"></i> Назначение смены
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="alert alert-info">
                    <strong>Сотрудник:</strong> <span id="modalEmployeeName">-</span><br>
                    <strong>Отдел/Цех:</strong> <span id="modalEmployeeDepartment">-</span><br>
                    <strong>ID:</strong> <span id="modalEmployeeId">-</span>
                </div>

                <form id="assignShiftForm">
                    <div class="mb-3">
                        <label for="shiftSelect" class="form-label">Выберите смену</label>
                        <select class="form-select" id="shiftSelect" required>
                            <option value="">-- Выберите смену --</option>
                            <!-- Список смен будет загружен динамически -->
                        </select>
                        <div class="invalid-feedback">
                            Пожалуйста, выберите смену
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="startDate" class="form-label">Дата начала</label>
                        <input type="date" class="form-control" id="startDate" required>
                        <div class="invalid-feedback">
                            Пожалуйста, укажите дату начала
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="endDate" class="form-label">Дата окончания (опционально)</label>
                        <input type="date" class="form-control" id="endDate">
                        <small class="text-muted">Если не указано, смена будет бессрочной</small>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle"></i> Отмена
                </button>
                <button type="button" class="btn btn-primary" id="saveShiftBtn">
                    <i class="bi bi-check-circle"></i> Назначить
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Модальное окно успеха -->
<div class="modal fade" id="successModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header bg-success text-white">
                <h5 class="modal-title">Успешно!</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <i class="bi bi-check-circle-fill text-success fs-1"></i>
                <p id="successMessage" class="mt-2">Смена успешно назначена!</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success" data-bs-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>

<!-- Модальное окно ошибки -->
<div class="modal fade" id="errorModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content mx-4">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title">Ошибка</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <i class="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
                <p id="errorMessage" class="mt-2">Произошла ошибка при назначении смены</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Закрыть</button>
            </div>
        </div>
    </div>
</div>

<!-- jQuery -->
<script src="/js/jquery.min.js"></script>
<!-- Bootstrap JS -->
<script src="/js/bootstrap/bootstrap.bundle.min.js"></script>
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

<script src="/js/workCalendar.js"></script>

<link rel="stylesheet" href="/css/list.css">

</body>
</html>
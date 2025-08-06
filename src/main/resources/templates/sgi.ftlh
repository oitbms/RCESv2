<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>План СГИ</title>
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <link href="//cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css" rel="stylesheet"/>
    <link rel="stylesheet" href="/css/sgi.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js"></script>
    <script src="/js/sgi.js" defer></script>
</head>
<body>
<div>
    <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions"
         aria-labelledby="offcanvasWithBothOptionsLabel">
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
    <table id="sgiTable" class="table table-hover">
        <thead>
        <tr>
            <th style="background-color: #007bff; color: white;">
                № п/п
                <button type="button" class="toggleInput">
                    <svg viewBox="0 0 24 24" width=16>
                        <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                    </svg>
                </button>
                <div class="inputContainer">
                    <input type="text" class="form-control" id="number">
                </div>
            </th>
            <th style="background-color: #007bff; color: white;">
                № цеха
                <button type="button" class="toggleInput">
                    <svg viewBox="0 0 24 24" width=16>
                        <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                    </svg>
                </button>
                <div class="inputContainer">
                    <input type="text" class="form-control" id="workshop">
                </div>
            </th>
            <th style="background-color: #007bff; color: white;">
                Мероприятие
                <button type="button" class="toggleInput">
                    <svg viewBox="0 0 24 24" width=16>
                        <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                    </svg>
                </button>
                <div class="inputContainer">
                    <input type="text" class="form-control" id="events">
                </div>
            </th>
            <th style="background-color: #007bff; color: white;">
                Сопутствующие действия
                <button type="button" class="toggleInput">
                    <svg viewBox="0 0 24 24" width=16>
                        <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                    </svg>
                </button>
                <div class="inputContainer">
                    <input type="text" class="form-control" id="actions">
                </div>
            </th>
            <th style="background-color: #007bff; color: white;">
                Ответственный отдел
                <button type="button" class="toggleInput">
                    <svg viewBox="0 0 24 24" width=16>
                        <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                    </svg>
                </button>
                <div class="inputContainer">
                    <input type="text" class="form-control" id="department">
                </div>
            </th>
            <th style="background-color: #007bff; color: white;">
                Ответственное лицо
                <button type="button" class="toggleInput">
                    <svg viewBox="0 0 24 24" width=16>
                        <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                    </svg>
                </button>
                <div class="inputContainer">
                    <input type="text" class="form-control" id="emploes">
                </div>
            </th>
            <th style="background-color: #007bff; color: white;">
                Желаемый срок
                <button type="button" class="toggleInput">
                    <svg viewBox="0 0 24 24" width=16>
                        <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                    </svg>
                </button>
                <div class="inputContainer">
                    <input type="text" class="form-control" id="desiredDate">
                </div>
            </th>
            <th style="background-color: #007bff; color: white;">
                Примечание
                <button type="button" class="toggleInput">
                    <svg viewBox="0 0 24 24" width=16>
                        <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                    </svg>
                </button>
                <div class="inputContainer">
                    <input type="text" class="form-control" id="note">
                </div>
            </th>
            <th style="background-color: #007bff; color: white;">
                Планируемый срок
                <button type="button" class="toggleInput">
                    <svg viewBox="0 0 24 24" width=16>
                        <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                    </svg>
                </button>
                <div class="inputContainer">
                    <input type="text" class="form-control" id="planDate">
                </div>
            </th>
            <th style="background-color: #007bff; color: white;">
                Комментарий
                <button type="button" class="toggleInput">
                    <svg viewBox="0 0 24 24" width=16>
                        <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                    </svg>
                </button>
                <div class="inputContainer">
                    <input type="text" class="form-control" id="comment">
                </div>
            </th>
            <th style="background-color: #007bff; color: white;">
            </th>
            <th style="background-color: #007bff; color: white;">
                <div style="position: relative; top: -4px;">
                    Факт выполнения
                </div>
            </th>
            <#if user.getRole() == 'ADMIN' || user.getRole() == 'CONTROL'>
                <th style="background-color: #007bff; color: white; display: flex; justify-content: space-between; align-items: center; padding: 8px;">
                    <div style="margin-right: 10px; margin-top: 5px;">Завершено</div>
                    <button type="button" id="statusBtn" class="btn btn-outline-secondary" data-state="" title="Статус">
                        <i class="bi bi-check-circle-fill" style="color: gray;"></i>
                    </button>
                </th>
            </#if>
        </tr>
        </thead>
        <tbody>
        <#list sgiList as sgi>
            <#assign reqIndex = sgi_index>
            <#assign rowClass = "">
            <#if sgi.color == "RED">
                <#assign rowClass = "table-danger">
            <#elseif sgi.color == "GREEN">
                <#assign rowClass = "table-success">
            <#elseif sgi.color == "YELLOW">
                <#assign rowClass = "table-warning">
            <#elseif sgi.color == "GREY">
                <#assign rowClass = "table-secondary">
            </#if>
            <tr id="${sgi.id}" class="${rowClass} sgiNumber" data-number="${sgi.requestNumber}" data-id="${sgi.id}">
                <td data-label="№ мероприятия">${sgi.requestNumber}</td>
                <td data-label="№ цеха" name="workshop">${sgi.workShop}</td>
                <td data-label="Мероприятие" name="event">${sgi.event}</td>
                <td data-label="Действия" name="actions">${sgi.actions}</td>
                <td data-label="Отдел" name="department">${sgi.department.getName()}</td>
                <td data-label="Ответственный" name="emploes">${(sgi.employee.getName())!""}</td>
                <td data-label="Желаемый срок" name="desiredDate">${updateDesiredDate[reqIndex]}</td>
                <td data-label="Примечание" name="note">${sgi.note!""}</td>
                <td data-label="Плановый срок" name="planDate">
                    <#if updatePlanDate[reqIndex]??>${updatePlanDate[reqIndex]}<#else></#if>
                </td>
                <td data-label="Комментарий" name="comment">${sgi.comment!''}</td>
                <td data-label="Указать плановый срок" style="gap: 8px;">
                    <button type="button" class="btn btn-info btn-sm"
                            onclick="change('${sgi.id}')">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                </td>
                <td data-label="Факт выполнения">
                    <button type="button" class="btn btn-info btn-sm" onclick="openFactExecutionModal('${sgi.id}')">
                        ✔
                    </button>
                </td>
                <#if user.getRole() == 'ADMIN' || user.getRole() == 'CONTROL'>
                    <td data-label="Статус мероприятия" class="text-center" name="agreed">
                        <button type="button"
                                class="btn btn-link p-0 toggle-agree"
                                data-sgi-id="${sgi.id}"
                                data-agreed="${sgi.agreed?string('true','false')}"
                                onclick="toggleAgreement('${sgi.id}', this)">
                            <i class="bi ${sgi.agreed?then('bi-check-circle-fill text-success', 'bi-circle')}"></i>
                        </button>
                    </td>
                </#if>
            </tr>
        </#list>
        </tbody>
    </table>

    <div class="sticky-footer">
        <div id="pagination" class="pagination-modern"></div>
        <div class="button-group">
            <!-- Десктопные кнопки -->
            <button type="button"
                    class="btn btn-primary btn-action d-none d-md-flex"
                    data-bs-toggle="modal"
                    data-bs-target="#createModal">
                <i class="bi bi-plus-circle"></i>
                <span class="btn-text">Добавить</span>
            </button>

            <button type="button"
                    class="btn btn-outline-primary btn-action d-none d-md-flex"
                    name="clearButton">
                <i class="bi bi-arrow-counterclockwise"></i>
                <span class="btn-text">Фильтры</span>
            </button>

            <button class="btn btn-outline-secondary btn-action d-none d-md-flex"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasWithBothOptions">
                <i class="bi bi-list"></i>
                <span class="btn-text">Меню</span>
            </button>

            <div class="additional-btn-container">
                <button type="button" class="additional-btn">
                    <i class="bi bi-three-dots-vertical"></i>
                    <span class="btn-text">Печать отчета</span>
                </button>

                <!-- Выпадающее меню с 4 строками -->
                <div class="additional-menu">
                    <div class="additional-menu-item" data-department="ОГМ">
                        <i class="bi bi-printer"></i> ОГМ
                    </div>
                    <div class="additional-menu-item"  data-department="ОРС">
                        <i class="bi bi-printer"></i> ОРС
                    </div>
                    <div class="additional-menu-item"  data-department="ОТиПК">
                        <i class="bi bi-printer"></i> ОТиПК
                    </div>
                    <div class="additional-menu-item"  data-department="ОГЭ">
                        <i class="bi bi-printer"></i> ОГЭ
                    </div>
                </div>
            </div>

            <!-- Мобильные кнопки -->
            <div class="mobile-actions d-flex d-md-none gap-2">
                <button type="button"
                        class="btn btn-primary btn-action"
                        data-bs-toggle="modal"
                        data-bs-target="#createModal">
                    <i class="bi bi-plus"></i>
                </button>

                <button type="button"
                        class="btn btn-primary btn-action"
                        id="mobileFilterBtn"
                        data-bs-toggle="modal"
                        data-bs-target="#mobileFilterModal">
                    <i class="bi bi-funnel"></i>
                </button>

                <button class="btn btn-outline-secondary btn-action"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasWithBothOptions">
                    <i class="bi bi-list"></i>
                </button>
            </div>
        </div>
    </div>

    <div class="modal" id="planModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-xxl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Редактирование</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"
                            onclick="reload()"></button>
                </div>
                <div class="modal-body p-0">
                    <div class="container-fluid">
                        <div id="planContainer" class="dynamic-grid">
                            <!-- Данные будут здесь -->
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="saveChangesBtn btn btn-primary">Сохранить</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="factModal" tabindex="-1" aria-labelledby="factModalLable" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="factModalLable">Факт выполнения задания</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" onclick="reload();"
                            aria-label="Закрыть"></button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row align-items-start" id="factHeadContainer">
                            <!-- Заголовки -->
                        </div>
                        <div class="row align-items-center" id="factDataContainer">
                            <!-- Данные -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary"><i class="bi bi-save"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2"
         tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalToggleLabel2">Отметка</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                </div>
                <div class="modal-body">
                    <form id="addSubTaskId" action="/sgi/create/execution" method="post"
                          enctype="multipart/form-data">
                        <div class="mb-3">
                            <label for="executionDate" class="form-label">Дата выполнения</label>
                            <input type="date" class="form-control" id="executionDate" name="executionDate">
                        </div>
                        <div class="mb-3">
                            <label for="report" class="form-label">Комментарий</label>
                            <input type="text" class="form-control" id="report" name="report">
                        </div>
                        <div class="mb-3">
                            <label for="images" class="form-label">Фото</label>
                            <input type="file" class="form-control" id="images" name="images" accept="image/*"
                                   multiple>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-primary"><i class="bi bi-save"></i></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="photoModal" aria-hidden="true" aria-labelledby="photoModalLabel" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="photoModalLabel">Прикрепленные фото</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                </div>
                <div class="modal-body" id="photoContainer">
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content ">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="createModalLabel">Добавление задания</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                </div>
                <div class="modal-body">
                    <form id="addTaskForm" action="/sgi/create" method="POST" enctype="multipart/form-data">
                        <div class="mb-3">
                            <label for="shop" class="form-label">Цех</label>
                            <input type="text" class="form-control" id="shopId" name="workshopModal"
                                   required>
                        </div>
                        <div class="mb-3">
                            <label for="event" class="form-label">Мероприятие</label>
                            <input type="text" class="form-control" id="eventId" name="eventModal" required>
                        </div>
                        <div class="mb-3">
                            <label for="actions" class="form-label">Сопутствующие действия</label>
                            <input type="text" class="form-control" id="actionsId" name="actionsModal">
                        </div>
                        <div class="mb-3">
                            <label for="department" class="form-label">Ответственный отдел</label>
                            <select class="form-control" id="departmentId" name="departmentModal" required>
                                <option value="">Выберите отдел</option>
                                <option value="mechanic">ОГМ</option>
                                <option value="builder">ОРС</option>
                                <option value="protection">ОТиПК</option>
                                <option value="energy">ОГЭ</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="responsiblePerson" class="form-label">Ответственное лицо</label>
                            <select class="form-select" id="employeeSelect1" aria-label="Выбор сотрудника" required
                                    onfocus="loadEmployeeFields(1)" name="employeesModal">
                                <option value="">Выберите сотрудника</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="desiredDate" class="form-label">Желаемый срок</label>
                            <input type="date" class="form-control" id="desiredDateId" name="desiredDateModal"
                                   required>
                        </div>
                        <div class="mb-3">
                            <label for="note" class="form-label">Примечание</label>
                            <input type="text" class="form-control" id="noteId" name="noteModal">
                        </div>
                        <div class="mb-3">
                            <label for="additionalFiles" class="form-label">Загрузить фотографии</label>
                            <input type="file" id="additionalFiles" name="additionalFiles" accept="image/*" multiple
                                   class="form-control">
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-primary">Сохранить изменения</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Модальное окно фильтров -->
    <div class="modal fade" id="mobileFilterModal" tabindex="-1" aria-labelledby="mobileFilterModalLabel"
         aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-fullscreen d-md-none">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="mobileFilterModalLabel">Фильтры</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                </div>
                <div class="modal-body">
                    <form id="mobileFilterForm">
                        <!-- № п/п -->
                        <div class="mb-3">
                            <label for="filterNumber" class="form-label">№ п/п</label>
                            <input type="number" class="form-control" id="filterNumber">
                        </div>

                        <!-- Цех -->
                        <div class="mb-3">
                            <label for="filterWorkshop" class="form-label">Цех</label>
                            <input type="text" class="form-control" id="filterWorkshop">
                        </div>

                        <!-- Ответственный отдел -->
                        <div class="mb-3">
                            <label for="filterDepartment" class="form-label">Ответственный отдел</label>
                            <select class="form-select" id="filterDepartment">
                                <option value="">Выберите отдел</option>
                                <option value="ОГМ">ОГМ</option>
                                <option value="ОРС">ОРС</option>
                                <option value="ОТиПК">ОТиПК</option>
                                <option value="ОГЭ">ОГЭ</option>
                            </select>
                        </div>

                        <!-- Ответственное лицо -->
                        <div class="mb-3">
                            <label for="filterEmployee" class="form-label">Ответственное лицо</label>
                            <select class="form-select" id="employeeSelect2" aria-label="Выбор сотрудника"
                                    onfocus="loadEmployeeFields(2)" name="employeesModal">
                                <option value="">Выберите сотрудника</option>
                            </select>
                        </div>

                        <!-- Желаемый срок -->
                        <div class="mb-3">
                            <label for="filterDesiredDate" class="form-label">Желаемый срок</label>
                            <input type="date" class="form-control" id="filterDesiredDate">
                        </div>

                        <!-- Планируемый срок -->
                        <div class="mb-3">
                            <label for="filterPlanDate" class="form-label">Планируемый срок</label>
                            <input type="date" class="form-control" id="filterPlanDate">
                        </div>

                        <!-- Завершено -->
                        <div class="mb-3">
                            <label for="filterStatusModal" class="form-label">Статус задания</label>
                            <select class="form-select" id="filterStatusModal">
                                <option value="">Все</option>
                                <option value="true">Завершено</option>
                                <option value="false">Не завершено</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" name="clearButton">Сбросить</button>
                    <button type="button" class="btn btn-primary" onclick="applyFilters()">Применить</button>
                </div>
            </div>
        </div>
    </div>

</div>

<div id="customContextMenu"
     style="display:none; position:absolute; z-index:1000; background:white; border:1px solid #ccc; padding:5px; border-radius:4px;">
    <button id="deleteRowBtn" class="btn btn-danger btn-sm">Удалить</button>
    <button id="printRowBtn" class="btn btn-info btn-sm">Печать</button>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
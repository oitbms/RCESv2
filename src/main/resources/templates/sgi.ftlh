<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
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
    <table id="sgiTable" class="table table-hover">
            <thead>
            <tr>
                <th style="background-color: #007bff; color: white;">
                    № п/п
                    <button type="button" class="toggleInput">
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
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
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
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
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
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
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
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
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
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
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
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
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
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
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
                            <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                        </svg>
                    </button>
                    <div class="inputContainer">
                        <input type="text" class="form-control">
                    </div>
                </th>
                <th style="background-color: #007bff; color: white;">
                    Планируемый срок
                    <button type="button" class="toggleInput">
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
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
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
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
                    Факт выполнения
                </th>
                <th style="background-color: #007bff; color: white;">
                    Завершено
                    <button type="button" class="toggleInput">
                        <svg onclick="filter()" viewBox="0 0 24 24" width=16>
                            <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>
                        </svg>
                    </button>
                    <div class="inputContainer">
                        <select class="form-control" id="agreed">
                            <option value="">Все</option>
                            <option value="выполнено">Выполнено</option>
                            <option value="не выполнено">Не выполнено</option>
                        </select>
                    </div>
                </th>
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
                <tr id="${sgi.id}" class="${rowClass}">
                    <td>${sgi.requestNumber}</td>
                    <td name="workShop">${sgi.workShop}</td>
                    <td name="event">${sgi.event}</td>
                    <td name="actions">${sgi.actions}</td>
                    <td name="department">${sgi.department.getName()}</td>
                    <td name="employee">${(sgi.employee.getName())!""}</td>
                    <td name="desiredDate">${updateDesiredDate[reqIndex]}</td>
                    <td name="node">${sgi.note!""}</td>
                    <td name="planDate">
                        <#if updatePlanDate[reqIndex]??>${updatePlanDate[reqIndex]}<#else></#if>
                    </td>
                    <td name="comment">${sgi.comment!''}</td>
                    <td style="gap: 8px;">
                        <button type="button" class="btn btn-info btn-sm"
                                onclick="change('${sgi.id}','<#if updatePlanDate[reqIndex]??>${updatePlanDate[reqIndex]}<#else></#if>','${sgi.comment!""}')">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-info btn-sm" onclick="openFactExecutionModal('${sgi.id}')">
                            ✔
                        </button>
                    </td>
                    <td class="text-center" name="agreed">
                        <button type="button"
                                class="btn btn-link p-0 toggle-agree"
                                data-sgi-id="${sgi.id}"
                                data-agreed="${sgi.agreed?string('true','false')}"
                                onclick="toggleAgreement('${sgi.id}', this)">
                            <i class="bi ${sgi.agreed?then('bi-check-circle-fill text-success', 'bi-circle')}"></i>
                        </button>
                    </td>
                </tr>
            </#list>
            </tbody>
        </table>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModal">Добавить
            новое задание
        </button>
        <div id="pagination" class="pagination mt-4"></div>

        <div class="modal fade" id="planModal" tabindex="-1" aria-labelledby="planModalLable" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header" style="margin-bottom: 0">
                        <h1 class="modal-title fs-5" id="planModalLable">Редактирование</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" onclick="reload();"
                                aria-label="Закрыть"></button>
                    </div>
                    <div class="modal-body">
                        <table class="table">
                            <thead>
                            <tr>
                                <th>Ответственный</th>
                                <th>Плановая дата</th>
                                <th>Комментарий</th>
                            </tr>
                            </thead>
                            <tbody>
                            <div class="modal-footer">
                            </div>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="factModal" tabindex="-1" aria-labelledby="factModalLable" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header" style="margin-bottom: 0">
                        <h1 class="modal-title fs-5" id="factModalLable">Факт выполнения задания</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" onclick="reload();"
                                aria-label="Закрыть"></button>
                    </div>
                    <div class="modal-body">
                        <table class="table">
                            <thead>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
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
                        <form id="addTaskForm" action="/sgi/create" method="POST">
                            <div class="mb-3">
                                <label for="shop" class="form-label">Цех</label>
                                <input type="text" class="form-control" id="shop" name="workshop" data-required="true">
                            </div>
                            <div class="mb-3">
                                <label for="event" class="form-label">Мероприятие</label>
                                <input type="text" class="form-control" id="event" name="event" data-required="true">
                            </div>
                            <div class="mb-3">
                                <label for="actions" class="form-label">Сопутствующие действия</label>
                                <input type="text" class="form-control" id="actions" name="actions"
                                       data-required="true">
                            </div>
                            <div class="mb-3">
                                <label for="department" class="form-label">Ответственный отдел</label>
                                <select class="form-control" id="department" name="department" data-required="true">
                                    <option value="">Выберите отдел</option>
                                    <option value="mechanic">ОГМ</option>
                                    <option value="builder">ОРС</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="responsiblePerson" class="form-label">Ответственное лицо</label>
                                <input
                                        type="text"
                                        id="employees"
                                        name="employees"
                                        list="employeesList"
                                        placeholder="Введите фамилию..."
                                        class="form-control"
                                        required
                                >
                                <datalist id="employeesList">
                                    <#list employeesList as emploees>
                                        <option value="${emploees.name}"></option>
                                    </#list>
                                </datalist>
                            </div>
                            <div class="mb-3">
                                <label for="desiredDate" class="form-label">Желаемый срок</label>
                                <input type="date" class="form-control" id="desiredDate" name="desiredDate"
                                       data-required="true">
                            </div>
                            <div class="mb-3">
                                <label for="note" class="form-label">Примечание</label>
                                <input type="text" class="form-control" id="note" name="note">
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                                <button type="submit" class="btn btn-primary">Сохранить изменения</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
</div>

<div id="customContextMenu"
     style="display:none; position:absolute; z-index:1000; background:white; border:1px solid #ccc; padding:5px; border-radius:4px;">
    <button id="deleteRowBtn" class="btn btn-danger btn-sm">Удалить</button>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
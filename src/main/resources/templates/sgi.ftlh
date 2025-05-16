<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>План СГИ</title>
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/sgi.css">
    <link href="//cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css" rel="stylesheet" />
    <script src="//cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js"></script>
</head>
<body>
<div>
    <table class="table table-hover">
        <thead>
        <tr>
            <th>№ п/п</th>
            <th>№ цеха</th>
            <th>Мероприятие</th>
            <th>Сопутствующие действия</th>
            <th>Ответственный отдел</th>
            <th>Ответственное лицо</th>
            <th>Желаемый срок</th>
            <th>Планируемый срок</th>
            <th>Факт выполнения</th>
            <th>Примечание</th>
        </tr>
        </thead>
        <tbody>
        <#list sgiList as sgi>
            <tr>
                <td>${sgi.requestNumber}</td>
                <td name="workShop">${sgi.workShop}</td>
                <td name="event">${sgi.event}</td>
                <td name="actions">${sgi.actions}</td>
                <td name="department">${sgi.department.name()}</td>
                <td name="employee">${(sgi.employee.getName())!""}</td>
                <td name="desiredDate">${(sgi.desiredDate)}</td>
                <td name="planDate">${(sgi.planDate)}</td>
                <td>
                    <button type="button" name="square"
                            data-endpoint="executions"
                            data-input-id="executionsName"
                            data-hidden-entity="executionsJson"
                            data-modal-id="executionsModal"
                            data-param="${sgi.id}"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="4" y="4" width="16" height="16" stroke="black" stroke-width="2" fill="none"/>
                        </svg>
                    </button>
                </td>
                <td>${sgi.comment!''}</td>
            </tr>
        </#list>
        </tbody>
    </table>

    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModal">Добавить новое задание</button>

    <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
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
                            <input type="text" class="form-control" id="actions" name="actions" data-required="true">
                        </div>
                        <div class="mb-3">
                            <label for="department" class="form-label">Ответственный отдел</label>
                            <select class="form-control" id="department" name="department" data-required="true">
                                <option value="">Выберите отдел</option>
                                <option value="constructor">constructor</option>
                                <option value="otk">otk</option>
                                <option value="technologist">technologist</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="responsiblePerson" class="form-label">Ответственное лицо</label>
                            <input
                                    type="text"
                                    id="emploees"
                                    name="emploees"
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
                            <input type="datetime-local" class="form-control" id="desiredDate" name="desiredDate" data-required="true">
                        </div>
                        <div class="mb-3">
                            <label for="planDate" class="form-label">Планируемый срок</label>
                            <input type="datetime-local" class="form-control" id="planDate" name="planDate" data-required="true">
                        </div>
                        <div class="mb-3">
                            <label for="comment" class="form-label">Примечания</label>
                            <input type="text" class="form-control" id="comment" name="comment">
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
    <div id="executionsModal" class="modal">
        <div class="modal-content">
            <button class="x" onclick="closeModal('executionsModal')">✕</button>
            <ul id="executionsList" class="modal-list"></ul>
        </div>
    </div>
</div>

<!-- Уведомления -->
<div id="notification-container"></div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="/script.js" defer></script>
</body>
</html>
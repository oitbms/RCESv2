<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>План СГИ</title>
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/stylesMain.css">
</head>
<body>
<div class="container d-flex justify-content-center">
    <table class="table table-hover">
        <thead>
        <tr>
            <th>№ п/п</th>
            <th>
                № цеха
            </th>
            <th>
                Мероприятие
            </th>
            <th>
                Сопутствующие действия
            </th>
            <th>
                Ответственный отдел
            </th>
            <th>
                Ответственное лицо
            </th>
            <th>
                Желаемый срок
            </th>
            <th>
                Планируемый срок
            </th>
            <th>
                Факт выполнения
            </th>
            <th>
                Примечание
            </th>
        </tr>
        </thead>
        <tbody>
        <#list sgiList as sgi>
            <tr>
                <td>${sgi.number}</td>
                <td>${sgi.workShop}</td>
                <td>${sgi.event}</td>
                <td>${sgi.actions}</td>
                <td>${sgi.department.name()}</td>
                <td>${(sgi.employee.getName())!''}</td>
                <td>${(sgi.desiredDate)!''}</td>
                <td>${(sgi.planDate)!''}</td>
                <td>
                    <button>НАЖМИ</button>
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
                    <form id="addTaskForm" action="/sgi/createSGI" method="POST">
                        <div class="mb-3">
                            <label for="shop" class="form-label">Цех</label>
                            <input type="text" class="form-control" id="shop" name="workshop" required>
                        </div>
                        <div class="mb-3">
                            <label for="event" class="form-label">Мероприятие</label>
                            <input type="text" class="form-control" id="event" name="event" required>
                        </div>
                        <div class="mb-3">
                            <label for="actions" class="form-label">Сопутствующие действия</label>
                            <input type="text" class="form-control" id="actions" name="actions" required>
                        </div>
                        <div class="mb-3">
                            <label for="department" class="form-label">Ответственный отдел</label>
                            <select class="form-control" id="department" name="department" required>
                                <option value="">Выберите отдел</option>
                                <option value="constructor">constructor</option>
                                <option value="otk">otk</option>
                                <option value="technologist">technologist</option>
                            </select>
                        </div>
<#--                        <div class="mb-3">-->
<#--                            <label for="responsiblePerson" class="form-label">Ответственное лицо</label>-->
<#--                            <input type="text" class="form-control" id="responsiblePerson" name="responsiblePerson" required>-->
<#--                        </div>-->
                        <div class="mb-3">
                            <label for="desiredDate" class="form-label">Желаемый срок</label>
                            <input type="datetime-local" class="form-control" id="desiredDate" name="desiredDate">
                        </div>
                        <div class="mb-3">
                            <label for="planDate" class="form-label">Планируемый срок</label>
                            <input type="datetime-local" class="form-control" id="planDate" name="planDate">
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
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
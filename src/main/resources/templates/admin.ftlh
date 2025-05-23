<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <title>Страница администрирования</title>
</head>
<body>
<h1 class="text-center">Список пользователей</h1>

<div class="container">
    <table class="table table-bordered" id="requestTable">
        <thead>
        <tr>
            <th>Сотрудник</th>
            <th>Состояние</th>
            <th>Должность</th>
            <th>ChatID</th>
        </tr>
        </thead>
        <tbody>
        <#list users as req>
            <tr id="req-${req.id}">
                <td>${req.username}</td>
                <#if req.enabled>
                    <td>Активный</td>
                    <#else >
                    <td>Не активный</td>
                </#if>
                <td>${req.getRole()!""}</td>
                <td>${req.getChatId()!""}</td>
            </tr>
        </#list>
        </tbody>
    </table>
    <div class="text-center mt-3">
        <a class="btn btn-primary" href="/registration">Добавить нового пользователя</a>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
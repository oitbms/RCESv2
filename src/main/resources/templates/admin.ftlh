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
            <th>Создал</th>
        </tr>
        </thead>
        <tbody>
        <#list users as req>
            <tr id="req-${req.id}">

                <td>${req.username}</td>
                <td>${req.enabled?c}</td>
                <td>${req.getRole()!""}</td>
                <td>${(req.username)!" "}</td>
                <td><button onclick="deleteReq('${req.id}')">Удалить</button></td>
            </tr>
        </#list>
        </tbody>
    </table>
    <div class="text-center mt-3">
        <a href="/registration">Add new user</a>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const reqs = document.querySelectorAll('tr[id^="req-"]');
        reqs.forEach(req => {
            req.addEventListener('contextmenu', function (e) {
                e.preventDefault();
                const reqId = this.id.replace('req-', '');
                const confirmation = confirm("Вы действительно хотите удалить этого пользователя?");
                if (confirmation) {
                    deleteReq(reqId);
                }
            });
        });
    });

    function deleteReq(reqId) {
        console.log('Attempting to delete user with ID:', reqId);
        fetch(`/delete/` + reqId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (response.ok) {
                    document.getElementById(`req-`+reqId).remove();
                } else if (response.status === 404) {
                    alert("Пользователь не найден.");
                } else {
                    alert("Удалить данного пользователя не удалось.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Ошибка удаления пользователя!");
            });
    }
</script>
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
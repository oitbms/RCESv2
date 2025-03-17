<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Заявки на вызов технолога</title>
</head>
<body>
<#list statuses as status>
    <h2>${status.getName()}</h2>
    <table border="1">
        <thead>
        <tr>
            <th>Номер заявки</th>
            <th>Дата создания</th>
            <th>Заказ клиента</th>
            <th>Статус</th>
            <th>ФИО ответственного</th>
        </tr>
        </thead>
        <tbody>
        <#list technologistList as technologist>
            <#if technologist.status == status>
                <tr>
                    <td>${technologist.requestNumber}</td>
                    <td>${technologist.createDate}</td>
                    <td>${technologist.customerOrder.name}</td>
                    <td>${technologist.status.getName()}</td>
                    <td>${technologist.employee.name}</td>
                </tr>
            </#if>
        </#list>
        </tbody>
    </table>
</#list>

<!-- Кнопка для создания заявки -->
<div>
    <button onclick="location.href='/technologistbid/create'">Создать заявку на вызов технолога</button>
</div>
</body>
</html>
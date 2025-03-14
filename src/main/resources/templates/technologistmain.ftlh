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
<h1>Список заявок</h1>
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
    <#list technologistList as list>
        <tr>
            <td>${list.requestNumber}</td>
            <td>${list.createDate}</td>
            <td>${list.customerOrder.name}</td>
            <td>${list.status}</td>
            <td>${list.employee.name}</td>
        </tr>
    </#list>
    </tbody>
</table>
<a href="/technologistbid">Создать заявку на вызов технолога</a>
</body>
</html>
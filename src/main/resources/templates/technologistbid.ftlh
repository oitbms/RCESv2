<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>TechnologistBid</title>
</head>
<body>
<!--Форма создания заявки на вызов технолога из цеха-->
<a href="/technologistmain">&larr; К списку заявок</a>
<h1>Новая заявка на вызов технолога</h1>
<form method="post" action="/technologistbid/create">
    <label>
        Сотрудник:<br>
        <input type="text" name="employee" value="${payload.employee!}">
    </label>

    <!-- Ещё фото -->

    <label>
        Причина:<br>
        <input type="text" name="reason" value="${payload.reason!}">
    </label>

    <label>
        Заказ клиента:<br>
        <input type="text" name="customerOrder" value="${payload.customerOrder!}">
    </label>

    <button type="submit">Создать заявку</button>
</form>
</body>
</html>
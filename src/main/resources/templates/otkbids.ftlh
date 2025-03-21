<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Заявки на вызов ОТК</title>
</head>
<body>
Начальная страница
<hr>
<a href="/newotkbid.ftlh">Создать новую заявку</a>
<hr>
<!--Главное меню отк с отображением всех заявок-->
<#list OtkBids as OtkBid>
    <div>
        <p>${OtkBid.numorder} ${OtkBid.naimdetail}!'' ${OtkBid.workshop} ${OtkBid.qaworker} </p>
    </div>
</#list>
<hr>
</body>
</html>
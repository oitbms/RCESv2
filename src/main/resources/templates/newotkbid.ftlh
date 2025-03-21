<#--<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <title>OtkBid</title>
</head>
<body>
Форма создания заявки на вызов отк из цеха
<header>
    <h1 class="text-center">Вызов ОТК</h1>-->
<#--</header>-->

<#--<div class="conteiner">-->
<#--    <div class="row">-->
<#--        <h3>№ заказа</h3>-->
<#--    </div>-->

<#--    <div class="col align-self-center">-->
<#--        <textarea id="NZak" type= "text" class="form-control" placeholder="Введите номер заказа"></textarea>-->
<#--    </div>-->

<#--    <div class="row">-->
<#--        <h3>Деталь / СБ</h3>-->
<#--    </div>-->
<#--    <div class="col align-self-center">-->
<#--        <textarea id="Usel" type= "text" class="form-control" placeholder="Введите название детали или СБ, контроль которой надо выполнить"></textarea>-->
<#--    </div>-->

<#--    <div class="row">-->
<#--        <h3>Цель вызова</h3>-->
<#--    </div>-->
<#--    <div class="col align-self-center">-->
<#--        <textarea id="Goal" type= "text" class="form-control" placeholder="Введите вид работ, для которых вызывается сотрудник ОТК"></textarea>-->
<#--    </div>-->
<#--</div>-->

<#--<div class="d-grid gap-2">-->
<#--    <button id="btn" class="btn btn-primary btn-lg" type="button" >Вызвать</button>-->
<#--</div>-->

<#--<script>-->
<#--    const arr = {-->
<#--        '1' : 'Цех №1',-->
<#--        '3' : 'Цех №3',-->
<#--        '4' : 'Цех №4',-->
<#--        '5' : 'Цех №5',-->
<#--        '6' : 'Цех №6',-->
<#--        '7' : 'Цех №7',-->
<#--        '8' : 'Цех №8',}-->

<#--    const arr_ = {-->
<#--        '1' : 'Участок №1',-->
<#--        '2' : 'Участок №2',-->
<#--        '3' : 'Участок №3',-->
<#--        '4' : 'Участок №4',}-->

<#--    var options={}-->

<#--    function getRandomInt(max) {-->
<#--        return Math.floor(Math.random() * max)}-->

<#--    document.getElementById('btn').onclick = function () {-->
<#--        const TOKEN = "7852582110:AAGxCJFO2W51nEodYJh1hHzwIe4dBiQtKQs";-->
<#--        const CHAT_ID = "-1002441134492";-->
<#--        const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;-->
<#--        const url_a = document.location.href-->
<#--        const url_b = document.location.href-->
<#--        const url = new URL(url_a)-->
<#--        const url1 = new URL(url_b)-->
<#--        const a = url.searchParams.get("a")-->
<#--        const b = url.searchParams.get("b")-->
<#--        var ceh = arr[a]-->
<#--        var uch = arr_[b]-->
<#--        var number = getRandomInt(1000);-->
<#--        var now = new Date().toLocaleString("ru", options);;-->
<#--        var NZak = document.getElementById("NZak").value;-->
<#--        var SBorDet = document.getElementById("Usel").value;-->
<#--        var Goal = document.getElementById("Goal").value;-->
<#--        let message = "<b>Вызов №:</b> " + number +  "  <b>от:</b>  " + now + "\n";-->
<#--        message += "<b>Цель вызова:</b>\n" + Goal + "\n";-->
<#--        message += "<b>Деталь/СБ:</b>\n" + NZak + " " + SBorDet + "\n";-->
<#--        message += "<b>Место вызова:</b>\n" + ceh + " " + uch +"\n";-->
<#--        console.log(message);-->
<#--        window.axios.post(URI_API, {-->
<#--            chat_id: CHAT_ID,-->
<#--            parse_mode: `html`,-->
<#--            text: message})-->
<#--        alert("Сообщение отправлено");-->
<#--        location.reload();-->
<#--    }-->
<#--</script>-->
<#--<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

</body>
</html>-->

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Новая заявка ОТК</title>
</head>
<body>
Вторая пробная страница
<hr>
<a href="/newotkbid.ftlh">Создать новую заявку</a>
<hr>
<!--Создание новой заявки-->
<#list OtkBids as OtkBid>
    <div>
        <p>${OtkBid.numorder} ${OtkBid.naimdetail}!'' ${OtkBid.workshop} ${OtkBid.qaworker} </p>
    </div>
</#list>
<hr>
</body>
</html>
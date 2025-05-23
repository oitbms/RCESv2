<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Меню пользователя</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <style>
        body {
            background-color: #f8f9fa; /* светлый фон для всего документа */
        }
        .card {
            border-radius: 1rem; /* закругление углов */
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2); /* тень для карточки */
        }
        .nav-link {
            font-weight: bold; /* выделение ссылок на навигацию */
        }
        .taq{
            white-space: nowrap;
        }
    </style>
</head>
<body>
<div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Функции</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
        <div class="list-group" style="width: 200px;">
            <a href="http://localhost:2520/menu" class="list-group-item list-group-item-action btn btn-primary mb-2">Меню</a>
            <#if user.getRole() == 'ADMIN' || user.getRole() == 'CONTROL' || user.getRole() == 'EVENT'>
                <a href="http://localhost:2520/sgi" class="list-group-item list-group-item-action btn btn-primary">СГИ</a>
            </#if>
            <#if user.getRole() != 'CONTROL' && user.getRole() != 'EVENT'>
                <div class="dropdown mt-3">
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        Формы заявок
                    </button>
                    <ul class="dropdown-menu">
                        <#if user.getRole() == 'ADMIN' || user.getRole() == 'MASTER'>
                            <li><a class="dropdown-item" href="requestslist/technologist">Заявки для ОГТ </a></li>
                            <li><a class="dropdown-item" href="requestslist/constructor">Заявки для ОГК</a></li>
                            <li><a class="dropdown-item" href="requestslist/otk">Заявки для ОТК</a></li>
                        <#elseif user.getRole() == 'TECHNOLOGIST'>
                            <li><a class="dropdown-item" href="requestslist/technologist">Заявки для ОГТ </a></li>
                        <#elseif user.getRole() == 'CONSTRUCTOR'>
                            <li><a class="dropdown-item" href="requestslist/constructor">Заявки для ОГК</a></li>
                        <#elseif user.getRole() == 'OTK'>
                            <li><a class="dropdown-item" href="requestslist/otk">Заявки для ОТК</a></li>
                        </#if>
                    </ul>
                </div>
            </#if>
        </div>
    </div>
</div>
<div class="container mb-4">
    <div class="row">
    <h1 class="text-center mb-4">
        Меню пользователя
        <button class="btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions" style="background: none; border: none;">
            <i class="bi bi-list" style="color: black"></i>
        </button>
    </h1>
    <div class="card">
        <div class="text-center card-body">
            <div class="user-info mb-4">
                <label class="fw-bold">Имя пользователя:</label>
                <span>${user.getName()}</span><br>
<#--                <label class="fw-bold">Рабочее место:</label>-->
<#--                <span>${(user.mlmNode.getName())!""}</span><br>-->
            </div>
        <nav class="mb-4">
            <ul class="nav justify-content-center">
                <li class="nav-item">
                    <a class="nav-link" href="/">Главная</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/logout">Выйти</a>
                </li>
                <#if user.getRole() == 'ADMIN'>
                    <li class="nav-item">
                        <a class="nav-link" href="/sgi">Просмотр заданий</a>
                    </li>
                </#if>
            </ul>
        </nav>
        <#if user.getRole() == 'CONSTRUCTOR' || user.getRole() == 'TECHNOLOGIST' || user.getRole() == 'OTK'>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Принятые мной заявки
            </button>
        </#if>
        <#if user.getRole() == 'ADMIN'>
            <button id="graf" class="btn btn-primary mb-4">Показать график</button>
        </#if>
    </div>
    </div>
    </div>
</div>
    <div class="container mb-4">
        <div class="row">
            <#if user.getRole() == 'ADMIN' || user.getRole() == 'MASTER' || user.getRole() == 'TECHNOLOGIST'>
            <div class="col-md-4">
                <div class="card text-center">
<#--                    <img src="" class="card-img-top">-->
                    <div class="card-body">
                        <h5 class="card-title">Список заявок для ОГТ</h5>
                        <p class="card-text">
                            Количество заявок:${qtuRequestTechnologist}<br>
                            <#if user.getRole() == 'ADMIN'>
<#--                                Среднее время выполнения заявки:${timeTechnologist}<br>-->
                            </#if>
                        </p>
                        <a href="requestslist/technologist" class="btn btn-primary">Просмотр заявок</a>
                    </div>
            </div>
            </div>
            </#if>
            <#if user.getRole() == 'ADMIN' || user.getRole() == 'MASTER' || user.getRole() == 'CONSTRUCTOR'>
            <div class="col-md-4">
                <div class="card text-center">
<#--                    <img src="" class="card-img-top">-->
                    <div class="card-body">
                        <h5 class="card-title">Список заявок для ОГК</h5>
                        <p class="card-text">
                            Количество заявок:${qtuRequests}<br>
                            <#if user.getRole() == 'ADMIN'>
<#--                                Среднее время выполнения заявки:${time}<br>-->
                            </#if>
                        </p>
                        <a href="requestslist/constructor" class="btn btn-primary">Просмотр заявок</a>
                    </div>
                </div>
            </div>
            </#if>
            <#if user.getRole() == 'ADMIN' || user.getRole() == 'MASTER' || user.getRole() == 'OTK'>
            <div class="col-md-4">
                <div class="card text-center">
<#--                    <img src="" class="card-img-top">-->
                    <div class="card-body">
                        <h5 class="card-title">Список заявок для ОТК</h5>
                        <p class="card-text">
                            Количество заявок:${qtuRequestsOtk}<br>
                            <#if user.getRole() == 'ADMIN'>
<#--                            Среднее время выполнения заявки:${timeOtk}<br>-->
                            </#if>
                        </p>
                        <a href="requestslist/otk" class="btn btn-primary">Просмотр заявок</a>
                    </div>
                </div>
            </div>
            </#if>
        </div>
    </div>
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Заявки</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <table class="table table-hover vertical-align: middle">
                    <thead>
                    <tr class="taq">
                        <th>#</th>
                        <th>ЗК</th>
                        <th>Статус</th>
                        <th>Просмотр задания</th>
                    </tr>
                    </thead>
                    <tbody>
                    <#list requests as req>
                        <tr>
                            <td>${req.requestNumber}</td>
                            <td>${req.customerOrder.getName()}</td>
                            <td>${req.status.getName()}</td>
                            <td>
                                <a href="view/${req.requestNumber}">Просмотр</a>
                            </td>
                        </tr>
                    </#list>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<div class="container mt-5" id="chartContainer">
    <h1 class="text-center" id="chartTitle" style="display: none">График заявок</h1>
    <canvas id="myChart" width="400" height="200" style="display: none;"></canvas>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    const dailyCounts = [${dailyCounts?join(",")}];
    const dailyCountConstructor = [${dailyCountsConstructor?join(",")}];
    const dailyCountOtk = [${dailyCountOtk?join(",")}];
    const dailyCountTechnologist = [${dailyCountTechnologist?join(",")}];
    let chartInstance;
    document.getElementById("graf").addEventListener("click", function() {
        const titleElement = document.getElementById('chartTitle');
        const canvasElement = document.getElementById('myChart');

        if (!canvasElement.style.display || canvasElement.style.display === "none") {
            const ctx = canvasElement.getContext('2d');
            chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [...Array(dailyCounts.length).keys()].map(i => i + 1), // От 1 до N
                    datasets: [
                        // {
                        //     label: 'Количество заявок за день',
                        //     backgroundColor: 'rgba(255, 99, 132, 1)',
                        //     borderColor: 'rgba(255, 99, 132, 1)',
                        //     data: dailyCounts,
                        //     fill: true
                        // },
                        {
                            label: 'ОГК',
                            backgroundColor: 'rgba(0, 0, 0, 1)',
                            borderColor: 'rgba(0, 0, 0, 1)',
                            data: dailyCountConstructor,
                            fill: true

                        },
                        {
                            label: 'ОГТ',
                            backgroundColor: 'rgba(0, 0, 255, 1)',
                            borderColor: 'rgba(0, 0, 255, 1)',
                            data: dailyCountTechnologist,
                            fill: true
                        },
                        {
                            label: 'ОТК',
                            backgroundColor: 'rgba(128, 0, 128, 1)',
                            borderColor: 'rgba(128, 0, 128, 1)',
                            data: dailyCountOtk,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                        },
                    },
                },
            });

            canvasElement.style.display = 'block';
            titleElement.style.display = 'block';
            this.textContent = 'Скрыть график';
        } else {
            chartInstance.destroy();
            canvasElement.style.display = 'none';
            titleElement.style.display = 'none';
            this.textContent = 'Показать график';
        }
    });
</script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Меню пользователя</title>
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <style>
        body {
            background-color: #f8f9fa;
        }
        .card {
            border-radius: 1rem;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }
        .taq{
            white-space: nowrap;
        }
        @media (max-width: 768px) {
            .container.mb-4 {
                display: none;
            }
        }
        @media (max-width: 768px) {
            .bottom-margin {
                margin-bottom: 10px;
            }
        }
    </style>
</head>
<body>
<div class="container mb-5">
    <div class="row">
        <h1 class="text-center mb-4">Меню пользователя</h1>
        <div class="card">
            <div class="text-center card-body">
                <div class="user-info mb-4">
                    <label class="fw-bold">Имя пользователя:</label>
                    <span>${user.getName()}</span><br>
                </div>
                <nav class="mb-4">
                    <ul class="nav justify-content-center">
                        <li class="nav-item">
                            <#if user.getRole() == 'ADMIN'>
                                    <a class="btn btn-primary bottom-margin" href="/sgi">СГИ</a>
                                    <a class="btn btn-primary bottom-margin" href="/admin">Пользователи</a>
                                    <a class="btn btn-primary bottom-margin" href="/createBid">Создать заявку</a>
                            <#elseif user.getRole() == 'MASTER'>
                                <a class="btn btn-primary" href="/createBid">Создать заявку</a>
                            </#if>
                            <#if user.getRole() == 'CONTROL' || user.getRole() == 'EVENT'>
                                <a class="btn btn-primary" href="/sgi">СГИ</a>
                            </#if>
                            <a class="btn btn-primary " href="/logout">Выйти</a>
                        </li>
                    </ul>
                </nav>
                <#if user.getRole() == 'CONSTRUCTOR' || user.getRole() == 'TECHNOLOGIST' || user.getRole() == 'OTK'>
                    <button type="button" class="btn btn-primary " data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Принятые мной заявки
                    </button>
                </#if>
                <#if user.getRole() == 'MASTER'>
                    <button type="button" class="btn btn-primary bottom-margin" data-bs-toggle="modal" data-bs-target="#exampleModal1">
                        Созданные заявки для ОГТ
                    </button>
                    <button type="button" class="btn btn-primary bottom-margin" data-bs-toggle="modal" data-bs-target="#exampleModal2">
                        Созданные заявки для ОГК
                    </button>
                    <button type="button" class="btn btn-primary bottom-margin" data-bs-toggle="modal" data-bs-target="#exampleModal3">
                        Созданные заявки для ОТК
                    </button>
                </#if>
                <#if user.getRole() == 'ADMIN' || user.getRole() == 'CONTROL'>
                    <button id="graf" class="btn btn-primary mb-4">Показать график</button>
                </#if>
            </div>
        </div>
    </div>
</div>

<div class="container mb-4">
    <div class="row">
        <#if user.getRole() == 'ADMIN' || user.getRole() == 'MASTER' || user.getRole() == 'TECHNOLOGIST' || user.getRole() == 'CONTROL'>
            <div class="col-md-4">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Список заявок для ОГТ</h5>
                        <p class="card-text">
                            Количество заявок:${qtuRequestTechnologist}<br>
                        </p>
                        <a href="requestslist/technologist" class="btn btn-primary">Просмотр заявок</a>
                    </div>
                </div>
            </div>
        </#if>
        <#if user.getRole() == 'ADMIN' || user.getRole() == 'MASTER' || user.getRole() == 'CONSTRUCTOR' || user.getRole() == 'CONTROL'>
            <div class="col-md-4">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Список заявок для ОГК</h5>
                        <p class="card-text">
                            Количество заявок:${qtuRequests}<br>
                        </p>
                        <a href="requestslist/constructor" class="btn btn-primary">Просмотр заявок</a>
                    </div>
                </div>
            </div>
        </#if>
        <#if user.getRole() == 'ADMIN' || user.getRole() == 'MASTER' || user.getRole() == 'OTK' || user.getRole() == 'CONTROL'>
            <div class="col-md-4">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Список заявок для ОТК</h5>
                        <p class="card-text">
                            Количество заявок:${qtuRequestsOtk}<br>
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
                <input type="hidden" id="modalDataValue" name="type" />
                <table class="table table-hover vertical-align: middle">
                    <thead>
                    <tr class="taq">
                        <th>#</th>
                        <th>ЗК</th>
                        <th>Статус</th>
                        <th>Просмотр задания</th>
                    </tr>
                    </thead>
                    <tbody id="requestsTableBody">
                    <#list requests as request>
                        <tr>
                            <td>${request.requestNumber}</td>
                            <td>${request.customerOrder.getName()}</td>
                            <td>${request.status.getName()}</td>
                            <td><a href="view/${request.requestNumber}">Просмотр</a></td>
                        </tr>
                    </#list>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModal1Label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModal1Label">Заявки</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="modalDataValue" name="type" />
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
                    <#list requestsMaster['technologist'] as request>
                        <tr data-type="technologist">
                            <td>${request.requestNumber}</td>
                            <td>${request.customerOrder.getName()}</td>
                            <td>${request.status.getName()}</td>
                            <td><a href="view/${request.requestNumber}">Просмотр</a></td>
                        </tr>
                    </#list>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModal2Label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModal2Label">Заявки</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="modalDataValue" name="type" />
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
                    <#list requestsMaster['constructor'] as request>
                        <tr data-type="constructor">
                            <td>${request.requestNumber}</td>
                            <td>${request.customerOrder.getName()}</td>
                            <td>${request.status.getName()}</td>
                            <td><a href="view/${request.requestNumber}">Просмотр</a></td>
                        </tr>
                    </#list>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="exampleModal3" tabindex="-1" aria-labelledby="exampleModal3Label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModal3Label">Заявки</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="modalDataValue" name="type" />
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
                    <#list requestsMaster['otk'] as request>
                        <tr data-type="otk">
                            <td>${request.requestNumber}</td>
                            <td>${request.customerOrder.getName()}</td>
                            <td>${request.status.getName()}</td>
                            <td><a href="view/${request.requestNumber}">Просмотр</a></td>
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
<script src="/js/bootstrap.bundle.js"></script>
</body>
</html>
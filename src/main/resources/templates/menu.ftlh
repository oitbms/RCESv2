<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Меню пользователя</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css">
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
<div class="container mt-5">
    <h1 class="text-center mb-4">Меню пользователя</h1>
    <div class="card">
        <div class="card-body">
            <div class="user-info mb-4">
                <label class="fw-bold">Имя пользователя:</label>
                <span>${user.getName()}</span><br>
                <label class="fw-bold">Рабочее место:</label>
                <span>${user.mlmNode.getName()}</span><br>
                <label class="fw-bold">Должность:</label>
                <span>${user.getRole()}</span>
            </div>
            <h5>Формы заявок</h5>
            <div class="mb-2">
                <span>Форма заявок ОГТ</span>
                <a  href="/requestslist/technologist/0">Перейти</a>
            </div>
            <div class="mb-2">
                <span>Форма заявок ОГК</span>
                <a  href="/requestslist/constructor/0">Перейти</a>
            </div>
            <div class="mb-2">
                <span>Форма заявок ОТК</span>
                <a  href="/requestslist/otk/0">Перейти</a>
            </div>
        </div>
        <nav class="mb-4">
            <ul class="nav">
                <li class="nav-item">
                    <a class="nav-link" href="/">Главная</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/logout">Выйти</a>
                </li>
            </ul>
        </nav>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Принятые мной заявки
        </button>
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

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
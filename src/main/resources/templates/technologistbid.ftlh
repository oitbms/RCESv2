<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Создание заявки на вызов технолога</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
<form id="createRequestForm" action="technologistbid/create" method="POST">
    <!-- Сотрудник -->
    <h2>Сотрудник</h2>
    <input type="text" id="employeeName" placeholder="Имя сотрудника" name="employee" readonly>
    <button type="button" class="openModal"
            data-endpoint="employees"
            data-param="technologist"
            data-display-field="name"
            data-input-id="employeeName">
        список
    </button>
    <div id="myModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Список сотрудников</h2>
            <ul id="employeeList"></ul>
        </div>
    </div>

    <!-- Заказ клиента -->
    <h2>Заказ клиента</h2>
    <input type="text" id="customerOrderName" placeholder="Номер заказа" name="customerOrder" readonly>
    <button type="button" class="openModal"
            data-endpoint="customerOrders"
            data-display-field="name"
            data-input-id="customerOrderName">
        список
    </button>
    <div id="myModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Список заказов клиента</h2>
            <ul id="customerOrderList"></ul>
        </div>
    </div>

    <!-- Причина -->
    <h2>Причина</h2>
    <input type="text" id="reasonId" placeholder="Причина" name="reason" readonly>
    <button type="button" class="openModal"
            data-endpoint="reasons"
            data-display-field="name"
            data-input-id="reasonId">
        список
    </button>

    <button type="submit">Создать заявку</button>
</form>
<script src="/script.js"></script>
</body>
</html>
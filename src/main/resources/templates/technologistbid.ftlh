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
    <input type="text" id="employeeId" name="employeeId" readonly>
    <button type="button" class="openModal"
            data-endpoint="employees"
            data-param="technologist"
            data-display-field="name"
            data-input-id="employeeName"
            data-hidden-id="employeeId"
            data-modal-id="employeesModal"> <!-- Указываем ID модального окна -->
        список
    </button>
    <!-- Модальное окно для сотрудников -->
    <div id="employeesModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Список сотрудников</h2>
            <ul id="employeesList"></ul>
        </div>
    </div>

    <!-- Заказ клиента -->
    <h2>Заказ клиента</h2>
    <input type="text" id="customerOrderName" placeholder="Номер заказа" name="customerOrder" readonly>
    <input type="text" id="customerOrderId" name="customerOrderId" readonly>
    <!-- Кнопка для заказов -->
    <button type="button" class="openModal"
            data-endpoint="customerOrders"
            data-display-field="name"
            data-input-id="customerOrderName"
            data-hidden-id="customerOrderId"
            data-modal-id="customerOrdersModal"> <!-- Указываем ID модального окна -->
        список
    </button>
    <<!-- Модальное окно для заказов -->
    <div id="customerOrdersModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Список заказов клиента</h2>
            <ul id="customerOrdersList"></ul>
        </div>
    </div>

    <!-- Причина -->
    <h2>Причина</h2>
    <input type="text" id="reasonsName" placeholder="Причина" name="reason" readonly>
    <input type="text" id="reasonsId" name="reasonsId" readonly>
    <!-- Кнопка для причин -->
    <button type="button" class="openModal"
            data-endpoint="reasons"
            data-display-field="name"
            data-input-id="reasonsName"
            data-hidden-id="reasonsId"
            data-modal-id="reasonsModal"> <!-- Указываем ID модального окна -->
        список
    </button>
    <!-- Модальное окно для причин -->
    <div id="reasonsModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Список причин</h2>
            <ul id="reasonsList"></ul>
        </div>
    </div>

    <button type="submit">Создать заявку</button>
</form>
<script src="/script.js"></script>
</body>
</html>
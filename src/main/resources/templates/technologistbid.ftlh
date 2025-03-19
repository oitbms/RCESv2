<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Заявка на вызов технолога</title>
    <link rel="stylesheet" href="/stylesBid.css">
</head>
<body>

<#if createForm!false>
    <!-- Форма создания заявки -->
    <form id="createRequestForm" action="/technologistbid/create" method="POST" class="modern-form" enctype="multipart/form-data">
        <h2>Создание заявки</h2>

        <!-- Сотрудник -->
        <div class="form-group">
            <label>Сотрудник</label>
            <div class="form-group-flex">
                <input type="text" id="employeeName" name="employee" placeholder="Имя сотрудника" readonly class="form-input">
                <input type="hidden" id="employeeId" name="employeeId">
                <button type="button" class="openModal btn-modern"
                        data-endpoint="employees"
                        data-param="technologist"
                        data-display-field="name"
                        data-input-id="employeeName"
                        data-hidden-id="employeeId"
                        data-modal-id="employeesModal">
                    Выбрать
                </button>
            </div>
        </div>

        <!-- Заказ клиента -->
        <div class="form-group">
            <label>Заказ клиента</label>
            <div class="form-group-flex">
                <input type="text" id="customerOrderName" name="customerOrder" placeholder="Номер заказа" readonly class="form-input">
                <input type="hidden" id="customerOrderId" name="customerOrderId">
                <button type="button" class="openModal btn-modern"
                        data-endpoint="customerOrders"
                        data-display-field="name"
                        data-input-id="customerOrderName"
                        data-hidden-id="customerOrderId"
                        data-modal-id="customerOrdersModal">
                    Выбрать
                </button>
            </div>
        </div>

        <!-- Причина -->
        <div class="form-group">
            <label>Причина</label>
            <div class="form-group-flex">
                <input type="text" id="reasonsName" name="reason" placeholder="Причина" readonly class="form-input">
                <input type="hidden" id="reasonsId" name="reasonsId">
                <button type="button" class="openModal btn-modern"
                        data-endpoint="reasons"
                        data-display-field="name"
                        data-input-id="reasonsName"
                        data-hidden-id="reasonsId"
                        data-modal-id="reasonsModal">
                    Выбрать
                </button>
            </div>
        </div>

        <!-- Фото -->
        <div class="form-group">
            <label for="additionalFiles">Загрузить фотографии:</label>
            <input type="file" id="additionalFiles" name="additionalFiles" accept="image/*" multiple class="add-photo">
        </div>

        <!-- Кнопка отправки -->
        <button type="submit" class="btn-modern submit-btn">Создать заявку</button>
    </form>
</#if>

<#if viewForm!false>
    <!-- Форма просмотра заявки -->
    <form id="viewRequestForm" class="modern-form">
        <h2>Просмотр заявки</h2>
        <input type="hidden" name="id" value="${bid.id}"/>

        <div class="form-group">
            <label>Номер заявки:</label>
            <span class="form-value">${bid.requestNumber}</span>
        </div>

        <div class="form-group">
            <label>Дата создания:</label>
            <span class="form-value">${bid.createDate}</span>
        </div>

        <div class="form-group form-group-flex">
            <label>Заказ клиента:</label>
            <input type="text" id="customerOrderName"
                   value="${bid.customerOrder.name?trim}"
                   readonly
                   class="form-input">
            <input type="hidden" id="customerOrderId" value="${bid.customerOrder.id}" name="customerOrder">
            <button type="button" class="openModal btn-modern"
                    data-endpoint="customerOrders"
                    data-display-field="name"
                    data-input-id="customerOrderName"
                    data-hidden-id="customerOrderId"
                    data-modal-id="customerOrdersModal"
                    data-save="Technologist">
                Изменить
            </button>
        </div>

        <div class="form-group form-group-flex">
            <label>Статус</label>
            <input type="text" id="statusName" name="status"
                   value="${bid.status.name()?trim}"
                   readonly
                   class="form-input">
            <input type="hidden" id="statusId" value="${bid.status.id}">
            <button type="button" class="openModal btn-modern"
                    data-endpoint="status"
                    data-display-field="name"
                    data-input-id="statusName"
                    data-hidden-id="statusId"
                    data-modal-id="statusModal"
                    data-save="Technologist">
                Изменить
            </button>
        </div>

        <div class="form-group form-group-flex">
            <label>Ответственный:</label>
        <input type="text" id="employeeName"
               value="${bid.employee.name?trim}"
               readonly
               class="form-input">
            <input type="hidden" id="employeeId" value="${bid.employee.id?c}" name="employee">
            <button type="button" class="openModal btn-modern"
                    data-endpoint="employees"
                    data-display-field="name"
                    data-input-id="employeeName"
                    data-hidden-id="employeeId"
                    data-modal-id="employeesModal"
                    data-save="Technologist">
                Изменить
            </button>
        </div>

    </form>
</#if>

<!-- Модальные окна -->
<div id="employeesModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Список сотрудников</h2>
        <ul id="employeesList" class="modal-list"></ul>
    </div>
</div>

<div id="customerOrdersModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Список заказов</h2>
        <ul id="customerOrdersList" class="modal-list"></ul>
    </div>
</div>

<div id="reasonsModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Список причин</h2>
        <ul id="reasonsList" class="modal-list"></ul>
    </div>
</div>

<div id="statusModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Статусы</h2>
        <ul id="statusList" class="modal-list"></ul>
    </div>
</div>

<!-- Уведомления -->
<div id="notification-container"></div>

<!-- Подключение JS -->
<script src="/script.js"></script>
</body>
</html>
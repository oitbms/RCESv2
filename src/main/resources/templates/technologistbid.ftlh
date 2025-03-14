<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Создание заявки на вызов технолога</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
<#if createForm!false>
    <!-- Форма создания заявки -->
    <form id="createRequestForm" action="technologistbid/create" method="POST">

        <!-- Сотрудник -->
        <h2>Сотрудник</h2>
        <input type="text" id="employeeName" placeholder="Имя сотрудника" name="employee" readonly>
        <input type="hidden" id="employeeId" name="employeeId" readonly>
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
        <input type="hidden" id="customerOrderId" name="customerOrderId" readonly>
        <!-- Кнопка для заказов -->
        <button type="button" class="openModal"
                data-endpoint="customerOrders"
                data-display-field="name"
                data-input-id="customerOrderName"
                data-hidden-id="customerOrderId"
                data-modal-id="customerOrdersModal"> <!-- Указываем ID модального окна -->
            список
        </button>
        <!-- Модальное окно для заказов -->
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
        <input type="hidden" id="reasonsId" name="reasonsId" readonly>
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

        <!-- Фото -->
        <div class="photo-group">
            <label for="additionalFiles">Загрузить фотографии:</label>
            <input type="file" class="add-photo" id="additionalFiles" name="additionalFiles" accept="image/*" multiple>
        </div>
        <!-- Модальное окно выбора фото -->
        <div class="modal fade" id="infoModal" tabindex="-1" role="dialog" aria-labelledby="infoModalLabel"
             aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="infoModalLabel">Дополнительное описание</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <img id="modalImage" src="" alt="Изображение"
                             style="width: 100%; height: auto; display: none;"/>
                        <p id="modalDescription"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>

        <button type="submit">Создать заявку</button>
    </form>
</#if>

<#if viewForm!false>
    <!-- Форма просмотра заявки -->
    <form id="viewRequestForm" action="technologistbid/view/${bid.requestNumber}" method="GET">
        <input type="hidden" name="id" value="${bid.id}"/>

        <!-- Поле: Номер заявки -->
        <div>
            <label>Номер заявки:</label>
            <span>${bid.requestNumber}</span>
        </div>

        <!-- Поле: Дата создания -->
        <div>
            <label>Дата создания:</label>
            <span>${bid.createDate}</span>
        </div>

        <!-- Поле: Заказ клиента -->
        <div>
            <label>Заказ клиента:</label>
            <label>${bid.customerOrder.name}</label>
        </div>

        <!-- Поле: Статус -->
        <div>
            <label>Статус:</label>
            <input type="text" id="statusName" name="status" value="${bid.status.name()}" readonly>
            <input type="hidden" id="statusId" value="${bid.status.id}"> <!-- Скрытое поле для хранения ID статуса -->
        </div>
        <!-- Кнопка для статуса -->
        <button type="button" class="openModal"
                data-endpoint="status"
                data-display-field="name"
                data-input-id="statusName"
                data-hidden-id="statusId"
                data-modal-id="statusModal"
                data-save="Technologist">
            изменить
        </button>
        <!-- Модальное окно для статуса -->
        <div id="statusModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Статусы</h2>
                <ul id="statusList"></ul>
            </div>
        </div>

        <!-- Поле: ФИО ответственного -->
        <div>
            <label>ФИО ответственного:</label>
            <label>${bid.employee.name}</label>
        </div>

        <!-- Кнопки -->
        <div>
            <button type="submit">Сохранить</button>
            <a href="/technologistmain">К списку</a>
        </div>
    </form>
</#if>
<script src="/script.js"></script>
<!-- Для загрузки фото -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
<!--                   -->
</body>
</html>
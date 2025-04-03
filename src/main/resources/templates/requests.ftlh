<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Заявка на вызов</title>
    <link rel="stylesheet" href="/stylesBid.css">
</head>
<body>
<#if createForm!false>
    <form id="createRequestForm" action="/create" method="POST" class="modern-form"
          enctype="multipart/form-data">
        <h2>Создание заявки</h2>

        <input type="hidden" name="type" value="${type}">

        <!-- Сотрудник -->
        <div class="form-group">
            <label>Сотрудник</label>
            <div class="form-group-flex">
                <input type="text" id="employeeName" placeholder="Имя сотрудника" readonly
                       class="form-input" data-required="true">
                <input type="hidden" id="employeeJson" name="employeeJson">
                <button type="button" class="openModal btn-modern"
                        data-endpoint="employees"
                        data-input-id="employeeName"
                        data-hidden-entity="employeeJson"
                        data-modal-id="employeesModal">
                    Выбрать
                </button>
            </div>
        </div>

        <!-- Цех -->
        <div class="form-group">
            <label>Цех</label>
            <div class="form-group-flex <#if !otk??>hidden</#if>">
                <input type="text" id="mlmNodeName" placeholder="Цех" readonly
                       class="form-input" <#if !otk??>data-required="true"</#if>>
                <input type="hidden" id="mlmNodeJson" name="mlmNodeJson">
                <button type="button" class="openModal btn-modern"
                        data-endpoint="mlmNode"
                        data-input-id="mlmNodeName"
                        data-hidden-entity="mlmNodeJson"
                        data-modal-id="mlmNodeModal">
                    Выбрать
                </button>
            </div>
        </div>

        <!-- Заказ клиента -->
        <div class="form-group">
            <label>Заказ клиента</label>
            <div class="form-group-flex">
                <input type="text" id="customerOrderString" name="customerOrderString" placeholder="Номер заказа"
                       class="form-input" data-required="true">
                <input type="hidden" id="customerOrderJson" name="customerOrderJson">
                <button type="button" class="openModal btn-modern"
                        data-endpoint="customerOrders"
                        data-input-id="customerOrderString"
                        data-hidden-entity="customerOrderJson"
                        data-modal-id="customerOrdersModal">
                    Выбрать
                </button>
            </div>
        </div>

        <!-- Причина -->
        <div class="form-group <#if !technologist??>hidden</#if>">
            <label>Причина</label>
            <div class="form-group-flex">
                <input type="text" id="reasonsName" placeholder="Причина" readonly class="form-input"
                       <#if !constructor??>data-required="true"</#if>>
                <input type="hidden" id="reasonsJson" name="reasonsJson">
                <button type="button" class="openModal btn-modern"
                        data-endpoint="reasons"
                        data-input-id="reasonsName"
                        data-hidden-entity="reasonsJson"
                        data-modal-id="reasonsModal">
                    Выбрать
                </button>
            </div>
        </div>

        <div class="form-group">
            <label>Комментарий</label>
            <div class="form-group-flex">
                <input type="text" id="comment" name="comment" placeholder="Комментарий" class="form-input">
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
        <input type="hidden" id="id" value="${bid.id}"/>

        <div class="form-group">
            <span class="form-value request-number">Заявка №${bid.requestNumber}</span>
        </div>

        <div class="form-group">
            <label>Дата создания:</label>
            <span class="form-value">${date}</span>
        </div>

        <div class="form-group form-group-flex">
            <label>Заказ клиента:</label>
            <input type="text" id="customerOrderString"
                   value="${bid.customerOrder.name?trim}"
                   class="form-input">
            <#assign customerOrderJson = '{"id":"${bid.customerOrder.id?string}", "name":"${bid.customerOrder.name?js_string}"}'>
            <input type="hidden" id="customerOrderJson"
                   value='${customerOrderJson}'
                   name="customerOrder">
            <button type="button" class="openModal btn-modern"
                    data-endpoint="customerOrders"
                    data-input-id="customerOrderString"
                    data-hidden-entity="customerOrderJson"
                    data-modal-id="customerOrdersModal">
                Изменить
            </button>
        </div>

        <div class="form-group form-group-flex">
            <label>Ответственный:</label>
            <input type="text" id="employeeName"
                   value="${bid.employee.name?trim}"
                   readonly
                   class="form-input">
            <#assign employeeJson = '{"id":"${bid.employee.id?c}", "name":"${bid.employee.name?js_string}"}'>
            <input type="hidden" id="employeeJson"
                   value='${employeeJson}'
                   name="employee">
            <button type="button" class="openModal btn-modern"
                    data-endpoint="employees"
                    data-input-id="employeeName"
                    data-hidden-entity="employeeJson"
                    data-modal-id="employeesModal">
                Изменить
            </button>
        </div>

        <div class="form-group form-group-flex">
            <label>Описание:</label>
            <input type="text" id="description"
                   value="${bid.description!''}"
                   class="form-input"
                   name="description">
        </div>

        <div class="form-group form-group-flex">
            <label>Комментарий:</label>
            <input type="text" id="comment"
                   value="${bid.comment!''}"
                   class="form-input"
                   name="comment">
        </div>

        <div class="form-group form-group-flex telegram-checkbox">
            <label for="telegramCheckbox">Отправить уведомление в Telegram</label>
            <input type="hidden" name="sendToTelegram" value="false">
            <input type="checkbox" id="telegramCheckbox" name="sendToTelegram" class="form-checkbox" value="true">
        </div>

        <!-- Кнопка для открытия модального окна просмотра фото-->
        <button type="button" class="btn-modern" id="openPhotoModal">Прикрепленные фото</button>

        <div class="form-group form-group-flex">
            <label>Статус</label>
            <input type="text" id="statusName" name="status"
                   value="${bid.status.name()?trim}"
                   readonly
                   class="form-input">
            <input type="hidden" id="statusJson" value="${bid.status}">
            <button type="button" class="openModal btn-modern"
                    data-endpoint="status"
                    data-display-field="name"
                    data-input-id="statusName"
                    data-hidden-entity="statusJson"
                    data-modal-id="statusModal"
                    data-save="Technologist">
                Изменить и уведомить
            </button>
        </div>
    </form>
</#if>

<!-- Модальные окна -->
<div id="employeesModal" class="modal">
    <div class="modal-content">
        <button class="x" onclick="closeModal('employeesModal')">✕</button>
        <h2>Список сотрудников</h2>
        <ul id="employeesList" class="modal-list"></ul>
    </div>
</div>

<div id="mlmNodeModal" class="modal">
    <div class="modal-content">
        <button class="x" onclick="closeModal('mlmNodeModal')">✕</button>
        <h2>Список сотрудников</h2>
        <ul id="mlmNodeList" class="modal-list"></ul>
    </div>
</div>

<div id="customerOrdersModal" class="modal">
    <div class="modal-content">
        <button class="x" onclick="closeModal('photoModal')">✕</button>
        <h2>Список заказов</h2>
        <ul id="customerOrdersList" class="modal-list"></ul>
    </div>
</div>

<div id="reasonsModal" class="modal">
    <div class="modal-content">
        <button class="x" onclick="closeModal('reasonsModal')">✕</button>
        <h2>Список причин</h2>
        <ul id="reasonsList" class="modal-list"></ul>
    </div>
</div>

<div id="statusModal" class="modal">
    <div class="modal-content">
        <button class="x" onclick="closeModal('statusModal')">✕</button>
        <h2>Статусы</h2>
        <ul id="statusList" class="modal-list"></ul>
    </div>
</div>

<!-- Модальное окно для фотографий -->
<div id="photoModal" class="modal">
    <div class="modal-content">
        <button class="x" onclick="closeModal('photoModal')">✕</button>
        <h2>Прикрепленные фото</h2>
        <div id="photoContainer" class="photo-container"></div>
        <button type="button" id="addPhotoBtn" class="btn-modern">Добавить фото</button>
        <input type="file" id="photoInput" accept="image/*" style="display: none;">
    </div>
</div>

<!-- Модальное окно для увеличенного фото -->
<div id="fullPhotoModal" class="modal">
    <div class="modal-content">
        <button class="x" onclick="closeModal('fullPhotoModal')">✕</button>
        <img id="fullPhoto" class="full-photo" src="" alt="Просмотр фото">
    </div>
</div>

<!-- Уведомления -->
<div id="notification-container"></div>
<script>const bidType = "${type}";
    const viewForm = <#if viewForm??>${viewForm?c}<#else>false</#if>;</script>
<script src="/script.js"></script>
</body>
</html>
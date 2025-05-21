<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Заявка на вызов</title>
    <link rel="stylesheet" href="/css/stylesBid.css">
    <script>const bidType = "${type}";
        const viewForm = <#if viewForm??>${viewForm?c}<#else>false</#if>;</script>
    <script type="module" src="/js/script.js" defer></script>
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
        <div class="form-group"  id="mlmNodeCreateField">
            <label>Цех</label>
            <div class="form-group-flex">
                <input type="text" id="mlmNodeName" placeholder="Цех" readonly
                       class="form-input" data-required="true">
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

        <!--ТМЦ-->
        <div class="form-group">
            <label>Тип ДСЕ</label>
            <div class="form-group-flex">
                <input type="text" id="itemName" placeholder="ДСЕ" readonly
                class="form-input" data-required="true">
                <input type="hidden" id="itemNameJson" name="itemNameJson">
                <button type="button" class="openModal btn-modern"
                        data-endpoint="item"
                        data-input-id="itemName"
                        data-hidden-entity="itemNameJson"
                        data-modal-id="itemModal">
                    Выбрать
                </button>
            </div>
        </div>

        <div class="form-group" id="qtyCreateField">
            <label>Кол-во деталей к контролю</label>
            <div class="form-group-flex">
                <input type="text" id="qty" name="qty" class="form-input" data-required="true">
            </div>
        </div>

        <!-- Тип контроля -->
        <#if type == 'otk'>
        <div class="form-group">
            <label>Тип контроля</label>
            <div class="form-group-flex">
                <select id="control" name="control" class="form-input" data-required="true">
                    <option value="">Выберите тип контроля</option>
                    <option value="ВИК">ВИК</option>
                    <option value="ЛНК">ЛНК</option>
                </select>
                <input type="hidden" id="hiddenСontrol" placeholder="Тип контроля" class="form-input">
            </div>
        </div>
        </#if>

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
        <#if type == 'constructor' || type == 'technologist'>
            <div class="form-group" id="reasonCreateField">
                <label>Причина</label>
                <div class="form-group-flex">
                    <input type="text" id="reasonsName" placeholder="Причина" readonly class="form-input" data-required="true">
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
        <#else>
            <div class="form-group">
                <label>Причина</label>
                <div class="form-group-flex">
                    <input type="text" id="reasonsJson" name="reasonsJson" placeholder="Комментарий" class="form-input">
                </div>
            </div>
        </#if>

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
            <label>Дата создания: ${date}</label>
<#--            <span class="form-value">${date}</span>-->
        </div>

        <div class="form-group" id="mlmNodeViewField">
            <label>Цех: ${(bid.mlmNode.getName())!""}</label>
<#--            <span class="form-value">${(bid.mlmNode.getName())!""}</span>-->
        </div>

        <div class="form-group">
            <label>Тип ТМЦ: ${(bid.item.getName())!""}</label>
<#--            <span class="form-value">${(bid.item.getName())!""}</span>-->
        </div>

        <#if bid.typeRequest == 'otk'>
        <div class="form-group">
            <label>Тип контроля: ${bid.getControl()!""}</label>
        </div>
        </#if>

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

        <div class="form-group form-group-flex" id="descriptionViewField">
            <label>Описание решения:</label>
            <input type="text" id="description"
                   value="${bid.description!''}"
                   class="form-input"
                   name="description">
        </div>

        <#if type == 'otk'>
            <div class="form-group form-group-flex" id="inconsistencyViewField">
                <label>Несоответствия:</label>
                <input type="text" id="inconsistencyName" readonly class="form-input"
                       value="${(bid.inconsistency??)?then(bid.inconsistency?map(i -> i.getName())?join(', '), '')}">
                <input type="hidden" id="inconsistencyJson" name="inconsistency"
                       value='[<#list bid.inconsistency as i>{"name": "${i.getName()}"<#if i_has_next>, </#if></#list>]'>
                <button type="button" class="openModal btn-modern"
                        data-endpoint="inconsistency"
                        data-input-id="inconsistencyName"
                        data-hidden-entity="inconsistencyJson"
                        data-modal-id="inconsistencyModal"
                        data-multiple="true"
                        data-param="${bid.getControl()!""}"
                >
                    Изменить
                </button>
            </div>

            <div class="form-group" id="qtyViewField">
                <label>Кол-во деталей к контролю: ${(bid.qty)!0}</label>
            </div>
        </#if>

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
                   value="${bid.status.getName()?trim}"
                   readonly
                   class="form-input">
            <input type="hidden" id="statusJson" value="${bid.status}">
            <button type="button" class="openModal btn-modern"
                    data-endpoint="status"
                    data-input-id="statusName"
                    data-hidden-entity="statusJson"
                    data-modal-id="statusModal">
                Изменить и уведомить
            </button>
        </div>
        <a href="/menu" class="btn-modern">Перейти в меню</a>
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
        <h2>Список цехов</h2>
        <ul id="mlmNodeList" class="modal-list"></ul>
    </div>
</div>

<div id="itemModal" class="modal">
    <div class="modal-content">
        <button class="x" onclick="closeModal('itemModal')">✕</button>
        <h2>Список ДСЕ</h2>
        <ul id="itemNodeList" class="modal-list"></ul>
    </div>
</div>

<div id="customerOrdersModal" class="modal">
    <div class="modal-content">
        <button class="x" onclick="closeModal('customerOrdersModal')">✕</button>
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

<div id="inconsistencyModal" class="modal">
    <div class="modal-content">
        <button class="x" onclick="closeModal('inconsistencyModal')">✕</button>
        <h2>Список несоответствий</h2>
        <ul id="inconsistencyList" class="modal-list"></ul>
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

<#--<script>-->
<#--    document.addEventListener('DOMContentLoaded', function() {-->
<#--        const button = document.getElementById('viewAllRequestsBtn');-->
<#--        if (button) { // Проверка, что элемент существует-->
<#--            button.addEventListener('click', function() {-->
<#--                const bidType = "constructor"; // Получаем тип заявки-->
<#--                // Переход на страницу со списком заявок передавая тип-->
<#--                window.location.href = `/requestslist/` + bidType; // Измените на нужный вам путь-->
<#--            });-->
<#--        }-->
<#--    });-->
<#--</script>-->

</body>
</html>
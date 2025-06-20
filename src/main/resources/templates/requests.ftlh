<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Заявка на вызов</title>
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/stylesBid.css">
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.21/css/jquery.dataTables.css">
    <script type="text/javascript" charset="utf8"
            src="https://cdn.datatables.net/1.10.21/js/jquery.dataTables.js"></script>
    <script>const bidType = "${type}";
        const viewForm = <#if viewForm??>${viewForm?c}<#else>false</#if>;</script>
    <script src="/js/script.js" defer></script>
</head>
<body>
<#if createForm!false>
    <div class="container mt-5 mb-5">
        <form id="createRequestForm" action="/create" method="POST" enctype="multipart/form-data"
              class="p-4 border rounded bg-light shadow-sm">
            <h2 class="mb-4">Создание заявки</h2>

            <input type="hidden" name="type" value="${type}">

            <!-- Сотрудник -->
            <div class="mb-3">
                <label class="form-label">Сотрудник</label>
                <div class="input-group has-validation">
                    <input type="text" id="employeeName" class="form-control" placeholder="Имя сотрудника" required>
                    <input type="hidden" id="employeeJson" name="employeeJson" required>
                    <button type="button" class="btn btn-outline-primary openModal"
                            data-endpoint="employees"
                            data-input-id="employeeName"
                            data-hidden-entity="employeeJson"
                            data-modal-id="employeesModal"
                            data-param="${type}">
                        Выбрать
                    </button>
                </div>
            </div>

            <!-- Цех -->
            <div class="mb-3" id="mlmNodeCreateField">
                <label class="form-label">Цех</label>
                <div class="input-group">
                    <input type="text" id="mlmNodeName" class="form-control" placeholder="Цех" required>
                    <input type="hidden" id="mlmNodeJson" name="mlmNodeJson">
                    <button type="button" class="btn btn-outline-primary openModal"
                            data-endpoint="mlmNode"
                            data-input-id="mlmNodeName"
                            data-hidden-entity="mlmNodeJson"
                            data-modal-id="mlmNodeModal">
                        Выбрать
                    </button>
                </div>
            </div>

            <!-- ТМЦ -->
            <div class="mb-3">
                <label class="form-label">Тип ДСЕ</label>
                <div class="input-group">
                    <input type="text" id="itemName" class="form-control" placeholder="ДСЕ">
                    <input type="hidden" id="itemNameJson" name="itemNameJson">
                    <button type="button" class="btn btn-outline-primary openModal"
                            data-endpoint="item"
                            data-input-id="itemName"
                            data-hidden-entity="itemNameJson"
                            data-modal-id="itemModal">
                        Выбрать
                    </button>
                </div>
            </div>

            <!-- Кол-во деталей -->
            <#if type == 'otk'>
                <div class="mb-3" id="qtyCreateField">
                    <label for="qty" class="form-label">Кол-во деталей к контролю</label>
                    <input type="text" id="qty" name="qty" class="form-control" required>
                </div>
            </#if>

            <!-- Тип контроля -->
            <#if type == 'otk'>
                <div class="mb-3">
                    <label for="control" class="form-label">Тип контроля</label>
                    <select id="control" name="control" class="form-select" required>
                        <option value="">Выберите тип контроля</option>
                        <option value="ВИК">ВИК</option>
                        <option value="ЛНК">ЛНК</option>
                    </select>
                    <input type="hidden" id="hiddenСontrol" class="form-control">
                </div>
            </#if>

            <!-- Заказ клиента -->
            <div class="mb-3">
                <label class="form-label">Заказ клиента</label>
                <div class="input-group">
                    <input type="text" id="customerOrderString" name="customerOrderString" class="form-control"
                           placeholder="Номер заказа" required>
                    <input type="hidden" id="customerOrderJson" name="customerOrderJson">
                    <button type="button" class="btn btn-outline-primary openModal"
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
                <div class="mb-3" id="reasonCreateField">
                    <label class="form-label">Причина</label>
                    <div class="input-group">
                        <input type="text" id="reasonsName" class="form-control" placeholder="Причина" readonly>
                        <input type="hidden" id="reasonsJson" name="reasonsJson">
                        <button type="button" class="btn btn-outline-primary openModal"
                                data-endpoint="reasons"
                                data-input-id="reasonsName"
                                data-hidden-entity="reasonsJson"
                                data-modal-id="reasonsModal"
                                data-param="${type}">
                            Выбрать
                        </button>
                    </div>
                </div>
            <#else>
                <div class="mb-3">
                    <label for="reasonsJson" class="form-label">Причина</label>
                    <input type="text" id="reasonsJson" name="reasonsJson" class="form-control"
                           placeholder="Причина">
                </div>
            </#if>

            <!-- Комментарий -->
            <div class="mb-3">
                <label for="comment" class="form-label">Комментарий</label>
                <textarea class="form-control" id="comment" name="comment" rows="4"
                          placeholder="Введите комментарий"></textarea>
            </div>

            <!-- Фото -->
            <div class="mb-3">
                <label for="additionalFiles" class="form-label">Загрузить фотографии</label>
                <input type="file" id="additionalFiles" name="additionalFiles" accept="image/*" multiple
                       class="form-control">
            </div>

            <!-- Кнопка отправки -->
            <div class="d-grid">
                <button type="submit" class="btn btn-success">Создать заявку</button>
            </div>
        </form>
    </div>
</#if>
<#if viewForm!false>
    <form id="viewRequestForm" class="container mt-4">
        <input type="hidden" id="id" value="${bid.id}"/>

        <!-- Номер заявки -->
        <div class="mb-3">
            <span class="fs-5 fw-bold">Заявка №${bid.requestNumber}</span>
        </div>

        <!-- Информация -->
        <div class="card mb-4">
            <div class="card-header bg-primary text-white">
                Информация
            </div>
            <div class="card-body">
                <#if bid.status.getName() != "Новый">
                    <p class="mb-2"><strong>Ответственный:</strong> ${(bid.getEmployee().getName())!""}</p>
                </#if>
                <p class="mb-2"><strong>Дата создания:</strong> ${(date)!""}</p>
                <p class="mb-2"><strong>Цех:</strong> ${(bid.mlmNode.getName())!""}</p>
                <p class="mb-2"><strong>Тип ТМЦ:</strong> ${(bid.item.getName())!""}</p>
                <p class="mb-2"><strong>Заказ клиента:</strong> ${(bid.customerOrder.getName())!""}</p>
                <#if bid.typeRequest == 'otk'>
                    <p class="mb-2"><strong>Тип контроля:</strong> ${(bid.getControl())!""}</p>
                    <p class="mb-2"><strong>Кол-во деталей к контролю:</strong> ${(bid.qty)!0}</p>
                </#if>
                <#if bid.status.getName() == "В работе">
                <p class="mb-2"><strong>Комментарий:</strong>
                    <textarea class="form-control"
                              id="comment"
                              name="comment"
                              rows="5"
                              style="resize: both;"
                              readonly>${bid.comment!''}</textarea>
                </#if>
            </div>
        </div>

        <!-- Редактирование -->
        <div class="card mb-4">
            <div class="card-header bg-secondary text-white">
                Редактирование
            </div>
            <div class="card-body">

                <#if bid.status.getName() == "Новый">
                    <!-- Ответственный -->
                    <div class="mb-3">
                        <label for="employeeName" class="form-label">Ответственный:</label>
                        <div class="input-group">
                            <input type="text" id="employeeName"
                                   value="${bid.employee.name?trim}"
                                   readonly
                                   class="form-control">
                            <#assign employeeJson = '{"id":"${bid.employee.id?c}", "name":"${bid.employee.name?js_string}"}'>
                            <input type="hidden" id="employeeJson"
                                   value='${employeeJson}'
                                   name="employee">
                            <button type="button"
                                    class="btn btn-outline-secondary openModal"
                                    data-endpoint="employees"
                                    data-input-id="employeeName"
                                    data-hidden-entity="employeeJson"
                                    data-modal-id="employeesModal"
                                    data-param="${bid.getTypeRequest().name()}">
                                Изменить
                            </button>
                        </div>
                        <#if role != 'MASTER'>
                        <p class="mb-2"><strong>Комментарий:</strong>
                            <textarea class="form-control"
                                      id="comment"
                                      name="comment"
                                      rows="5"
                                      style="resize: both;"
                                      readonly>${bid.comment!''}</textarea>
                        </#if>
                    </div>
                    <!-- Кнопка "Взять в работу" -->
                    <#if role != 'MASTER'>
                        <button type="button"
                                class="btn btn-primary mb-3 work"
                                id="workId"
                                data-param="${bid.getId()}">
                            Взять в работу
                        </button>
                    </#if>
                </#if>

                <#if bid.getStatus().getName() == 'В работе' && role == 'MASTER'>
                    <p class="text-success fs-3 fw-bold">Заявка была принята в работу</p>
                <#elseif bid.getStatus().getName() == 'В работе' && role != 'MASTER' && type != 'otk'>
                    <button type="button"
                            class="btn btn-success mb-3 work"
                            id="executeBtn"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal">
                        Выполнение
                    </button>
                <#elseif bid.getStatus().getName() == 'В работе' && role != 'MASTER' && type == 'otk'>
                    <button type="button"
                            class="btn btn-success mb-3 work"
                            id="workId"
                            data-param="${bid.getId()}">
                        Выполнено
                    </button>
                    <button type="button"
                            class="btn btn-danger mb-3"
                            id="executeOtkBtn"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModalOtk">
                        Забракован
                    </button>

                </#if>

                <#if role == ('MASTER') && bid.getStatus().getName() == 'Выполнен'>
                    <#if type != 'otk'>
                    <label for="closed" class="form-label">Описание решения</label>
                    <textarea class="form-control"
                              name="description"
                              id="description"
                              rows="5"
                              readonly>${bid.getDescription()!""}
                    </textarea>
                        <#else >
                        <input type="text" readonly class="form-control" value="${bid.status.getName()}">
                    </#if>

                    <button type="button"
                            class="btn btn-danger mt-3 work"
                            id="canceledBtn"
                            data-param="${bid.getId()}"
                            data-status="false"
                    >Не согласовано</button>

                    <button type="button"
                            class="btn btn-success mt-3 work"
                            id="successBtn"
                            data-param="${bid.getId()}"
                            data-status="true"
                    >Согласовано</button>

                <#elseif role != ('MASTER') && bid.getStatus().getName() == 'Выполнен'>
                    <p class="text-success fs-3 fw-bold">Решение отправлено</p>
                </#if>

                <#if bid.getStatus().getName() == 'Закрыт'>
                    <p class="text-success fs-3 fw-bold">Заявка закрыта!</p>
                </#if>

                <#if bid.getStatus().getName() == 'Отменен'>
                    <p class="text-danger fs-3 fw-bold">Заявка забракована!</p>
                    <label for="closed" class="form-label">Несоответствия</label>
                    <input type="text" class="form-control"
                           value="${(bid.inconsistency??)?then(bid.inconsistency?map(i -> i.getName())?join(', '), '')}">
                    <label for="closed" class="form-label">Описание решения</label>
                    <textarea class="form-control"
                              name="description"
                              id="description"
                              rows="3"
                              readonly>${bid.getDescription()!""}
                    </textarea>
                </#if>

                <!-- Модальное окно "Выполнение заявки" -->
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
                     aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Выполнение заявки</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Закрыть"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="description" class="form-label">Решение:</label>
                                    <textarea class="form-control"
                                              id="description"
                                              name="description"
                                              rows="4"
                                              placeholder="Введите описание решения">${bid.description!''}</textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                                <button type="button"
                                        id="successId"
                                        class="btn btn-success work"
                                        data-endpoint="inwork"
                                        data-param="${bid.getId()}"
                                        data-description="${bid.getDescription()!""}"
                                >
                                    Сохранить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="exampleModalOtk" tabindex="-1" aria-labelledby="exampleModalOtkLabel"
                     aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalOtkLabel">Выполнение заявки</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Закрыть"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-2">
                                    <label class="mb-3">Несоответствия:</label>
                                    <input type="text" id="inconsistencyName" readonly
                                           class="form-control readonly-scroll"
                                           value="${(bid.inconsistency??)?then(bid.inconsistency?map(i -> i.getName())?join(', '), '')}">
                                    <input type="hidden" id="inconsistencyJson" name="inconsistency"
                                           value='[<#list bid.inconsistency as i>{"name": "${i.getName()?json_string}"}<#sep>, </#sep></#list>]'>
                                    <button type="button" class="btn btn-primary mt-2 openModal"
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
                                <div class="mb-3">
                                    <label for="description" class="form-label">Решение:</label>
                                    <textarea class="form-control"
                                              id="description2"
                                              name="description"
                                              rows="4"
                                              placeholder="Введите описание решения">${bid.description!''}</textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                                <button type="button"
                                        id="successId"
                                        class="btn btn-success work"
                                        data-endpoint="inwork"
                                        data-param="${bid.getId()}"
                                        data-description="${bid.getDescription()!""}"
                                >
                                    Сохранить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <#if (bid.status.getName() == "Новый" || bid.status.getName() == "Выполнен") && role == "MASTER">
                    <div class="mb-1 mt-2">
                        <label for="comment" class="form-label">Комментарий:</label>
                        <textarea class="form-control"
                                  id="comment"
                                  name="comment"
                                  rows="5"
                                  style="resize: both;">${bid.comment!''}</textarea>
                    </div>
                </#if>
            </div>
        </div>

        <!-- Telegram уведомление -->
        <div class="form-check form-switch mb-4 d-none">
            <input type="hidden" name="sendToTelegram" value="true">
            <input class="form-check-input" type="checkbox" id="telegramCheckbox" name="sendToTelegram" value="false">
            <label class="form-check-label" for="telegramCheckbox">
                Не отправлять уведомление в Telegram
            </label>
        </div>

        <!-- Кнопки действий -->
        <div class="d-flex flex-wrap gap-2 mb-4">
            <button class="btn btn-outline-primary"
                    type="button"
                    id="openPhotoModal"
                    data-bs-toggle="modal"
                    data-bs-target="#photoModal"
            >Прикрепленные фото
            </button>
            <a href="/menu" class="btn btn-outline-secondary">Меню</a>
        </div>
    </form>
</#if>

<!-- Модальные окна -->

<div class="modal fade" id="photoModal" tabindex="-1" aria-labelledby="photoModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="photoModalLabel">Прикрепленные фото</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
            </div>
            <div class="modal-body">
                <div id="photoContainer" class="d-flex flex-wrap gap-3"></div>
                <input type="file" id="photoInput" accept="image/*" capture="environment" style="display: none;">
                <!-- Добавьте сюда -->
                <img id="fullPhoto" src="" style="max-width:100%; max-height:80vh; margin-top:10px;">
            </div>
            <div class="modal-footer">
                <button type="button" id="addPhotoBtn" class="btn btn-primary">Добавить фото</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="universalModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Выберите элемент</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
            </div>
            <div class="modal-body">
                <input type="text" class="form-control mb-2" id="modalSearchInput" placeholder="Поиск...">
                <ul class="list-group modal-list" id="modalItemList">

                </ul>
                <div id="modalLoading" class="text-center my-3 d-none">
                    <div class="spinner-border text-primary" role="status"></div>
                </div>
                <div id="modalError" class="text-danger text-center d-none">Ошибка загрузки данных</div>
            </div>
            <div class="modal-footer d-none" id="modalFooter">
                <button type="button" class="btn btn-primary" id="modalSaveBtn">Сохранить</button>
            </div>
        </div>
    </div>
</div>

<!-- Уведомления -->
<div id="notification-container"></div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const actionButtons = document.querySelectorAll('button.work[data-param]');
        const bidType = '${type}';
        let description;

        const handleClick = async (button) => {

                const param = button.dataset.param;
                const status = button.dataset.status;
                const comment = button.dataset.comment;

                if (bidType === 'otk') {
                    description = document.getElementById('description2')?.value || '';
                } else {
                    description = document.getElementById('description')?.value || '';
                }


                const formData = new URLSearchParams();
                formData.append('param', param);
                formData.append('description', description);
                if (status !== undefined && status !== null) {
                    formData.append('status', status);
                }
                if (comment !== undefined && comment !== null) {
                    formData.append('comment', comment);
                }

                console.log('param:', param);
                console.log('description:', description);

                const response = await fetch('/api/inwork', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData
                });

                if (!response.ok) throw new Error('Ошибка сервера: ' + response.status);

                location.reload();
        };

        actionButtons.forEach(button => {
            button.addEventListener('click', () => handleClick(button));
        });
    });
</script>

<script> (function () {
        const modalElement = document.getElementById('universalModal');
        const modal = new bootstrap.Modal(modalElement);
        const listElement = document.getElementById('modalItemList');
        const searchInput = document.getElementById('modalSearchInput');
        const loadingIndicator = document.getElementById('modalLoading');
        const errorBlock = document.getElementById('modalError');
        const saveBtn = document.getElementById('modalSaveBtn');
        const footer = document.getElementById('modalFooter');
        let multiple = false;
        let selected = new Map();
        let originalData = [];
        let inputId, hiddenId;

        searchInput.classList.remove('visible');

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            renderList(originalData.filter(item => item.name.toLowerCase().includes(query)));
        });

        function renderList(data) {
            listElement.innerHTML = '';

            data.forEach(item => {
                const li = document.createElement('li');
                li.className = 'list-group-item list-group-item-action selectable';
                li.textContent = item.name;
                li.dataset.entity = encodeURIComponent(JSON.stringify(item));

                if (multiple && selected.has(item.name)) {
                    li.classList.add('active');
                }

                li.addEventListener('click', () => {
                    if (multiple) {
                        if (selected.has(item.name)) {
                            selected.delete(item.name);
                            li.classList.remove('active');
                        } else {
                            selected.set(item.name, item);
                            li.classList.add('active');
                        }
                        const arr = Array.from(selected.values());
                        document.getElementById(inputId).value = arr.map(e => e.name).join(', ');
                        document.getElementById(hiddenId).value = JSON.stringify(arr);
                    } else {
                        document.getElementById(inputId).value = item.name;
                        document.getElementById(hiddenId).value = JSON.stringify(item);
                        modal.hide();
                        if (typeof saveData === 'function') saveData();
                        toggleCommentField?.();
                        toggleDescriptionField?.();
                    }
                });

                listElement.appendChild(li);
            });
        }

        window.openUniversalModal = async function
            ({
                 endpoint, param, inputFieldId, hiddenFieldId,
                 isMultiple = false, title = 'Выберите элемент'
             }) {
            inputId = inputFieldId;
            hiddenId = hiddenFieldId;
            multiple = isMultiple;
            selected = new Map();
            originalData = [];
            modalElement.querySelector('.modal-title').textContent = title;
            searchInput.value = '';
            listElement.innerHTML = '';
            errorBlock.classList.add('d-none');
            loadingIndicator.classList.remove('d-none');
            footer.classList.toggle('d-none', !multiple);

            if (multiple) {
                try {
                    const raw = document.getElementById(hiddenId).value;
                    const parsed = JSON.parse(raw || '[]');
                    parsed.forEach(e => e?.name && selected.set(e.name, e));
                } catch (e) {
                    console.warn('Ошибка парсинга выбранных значений:', e);
                }
            }

            try {
                const url = new URL('/api/' + endpoint, window.location.origin);
                url.searchParams.append('param', param || '');
                const response = await fetch(url);
                const data = await response.json();
                originalData = Array.isArray(data) ? data : [];

                if (originalData.length > 5) {
                    searchInput.classList.add('visible');
                } else {
                    searchInput.classList.remove('visible');
                }

                renderList(originalData);
            } catch (e) {
                console.error('Ошибка загрузки данных:', e);
                errorBlock.classList.remove('d-none');
            } finally {
                loadingIndicator.classList.add('d-none');
                modal.show();
            }
        };

        saveBtn.addEventListener('click', () => {
            const arr = Array.from(selected.values());
            document.getElementById(inputId).value = arr.map(e => e.name).join(', ');
            document.getElementById(hiddenId).value = JSON.stringify(arr);
            modal.hide();
            if (typeof saveData === 'function') saveData();
        });
    })();
</script>
<script> document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.openModal').forEach(button => {
            button.addEventListener('click', () => {
                const endpoint = button.dataset.endpoint;
                const inputId = button.dataset.inputId;
                const hiddenId = button.dataset.hiddenEntity;
                const param = button.dataset.param || '';
                const isMultiple = button.dataset.multiple === 'true';
                const title = button.dataset.title || 'Выберите элемент';
                openUniversalModal({
                    endpoint,
                    param,
                    inputFieldId: inputId,
                    hiddenFieldId: hiddenId,
                    isMultiple,
                    title
                });
            });
        });
    });
</script>
</body>
</html>
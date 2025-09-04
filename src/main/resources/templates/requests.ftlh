<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Заявка на вызов</title>
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/stylesBid.css">
    <script src="/js/bootstrap.bundle.js"></script>
    <script>const bidType = "${type}";
        const viewForm = <#if viewForm??>${viewForm?c}<#else>false</#if>;
    </script>
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
                    <input type="text" id="mlmNodeName" class="form-control" placeholder="Цех" value="${mlmNodeEmployee.getName()}" required>
                    <input type="hidden" id="mlmNodeJson" name="mlmNodeJson" value="${mlmNodeEmployee}">
<#--                    <button type="button" class="btn btn-outline-primary openModal"-->
<#--                            data-endpoint="mlm-node"-->
<#--                            data-input-id="mlmNodeName"-->
<#--                            data-hidden-entity="mlmNodeJson"-->
<#--                            data-modal-id="mlmNodeModal">-->
<#--                        Выбрать-->
<#--                    </button>-->
                </div>
            </div>

            <!-- ПОЛЕ ОБОЗНАЧЕНИЕ/НАИМЕНОВАНИЕ-->
            <div class="mb-3" id="titleJsonId">
                <label for="titleJson" class="form-label">Обозначение/Наименование</label>
                <input type="text" id="titleJson" name="titleJson" class="form-control"
                       placeholder="Обозначение/Наименование" required>
            </div>

            <!-- ТМЦ -->
            <div class="mb-3">
                <label class="form-label">Тип ТМЦ</label>
                <div class="input-group">
                    <input type="text" id="itemName" class="form-control" placeholder="ТМЦ">
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
                    <label for="qty" class="form-label">Количество деталей к контролю</label>
                    <#if mlmNodeEmployee.getName() == 'Цех №1'>
                    <input type="text" id="qty" name="qty" class="form-control" >
                    <#else >
                    <input type="text" id="qty" name="qty" class="form-control" required>
                    </#if>
                </div>
            </#if>

            <!-- Тип контроля -->
            <#if type == 'otk'>
                <div class="mb-3" id="divControlId">
                    <label for="control" class="form-label" >Тип контроля</label>
                    <#if mlmNodeEmployee.getName() == 'Цех №1'>
                        <select id="control" name="control" class="form-select">
                            <option value="">Выберите тип контроля</option>
                            <option value="ВИК" selected>ВИК</option>
                            <option value="ЛНК">ЛНК</option>
                        </select>
                    <#else >
                        <select id="control" name="control" class="form-select" required>
                            <option value="">Выберите тип контроля</option>
                            <option value="ВИК">ВИК</option>
                            <option value="ЛНК">ЛНК</option>
                        </select>
                    </#if>
                    <input type="hidden" id="hiddenСontrol" class="form-control">
                </div>
            </#if>

            <!-- Заказ клиента -->
            <div class="mb-3" id="divCustomerId">
                <label class="form-label">Заказ клиента</label>
                <div class="input-group">
                    <#if mlmNodeEmployee.getName() == 'Цех №1'>
                        <input type="text" id="customerOrderString" name="customerOrderString" class="form-control"
                               placeholder="Номер заказа" >
                        <#else >
                            <input type="text" id="customerOrderString" name="customerOrderString" class="form-control"
                                   placeholder="Номер заказа" required>
                            </#if>

                    <input type="hidden" id="customerOrderJson" name="customerOrderJson">
                    <button type="button" class="btn btn-outline-primary openModal"
                            data-endpoint="customer-orders"
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
                <div class="mb-3" id="divReasonsId">
                    <label for="reasonsJson" class="form-label">Причина</label>
                    <input type="text" id="reasonsJson" name="reasonsJson" class="form-control"
                           placeholder="Причина">
                </div>
            </#if>

            <!-- Комментарий -->
            <div class="mb-3" id="divCommentId">
                <label for="comment" class="form-label">Комментарий</label>
                <textarea class="form-control" id="comment" name="comment" rows="4"
                          placeholder="Введите комментарий"></textarea>
            </div>

            <!-- Фото -->
            <div class="mb-3">
                <label for="additionalFiles" class="form-label">Загрузить фотографии или сделать фото</label>
                <input type="file" id="additionalFiles" name="additionalFiles" accept="image/*" multiple capture="environment"
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

        <!-- Информация -->
        <div class="card mb-4">
            <#if bid.getStatus().getName() == 'Новый'>
            <div class="card-header bg-secondary text-white">
                Информация
            </div>
                <#elseif bid.getStatus().getName() == 'В работе'>
                    <div class="card-header bg-warning text-white">
                        Информация
                    </div>
                <#elseif bid.getStatus().getName() == 'Забракована'>
                <div class="card-header bg-danger text-white">
                    Информация
                </div>
                <#elseif bid.getStatus().getName() == 'Закрыт'>
                <div class="card-header btn-success text-white">
                    Информация
                </div>
            </#if>
            <div class="card-body">
                <#if bid.getStatus().getName() == 'Новый'>
                    <p class="card-header fs-5 fw-bold bg-secondary text-center text-white">Заявка №${bid.requestNumber}</p>
                <#elseif bid.getStatus().getName() == 'В работе'>
                    <p class="card-header fs-5 fw-bold bg-warning text-center text-white">Заявка №${bid.requestNumber}</p>
                <#elseif bid.getStatus().getName() == 'Забракована'>
                    <p class="card-header fs-5 fw-bold bg-danger text-center text-white">Заявка №${bid.requestNumber}</p>
                <#elseif bid.getStatus().getName() == 'Закрыта'>
                    <p class="card-header fs-5 fw-bold btn-success text-center text-white">Заявка №${bid.requestNumber}</p>
                </#if>
                <#if bid.status.getName() != "Новый">
                    <p class="mb-2 m-lg-2"><strong>Ответственный:</strong> ${(bid.getEmployee().getName())!""}</p>
                </#if>
                <p class="mt-2 mb-2 m-lg-2"><strong>Дата создания:</strong> ${(date)!""}</p>
                <p class="mb-2 m-lg-2"><strong>Цех:</strong> ${(bid.mlmNode.getName())!""}</p>
                <p class="mb-2 m-lg-2"><strong>Тип ТМЦ:</strong> ${(bid.item.getName())!"Не указан"}</p>
                <p class="mb-2 m-lg-2"><strong>Заказ клиента:</strong> ${(bid.customerOrder.getName())!"Не указан"}</p>
                <p class="mb-2 m-lg-2"><strong>Обозначение/Наименование:</strong> ${(bid.getTitle())!"Не указан"}</p>
                <#if bid.typeRequest == 'otk'>
                    <p class="mb-2 m-lg-2"><strong>Тип контроля:</strong> ${(bid.getControl())!"ВИК"}</p>
                    <p class="mb-2 m-lg-2"><strong>Количество деталей к контролю:</strong> ${(bid.qty)!0}</p>
                    <p class="mb-2 m-lg-2"><strong>Причина:</strong> ${(bid.getReason_wr())!"Не указана"}</p>
                    <p class="mb-2 m-lg-2"><strong>Дефект:</strong> ${(bid.getCommentAgreed())!"Не указан"}</p>
                    <#else >
                        <p class="mb-2 m-lg-2"><strong>Причина:</strong> ${(bid.reason.getName())!"Не указана"}</p>
                </#if>
                <#if bid.status.getName() == "В работе">
                <p class="mb-2 m-lg-2"><strong>Комментарий:</strong>
                    <textarea class="form-control"
                              id="comment"
                              name="comment"
                              rows="5"
                              style="resize: both;"
                              readonly>${bid.comment!''}</textarea>
                </#if>
            </div>
        </div>

        <div class="d-flex justify-content-between">
            <a href="/requestslist/${type}" class="btn btn-outline-secondary d-none d-md-block mb-3">Перейти в список</a>
            <#if bid.getQtyRejected() = 0>
                <a class="btn btn-outline-secondary mb-3">Количество брака заявки: ${(bid.getQtyRejected())!0}</a>
                <#else>
                    <a class="btn btn-danger mb-3">Количество брака заявки: ${(bid.getQtyRejected())!0}</a>
            </#if>

        </div>


        <!-- Редактирование -->
        <div class="card mb-4">
            <#if bid.getStatus().getName() == 'Новый'>
                <div class="card-header bg-secondary text-white">
                    Редактирование
                </div>
            <#elseif bid.getStatus().getName() == 'В работе'>
                <div class="card-header bg-warning text-white">
                    Редактирование
                </div>
            <#elseif bid.getStatus().getName() == 'Забракована'>
                <div class="card-header bg-danger text-white">
                    Редактирование
                </div>
            <#elseif bid.getStatus().getName() == 'Закрыт'>
                <div class="card-header btn-success text-white">
                    Редактирование
                </div>
            </#if>
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
                    <div>
                        <button type="button"
                                class="btn btn-success mb-3 work"
                                id="workId"
                                data-param="${bid.getId()}">
                            Взять в работу
                        </button>
<#--                        <button type="button"-->
<#--                                class="btn btn-danger ms-3 mb-3 work"-->
<#--                                id="pauseId"-->
<#--                                data-bs-toggle="modal"-->
<#--                                data-bs-target="#pauseModal"-->
<#--                        >Перенести заявку-->
<#--                        </button>-->
                    </div>
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
                            data-status="true"
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

                <#elseif role != ('MASTER') && bid.getStatus().getName() == 'Выполнен'>
                    <p class="text-success fs-3 fw-bold">Решение отправлено</p>
                </#if>

                <#if bid.getStatus().getName() == 'Закрыт'>
                    <p class="text-success fs-3 fw-bold">Заявка закрыта!</p>
                </#if>

                <#if bid.getStatus().getName() == 'Забракована'>
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

                    <#if role == 'MASTER'>
                        <button type="button"
                                class="btn btn-success mt-3 work"
                                id="canceledBtn"
                                data-param="${bid.getId()}"
                                data-status="false"
                        >Отправить повторно</button>
                    </#if>

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
                                        data-endpoint="request/in-work"
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
                                    <label for="inconsistencyName" class="mb-3">Несоответствия:</label>
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
                                        data-endpoint="request/in-work"
                                        data-param="${bid.getId()}"
                                        data-description="${bid.getDescription()!""}"
                                >
                                    Сохранить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <#if ((bid.status.getName() == "Новый" || bid.status.getName() == "Выполнен") && role == "MASTER")>
                    <div class="mb-1 mt-2">
                        <label for="comment" class="form-label">Комментарий:</label>
                        <textarea class="form-control work"
                                  id="comment"
                                  name="comment"
                                  rows="5"
                                  style="resize: both;">${bid.comment!''}</textarea>
                    </div>
                </#if>
                <#if bid.status.getName() == "В работе" && role == "OTK">
                    <div class="mb-1 mt-2">
                        <button class="btn btn-outline-secondary" id="openOtkId" type="button">Комментарий для детали которая пропущена с дефектами  ↓</button>
                        <textarea class="form-control mt-2"
                                  id="commentOtk"
                                  name="commentAgreed"
                                  rows="5"
                                  style="resize: both; display: none">${bid.commentAgreed!''}</textarea>
                    </div>
                    <button class="btn btn-success" id="commentOtkId"
                            style="display: none"
                            data-param="${bid.getId()}"
                            data-comment="${bid.getCommentAgreed()!""}">
                        Сохранить комментарий
                    </button>
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
            <button class="btn btn-outline-secondary"
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

<#--<div class="modal fade" id="pauseModal" tabindex="-1" aria-labelledby="pauseModalLabel" aria-hidden="true">-->
<#--    <div class="modal-dialog modal-dialog-centered modal-lg custom-modal-width">-->
<#--        <div class="modal-content">-->
<#--            <div class="modal-header">-->
<#--                <h5 class="modal-title" id="pauseModalLabel">Перевод заявки в статус паузы</h5>-->
<#--                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>-->
<#--            </div>-->
<#--            <div class="modal-body">-->
<#--                <div class="mb-3">-->
<#--                    <label for="pauseReason" class="form-label">Причина остановки заявки</label>-->
<#--                    <textarea id="pauseReason" class="form-control" rows="3" placeholder="Введите причину остановки заявки"></textarea>-->
<#--                </div>-->
<#--                <div class="row">-->
<#--                    <div class="col">-->
<#--                        <label for="start-time" class="form-label">От</label>-->
<#--                        <input type="time" value="${time}" class="form-control" id="start-time">-->
<#--                    </div>-->
<#--                    <div class="col">-->
<#--                        <label for="end-time" class="form-label">До</label>-->
<#--                        <input type="time" class="form-control" id="end-time">-->
<#--                    </div>-->
<#--                </div>-->
<#--            </div>-->
<#--            <div class="modal-footer" id="modalFooter">-->
<#--                <button type="button" class="btn btn-primary" value=${bid.getId()} id="pauseModalSaveBtn">Сохранить</button>-->
<#--            </div>-->
<#--        </div>-->
<#--    </div>-->
<#--</div>-->

<div class="modal fade" id="photoModal" tabindex="-1" aria-labelledby="photoModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg custom-modal-width">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="photoModalLabel">Прикрепленные фото</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
            </div>
            <div class="modal-body">
                <div id="photoContainer" class="d-flex flex-wrap gap-3"></div>
                <#if role?? && role == "OTK">
                    <input type="file" id="photoInput" accept="image/*" multiple style="display: none;">
                <#else>
                    <input type="file" id="photoInput" accept="image/*" multiple capture="environment" style="display: none;">
                </#if>
                <img id="fullPhoto" src="" style="max-width:100%; max-height:80vh; margin-top:10px; display: none">
            </div>
            <div class="modal-footer">
                <button type="button" id="addPhotoBtn" class="btn btn-primary">Добавить фото</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade " id="universalModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Выберите элемент</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
            </div>
            <div class="modal-body">
                <input type="text" class="form-control mb-2" id="modalSearchInput"  placeholder="Поиск..." >
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
</body>
</html>
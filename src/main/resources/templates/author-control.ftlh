<!doctype html>
<html lang="ru" xmlns="http://www.w3.org/1999/html">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Авторский надзор</title>
    <link href="/css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <style>
        .fab {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            justify-content: center;
            gap: 20px;
            z-index: 1050;
        }

        .fab .btn {
            border-radius: 50%;
            width: 48px;
            height: 48px;
            padding: 0;
            font-size: 1.2rem;
        }

        .status-label {
            font-size: 1rem;
            text-align: center;
        }

        .status-buttons-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px 15px;
            margin-top: 20px;
        }

        .status-button {
            text-align: center;
        }

        .status-button button {
            min-width: 120px;
            padding: 10px 15px;
            font-size: 1rem;
            white-space: nowrap;
        }
    </style>
</head>
<body>
<div class="container mt-3">
    <h4 class="text-center">Авторский надзор №: AАН-0${authorControl.getId()}</h4>

    <div class="status-buttons-container flex-wrap">
        <div class="status-button">
            <button id="btn_new" value="${authorControl.getStatusAuthor().getName()}" class="btn btn-outline-secondary"
                    onclick="return checkStatusBeforeUpdate('Новый')"
                    data-bs-toggle="modal" data-bs-target="#exampleModalNew">Новый
            </button>
        </div>
        <div class="status-button">
            <button id="btn_waiting" value="${authorControl.getStatusAuthor().getName()}"
                    class="btn btn-outline-warning"
                    onclick="return checkStatusBeforeUpdate('Ожидает устранения')" data-bs-toggle="modal"
                    data-bs-target="#exampleModalAwaits">Ожидает устранения
            </button>
        </div>
        <div class="status-button">
            <button id="btn_agreement" value="${authorControl.getStatusAuthor().getName()}" class="btn btn-outline-info"
                    onclick="return checkStatusBeforeUpdate('На согласовании')"
                    data-bs-toggle="modal" data-bs-target="#exampleModalToBeAgreed">На согласовании
            </button>
        </div>
        <div class="status-button">
            <button id="btn_not_agreed" value="${authorControl.getStatusAuthor().getName()}"
                    class="btn btn-outline-danger"
                    onclick="return checkStatusBeforeUpdate('Не согласовано')"
                    data-bs-toggle="modal" data-bs-target="#exampleModalNotAgreed">Не согласовано
            </button>
        </div>
        <div class="status-button">
            <button id="btn_agreed" value="${authorControl.getStatusAuthor().getName()}" class="btn btn-outline-success"
                    onclick="return checkStatusBeforeUpdate('Согласовано')"
                    data-bs-toggle="modal" data-bs-target="#exampleModalAgreed">Согласовано
            </button>
        </div>
    </div>
    <div class="row g-3 mb-3">
        <div class="col-12">
            <strong>Площадка изготовитель:</strong> ${authorControl.getSite().getName()}
        </div>
        <div class="col-12">
            <strong>Наличие несоответствий:</strong> ${authorControl.getInconsistency()?string("Да","Нет")}
        </div>
        <div class="col-12">
            <strong>Зав. номер:</strong> ${authorControl.getSiteCode()}
        </div>
        <div class="col-12">
            <strong>Заказ №:</strong> ${authorControl.getCustomerOrderStrCode()}
        </div>
        <div class="col-12">
            <strong>Конструктор:</strong> ${authorControl.getEmployee().getName()}
        </div>
        <div class="col-12">
            <strong>Виновник:</strong> ${authorControl.getSubDivision().getName()}
        </div>
        <div class="col-12">
            <strong>Статус:</strong> ${authorControl.getStatusAuthor().getName()}
        </div>
        <div class="col-12">
            <strong>Дата создания:</strong> ${authorControl.getCreatedAt()}
        </div>
        <div class="col-12">
            <strong>Комментарии:</strong>
        </div>
    </div>
    <div class="fab">
        <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModalDiviations"><i
                    class="bi bi-plus"></i></button>
        <button id="exportWordBtn" value="${authorControl.getId()}" class="btn btn-outline-primary"><i
                    class="bi bi-file-earmark-word"></i></button>
        <button onclick="window.location.href='/view/author-control'" class="btn btn-secondary"><i
                    class="bi bi-arrow-left"></i></button>
        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModalDelete"><i
                    class="bi bi-trash"></i></button>
        <a href="/control/712/all-images" class="btn btn-primary btn-sm">
            <i class="bi bi-card-image"></i>
        </a>
        <button type="button" class="btn btn-secondary btn-sm" onclick="openAnnullingModal(712)"
                title="Аннулировать запись">
            <i class="bi bi-slash-circle"></i>
        </button>
    </div>
    <#list authorControl.getAuthorControls() as authors>
        <#assign devId = authors.getId() />
        <div class="mb-5">
            <div class="card mb-3 shadow-sm">
                <div class="card-body">
                    <h6 class="card-title">Отклонение ${authors.getDeviationNumber()}</h6>
                    <h6 class="card-title"><strong>Изделие / чертёж:</strong> ${authors.getItemName()}</h6>
                    <p class="card-text"><strong>Несоответствие:</strong> ${authors.getInconsistency()}</p>
                    <p class="card-text">
                        <strong>Виновник:</strong> ${(authors.getSubDivisionDto().getName())!"Отсутствует"}
                    </p>
                    <p class="card-text">
                        <strong>Срок устранения:</strong>
                        ${authors.getPeriodRemoval()}
                        <button class="btn btn-outline-primary btn-sm ms-2"
                                data-bs-toggle="modal"
                                data-bs-target="#editTargetDateModal_${devId}"
                                title="Редактировать срок устранения">
                            <i class="bi bi-calendar-event"></i>
                        </button>
                    </p>
                    <p class="card-text">
                        <strong>Дата устранения:</strong>
                        ${(authors.getDateRemoval())!"-"}
                    </p>
                    <p class="card-text">
                        <strong>Комментарий:</strong>
                        ${(authors.getDescription())!"-"}
                    </p>

                    <div class="d-flex flex-wrap align-items-center gap-2">
                        <a href="/control/deviation/${devId}/images" class="btn btn-info btn-sm">
                            <i class="bi bi-card-image"></i>
                        </a>

                        <button class="btn btn-success btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target="#uploadFixImageModal_${devId}"
                                title="Загрузить фото исправления">
                            <i class="bi bi-upload"></i> Fix
                        </button>

                        <a href="/control/deviation/${devId}/fix-photo" class="btn btn-warning btn-sm"
                           title="Просмотреть фото исправлений">
                            <i class="bi bi-images"></i> Fix фото
                        </a>

                        <button class="btn btn-success btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target="#editDateModal_${devId}"
                                title="Редактировать дату устранения">
                            <i class="bi bi-calendar-event"></i>
                        </button>

                        <button class="btn btn-primary btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target="#editModal_${devId}">
                            <i class="bi bi-pencil"></i>
                        </button>

                        <button type="button" class="btn btn-danger btn-sm"
                                onclick="return deleteAuthorControlDeviation(${devId})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="editDateModal_${devId}"
                 tabindex="-1" aria-labelledby="editModalLabel_${devId}"
                 aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editModalLabel_${devId}">
                                Редактировать дату устранения
                            </h5>
                            <button type="button" class="btn-close"
                                    data-bs-dismiss="modal" aria-label="Закрыть"></button>
                        </div>
                        <div class="modal-body">
                            <label for="fixDate_${devId}" class="form-label">Дата устранения:</label>
                            <input type="date" class="form-control"
                                   id="fixDate_${devId}"
                                   value="${authors.getDateRemoval()!}"
                                   required="">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary"
                                    onclick="saveDate(${devId})">
                                Сохранить
                            </button>
                            <button type="button" class="btn btn-secondary"
                                    data-bs-dismiss="modal">Отмена
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="uploadFixImageModal_${devId}"
                 tabindex="-1" aria-labelledby="uploadFixImageLabel_${devId}"
                 aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="uploadFixImageLabel_${devId}">
                                Загрузка изображения исправления
                            </h5>
                            <button type="button" class="btn-close"
                                    data-bs-dismiss="modal" aria-label="Закрыть"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Файлы</label>
                                <input type="file" class="form-control mb-1"
                                       id="additionalDeviationFilesId_${devId}"
                                       multiple name="additionalFilesCorrections">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary"
                                    onclick="saveDeviationImages(${devId})">
                                Загрузить
                            </button>
                            <button type="button" class="btn btn-secondary"
                                    data-bs-dismiss="modal">Отмена
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="editTargetDateModal_${devId}"
                 tabindex="-1" aria-labelledby="editTargetDateLabel_${devId}"
                 aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editTargetDateLabel_${devId}">
                                Редактировать срок устранения
                            </h5>
                            <button type="button" class="btn-close"
                                    data-bs-dismiss="modal" aria-label="Закрыть"></button>
                        </div>
                        <div class="modal-body">
                            <label for="date_${devId}" class="form-label">Срок устранения:</label>
                            <input type="date" class="form-control"
                                   id="date_${devId}"
                                   value="${authors.getPeriodRemoval()!}"
                                   required="">
                            <label for="comment_${devId}" class="form-label mt-3">Комментарий:</label>
                            <textarea class="form-control" id="comment_${devId}"></textarea>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary"
                                    onclick="savePeriodRemoval(${devId})">
                                Сохранить
                            </button>
                            <button type="button" class="btn btn-secondary"
                                    data-bs-dismiss="modal">Отмена
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="editModal_${devId}"
                 tabindex="-1" aria-labelledby="editModalLabel_${devId}"
                 aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="editModalLabel_867">Редактирование отклонения</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                                    aria-label="Закрыть"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Изделие / чертёж</label>
                                <input type="text" name="itemBom" class="form-control"
                                       value="${authors.getItemName()}" id="updateItemId_${devId}" required="">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Несоответствие</label>
                                <input type="text" name="deviation" class="form-control"
                                       value="${authors.getInconsistency()}" placeholder="${authors.getInconsistency()}" id="updateInconsistencyId_${devId}" required="">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Срок устранения</label>
                                <input type="date" name="date" class="form-control" id="updatePeriodRemovalId_${devId}" value="${authors.getPeriodRemoval()}">
                            </div>
                            <div class="form-check mb-3">
                                <input type="checkbox" name="success" class="form-check-input" id="successCheck_${devId}"
                                       checked="">
                                <label class="form-check-label" for="successCheck_${devId}">Успешно</label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                            <button type="submit" class="btn btn-primary" onclick="updateDeviation(${authors.getId()})">Сохранить</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </#list>
</div>
<div class="modal fade" id="exampleModalDiviations" tabindex="-1" aria-labelledby="exampleModalDiviationTitle"
     style="display: none;" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen-sm-down modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header bg-success text-white">
                <h5 class="modal-title" id="exampleLable">Новое отклонение</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Закрыть"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label">Изделие / чертёж</label>
                    <input type="text" name="itemBom" id="itemBomId" class="form-control" required="">
                </div>
                <div class="mb-3">
                    <label class="form-label">Несоответствие</label>
                    <textarea name="deviation" id="inconsistenciesId" class="form-control" rows="4"
                              style="resize: vertical;"
                              required=""></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Виновник</label>
                    <select name="subDivision" id="subDivisionId" class="form-select mb-2">
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Срок устранения</label>
                    <input type="date" name="date" id="dateId" class="form-control">
                </div>
                <div class="mb-3">
                    <label class="form-label">Файлы</label>
                    <input type="file" class="form-control mb-1" id="additionalFilesId" multiple name="additionalFiles">
                </div>
                <div class="form-check mb-3">
                    <input type="checkbox" name="success" class="form-check-input" id="successCheck">
                    <label class="form-check-label" for="successCheck">Успешно</label>
                </div>
                <div>
                    <input type="hidden" name="authorControl" id="authorControlId" value="${authorControl.getId()}">
                </div>
            </div>
            <div class="modal-footer d-flex justify-content-between">
                <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
                <button class="btn btn-success" id="saveId">Добавить</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="exampleModalDelete" tabindex="-1" aria-labelledby="exampleModalDeleteTitle"
     style="display: none;" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen-sm-down modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="exampleModalDeleteTitle">Удаление</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Закрыть"></button>
            </div>
            <div class="modal-body text-center">
                <p>Вы уверены, что хотите удалить запись?</p>
            </div>
            <div class="modal-footer d-flex justify-content-between">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                <button type="submit" class="btn btn-danger" id="deleteButtonId" value="${authorControl.getId()}">
                    Удалить
                </button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="annullingModal" tabindex="-1" aria-labelledby="annullingModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="annullingModalLabel">Аннулирование акта</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="tokenInput" class="form-label">Введите токен</label>
                    <input type="password" class="form-control" id="tokenInput" placeholder="Токен">
                </div>
                <div class="mb-3">
                    <label for="commentsInputAnnul" class="form-label">Комментарий</label>
                    <textarea class="form-control" id="commentsInputAnnul" rows="3"
                              placeholder="Комментарий"></textarea>
                </div>
                <div id="tokenError" class="text-danger" style="display:none;">Неверный токен</div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                <button type="button" id="confirmAnnullingBtn" class="btn btn-danger">Аннулировать</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="exampleModalDiviations" tabindex="-1" aria-labelledby="exampleModalDiviationTitle"
     aria-hidden="true">
    <div class="modal-dialog modal-fullscreen-sm-down modal-dialog-centered" role="document">
        <div class="modal-content">
            <form action="/control/712/add-deviation" method="post" enctype="multipart/form-data">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title" id="exampleLable">Новое отклонение</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Закрыть"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Изделие / чертёж</label>
                        <input type="text" name="itemBom" class="form-control" required="">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Несоответствие</label>
                        <textarea name="deviation" class="form-control" rows="4" style="resize: vertical;"
                                  required=""></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Виновник</label>
                        <!--<input type="text" name="vinovnik" class="form-control">-->
                        <select name="vinovnik" class="form-select mb-2">
                            <option value="Отсутствует">Отсутствует</option>
                            <option value="ОГК">ОГК</option>
                            <option value="ОГТ">ОГТ</option>
                            <option value="ОГС">ОГС</option>
                            <option value="ОМТС">ОМТС</option>
                            <option value="Цех №1">Цех №1</option>
                            <option value="Цех №2">Цех №2</option>
                            <option value="Цех №3">Цех №3</option>
                            <option value="Цех №4">Цех №4</option>
                            <option value="Цех №5">Цех №5</option>
                            <option value="Цех №6">Цех №6</option>
                            <option value="Цех №7">Цех №7</option>
                            <option value="Цех №8">Цех №8</option>
                            <option value="ОТК">ОТК</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Срок устранения</label>
                        <input type="date" name="date" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Файлы</label>
                        <input type="file" class="form-control mb-1" name="file1">
                        <input type="file" class="form-control mb-1" name="file2">
                        <input type="file" class="form-control" name="file3">
                    </div>
                    <div class="form-check mb-3">
                        <input type="checkbox" name="success" class="form-check-input" id="successCheck">
                        <label class="form-check-label" for="successCheck">Успешно</label>
                    </div>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
                    <button type="submit" class="btn btn-success">Добавить</button>
                </div>
            </form>
        </div>
    </div>
</div>
<div class="modal fade" id="exampleModalDelete" tabindex="-1" aria-labelledby="exampleModalDeleteTitle"
     aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
            <form action="/control/delete/712" method="post">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title" id="exampleModalDeleteTitle">Удаление</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Закрыть"></button>
                </div>
                <div class="modal-body text-center">
                    <p>Вы уверены, что хотите удалить запись?</p>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                    <button type="submit" class="btn btn-danger">Удалить</button>
                </div>
            </form>
        </div>
    </div>
</div>
<div class="modal fade" id="exampleModalNew" tabindex="-1" aria-labelledby="exampleModalNewTitle" aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header bg-secondary text-white">
                <h5 class="modal-title" id="exampleModalDeleteTitle">Новый</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Закрыть"></button>
            </div>
            <div class="modal-body text-center">
                <p>Перевести статус на новый?</p>
            </div>
            <div class="modal-footer d-flex justify-content-between">
                <button type="button" class="btn btn-outline-secondary active"
                        onclick="updateStatus('NEW',${authorControl.getId()})">Новый
                </button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="exampleModalAwaits" tabindex="-1" aria-labelledby="exampleModalAwaitsTitle"
     aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header bg-secondary text-white">
                <h5 class="modal-title" id="exampleModalDeleteTitle">Ожидает устранения</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Закрыть"></button>
            </div>
            <div class="modal-body text-center">
                <p>Перевести статус на Ожидает устранения?</p>
            </div>
            <div class="modal-footer d-flex justify-content-between">
                <button type="button" class="btn btn-outline-warning "
                        onclick="updateStatus('AWAITING_FIX', ${authorControl.getId()})">Ожидает устранения
                </button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="exampleModalToBeAgreed" tabindex="-1" aria-labelledby="exampleModalToBeAgreedTitle"
     aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header bg-secondary text-white">
                <h5 class="modal-title" id="exampleModalDeleteTitle">На согласовании</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Закрыть"></button>
            </div>
            <div class="modal-body text-center">
                <p>Перевести на статус согласование?</p>
            </div>
            <div class="modal-footer d-flex justify-content-between">
                <button type="button" class="btn btn-outline-info "
                        onclick="updateStatus('PENDING_APPROVAL',${authorControl.getId()})">
                    На согласовании
                </button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="exampleModalNotAgreed" tabindex="-1" aria-labelledby="exampleModalNotAgreedTitle"
     aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header bg-secondary text-white">
                <h5 class="modal-title" id="exampleModalDeleteTitle">Не согласовано</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Закрыть"></button>
            </div>
            <div class="modal-body text-center">
                <p>Перевести на статус не согласовано?</p>
            </div>
            <div class="modal-footer d-flex justify-content-between">
                <button type="button" class="btn btn-outline-danger "
                        onclick="updateStatus('NOT_APPROVED',${authorControl.getId()})">
                    Не согласовано
                </button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="exampleModalAgreed" tabindex="-1" aria-labelledby="exampleModalAgreedTitle"
     aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header bg-secondary text-white">
                <h5 class="modal-title" id="exampleModalDeleteTitle">Согласовано</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Закрыть"></button>
            </div>
            <div class="modal-body text-center">
                <p>Перевести статус на согласовано?</p>
            </div>
            <div class="modal-footer d-flex justify-content-between">
                <button type="button" class="btn btn-outline-success "
                        onclick="updateStatus('APPROVED',${authorControl.getId()})">
                    Согласовано
                </button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="exampleModalAgreed" tabindex="-1" aria-labelledby="exampleModalAgreedTitle"
     aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header bg-secondary text-white">
                <h5 class="modal-title" id="exampleModalDeleteTitle">Cогласовано</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Закрыть"></button>
            </div>
            <div class="modal-body text-center">
                <p>Перевести на статус согласовано?</p>
            </div>
            <div class="modal-footer d-flex justify-content-between">
                <button type="button" class="btn btn-outline-success " onclick="updateStatus('Согласовано')">
                    Согласовано
                </button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="exampleModalKey" tabindex="-1" aria-labelledby="exampleModalKeyTitle" aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header bg-secondary text-white">
                <h5 class="modal-title" id="exampleModalDeleteTitle">Cогласовано</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Закрыть"></button>
            </div>
            <div class="modal-body text-center">
                <p>Введите TOKEN пользователя</p>
                <input type="password" class="form-control mb-3" id="userToken" placeholder="Введите токен">
            </div>
            <div class="modal-footer d-flex justify-content-between">
                <button type="button" class="btn btn-outline-success" onclick="checkTokenAndApprove()">ОК</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="exampleModalKey1" tabindex="-1" aria-labelledby="exampleModalKeyTitle" aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header bg-secondary text-white">
                <h5 class="modal-title" id="exampleModalDeleteTitle">Не согласовано</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Закрыть"></button>
            </div>
            <div class="modal-body text-center">
                <p>Введите TOKEN пользователя</p>
                <input type="password" class="form-control mb-3" id="userToken1" placeholder="Введите токен">
            </div>
            <div class="modal-footer d-flex justify-content-between">
                <button type="button" class="btn btn-outline-success" onclick="checkTokenAndApprove1()">ОК</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="exampleModalKT" tabindex="-1" aria-labelledby="exampleModalKTTitle" aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header bg-secondary text-white">
                <h5 class="modal-title" id="exampleModalDeleteTitle">Удаление АКТА</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Закрыть"></button>
            </div>
            <div class="modal-body text-center">
                <p>Введите TOKEN пользователя</p>
                <input type="password" class="form-control mb-3" id="userT" placeholder="Введите токен">
            </div>
            <div class="modal-footer d-flex justify-content-between">
                <button type="button" class="btn btn-outline-success" onclick="checkT()">ОК</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="exampleModalKey2" tabindex="-1" aria-labelledby="exampleModalKey2Title" aria-hidden="true"
     data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header bg-secondary text-white">
                <h5 class="modal-title" id="exampleModalKey2Title">Подтверждение</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Закрыть"></button>
            </div>
            <div class="modal-body text-center">
                <p>Введите TOKEN пользователя</p>
                <input type="password" class="form-control mb-3" id="userToken2" placeholder="Введите токен">
            </div>
            <div class="modal-footer d-flex justify-content-between">
                <button type="button" class="btn btn-outline-success" onclick="checkTokenAndApprove2()">ОК</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="annullingModal" tabindex="-1" aria-labelledby="annullingModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="annullingModalLabel">Аннулирование акта</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="tokenInput" class="form-label">Введите токен</label>
                    <input type="password" class="form-control" id="tokenInput" placeholder="Токен">
                </div>
                <div class="mb-3">
                    <label for="commentsInputAnnul" class="form-label">Комментарий</label>
                    <textarea class="form-control" id="commentsInputAnnul" rows="3"
                              placeholder="Комментарий"></textarea>
                </div>
                <div id="tokenError" class="text-danger" style="display:none;">Неверный токен</div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                <button type="button" id="confirmAnnullingBtn" class="btn btn-danger">Аннулировать</button>
            </div>
        </div>
    </div>
</div>
<script src="/js/bootstrap/bootstrap.bundle.min.js"></script>
<script src="/js/author-control.js"></script>
</body>
</html>
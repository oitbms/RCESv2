<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Список заявок для конструкторов</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <style>
        body {
            background-color: #f0f0f0; /* Серый цвет фона */
        }
    </style>
    <style>
        th {
            border: 1px solid #000; /* Черная граница */
            padding: 8px; /* Отступы внутри ячейки */
            vertical-align: top; /* Выравнивание по верхнему краю */
        }
    </style>
    <style>
        .form-control {
            border: 1px solid #000; /* Черная граница */
            text-align: center; /* Выравнивание текста по центру */
        }
    </style>
    <style>
        th {
            text-align: center; /* Центрируем текст в заголовках */
            width: 12.5%; /* Устанавливаем фиксированную ширину для всех заголовков */
        }

        input.form-control {
            width: 100%; /* Поля ввода занимают 100% ширины ячейки */
            box-sizing: border-box; /* Учитываем отступы и границы в ширине */
        }
    </style>
</head>
<body>
<h1 class="text-center">Список заявок</h1>

<div class="container">
<table  class="table table-bordered" id="requestTable">
    <thead>
    <tr>
        <th>
            Мастер
            <input type="text" class="form-control" id="filterMaster" placeholder="" style="margin-top: 5px;">
        </th>
        <th>
            Цех
            <input type="text" class="form-control" id="workShop" placeholder="" style="margin-top: 5px;">
        </th>
        <th>
            Причина вызова
            <input type="text" class="form-control" id="reason" placeholder="" style="margin-top: 5px;">
        </th>
        <th>
            Статус
            <input type="text" class="form-control" id="status" placeholder="" style="margin-top: 5px;">
        </th>
        <th>
            Дата создания Заявки
            <input type="text" class="form-control" id="dateStart" placeholder="" style="margin-top: 5px;">
        </th>
        <th>
            Дата принятия в обработку
            <input type="text" class="form-control" id="dateEnd" placeholder="" style="margin-top: 5px;">
        </th>
        <th>
            Принимающий конструктор
            <input type="text" class="form-control" id="constructor" placeholder="" style="margin-top: 5px;">
        </th>
        <th class="text-center">Действия</th>
    </tr>
    </thead>
    <tbody>
    <#list constructors as req>
        <tr>
            <td>${req.name}</td>
            <td>${req.numberWorkshop}</td>
            <td>${req.description}</td>
<#--            <td>-->
<#--                <span id="status-display-${req.id}">${req.status}</span>  <!-- Элемент для отображения статуса &ndash;&gt;-->
<#--            </td>-->
            <td>
                <select name="status" class="form-control" id="status-${req.id}" onchange="updateStatus(${req.id}, this.value)">
                    <#list statuses as status>
                        <option value="${status}" <#if req.status?? && req.status == status>selected</#if>>${status}</option>
                    </#list>
                </select>
            </td>
            <td>${req.dateStartAccepted?string("dd.MM.yyyy HH:mm")}</td>
            <td>
                <#if req.dateEndAccepted?has_content>
                    ${req.dateEndAccepted?string("dd.MM.yyyy HH:mm")}
                <#else>
                    Не установлена
                </#if>
            </td>
            <td>
                <select name="employ" class="form-control" id="employee-${req.id}" onchange="updateEmployee(${req.id}, this.value)">
                    <#list employeeList as employee>
                        <option value="${employee}"
                                <#if req?? && req.employ?? && req.employ == employee>selected</#if>>
                            ${employee}
                        </option>
                    </#list>
                </select>
            </td>
            <td>
                <button type="button" class="btn btn-info" data-toggle="modal" data-target="#infoModal"
                        <#if req.image?? && req.image != "">
                            data-img-src="data:image/png;base64,${req.image}"
                        <#else>
                            data-img-src=""
                        </#if>
                >
                    Посмотреть описание
                </button>
            </td>
        </tr>
    </#list>
    </tbody>
</table>
    <div id="pagination" class="text-center"></div>
</div>

<div class="text-center">
    <a href="/requestForm" class="btn btn-primary">Создать новую заявку</a>
</div>
<div class="text-right mr-5">
    <a href="/requestCanceled">Аннулированные заявки</a>
</div>
<div class="text-right mr-5">
    <a href="/requestCompleted">Выполненные заявки</a>
</div>

<!-- Модальное окно -->
<div class="modal fade" id="infoModal" tabindex="-1" role="dialog" aria-labelledby="infoModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="infoModalLabel">Дополнительное описание</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <img id="modalImage" src="" alt="Изображение" style="width: 100%; height: auto; display: none;"/>
                <p id="modalDescription"></p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
            </div>
        </div>
    </div>
</div>

<!-- Модальное окно -->
<div class="modal fade" id="cancelModal" tabindex="-1" role="dialog" aria-labelledby="cancelModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="cancelModalLabel">Причина аннулирования</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <textarea id="cancellationReason" class="form-control" placeholder="Введите причину..."></textarea>
            </div>
            <div class="modal-footer">
                <button id="acceptCancellation" type="button" class="btn btn-primary">Принять</button>
                <button id="closeModal" type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
            </div>
        </div>
    </div>
</div>

<!-- JavaScript для обработки модального окна -->

<script>
    $(document).ready(function () {
        $('#infoModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var imgSrc = button.data('img-src');

            var modal = $(this);
            if (imgSrc) {
                modal.find('#modalImage').attr('src', imgSrc).show();
                modal.find('#imageMessage').hide(); // Скрываем сообщение об отсутствии изображения
            } else {
                modal.find('#modalImage').attr('src', '').hide();
                modal.find('#modalDescription').text('Изображение отсутствует.');
                modal.find('#imageMessage').show(); // Показываем сообщение об отсутствии изображения
            }
        });
    });
</script>

<script>
    function updateStatus(requestId, newStatus) {
        fetch('/updateStatus/' + requestId, {
            method: 'POST', // или PUT/PATCH в зависимости от вашей логики
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus }) // Отправляем новый статус
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Если сервер возвращает JSON с подтверждением и, возможно, обновленными данными
            })
            .then(data => {
                // Проверяем статус
                if (newStatus === 'CANCELED') {
                    // Если статус CANCELED, показываем модальное окно
                    $('#cancelModal').modal('show'); // Открываем модальное окно

                    // Обработчик нажатия кнопки "Принять" в модальном окне
                    document.getElementById('acceptCancellation').onclick = function() {
                        const reason = document.getElementById('cancellationReason').value;
                        if (reason) {
                            // Логика для переноса документа в другую таблицу
                            moveToAnotherTable(reason,requestId);
                            $('#cancelModal').modal('hide'); // Закрываем модальное окно

                            // Обновляем отображение статуса на странице
                            const statusElement = document.getElementById('status-display-' + requestId);
                            if (statusElement) {
                                statusElement.textContent = newStatus;
                            }

                            const selectElement = document.getElementById('status-' + requestId);
                            if (selectElement) {
                                // Находим выбранный элемент
                                for (let i = 0; i < selectElement.options.length; i++) {
                                    if (selectElement.options[i].value === newStatus) {
                                        selectElement.selectedIndex = i;
                                        break;
                                    }
                                }
                            }
                        } else {
                            alert('Пожалуйста, введите причину аннулирования.');
                        }
                    };

                    // Обработчик нажатия кнопки "Закрыть" в модальном окне
                    document.getElementById('closeModal').onclick = function() {
                        $('#cancelModal').modal('hide'); // Закрываем модальное окно
                    };

                }
                else if (newStatus === 'COMPLETED') {
                    moveAnotherTable(requestId);
                }
                else if (newStatus === 'IN_PROGRESS') {
                    // Если статус не CANCELED, обновляем отображение статуса на странице
                    const statusElement = document.getElementById('status-display-' + requestId);
                    if (statusElement) {
                        statusElement.textContent = newStatus;
                    }

                    const selectElement = document.getElementById('status-' + requestId);
                    if (selectElement) {
                        // Находим выбранный элемент
                        for (let i = 0; i < selectElement.options.length; i++) {
                            if (selectElement.options[i].value === newStatus) {
                                selectElement.selectedIndex = i;
                                break;
                            }
                        }
                    }
                }
                console.log('Статус успешно обновлен:', data);
            })
            .catch(error => {
                console.error('Ошибка при обновлении статуса:', error);
                alert('Произошла ошибка при обновлении статуса.');
            });
    }
    function moveAnotherTable(req) {
        fetch('moveDocumentCompleted/' + req, {  // Добавлен req в URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        }) .then(response => { // Добавлен '.' перед 'then'
            if (!response.ok) {
                throw new Error('Ошибка при переносе документа');
            }
            return response.json();
        })
            .then(data => {
                console.log(data.message); // Успешное сообщение
                // Здесь можно обновить интерфейс, если нужно
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при переносе документа.');
            });
    }

    function moveToAnotherTable(reason, req) {
        fetch('/moveDocumentCanceled/' + req, { // Добавлен req в URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reason: reason }) // Убедитесь, что вы передаете reason
        })
            .then(response => { // Добавлен '.' перед 'then'
                if (!response.ok) {
                    throw new Error('Ошибка при переносе документа');
                }
                return response.json();
            })
            .then(data => {
                console.log(data.message); // Успешное сообщение
                // Здесь можно обновить интерфейс, если нужно
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при переносе документа.');
            });
    }
</script>

<script>
    function updateEmployee(requestId, employee) {
        fetch(`/updateEmployee/`+requestId+`?employ=`+employee, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Network response was not ok: `+text);
                });
            }
            return response.text(); // Получаем ответ в виде текста
        }).then(message => {
            console.log('Сервер ответил:', message); // Выведет сообщение от сервера
        }).catch(error => {
            console.error('Ошибка:', error);
        });
    }
</script>

<script>
    $(document).ready(function() {
        const rowsPerPage = 10;
        let filteredRows = [];

        const filterData = () => {
            filteredRows = $('#requestTable tbody tr').filter((index, row) => {
                const master = $(row).find('td:nth-child(1)').text().toLowerCase();
                const workShop = $(row).find('td:nth-child(2)').text().toLowerCase();
                const reason = $(row).find('td:nth-child(3)').text().toLowerCase();
                const status = $(row).find('td:nth-child(4)').text().toLowerCase();
                const dateStart = $(row).find('td:nth-child(5)').text().toLowerCase();
                const dateEnd = $(row).find('td:nth-child(6)').text().toLowerCase();
                const constructor = $(row).find('td:nth-child(7)').text().toLowerCase();


                return (
                    master.includes($('#filterMaster').val().toLowerCase()) &&
                    workShop.includes($('#workShop').val().toLowerCase()) &&
                    reason.includes($('#reason').val().toLowerCase()) &&
                    status.includes($('#status').val().toLowerCase()) &&
                    dateStart.includes($('#dateStart').val().toLowerCase()) &&
                    dateEnd.includes($('#dateEnd').val().toLowerCase()) &&
                    constructor.includes($('#constructor').val().toLowerCase())
                );
            });

            const totalFilteredRows = filteredRows.length;
            const totalFilteredPages = Math.ceil(totalFilteredRows / rowsPerPage);

            renderPagination(1); // Сбрасываем пагинацию на первую страницу после фильтрации
            showPage(1); // Отображаем первую страницу отфильтрованных результатов
        };

        const showPage = (page) => {
            $('#requestTable tbody tr').hide(); // Скрываем все строки
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            filteredRows.slice(start, end).show(); // Показываем только нужные строки
            renderPagination(page);
        };

        const renderPagination = (currentPage) => {
            const pagination = $('#pagination');
            pagination.empty();
            const totalFilteredRows = filteredRows.length;
            const totalFilteredPages = Math.ceil(totalFilteredRows / rowsPerPage);
            for (let i = 1; i <= totalFilteredPages; i++) {
                const pageLink = $('<button>')
                    .text(i)
                    .addClass('btn btn-secondary mx-1')
                    .click(() => showPage(i));
                if (i === currentPage) {
                    pageLink.addClass('active');
                }
                pagination.append(pageLink);
            }
        };

        // Обработчик событий для фильтров
        $('#filterMaster, #workShop, #reason, #status,#dateStart,#dateEnd,#constructor').on('keyup', filterData);

        // Показать первую страницу при загрузке
        filterData();
    });
</script>

</body>
</html>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Список аннулированных заявок для конструкторов</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
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
</head>
<body>
<h1 class="text-center">Список аннулированных заявок для конструкторов</h1>

<div class="container">
    <table class="table table-bordered" id="requestTable">
        <thead>
        <tr>
            <th class="text-center">
                Мастер
                <input type="text" class="form-control" id="filterMaster" placeholder="Фильтр по мастеру" style="margin-top: 5px;">
            </th>
            <th class="text-center">
                Описание заявки
                <input type="text" class="form-control" id="filterDescription" placeholder="Фильтр по описанию" style="margin-top: 5px;">
            </th>
            <th class="text-center">
                Причина аннулирования заявки
                <input type="text" class="form-control" id="filterCanceledDescription" placeholder="Фильтр по причине" style="margin-top: 5px;">
            </th>
            <th class="text-center">
                Кто аннулировал заявку
                <input type="text" class="form-control" id="filterEmploy" placeholder="Фильтр по аннулировавшему" style="margin-top: 5px;">
            </th>
        </tr>
        </thead>
        <tbody>
        <#list request as req>
            <tr>
                <td>${req.name}</td>
                <td>${req.description}</td>
                <td>${req.canceledDescription}</td>
                <td>${req.employ}</td>
            </tr>
        </#list>
        </tbody>
    </table>

    <div id="pagination" class="text-center"></div>
</div>


<script>
    $(document).ready(function() {
        const rowsPerPage = 10;
        let filteredRows = [];

        const filterData = () => {
            filteredRows = $('#requestTable tbody tr').filter((index, row) => {
                const master = $(row).find('td:nth-child(1)').text().toLowerCase();
                const description = $(row).find('td:nth-child(2)').text().toLowerCase();
                const canceledDescription = $(row).find('td:nth-child(3)').text().toLowerCase();
                const employ = $(row).find('td:nth-child(4)').text().toLowerCase();

                return (
                    master.includes($('#filterMaster').val().toLowerCase()) &&
                    description.includes($('#filterDescription').val().toLowerCase()) &&
                    canceledDescription.includes($('#filterCanceledDescription').val().toLowerCase()) &&
                    employ.includes($('#filterEmploy').val().toLowerCase())
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
        $('#filterMaster, #filterDescription, #filterCanceledDescription, #filterEmploy').on('keyup', filterData);

        // Показать первую страницу при загрузке
        filterData();
    });
</script>

<div class="text-center">
    <a href="/requestList">Вернуться к списку заявок</a>
</div>
</body>
</html>
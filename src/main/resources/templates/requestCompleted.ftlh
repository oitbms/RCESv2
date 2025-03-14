<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Мета-тег для адаптивности -->
    <title>Список аннулированных заявок для конструкторов</title>
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
        .form-control {
            border: 1px solid #000; /* Черная граница */
            text-align: center; /* Выравнивание текста по центру */
        }
    </style>
</head>
<body>
<h1 class="text-center">Список выполненных заявок у конструкторов</h1>

<div class="container">
    <table class="table table-bordered" id="requestTable">
    <thead>
    <tr>
        <th class="text-center">
            Конструктор
            <input type="text" class="form-control" id="filterConstructor" placeholder="" style="margin-top: 5px;">
        </th>
        <th>
            Описание заявки
            <input type="text" class="form-control" id="filterDescription" placeholder="" style="margin-top: 5px;">
        </th>
        <th>
            Дата выполнения
            <input type="text" class="form-control" id="filterEndDate" placeholder="" style="margin-top: 5px;">
        </th>
        <th>
            Кто вызывал
            <input type="text" class="form-control" id="filterEmploy" placeholder="" style="margin-top: 5px;">
        </th>
    </tr>
    </thead>
    <tbody>
    <#list request as reqs>
        <tr>
            <td>${reqs.employ}</td>
            <td>${reqs.description}</td>
            <td>${reqs.date}</td>
            <td>${reqs.name}</td>
        </tr>
    </#list>
    </tbody>
</table>

<div id="pagination" class="text-center"></div>

</div>

<script>
    $(document).ready(function () {
        const rowPerPage = 10; // Исправлено на singular
        let filteredRows = [];

        const filterData = () => {
            filteredRows = $('#requestTable tbody tr').filter((index, row) => {
                const constructor = $(row).find('td:nth-child(1)').text().toLowerCase();
                const description = $(row).find('td:nth-child(2)').text().toLowerCase();
                const dateStart = $(row).find('td:nth-child(3)').text().toLowerCase();
                const employ = $(row).find('td:nth-child(4)').text().toLowerCase();

                return (
                    constructor.includes($('#filterConstructor').val().toLowerCase()) &&
                    description.includes($('#filterDescription').val().toLowerCase()) &&
                    dateStart.includes($('#filterEndDate').val().toLowerCase()) &&
                    employ.includes($('#filterEmploy').val().toLowerCase())
                );
            });

            const totalFilteredRows = filteredRows.length;
            const totalFilteredPages = Math.ceil(totalFilteredRows / rowPerPage); // Исправлено на singular

            renderPagination(1); // Сбрасываем пагинацию на первую страницу после фильтрации
            showPage(1); // Отображаем первую страницу отфильтрованных результатов
        };

        const showPage = (page) => {
            $('#requestTable tbody tr').hide(); // Скрываем все строки
            const start = (page - 1) * rowPerPage; // Исправлено на singular
            const end = start + rowPerPage; // Исправлено на singular
            filteredRows.slice(start, end).show(); // Показываем только нужные строки
            renderPagination(page);
        };

        const renderPagination = (currentPage) => {
            const pagination = $('#pagination');
            pagination.empty();
            const totalFilteredRows = filteredRows.length;
            const totalFilteredPages = Math.ceil(totalFilteredRows / rowPerPage); // Исправлено на singular
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
        $('#filterConstructor, #filterDescription, #filterEndDate, #filterEmploy').on('keyup', filterData);

        // Показать первую страницу при загрузке
        filterData();
    });
</script>

<div class="text-center">
    <a href="/requestList">Вернуться к списку заявок</a>
</div>
</body>
</html>
<#--<div class="row mb-3">-->
<#--    <div class="col-md-3 mt-4">-->
<#--        <label for="filterConstructor">Конструктор:</label>-->
<#--        <input type="text" class="form-control" id="filterConstructor" placeholder="">-->
<#--    </div>-->
<#--    <div class="col-md-3 mt-4">-->
<#--        <label for="filterDescription">Описание:</label>-->
<#--        <input type="text" class="form-control" id="filterDescription" placeholder="">-->
<#--    </div>-->
<#--    <div class="col-md-3 mt-4">-->
<#--        <label for="filterEndDate">Дата выполнения:</label>-->
<#--        <input type="text" class="form-control" id="filterEndDate" placeholder="">-->
<#--    </div>-->
<#--    <div class="col-md-3 mt-4">-->
<#--        <label for="filterEmploy">Вызывал:</label>-->
<#--        <input type="text" class="form-control" id="filterEmploy" placeholder="">-->
<#--    </div>-->
<#--</div>-->
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <script>
        function isMobileDevice() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }

        // Проверка устройства при загрузке страницы
        window.onload = function() {
            if (isMobileDevice()) {
                alert("Эта страница доступна только на компьютере.");
                window.location.href = "/mobiledevice";
            }
        };
    </script>
    <link rel="stylesheet" href="/stylesMain.css">
    <title>Заявки на вызов технолога</title>
</head>
<body>
<#assign statusFilter = RequestParameters.status!"" />

<!-- Контейнер для контента -->
<div class="content-container">
    <!-- Фильтр -->
    <div class="filter-container">
        <label for="statusFilter">Фильтр по статусу</label>
        <select id="statusFilter" onchange="location = this.value">
            <option value="/technologistmain">Все статусы</option>
            <option value="/technologistmain?status=Новый" <#if statusFilter == "Новый">selected</#if>>Новый</option>
            <option value="/technologistmain?status=В работе" <#if statusFilter == "В работе">selected</#if>>В работе</option>
            <option value="/technologistmain?status=Закрыт" <#if statusFilter == "Закрыт">selected</#if>>Закрыт</option>
            <option value="/technologistmain?status=Отменен" <#if statusFilter == "Отменен">selected</#if>>Отменен</option>
        </select>
    </div>

    <!-- Список заявок -->
    <div class="requests-container">
        <#list statuses as status>
            <#if statusFilter == "" || status.getName() == statusFilter>
                <h2>${status.getName()}</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Номер заявки</th>
                        <th>Дата создания</th>
                        <th>Заказ клиента</th>
                        <th>Статус</th>
                        <th>ФИО ответственного</th>
                    </tr>
                    </thead>
                    <tbody>
                    <#list technologistList as technologist>
                        <#if technologist.status == status>
                            <tr>
                                <td>${technologist.requestNumber}</td>
                                <td>${technologist.createDate}</td>
                                <td>${technologist.customerOrder.name}</td>
                                <td>${technologist.status.getName()}</td>
                                <td>${technologist.employee.name}</td>
                            </tr>
                        </#if>
                    </#list>
                    </tbody>
                </table>
            </#if>
        </#list>

        <!-- Кнопка -->
        <div class="create-button">
            <button onclick="location.href='/technologistbid/create'">Создать заявку ➕</button>
        </div>
    </div>
</div>

</body>
</html>
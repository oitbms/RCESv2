<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>План СГИ</title>
</head>
<body>
<div class="container">
    <table>
        <thead>
        <tr>
            <th>№ п/п</th>
            <th>
                № цеха
            </th>
            <th>
                Мероприятие
            </th>
            <th>
                Сопутствующие действия
            </th>
            <th>
                Ответственный отдел
            </th>
            <th>
                Ответственное лицо
            </th>
            <th>
                Желаемый срок
            </th>
            <th>
                Планируемый срок
            </th>
            <th>
                Факт выполнения
            </th>
            <th>
                Примечание
            </th>
        </tr>
        </thead>
        <tbody>
        <#list sgiList as sgi>
            <tr>
                <td>${sgi.number}</td>
                <td>${sgi.workShop}</td>
                <td>${sgi.event}</td>
                <td>${sgi.actions}</td>
                <td>${sgi.department.name()}</td>
                <td>${sgi.employee.getName()}</td>
                <td>${(sgi.desiredDate)!''}</td>
                <td>${(sgi.planDate)!''}</td>
                <td>
                    <button>НАЖМИ</button>
                </td>
                <td>${sgi.comment!''}</td>
            </tr>
        </#list>
        </tbody>
    </table>
</div>
</body>
</html>
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
                <div><input type="text" id="workShop"></div>
            </th>
            <th>
                Мероприятие
                <div><input type="text" id="event"></div>
            </th>
            <th>
                Сопутствующие действия
                <div><input type="text" id="actions"></div>
            </th>
            <th>
                Ответственный отдел
                <div><input type="text" id="department"></div>
            </th>
            <th>
                Ответственное лицо
                <div><input type="text" id="employee"></div>
            </th>
            <th>
                Желаемый срок
                <div><input type="text" id="desiredDate"></div>
            </th>
            <th>
                Планируемый срок
                <div><input type="text" id="planDate"></div>
            </th>
            <th>
                Факт выполнения
                <div><input type="text" id="executions"></div>
            </th>
            <th>
                Примечание
                <div><input type="text" id="comment"></div>
            </th>
            <th>
                Создать
                <div><button></button></div>
            </th>
        </tr>
        </thead>
        <tbody>
        <#list sgiList as sgi>
            <tr>
                <td>${sgi?index + 1}</td>
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
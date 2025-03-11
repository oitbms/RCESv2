<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Мета-тег для адаптивности -->
    <title>Создать заявку</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
<div class="container">
    <h1 class="text-center">Создать заявку</h1>
    <form action="/submitRequest" method="post" enctype="multipart/form-data">
        <div class="form-group">
            <label for="name">Мастер:</label>
            <select class="form-control" name="name" required>
                <option value="" disabled <#if request.name?? && request.name == "">selected</#if>>Выберите Мастера</option>
                <option value="Иванов Иван Иванович" <#if request.name?? && request.name == "Иванов Иван Иванович">selected</#if>>Иванов Иван Иванович</option>
                <option value="Петров Петр Петрович" <#if request.name?? && request.name == "Петров Петр Петрович">selected</#if>>Петров Петр Петрович</option>
                <option value="Сидоров Сидор Сидорович" <#if request.name?? && request.name == "Сидоров Сидор Сидорович">selected</#if>>Сидоров Сидор Сидорович</option>
            </select>
        </div>
        <div class="form-group">
            <label for="description">Причина вызова:</label>
            <textarea class="form-control" name="description" required>${request.description!""}</textarea>
        </div>
        <div class="form-group">
            <label for="customerOrder">Номер ЗК:</label>
            <textarea class="form-control" name="customerOrder" required>${request.customerOrder!""}</textarea>
        </div>
        <div class="form-group">
            <label for="numberWorkshop">Номер цеха:</label>
            <select class="form-control" name="numberWorkshop" required>
                <option value="" disabled <#if request.numberWorkshop?? && request.numberWorkshop == "">selected</#if>>Выберите номер цеха</option>
                <option value="Цех 1" <#if request.numberWorkshop?? && request.numberWorkshop == "Цех 1">selected</#if>>Цех 1</option>
                <option value="Цех 3" <#if request.numberWorkshop?? && request.numberWorkshop == "Цех 3">selected</#if>>Цех 3</option>
                <option value="Цех 4" <#if request.numberWorkshop?? && request.numberWorkshop == "Цех 4">selected</#if>>Цех 4</option>
                <option value="Цех 5" <#if request.numberWorkshop?? && request.numberWorkshop == "Цех 5">selected</#if>>Цех 5</option>
                <option value="Цех 6" <#if request.numberWorkshop?? && request.numberWorkshop == "Цех 6">selected</#if>>Цех 6</option>
                <option value="Цех 7" <#if request.numberWorkshop?? && request.numberWorkshop == "Цех 7">selected</#if>>Цех 7</option>
                <option value="Цех 8" <#if request.numberWorkshop?? && request.numberWorkshop == "Цех 8">selected</#if>>Цех 8</option>
            </select>
        </div>
        <div class="form-group">
            <label for="additionalFiles">Загрузить дополнительные фотографии:</label>
            <input type="file" class="form-control-file" id="additionalFiles" name="additionalFiles" accept="image/*" multiple>
        </div>
        <div class="text-center">
            <button type="submit" class="btn btn-primary">Отправить заявку</button>
        </div>
    </form>
    <div class="text-center">
        <a href="/requestList">Список заявок</a>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
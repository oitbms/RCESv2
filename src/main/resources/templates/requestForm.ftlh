<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
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
                <option value="" disabled selected>Выберите Мастера</option> <!-- Заголовок выпадающего списка -->
                <option value="Иванов Иван Иванович">Иванов Иван Иванович</option>
                <option value="Петров Петр Петрович">Петров Петр Петрович</option>
                <option value="Сидоров Сидор Сидорович">Сидоров Сидор Сидорович</option>
            </select>
        </div>
        <div class="form-group">
            <label for="description">Причина вызова:</label>
            <textarea class="form-control" name="description" required></textarea>
        </div>
        <div class="form-group">
            <label for="customerOrder">Номер ЗК:</label>
            <textarea class="form-control" name="customerOrder" required></textarea>
        </div>
        <div class="form-group">
            <label for="numberWorkshop">Номер цеха:</label>
            <select class="form-control" name="numberWorkshop" required>
                <option value="" disabled selected>Выберите номер цеха</option> <!-- Заголовок выпадающего списка -->
                <option value="Цех 1">Цех 1</option>
                <option value="Цех 3">Цех 3</option>
                <option value="Цех 4">Цех 4</option>
                <option value="Цех 5">Цех 5</option>
                <option value="Цех 6">Цех 6</option>
                <option value="Цех 7">Цех 7</option>
                <option value="Цех 8">Цех 8</option>
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
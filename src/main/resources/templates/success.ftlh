<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Успех</title>
    <style>
        /* Сброс стилей */
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: Arial, sans-serif;
        }

        /* Центрирование контента */
        .container {
            display: flex;
            flex-direction: column; /* Вертикальное выравнивание */
            justify-content: center;
            align-items: center;
            height: 100%;
            background-color: #f0f0f0;
        }

        /* Стиль для зеленой галочки */
        .checkmark {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background-color: #4CAF50; /* Зеленый цвет */
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px; /* Отступ для текста */
        }

        /* Символ галочки */
        .checkmark::after {
            content: "✓";
            font-size: 60px;
            color: white;
        }

        /* Стиль для текста */
        .message {
            font-size: 24px;
            color: #333; /* Цвет текста */
        }

        /* Адаптация для мобильных устройств */
        @media (max-width: 600px) {
            .checkmark {
                width: 80px;
                height: 80px;
            }

            .checkmark::after {
                font-size: 50px;
            }

            .message {
                font-size: 20px; /* Уменьшенный размер текста для мобильных */
            }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="checkmark"></div>
    <div class="message">Заявка под номером <span>${requestNumber}</span>
        <#if create>
            создана
        <#else>
            обновлена
        </#if>
    </div>
</div>
</body>
</html>
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
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f5f7fa, #c3cfe2); /* Градиентный фон */
        }

        /* Центрирование контента */
        .container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            text-align: center;
        }

        /* Стиль для зеленой галочки */
        .checkmark {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4CAF50, #45a049); /* Градиентный фон */
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 30px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* Тень */
            animation: pop 0.6s ease-in-out; /* Анимация появления */
        }

        /* Анимация для галочки */
        @keyframes pop {
            0% {
                transform: scale(0);
            }
            50% {
                transform: scale(1.2);
            }
            100% {
                transform: scale(1);
            }
        }

        /* Символ галочки */
        .checkmark::after {
            content: "✓";
            font-size: 70px;
            color: white;
            font-weight: bold;
        }

        /* Стиль для текста */
        .message {
            font-size: 26px;
            color: #333;
            background: white;
            padding: 20px 40px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Тень */
            max-width: 90%;
            margin: 0 auto;
        }

        /* Стиль для номера заявки */
        .message span {
            font-weight: bold;
            color: #4CAF50; /* Зеленый цвет */
        }

        /* Стиль для ссылки */
        .message a {
            display: inline-block;
            margin-top: 15px;
            padding: 10px 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049); /* Градиентный фон */
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-size: 18px;
            transition: transform 0.3s ease, box-shadow 0.3s ease; /* Плавные переходы */
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Тень */
        }

        /* Эффект при наведении на ссылку */
        .message a:hover {
            transform: translateY(-3px); /* Сдвиг вверх */
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3); /* Увеличенная тень */
        }

        /* Адаптация для мобильных устройств */
        @media (max-width: 600px) {
            .checkmark {
                width: 90px;
                height: 90px;
            }

            .checkmark::after {
                font-size: 50px;
            }

            .message {
                font-size: 20px;
                padding: 15px 20px;
            }

            .message a {
                font-size: 16px;
                padding: 8px 16px;
            }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="checkmark"></div>
    <div class="message">
        Заявка под номером <span>${requestNumber}</span>
        <#if create>
            успешно создана.
        <#else>
            успешно обновлена.
        </#if>
        <br>
        <a href="/view/${requestNumber}">Редактировать</a>
    </div>
</div>
</body>
</html>

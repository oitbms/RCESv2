<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Выбор заявки</title>
    <style>
        :root {
            --primary: #3a86ff;
            --primary-dark: #2667cc;
            --text: #2b2d42;
            --bg: #f8f9fa;
            --transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background: var(--bg);
            color: var(--text);
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        .menu {
            display: flex;
            flex-direction: column;
            height: 100vh;
        }

        .menu-item {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            padding: 1rem;
            isolation: isolate;
            border-bottom: 1px solid rgba(0,0,0,0.05);
            transition: transform 0.3s ease;
        }

        .menu-item:last-child {
            border-bottom: none;
        }

        .menu-link {
            position: relative;
            z-index: 10;
            text-decoration: none;
            color: var(--text);
            font-size: clamp(1.2rem, 4vw, 1.6rem);
            font-weight: 600;
            padding: 1.5rem;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
        }

        .fill-effect {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            transform: scaleY(0);
            transform-origin: bottom;
            transition: transform 1s cubic-bezier(0.87, 0, 0.13, 1);
            z-index: -1;
            opacity: 0.9;
        }

        .menu-item.active {
            animation: micro-shake 0.1s infinite alternate;
        }

        .menu-item.active .fill-effect {
            transform: scaleY(1);
        }

        @keyframes micro-shake {
            0% { transform: translateX(-0.5px); }
            100% { transform: translateX(0.5px); }
        }

        .menu-item:hover {
            transform: translateY(-3px);
        }

        @media (max-width: 768px) {
            .menu-link {
                font-size: 1.3rem;
                padding: 1rem;
            }
        }
    </style>
</head>
<body>
<div class="menu">
    <div class="menu-item" data-href="/technologistbid/create">
        <div class="fill-effect"></div>
        <a class="menu-link">Создать заявку на вызов технолога</a>
    </div>
    <div class="menu-item" data-href="/constructorbid/create">
        <div class="fill-effect"></div>
        <a class="menu-link">Создать заявку на вызов конструктора</a>
    </div>
    <div class="menu-item" data-href="/otkbid/create">
        <div class="fill-effect"></div>
        <a class="menu-link">Создать заявку на вызов ОТК</a>
    </div>
</div>

<script>
    document.querySelectorAll('.menu-item').forEach(item => {
        let holdTimer;
        const holdDuration = 1000;

        const startHold = () => {
            item.classList.add('active');
            holdTimer = setTimeout(() => {
                window.location.href = item.getAttribute('data-href');
            }, holdDuration);
        };

        const cancelHold = () => {
            clearTimeout(holdTimer);
            item.classList.remove('active');
        };

        // Для мыши
        item.addEventListener('mousedown', startHold);
        item.addEventListener('mouseup', cancelHold);
        item.addEventListener('mouseleave', cancelHold);

        // Для сенсорных устройств
        item.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startHold();
        });

        item.addEventListener('touchend', cancelHold);
        item.addEventListener('touchcancel', cancelHold);
    });
</script>
</body>
</html>
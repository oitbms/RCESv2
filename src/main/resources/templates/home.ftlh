<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Выбор заявки</title>
    <link rel="stylesheet" href="/css/home.css">
</head>
<body class="request-selector-page">
<main class="request-selector" role="main">
    <section class="request-selector__intro">
        <p class="request-selector__eyebrow">Создание заявки</p>
        <h1>Выберите направление обращения</h1>
        <p class="request-selector__description">
            Доступные сценарии запуска задач собраны в одном экране. Активное направление можно открыть сразу,
            остальные отображаются как дорожная карта интерфейса.
        </p>
    </section>

    <section class="request-grid" aria-label="Типы заявок">
        <article class="request-card request-card--disabled">
            <div class="request-card__status">Скоро доступно</div>
            <div class="request-card__icon">
                <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
            </div>
            <h2>Вызов технолога</h2>
            <p>Сценарий будет доступен после завершения переноса формы в обновленный интерфейс.</p>
            <div class="request-card__cta" aria-disabled="true">Недоступно</div>
        </article>

        <article class="request-card request-card--disabled">
            <div class="request-card__status">Скоро доступно</div>
            <div class="request-card__icon">
                <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
            </div>
            <h2>Вызов конструктора</h2>
            <p>Маршрут сохранен в дизайне как отдельная карточка и готов к последующему подключению.</p>
            <div class="request-card__cta" aria-disabled="true">Недоступно</div>
        </article>

        <article class="request-card request-card--active">
            <div class="request-card__status request-card__status--active">Доступно сейчас</div>
            <div class="request-card__icon">
                <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
            </div>
            <h2>Вызов ОТК</h2>
            <p>Откройте форму и создайте заявку без переходов по дополнительным промежуточным страницам.</p>
            <a href="/create?type=otk" class="request-card__cta">Открыть форму</a>
        </article>
    </section>
</main>
</body>
</html>

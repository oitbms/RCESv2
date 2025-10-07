<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Реестр средств измерений</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/css/spe.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="/js/cache.js" defer></script>
    <script src="/js/spe.js" defer></script>
</head>

<body>
<div class="container">
    <header>
        <div class="title">
            <h1>Перечень УМИ ООО «БорМаш»</h1>
            <p class="subtitle">Актуальная информация о состоянии и поверке оборудования</p>
        </div>
        <div class="toolbar">
            <div class="tool edit" id="edit-button">
                <button title="Редактировать">
                    <i class="fas fa-pencil-alt"></i>
                </button>
            </div>
            <div class="tool save" id="save-button">
                <button title="Сохранить">
                    <i class="fas fa-floppy-disk"></i>
                </button>
            </div>
            <div class="tool create" id="create-button">
                <button title="Создать">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
    </header>

    <div class="controls">
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="searchInput" placeholder="Поиск оборудования...">
        </div>
        <div class="filters">
            <button class="filter-btn active">
                <i class="fas fa-list"></i>Все
            </button>
            <button class="filter-btn">
                <i class="fas fa-check-circle"></i>Списаны
            </button>
            <button class="filter-btn">
                <i class="fas fa-exclamation-triangle"></i>Требуется поверка
            </button>
            <button class="filter-btn">
                <i class="fas fa-exclamation-triangle"></i>Истек срок поверки
            </button>
            <button class="filter-btn">
                <i class="fas fa-exclamation-triangle"></i>На поверке
            </button>
        </div>
    </div>

    <div class="data-container">
        <div class="sidebar">
            <div class="stats">
                <div class="stat-item">
                    <div class="stat-label">Всего единиц</div>
                    <div class="stat-value" id="total-units"></div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Списано</div>
                    <div class="stat-value" id="written-off"></div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Требуется поверка</div>
                    <div class="stat-value" id="verification-required"></div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Истек срок поверки</div>
                    <div class="stat-value" id="verification-period-has-expired"></div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">На поверке</div>
                    <div class="stat-value" id="at-inspection"></div>
                </div>
            </div>

            <div class="department-list">
                <div class="department-item active">Все подразделения</div>
                <div class="department-item">Склад (ОФ)</div>
                <div class="department-item">Цех №3</div>
                <div class="department-item">Электрик</div>
                <div class="department-item">Участок изготовления</div>
            </div>
        </div>

        <div class="table-container">
            <div class="table-header">
                <div class="table-header-cell" style="width: var(--equipment);">Оборудование</div>
                <div class="table-header-cell" style="width: var(--characteristics);">Характеристики</div>
                <div class="table-header-cell" style="width: var(--subdivision);">Подразделение</div>
                <div class="table-header-cell" style="width: var(--responsible);">Ответственный</div>
                <div class="table-header-cell" style="width: var(--mark);">Отметка</div>
                <div class="table-header-cell" style="width: var(--preparationDate);">Дата подготовки поверки</div>
                <div class="table-header-cell" style="width: var(--verificationDate);">Дата поверки</div>
                <div class="table-header-cell" style="width: var(--certificate);">Свидетельство</div>
                <div class="table-header-cell" style="width: var(--periodicity);">Периодичность</div>
                <div class="table-header-cell" style="width: var(--file);">Чертеж</div>
                <div class="table-header-cell" style="width: var(--status);">Статус</div>
            </div>

            <div class="table-body">

            </div>

        </div>
    </div>
</div>
</body>

</html>
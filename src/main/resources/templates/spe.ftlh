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
        <h1>Перечень УМИ ООО «БорМаш»</h1>
        <p class="subtitle">Актуальная информация о состоянии и поверке оборудования</p>
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
                    <div class="stat-value" id="total-units">9</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Списано</div>
                    <div class="stat-value" id="written-off">7</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Требуется поверка</div>
                    <div class="stat-value" id="verification-required">2</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Истек срок поверки</div>
                    <div class="stat-value" id="verification-period-has-expired">2</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">На поверке</div>
                    <div class="stat-value" id="at-inspection">2</div>
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

                <div class="table-row">
                    <div class="table-cell" style="width: var(--equipment);">
                        <div class="equipment">
                            Виброметр
                            <div class="equipments">
                                <div class="equipment-type">29Е4/2Р/485/4М/F-РВ/12УВ/12Р</div>
                                <div class="equipment-number">34762809/507</div>
                            </div>
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--characteristics);">
                        <div class="characteristics">
                            <div>
                                0,1
                            </div>
                            <div>
                                0-10
                            </div>
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--subdivision);">Склад (ОФ)</div>
                    <div class="table-cell" style="width: var(--responsible);">
                        <div class="responsible">
                            <div>Парфенова Е.В.</div>
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--mark);">и</div>
                    <div class="table-cell" style="width: var(--preparationDate);">07.09.2025</div>
                    <div class="table-cell" style="width: var(--verificationDate);">07.10.2025</div>
                    <div class="table-cell" style="width: var(--certificate);">C:BM/08-10-2024/37701227</div>
                    <div class="table-cell" style="width: var(--periodicity);">12</div>
                    <div class="table-cell" style="width: var(--file);">
                        +
                    </div>
                    <div class="table-cell" style="width: var(--status);">
                        <span class="status-indicator status-good">Исправен</span>
                    </div>
                </div>

            </div>

            <div class="pagination">
                <div class="page-info">Показано 1-9 из 9 записей</div>
                <div class="page-controls">
                    <button class="page-btn active">1</button>
                    <button class="page-btn">2</button>
                    <button class="page-btn">3</button>
                </div>
            </div>
        </div>
    </div>
</div>
</body>

</html>
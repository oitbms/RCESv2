<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bootstrap Treeview Пример</title>
    <link rel="stylesheet" href="/css/tree.css">
</head>
<body>

<div class="report-container">
    <header></header>
    <main>
        <div class="table">
            <div class="table-header">
                <div class="table-header-item" style="width: 29.625rem">Строка ЗК/Спрос</div>
                <div class="table-header-item" style="width: 28.125rem;">ДСЕ</div>
                <div class="table-header-item" style="width: 21.5625rem;">Узел ПЛМ</div>
                <div class="table-header-item" style="width: 15.9375rem;">Описание(заход)</div>
                <div class="table-header-item" style="width: 6.25rem;">План брутто</div>
                <div class="table-header-item" style="width: 7.25rem;">Выполнено</div>
                <div class="table-header-item" style="width: 10.625rem;">Трудоемкость</div>
                <div class="table-header-item" style="width: 9.6875rem;">Дата начала</div>
                <div class="table-header-item" style="width: 9.6875rem;">Дата завершения</div>
                <div class="table-header-item" style="width: 9.6875rem;">РД начала</div>
                <div class="table-header-item" style="width: 9.6875rem;">РД завершения</div>
            </div>
            <div class="table-rows">
                <div class="table-rows-items">
                    <div class="row" data-parent-id="#" data-id="1" data-level="0">
                        <label class="hamburger">
                            <input type="checkbox">
                            <svg viewBox="0 0 32 32">
                                <path class="line line-top-bottom"
                                      d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
                                <path class="line" d="M7 16 27 16"></path>
                            </svg>
                        </label>
                        <div class="row-item" style="width: 29.625rem; padding-left: 1.5rem">СТРОКА КАКАЯ_ТО №1 #231314
                            ЗАЛУПА КОНСКАЯ МАТЕРИАЛЬНАЯ
                        </div>
                        <div class="row-item" style="width: 28.125rem;">00000000206643 #3⁣ КСА1180 ИД-200.01 Секция АВО
                            газа
                        </div>
                        <div class="row-item" style="width: 21.5625rem;">Цех по получению пиздюлей с газом</div>
                        <div class="row-item" style="width: 15.9375rem;">Покрасил подводку - она утонула</div>
                        <div class="row-item" style="width: 6.25rem;">52</div>
                        <div class="row-item" style="width: 7.25rem;">52</div>
                        <div class="row-item" style="width: 10.625rem;">192.192</div>
                        <div class="row-item" style="width: 9.6875rem;">20.11.2025</div>
                        <div class="row-item" style="width: 9.6875rem;">20.11.2025</div>
                        <div class="row-item" style="width: 9.6875rem;">20.11.2025</div>
                        <div class="row-item" style="width: 9.6875rem;">20.11.2025</div>
                    </div>
                    <div class="inner-rows">
                        <div class="table-rows-items">
                            <div class="row" data-parent-id="1" data-id="2" data-level="1">
                                <label class="hamburger">
                                    <input type="checkbox">
                                    <svg viewBox="0 0 32 32">
                                        <path class="line line-top-bottom"
                                              d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
                                        <path class="line" d="M7 16 27 16"></path>
                                    </svg>
                                </label>
                                <div cl ass="row-item" style="width: 29.625rem; padding-left: 1.5rem">СТРОКА КАКАЯ_ТО №1
                                    #231314
                                    ЗАЛУПА КОНСКАЯ МАТЕРИАЛЬНАЯ
                                </div>
                                <div class="row-item" style="width: 28.125rem;">00000000206643 #3⁣ КСА1180 ИД-200.01
                                    Секция АВО
                                    газа
                                </div>
                                <div class="row-item" style="width: 21.5625rem;">Цех по получению пиздюлей с газом</div>
                                <div class="row-item" style="width: 15.9375rem;">Покрасил подводку - она утонула</div>
                                <div class="row-item" style="width: 6.25rem;">52</div>
                                <div class="row-item" style="width: 7.25rem;">52</div>
                                <div class="row-item" style="width: 10.625rem;">192.192</div>
                                <div class="row-item" style="width: 9.6875rem;">20.11.2025</div>
                                <div class="row-item" style="width: 9.6875rem;">20.11.2025</div>
                                <div class="row-item" style="width: 9.6875rem;">20.11.2025</div>
                                <div class="row-item" style="width: 9.6875rem;">20.11.2025</div>
                            </div>
                            <div class="inner-rows">
                                <div class="table-rows-items">
                                    <div class="row" data-parent-id="2" data-id="3" data-level="2">
                                        <label class="hamburger">
                                            <input type="checkbox">
                                            <svg viewBox="0 0 32 32">
                                                <path class="line line-top-bottom"
                                                      d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
                                                <path class="line" d="M7 16 27 16"></path>
                                            </svg>
                                        </label>
                                        <div class="row-item" style="width: 29.625rem; padding-left: 1.5rem"><p>СТРОКА КАКАЯ_ТО №1
                                                #231314
                                                ЗАЛУПА КОНСКАЯ МАТЕРИАЛЬНАЯ</p>
                                        </div>
                                        <div class="row-item" style="width: 28.125rem;">00000000206643 #3, КСА1180 ИД-200.01
                                            Секция АВО
                                            газа
                                        </div>
                                        <div class="row-item" style="width: 21.5625rem;">Цех по получению пиздюлей с газом</div>
                                        <div class="row-item" style="width: 15.9375rem;">Покрасил подводку - она утонула</div>
                                        <div class="row-item" style="width: 6.25rem;">52</div>
                                        <div class="row-item" style="width: 7.25rem;">52</div>
                                        <div class="row-item" style="width: 10.625rem;">192.192</div>
                                        <div class="row-item" style="width: 9.6875rem;">20.11.2025</div>
                                        <div class="row-item" style="width: 9.6875rem;">20.11.2025</div>
                                        <div class="row-item" style="width: 9.6875rem;">20.11.2025</div>
                                        <div class="row-item" style="width: 9.6875rem;">20.11.2025</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/colresizable@1.6.0/colResizable-1.6.min.js"></script>
<script src="/js/report.js" defer></script>
</body>
</html>
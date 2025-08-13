<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Дерево ЗК</title>
    <link rel="stylesheet" href="/css/tree.css">
</head>
<body>
<div class="report-container">
    <header>
        <div class="header-header">
            <div class="report-name"><h1>Дерево заказа клиента</h1></div>
            <div class="buttons">
                <button type="button" class="print-report">
                    Выгрузить в Excel
                </button>
            </div>
        </div>
        <div class="header-footer"></div>
    </header>
    <main>
        <div class="table">
            <div class="table-header">
                <div class="table-header-item" style="width: var(--primarydemand)" data-name="primarydemand">
                    Строка ЗК/Спрос
                    <div class="table-header-resizer"></div>
                </div>
                <div class="table-header-item" style="width: var(--item)" data-name="item">
                    ДСЕ
                    <div class="table-header-resizer"></div>
                </div>
                <div class="table-header-item" style="width: var(--mlm-node)" data-name="mlm-node">
                    Узел ПЛМ
                    <div class="table-header-resizer"></div>
                </div>
                <div class="table-header-item" style="width: var(--description)" data-name="description">
                    Описание(заход)
                    <div class="table-header-resizer"></div>
                </div>
                <div class="table-header-item" style="width: var(--qty)" data-name="qty">
                    План брутто
                    <div class="table-header-resizer"></div>
                </div>
                <div class="table-header-item" style="width: var(--qty-finished)" data-name="qty-finished">
                    Выполнено
                    <div class="table-header-resizer"></div>
                </div>
                <div class="table-header-item" style="width: var(--resourcetime);" data-name="resourcetime">
                    Трудоемкость
                    <div class="table-header-resizer"></div>
                </div>
                <div class="table-header-item" style="width: var(--date-start)" data-name="date-start">
                    Дата начала
                    <div class="table-header-resizer"></div>
                </div>
                <div class="table-header-item" style="width: var(--date-end)" data-name="date-end">
                    Дата завершения
                    <div class="table-header-resizer"></div>
                </div>
                <div class="table-header-item" style="width: var(--date-calc-start)" data-name="date-calc-start">
                    РД начала
                    <div class="table-header-resizer"></div>
                </div>
                <div class="table-header-item" style="width: var(--date-calc-end)" data-name="date-calc-end">
                    РД завершения
                    <div class="table-header-resizer"></div>
                </div>
            </div>
            <div class="table-rows" id="table-data">
                <div class="table-rows-items" style="display: none">
                    <div class="row" data-parent-id="#" data-id="1" data-level="0">
                        <label class="hamburger">
                            <input type="checkbox">
                            <svg viewBox="0 0 32 32">
                                <path class="line line-top-bottom"
                                      d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
                                <path class="line" d="M7 16 27 16"></path>
                            </svg>
                        </label>
                        <div class="row-item" style="width: 29.625rem;" data-name="primarydemand">
                            <p>
                                СТРОКА КАКАЯ_ТО №1 #231314МАТЕРИАЛЬНАЯ ГАЗОВАЯ
                                <span class="line-container">
                                  <span class="third-line"></span>
                                </span>
                              </p>
                        </div>
                        <div class="row-item" style="width: 25.125rem;" data-name="item">00000000206643 #3⁣ КСА1180 ИД-200.01 Секция АВО
                            газа
                        </div>
                        <div class="row-item" style="width: 17.5625rem;" data-name="mlm-node"></div>
                        <div class="row-item" style="width: 15.9375rem;" data-name="description"></div>
                        <div class="row-item" style="width: 6.25rem;" data-name="qty">52</div>
                        <div class="row-item" style="width: 7.25rem;" data-name="qty-finished">52</div>
                        <div class="row-item" style="width: 7.625rem;" data-name="resourcetime">192.192</div>
                        <div class="row-item" style="width: 6.6875rem;" data-name="date-start">20.11.2025</div>
                        <div class="row-item" style="width: 8rem;" data-name="date-end">20.11.2025</div>
                        <div class="row-item" style="width: 6.6875rem;" data-name="date-calc-start">20.11.2025</div>
                        <div class="row-item" style="width: 8rem;" data-name="date-calc-end">20.11.2025</div>
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
                                <div class="row-item first-element" style="width: 29.625rem; padding-left: 1.9rem;" data-name="primarydemand">
                                    <p>
                                        00000000206643 #3⁣ КСА1180 ИД-200.01 Секция АВО газа
                                        <span class="line-container">
                                            <span class="third-line"></span>
                                        </span>
                                    </p>
                                </div>
                                <div class="row-item" style="width: 25.125rem;" data-name="item">00000000206643 #3⁣ КСА1180 ИД-200.01
                                    Секция АВО
                                    газа
                                </div>
                                <div class="row-item" style="width: 17.5625rem;" data-name="mlm-node">Цех по получению пиздюлей с газом</div>
                                <div class="row-item" style="width: 15.9375rem;" data-name="description">Покрасил подводку - она утонула</div>
                                <div class="row-item" style="width: 6.25rem;" data-name="qty">52</div>
                                <div class="row-item" style="width: 7.25rem;" data-name="qty-finished">52</div>
                                <div class="row-item" style="width: 7.625rem;" data-name="resourcetime">192.192</div>
                                <div class="row-item" style="width: 6.6875rem;" data-name="date-start">20.11.2025</div>
                                <div class="row-item" style="width: 8rem;" data-name="date-end">20.11.2025</div>
                                <div class="row-item" style="width: 6.6875rem;" data-name="date-calc-start">20.11.2025</div>
                                <div class="row-item" style="width: 8rem;" data-name="date-calc-end">20.11.2025</div>
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
                                        <div class="row-item first-element" style="width: 29.625rem; padding-left: 2.3rem;" data-name="primarydemand">
                                            <p>
                                                00000000206643 #3⁣ КСА1180 ИД-200.01 Секция АВО газа
                                                <span class="line-container">
                                                    <span class="third-line"></span>
                                                </span>
                                            </p>
                                                
                                        </div>
                                        <div class="row-item" style="width: 25.125rem;" data-name="item">00000000206643 #3, КСА1180
                                            ИД-200.01
                                            Секция АВО
                                            газа
                                        </div>
                                        <div class="row-item" style="width: 17.5625rem;" data-name="mlm-node">Цех по получению пиздюлей с
                                            газом
                                        </div>
                                        <div class="row-item" style="width: 15.9375rem;" data-name="description">Покрасил подводку - она
                                            утонула
                                        </div>
                                        <div class="row-item" style="width: 6.25rem;" data-name="qty">52</div>
                                        <div class="row-item" style="width: 7.25rem;" data-name="qty-finished">52</div>
                                        <div class="row-item" style="width: 7.625rem;" data-name="resourcetime">192.192</div>
                                        <div class="row-item" style="width: 6.6875rem;" data-name="date-start">20.11.2025</div>
                                        <div class="row-item" style="width: 8rem;" data-name="date-end">20.11.2025</div>
                                        <div class="row-item" style="width: 6.6875rem;" data-name="date-calc-start">20.11.2025</div>
                                        <div class="row-item" style="width: 8rem;" data-name="date-calc-end">20.11.2025</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="table-footer" id="table-footer">
                <div class="table-footer-content">
                    <div class="count">
                        <div class="total-count"></div>
                        <div class="load-count">
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<dialog id="photoDialog" style="display: none">
    <div class="container-dialog">
        <div class="dialog-header">
            <div class="dialog-header-content">
                <div class="dialog-header-content-title">Прикрепленные фото</div>
                <div class="dialog-header-content-close">
                    <button class="ui-btn" onclick="window['photoDialog'].close()"><span>Закрыть</span></button>
                </div>
            </div>
        </div>
        <div class="dialog-content">
            <div class="dialog-content-content">
                <div class="dialog-content-content-photo">
                    <img src="" alt="">
                </div>
                <div class="dialog-content-content-delete-photo">
                    <button class="ui-btn"><span>Удалить</span></button>
                </div>
            </div>
            <div class="dialog-content-content">
                <div class="dialog-content-content-photo">
                    <img src="" alt="">
                </div>
                <div class="dialog-content-content-delete-photo">
                    <button class="ui-btn"><span>Удалить</span></button>
                </div>
            </div>
            <div class="dialog-content-content">
                <div class="dialog-content-content-photo">
                    <img src="" alt="">
                </div>
                <div class="dialog-content-content-delete-photo">
                    <button class="ui-btn"><span>Удалить</span></button>
                </div>
            </div>
            <div class="dialog-content-content">
                <div class="dialog-content-content-photo">
                    <img src="" alt="">
                </div>
                <div class="dialog-content-content-delete-photo">
                    <button class="ui-btn"><span>Удалить</span></button>
                </div>
            </div>
        </div>
        <div class="dialog-footer">
            <div class="dialog-footer-content">
                <button class="ui-btn" id="addPhotoBtn"><span>Добавить</span></button>
            </div>
        </div>
</div></dialog>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="/js/report.js" defer></script>
</body>
</html>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bootstrap Treeview Пример</title>
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery-treetable@3.2.0/css/jquery.treetable.css">
    <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/jquery-treetable@3.2.0/css/jquery.treetable.theme.default.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/themes/default/style.min.css">
    <link rel="stylesheet" href="/css/tree.css">
</head>
<body>

<header>
    header
    <div>

    </div>
</header>

<div class="table">
    <div class="table-content">
        <div class="table-header">
            <div>Строка ЗК/Спрос</div>
            <div>ДСЕ</div>
            <div>Узел ПЛМ</div>
            <div>Описание(заход)</div>
            <div>План<br>брутто</div>
            <div>Выполнено</div>
            <div>Трудоемкость</div>
            <div>Дата начала</div>
            <div>Дата завершения</div>
            <div>РД начала</div>
            <div>РД завершения</div>
        </div>
        <div class="table-body">
            <div class="row" data-parent-id="0" data-id="1" data-depth="0">
                <div class="hamburger">
                    <input class="checkbox" type="checkbox"/>
                    <svg fill="none" viewBox="0 0 50 50" height="15" width="15">
                        <path class="lineTop line" stroke-linecap="round" stroke-width="4" stroke="black"
                              d="M6 11L44 11"></path>
                        <path stroke-linecap="round" stroke-width="4" stroke="black" d="M6 24H43"
                              class="lineMid line"></path>
                        <path stroke-linecap="round" stroke-width="4" stroke="black" d="M6 37H43"
                              class="lineBottom line"></path>
                    </svg>
                </div>
                <div class="cell"><p>Какая-то строка ЗК/Спрос с номером каким-то WWWWWWW</p></div>
                <div class="cell"><p>Самое обыкновенное ДСЕ</p></div>
                <div class="cell position-center"><p>Узел такой-то ПЛМ</p></div>
                <div class="cell position-center"><p>Там бля он бля вон бля он бля</p></div>
                <div class="cell position-center"><p>100</p></div>
                <div class="cell position-center"><p>99</p></div>
                <div class="cell position-center"><p>11.131</p></div>
                <div class="cell position-center"><p>12.13.2025</p></div>
                <div class="cell position-center"><p>12.13.2025</p></div>
                <div class="cell position-center"><p>12.13.2025</p></div>
                <div class="cell position-center"><p>12.13.2025</p></div>
                <div class="nested-rows">
                    <div class="row"  data-parent-id="1" data-id="2" data-depth="1">
                        <div class="hamburger">
                            <input class="checkbox" type="checkbox"/>
                            <svg fill="none" viewBox="0 0 50 50" height="15" width="15">
                                <path
                                        class="lineTop line"
                                        stroke-linecap="round"
                                        stroke-width="4"
                                        stroke="black"
                                        d="M6 11L44 11"
                                ></path>
                                <path
                                        stroke-linecap="round"
                                        stroke-width="4"
                                        stroke="black"
                                        d="M6 24H43"
                                        class="lineMid line"
                                ></path>
                                <path
                                        stroke-linecap="round"
                                        stroke-width="4"
                                        stroke="black"
                                        d="M6 37H43"
                                        class="lineBottom line"
                                ></path>
                            </svg>
                        </div>
                        <div class="inner-cell"><p>ЭТО ВЛОЖЕННАЯ СТРОКА ВО ВЛОЖЕННОЙ СТРОКЕ ВО ВЛОЖЕННОЙ СТРОКЕ В СТРОКЕ
                            РОДИТЕЛЕ ЕЙ ПО КАФУ КАФОВАТЬ И КАФОВА СУЩЕСТВОВАТЬ
                        </p></div>
                        <div class="inner-cell"><p>Самое обыкновенное ДСЕ</p></div>
                        <div class="inner-cell position-center"><p>Узел такой-то ПЛМ</p></div>
                        <div class="inner-cell position-center"><p>Там бля он бля вон бля он бля</p></div>
                        <div class="inner-cell position-center"><p>100</p></div>
                        <div class="inner-cell position-center"><p>99</p></div>
                        <div class="inner-cell position-center"><p>11.131</p></div>
                        <div class="inner-cell position-center"><p>12.13.2025</p></div>
                        <div class="inner-cell position-center"><p>12.13.2025</p></div>
                        <div class="inner-cell position-center"><p>12.13.2025</p></div>
                        <div class="inner-cell position-center"><p>12.13.2025</p></div>
                        <div class="nested-rows">
                            <div class="row"  data-parent-id="2" data-id="3" data-depth="2">
                                <div class="hamburger">
                                    <input class="checkbox" type="checkbox"/>
                                    <svg fill="none" viewBox="0 0 50 50" height="15" width="15">
                                        <path
                                                class="lineTop line"
                                                stroke-linecap="round"
                                                stroke-width="4"
                                                stroke="black"
                                                d="M6 11L44 11"
                                        ></path>
                                        <path
                                                stroke-linecap="round"
                                                stroke-width="4"
                                                stroke="black"
                                                d="M6 24H43"
                                                class="lineMid line"
                                        ></path>
                                        <path
                                                stroke-linecap="round"
                                                stroke-width="4"
                                                stroke="black"
                                                d="M6 37H43"
                                                class="lineBottom line"
                                        ></path>
                                    </svg>
                                </div>
                                <div class="inner-cell"><p>ЭТО ВЛОЖЕННАЯ СТРОКА ВО ВЛОЖЕННОЙ СТРОКЕ ВО ВЛОЖЕННОЙ СТРОКЕ В СТРОКЕ
                                    РОДИТЕЛЕ ЕЙ ПО КАФУ КАФОВАТЬ И КАФОВА СУЩЕСТВОВАТЬ
                                </p></div>
                                <div class="inner-cell"><p>Самое обыкновенное ДСЕ</div>
                                <div class="inner-cell position-center"><p>Узел такой-то ПЛМ</p></div>
                                <div class="inner-cell position-center"><p>Там бля он бля вон бля он бля</p></div>
                                <div class="inner-cell position-center"><p>100</p></div>
                                <div class="inner-cell position-center"><p>99</p></div>
                                <div class="inner-cell position-center"><p>11.131</p></div>
                                <div class="inner-cell position-center"><p>12.13.2025</p></div>
                                <div class="inner-cell position-center"><p>12.13.2025</p></div>
                                <div class="inner-cell position-center"><p>12.13.2025</p></div>
                                <div class="inner-cell position-center"><p>12.13.2025</p></div>
                                <div class="nested-rows">
                                    <div class="row"  data-parent-id="3" data-id="4" data-depth="3">
                                        <div class="hamburger">
                                            <input class="checkbox" type="checkbox"/>
                                            <svg fill="none" viewBox="0 0 50 50" height="15" width="15">
                                                <path
                                                        class="lineTop line"
                                                        stroke-linecap="round"
                                                        stroke-width="4"
                                                        stroke="black"
                                                        d="M6 11L44 11"
                                                ></path>
                                                <path
                                                        stroke-linecap="round"
                                                        stroke-width="4"
                                                        stroke="black"
                                                        d="M6 24H43"
                                                        class="lineMid line"
                                                ></path>
                                                <path
                                                        stroke-linecap="round"
                                                        stroke-width="4"
                                                        stroke="black"
                                                        d="M6 37H43"
                                                        class="lineBottom line"
                                                ></path>
                                            </svg>
                                        </div>
                                        <div class="inner-cell"><p>ЭТО ВЛОЖЕННАЯ СТРОКА ВО ВЛОЖЕННОЙ СТРОКЕ ВО ВЛОЖЕННОЙ СТРОКЕ В СТРОКЕ
                                                РОДИТЕЛЕ ЕЙ ПО КАФУ КАФОВАТЬ И КАФОВА СУЩЕСТВОВАТЬ
                                            </p></div>
                                        <div class="inner-cell"><p>Самое обыкновенное ДСЕ</div>
                                        <div class="inner-cell position-center"><p>Узел такой-то ПЛМ</p></div>
                                        <div class="inner-cell position-center"><p>Там бля он бля вон бля он бля</p></div>
                                        <div class="inner-cell position-center"><p>100</p></div>
                                        <div class="inner-cell position-center"><p>99</p></div>
                                        <div class="inner-cell position-center"><p>11.131</p></div>
                                        <div class="inner-cell position-center"><p>12.13.2025</p></div>
                                        <div class="inner-cell position-center"><p>12.13.2025</p></div>
                                        <div class="inner-cell position-center"><p>12.13.2025</p></div>
                                        <div class="inner-cell position-center"><p>12.13.2025</p></div>
                                        <div class="nested-rows">
                                            <div class="row"  data-parent-id="4" data-id="5" data-depth="4">
                                                <div class="hamburger">
                                                    <input class="checkbox" type="checkbox"/>
                                                    <svg fill="none" viewBox="0 0 50 50" height="15" width="15">
                                                        <path
                                                                class="lineTop line"
                                                                stroke-linecap="round"
                                                                stroke-width="4"
                                                                stroke="black"
                                                                d="M6 11L44 11"
                                                        ></path>
                                                        <path
                                                                stroke-linecap="round"
                                                                stroke-width="4"
                                                                stroke="black"
                                                                d="M6 24H43"
                                                                class="lineMid line"
                                                        ></path>
                                                        <path
                                                                stroke-linecap="round"
                                                                stroke-width="4"
                                                                stroke="black"
                                                                d="M6 37H43"
                                                                class="lineBottom line"
                                                        ></path>
                                                    </svg>
                                                </div>
                                                <div class="inner-cell"><p>ЭТО ВЛОЖЕННАЯ СТРОКА ВО ВЛОЖЕННОЙ СТРОКЕ ВО ВЛОЖЕННОЙ СТРОКЕ В СТРОКЕ
                                                        РОДИТЕЛЕ ЕЙ ПО КАФУ КАФОВАТЬ И КАФОВА СУЩЕСТВОВАТЬ
                                                    </p></div>
                                                <div class="inner-cell"><p>Самое обыкновенное ДСЕ</div>
                                                <div class="inner-cell position-center"><p>Узел такой-то ПЛМ</p></div>
                                                <div class="inner-cell position-center"><p>Там бля он бля вон бля он бля</p></div>
                                                <div class="inner-cell position-center"><p>100</p></div>
                                                <div class="inner-cell position-center"><p>99</p></div>
                                                <div class="inner-cell position-center"><p>11.131</p></div>
                                                <div class="inner-cell position-center"><p>12.13.2025</p></div>
                                                <div class="inner-cell position-center"><p>12.13.2025</p></div>
                                                <div class="inner-cell position-center"><p>12.13.2025</p></div>
                                                <div class="inner-cell position-center"><p>12.13.2025</p></div>
                                                <div class="nested-rows">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row"  data-parent-id="0" data-id="6" data-depth="0">
                <div class="hamburger">
                    <input class="checkbox" type="checkbox"/>
                    <svg fill="none" viewBox="0 0 50 50" height="15" width="15">
                        <path
                                class="lineTop line"
                                stroke-linecap="round"
                                stroke-width="4"
                                stroke="black"
                                d="M6 11L44 11"
                        ></path>
                        <path
                                stroke-linecap="round"
                                stroke-width="4"
                                stroke="black"
                                d="M6 24H43"
                                class="lineMid line"
                        ></path>
                        <path
                                stroke-linecap="round"
                                stroke-width="4"
                                stroke="black"
                                d="M6 37H43"
                                class="lineBottom line"
                        ></path>
                    </svg>
                </div>
                <div class="inner-cell"><p>ЭТО ВЛОЖЕННАЯ СТРОКА ВО ВЛОЖЕННОЙ СТРОКЕ ВО ВЛОЖЕННОЙ СТРОКЕ В СТРОКЕ
                    РОДИТЕЛЕ ЕЙ ПО КАФУ КАФОВАТЬ И КАФОВА СУЩЕСТВОВАТЬ
                    </p></div>
                <div class="inner-cell"><p>Самое обыкновенное ДСЕ</p></div>
                <div class="inner-cell position-center"><p>Узел такой-то ПЛМ</p></div>
                <div class="inner-cell position-center"><p>Там бля он бля вон бля он бля</p></div>
                <div class="inner-cell position-center"><p>100</p></div>
                <div class="inner-cell position-center"><p>99</p></div>
                <div class="inner-cell position-center"><p>11.131</p></div>
                <div class="inner-cell position-center"><p>12.13.2025</p></div>
                <div class="inner-cell position-center"><p>12.13.2025</p></div>
                <div class="inner-cell position-center"><p>12.13.2025</p></div>
                <div class="inner-cell position-center"><p>12.13.2025</p></div>
                <div class="nested-rows">
                    <div class="row"  data-parent-id="6" data-id="7" data-depth="1">
                        <div class="hamburger">
                            <input class="checkbox" type="checkbox"/>
                            <svg fill="none" viewBox="0 0 50 50" height="15" width="15">
                                <path
                                        class="lineTop line"
                                        stroke-linecap="round"
                                        stroke-width="4"
                                        stroke="black"
                                        d="M6 11L44 11"
                                ></path>
                                <path
                                        stroke-linecap="round"
                                        stroke-width="4"
                                        stroke="black"
                                        d="M6 24H43"
                                        class="lineMid line"
                                ></path>
                                <path
                                        stroke-linecap="round"
                                        stroke-width="4"
                                        stroke="black"
                                        d="M6 37H43"
                                        class="lineBottom line"
                                ></path>
                            </svg>
                        </div>
                        <div class="inner-cell"><p>ЭТО ВЛОЖЕННАЯ СТРОКА ВО ВЛОЖЕННОЙ СТРОКЕ ВО ВЛОЖЕННОЙ СТРОКЕ В СТРОКЕ
                                РОДИТЕЛЕ ЕЙ ПО КАФУ КАФОВАТЬ И КАФОВА СУЩЕСТВОВАТЬ
                            </p></div>
                        <div class="inner-cell"><p>Самое обыкновенное ДСЕ</div>
                        <div class="inner-cell position-center"><p>Узел такой-то ПЛМ</p></div>
                        <div class="inner-cell position-center"><p>Там бля он бля вон бля он бля</p></div>
                        <div class="inner-cell position-center"><p>100</p></div>
                        <div class="inner-cell position-center"><p>99</p></div>
                        <div class="inner-cell position-center"><p>11.131</p></div>
                        <div class="inner-cell position-center"><p>12.13.2025</p></div>
                        <div class="inner-cell position-center"><p>12.13.2025</p></div>
                        <div class="inner-cell position-center"><p>12.13.2025</p></div>
                        <div class="inner-cell position-center"><p>12.13.2025</p></div>
                        <div class="nested-rows">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>


<!-- Модальное окно -->
<div class="modal fade" id="customerOrderModal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2"
     tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content rounded-4 shadow-lg">
            <div class="modal-header bg-primary text-white p-3">
                <h1 class="modal-title fs-5 fw-bold"><i class="bi bi-bag-check me-2"></i>Выбор заказа клиента
                </h1>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Закрыть"></button>
            </div>
            <div class="modal-body p-0">
                <!-- Поле поиска -->
                <div class="sticky-top bg-light p-3 border-bottom">
                    <div class="input-group">
                        <input type="text"
                               class="form-control border-start-0"
                               id="searchCustomerOrder"
                               placeholder="Введите название заказа для поиска...">
                    </div>
                </div>

                <!-- Контейнер для заголовков таблицы -->
                <div id="customerOrderModalHeadContainer" class="bg-light p-2 border-bottom">
                    <div class="row fw-bold text-muted small">
                        <div class="col-md-4">Название заказа</div>
                        <div class="col-md-3">Клиент</div>
                        <div class="col-md-3">Дата создания</div>
                        <div class="col-md-2">Статус</div>
                    </div>
                </div>

                <!-- Контейнер для данных -->
                <div id="customerOrderModalDataContainer" style="height: 500px; overflow-y: auto;"></div>
            </div>
        </div>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/colresizable@1.6.0/colResizable-1.6.min.js"></script>
<script src="/js/report.js" defer></script>
</body>
</html>
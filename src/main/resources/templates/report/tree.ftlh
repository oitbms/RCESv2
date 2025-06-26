<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bootstrap Treeview Пример</title>
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-treeview@1.2.0/dist/bootstrap-treeview.min.css" rel="stylesheet">

    <link rel="stylesheet" href="/css/tree.css">
    <link rel="stylesheet" href="/css/stylesBid.css">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap-treeview@1.2.0/dist/bootstrap-treeview.min.js"></script>

    <script src="/js/report.js" defer></script>
</head>
<body>
<div class="container">
    <h2 class="text-center">Пример Bootstrap Treeview</h2>

    <div class="container-fluid">
        <!-- Центральное поле ввода с кнопкой -->
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="input-group input-group-center">
                    <span class="input-group-text">Заказ клиента</span>
                    <input type="text" class="form-control" id="customerOrderName" placeholder="Выберите заказ...">
                    <input type="hidden" id="spmCustomerOrder">
                    <button type="button" class="btn btn-outline-primary openModal"
                            data-primarilyEndpoint="getBurningCustomerOrder"
                            data-endpoint="getAllCustomerOrder"
                            data-input-id="customerOrderName"
                            data-hidden-entity="spmCustomerOrder"
                            data-modal-id="customerOrderModal">
                        Выбрать из списка
                    </button>
                    <button type="button" class="btn btn-primary" id="btnGenerate">
                        Сформировать
                    </button>
                </div>
            </div>
        </div>
    </div>

<#--    <div class="controls">-->
<#--        <button id="btnExpandAll" class="btn btn-primary btn-sm">Развернуть все</button>-->
<#--        <button id="btnCollapseAll" class="btn btn-secondary btn-sm">Свернуть все</button>-->
<#--        <button id="btnGetSelected" class="btn btn-success btn-sm">Получить выбранные</button>-->
<#--    </div>-->

    <div id="table-container" class="table-container" style="display:none;">
        <table class="tree-table table-bordered">
            <thead id="tableHead">
            <tr>
                <th>Строка ЗК/Спрос</th>
                <th>ТМЦ/Заход</th>
                <th>Узел ПЛМ</th>
                <th>Описание</th>
                <th>План брутто</th>
                <th>Выполнено</th>
                <th>Общее время захода</th>
                <th>Дата начала</th>
                <th>Дата завершения</th>
                <th>РД начала</th>
                <th>РД завершения</th>
            </tr>
            </thead>
            <tbody id="tableBody">
            <!-- Данные -->
            </tbody>
        </table>
    </div>

    <div id="treeview"></div>

    <div id="output" class="mt-3 text-center"></div>
</div>

<!-- Модальное окно -->
<div class="modal fade" id="customerOrderModal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content rounded-4 shadow">
            <div class="modal-header bg-light p-3">
                <h1 class="modal-title fs-5">Выбор заказа клиента</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
            </div>
            <div class="modal-body p-0">
                <!-- Поле поиска -->
                <div class="sticky-top bg-white p-3 border-bottom">
                    <div class="input-group">
                        <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                        <input type="text"
                               class="form-control border-start-0"
                               id="searchCustomerOrder"
                               placeholder="Поиск заказа...">
                    </div>
                </div>

                <!-- Контейнер для заголовков таблицы -->
                <div id="customerOrderModalHeadContainer"></div>

                <!-- Контейнер для данных -->
                <div id="customerOrderModalDataContainer" style="height: 400px; overflow-y: auto;"></div>
            </div>
        </div>
    </div>
</div>

</body>
</html>
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
<div class="table-container">
    <div id="tree_container">

    </div>
</div>

<div class="filter-wrapper">
    <div class="container" id="filterContainer">
        <div class="row justify-content-center">
            <div class="col-lg-8 col-md-10">
                <!-- Центральное поле ввода с кнопкой -->
                <div class="input-group mb-3 custom-input-group">
                <span class="input-group-text bg-primary text-white"><i
                            class="bi bi-bag-check me-2"></i>Заказ клиента</span>
                    <input type="text" class="form-control" id="customerOrderName" placeholder="Выберите заказ..."
                           readonly>
                    <input type="hidden" id="spmCustomerOrder">
                    <button type="button" class="btn btn-outline-primary openModal"
                            data-primarilyEndpoint="getBurningCustomerOrder"
                            data-endpoint="getAllCustomerOrder"
                            data-input-id="customerOrderName"
                            data-hidden-entity="spmCustomerOrder"
                            data-modal-id="customerOrderModal">
                        <i class="bi bi-search me-1"></i> Выбрать
                    </button>
                    <button type="button" class="btn btn-primary" id="btnGenerate">
                        <i class="bi bi-file-earmark-arrow-down me-1"></i> Сформировать
                    </button>
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
                <h1 class="modal-title fs-5 fw-bold"><i class="bi bi-bag-check me-2"></i>Выбор заказа клиента</h1>
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
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/colresizable@1.6.0/colResizable-1.6.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/jstree.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jstree-grid/3.9.5/jstreegrid.min.js"></script>
<script src="/js/report.js" defer></script>
</body>
</html>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Детали здания</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="/css/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="/css/modern.css">
</head>
<body data-can-edit="${canEdit?c}">

<div class="container mt-4">
    <div id="loading-indicator" class="text-center">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Загрузка...</span>
        </div>
    </div>

    <div id="sub-division-content" style="display: none;" class="fade-in-up">
        <div class="page-header">
            <h1 id="machine-name" class="page-title"></h1>
            <div class="d-flex gap-2">
                <a href="/sub-division" class="btn btn-outline-secondary icon-text">
                    <i class="bi bi-arrow-left"></i>
                    <span>Назад к списку</span>
                </a>
                <#if canEdit>
                <a id="edit-button" href="#" class="btn btn-primary icon-text">
                    <i class="bi bi-pencil-square"></i>
                    <span>Редактировать</span>
                </a>
                <button id="delete-button" class="btn btn-outline-danger icon-text">
                    <i class="bi bi-trash"></i>
                    <span>Удалить</span>
                </button>
                </#if>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-header">
                <h5><i class="bi bi-info-circle me-2"></i>Основная информация</h5>
            </div>
            <div class="card-body">
                <dl class="info-grid">
                    <dt>Инвентарный номер</dt>
                    <dd id="subdivision-item-number" class="tabular-nums"></dd>
                    <dt>Подразделение</dt>
                    <dd id="machine-subdivision-name"></dd>
                </dl>
            </div>
        </div>

        <div class="card mt-4">
            <div class="card-header">
                <h5><i class="bi bi-images me-2"></i>Фотографии</h5>
            </div>
            <div class="card-body">
                <div id="photos-gallery" class="row g-3">

                </div>
            </div>
        </div>

        <div class="row g-4 mt-0">
            <div class="col-lg-8">
                <div class="card h-100">
                    <div class="card-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <a class="text-decoration-none text-body me-3 collapsed" data-bs-toggle="collapse"
                               href="#collapseDocuments" role="button" aria-expanded="false"
                               aria-controls="collapseDocuments">
                                <div class="d-flex align-items-center collapsible-header">
                                    <h5 class="mb-0"><i class="bi bi-file-earmark-text me-2"></i>Документация</h5>
                                    <i class="bi bi-chevron-down ms-2 collapse-icon"></i>
                                </div>
                            </a>
                            <#if canEdit>
                            <button class="btn btn-sm btn-success icon-text flex-shrink-0" data-bs-toggle="modal"
                                    data-bs-target="#add-document-modal">
                                <i class="bi bi-plus-circle"></i>
                                <span>Добавить документ</span>
                            </button>
                            </#if>
                        </div>
                    </div>
                    <div class="collapse" id="collapseDocuments">
                        <ul class="list-group list-group-flush" id="documents-list">

                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card h-100">
                    <div class="card-body text-center d-flex flex-column justify-content-center">
                        <h5 class="card-title mb-3">QR-код здания</h5>
                        <div class="d-flex justify-content-center mb-3">
                            <canvas id="qr-code-canvas"
                                    class="qr-canvas"></canvas>
                        </div>
                        <a id="download-qr-btn" class="btn btn-outline-primary icon-text" download="qr-code.png">
                            <i class="bi bi-download"></i>
                            <span>Скачать</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <#include "macros/other-section.ftlh">
    </div>
</div>

<div class="modal fade" id="add-document-modal" tabindex="-1" aria-labelledby="addDocumentModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addDocumentModalLabel">Добавить новые документы</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="add-document-form">
                    <div class="mb-3">
                        <label for="new-documents" class="form-label">Выберите файлы (PDF)</label>
                        <input class="form-control" type="file" id="new-documents" multiple
                               accept="application/pdf"
                               required>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                <button type="button" class="btn btn-primary icon-text" id="upload-documents-button">
                    <i class="bi bi-upload"></i>
                    <span>Загрузить</span>
                </button>
            </div>
        </div>
    </div>
</div>

<div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div id="app-toast" class="toast align-items-center text-white border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body" id="app-toast-body"></div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>
</div>

<script src="/js/bootstrap/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/qrcode@1/build/qrcode.min.js"></script>
<script src="/js/dist/sub-division.js"></script>

<div class="modal fade" id="imageViewerModal" tabindex="-1" aria-labelledby="imageViewerModalLabel"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
            <div class="modal-header border-0">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center p-0">
                <img src="" class="img-fluid" id="modalImage" alt="Увеличенное изображение">
            </div>
        </div>
    </div>
</div>
</body>
</html>


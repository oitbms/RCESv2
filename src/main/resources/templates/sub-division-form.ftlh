<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Форма станка</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="/css/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css"/>
    <link rel="stylesheet" href="/css/modern.css">
</head>
<body>

<div class="container mt-4">
    <div class="page-header fade-in-up">
        <h1 id="form-title" class="page-title">Создание нового здания</h1>
        <a href="/sub-division" class="btn btn-outline-secondary icon-text">
            <i class="bi bi-arrow-left"></i>
            <span>Назад к списку</span>
        </a>
    </div>

    <div class="card fade-in-up">
        <div class="card-body p-4">
            <form id="sub-division-form" enctype="multipart/form-data">
                <input type="hidden" id="machine-id" name="machineId">

                <div class="mb-3">
                    <label for="name" class="form-label">Полное название</label>
                    <input type="text" class="form-control" id="name" name="name" maxlength="255" required
                           placeholder="Например: Цех №3 (Механический участок)">
                </div>

                <div class="col-md-6 mb-3">
                    <label for="subDivision" class="form-label">Подразделение</label>
                    <select id="subDivision" name="subDivisionId" class="form-select">

                    </select>
                </div>

                <p class="form-text text-muted d-none" data-edit-only>
                    <i class="bi bi-info-circle me-1"></i>Документы и фотографии добавляются и удаляются в карточке здания.
                </p>

                <div class="mb-3" data-create-only>
                    <label for="documentFiles" class="form-label">Руководство по эксплуатации и инструкция по ОТ</label>
                    <input class="form-control" type="file" id="documentFiles" name="documentFiles" multiple accept="application/pdf">
                </div>

                <div class="mb-3" data-create-only>
                    <label for="additionalFiles" class="form-label">Фотографии</label>
                    <input class="form-control" type="file" id="additionalFiles" name="additionalFiles" multiple accept="image/*">
                </div>

                <div class="mb-3" hidden="hidden">
                    <label for="buildingId" class="form-label">Id</label>
                    <input type="number" class="form-control" id="buildingId" name="id">
                </div>

                <div class="form-actions">
                    <a href="/sub-division" class="btn btn-outline-secondary icon-text">
                        <i class="bi bi-x-circle"></i>
                        <span>Отмена</span>
                    </a>
                    <button type="submit" class="btn btn-primary icon-text" id="save-button">
                        <i class="bi bi-check-circle"></i>
                        <span>Сохранить</span>
                    </button>
                </div>
            </form>
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
<script src="/js/dist/sub-division.js"></script>
<script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>
</body>
</html>

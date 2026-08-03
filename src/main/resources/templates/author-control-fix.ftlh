<!doctype html>
<html lang="ru" xmlns="http://www.w3.org/1999/html">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Фотографии исправлений</title>
    <link href="/css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <style>
        body {
            padding-bottom: 100px;
        }

        .fab {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1050;
        }

        .fab .btn {
            border-radius: 50%;
            width: 60px;
            height: 60px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .image-card {
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            background: white;
        }

        .zoom-container {
            overflow: hidden;
            touch-action: pan-y;
            cursor: grab;
        }

        .zoom-container img {
            width: 100%;
            height: auto;
            display: block;
            user-select: none;
        }

        .image-caption {
            text-align: center;
            padding: 10px;
            font-size: 0.9rem;
            background-color: #f8f9fa;
        }

        .deviation-header {
            text-align: center;
            margin-bottom: 20px;
        }
    </style>
</head>
<body class="bg-light">
<div class="container mt-4">
    <div class="container mt-4">
        <div class="deviation-header">
            <h5>Устранение отклонения</h5>
            <small class="text-muted">Акт №: AАН-${authorControl.getId()}</small>
        </div>
        <div class="deviation-header">
            <div class="row g-3">
                <#if authorControl.getImagesCorrections()?? && authorControl.getImagesCorrections()?size gt 0>
                    <#list authorControl.getImagesCorrections() as image>
                        <div class="col-12 col-sm-6 col-md-4">
                            <div class="image-card">
                                <div class="zoom-container">
                                    <img src="${image.getBase64Data()}"
                                         class="img-fluid"/>
                                </div>
                                <div class="image-caption">
                                    Фото отклонения
                                </div>
                            </div>
                        </div>
                    </#list>
                <#else>
                    <div class="col-12">
                        <p class="text-muted">Нет изображений</p>
                    </div>
                </#if>
            </div>
        </div>
    </div>
    <div class="row g-3">
    </div>
</div>

<div class="fab">
    <button onclick="window.location.href='/view/author-control/${authorControl.getAuthorControl()}'" class="btn btn-secondary">
        <i class="bi bi-arrow-left"></i>
    </button>
</div>
<script src="/js/bootstrap.bundle.min.js"></script>
</body>
</html>
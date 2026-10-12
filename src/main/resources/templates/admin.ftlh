<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/css/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="/css/base.css">
    <link rel="stylesheet" href="/css/admin.css">
    <#include "macros/registry-scripts.ftlh">
    <@registryScripts module="admin" />
    <title>Администрирование пользователей</title>
</head>
<body>
<div class="admin-container">
    <header>
        <div class="title">
            <h1>Управление пользователями</h1>
        </div>
        <div class="filters">
            <div class="filter-field search-field">
                <label for="user-search">Поиск</label>
                <input type="text" id="user-search" placeholder="Имя сотрудника...">
            </div>
            <div class="filter-field">
                <label for="role-filter">Роль</label>
                <select id="role-filter">
                    <option value="">Все роли</option>
                    <#list roles as role>
                        <option value="${role}">${role}</option>
                    </#list>
                </select>
            </div>
            <div class="filter-field">
                <label for="subdivision-filter">Подразделение</label>
                <select id="subdivision-filter">
                    <option value="">Все подразделения</option>
                    <#list mlmNodes as mlmNode>
                        <option value="${mlmNode.id}">${mlmNode.name}</option>
                    </#list>
                </select>
            </div>
            <div class="filter-field">
                <label for="active-filter">Статус</label>
                <select id="active-filter">
                    <option value="">Все</option>
                    <option value="true">Активные</option>
                    <option value="false">Отключённые</option>
                </select>
            </div>
            <button type="button" class="btn-secondary-action" id="reset-filters">Сбросить</button>
            <button type="button" class="btn-primary-action" id="create-user-btn">
                <i class="fas fa-plus"></i> Добавить
            </button>
        </div>
    </header>

    <div class="data-container">
        <div class="table-header">
            <div class="table-header-cell sortable" data-sort="id">ID</div>
            <div class="table-header-cell sortable" data-sort="name">Сотрудник</div>
            <div class="table-header-cell sortable" data-sort="subDivision">Подразделение</div>
            <div class="table-header-cell sortable" data-sort="role">Роль</div>
            <div class="table-header-cell">Уведомления</div>
            <div class="table-header-cell">ChatID</div>
            <div class="table-header-cell sortable" data-sort="active">Статус</div>
            <div class="table-header-cell">Действия</div>
        </div>
        <div class="table-body" id="usersBody"></div>
    </div>

    <div class="footer-bar">
        <div class="page-info" id="page-info"></div>
        <div class="pagination" id="pagination"></div>
    </div>
</div>

<dialog id="userDialog" aria-labelledby="userDialogTitle">
    <div class="modal-header">
        <h2 class="modal-title" id="userDialogTitle">Создание пользователя</h2>
        <button type="button" class="btn-close user-dialog-close" aria-label="Закрыть"></button>
    </div>
    <form id="userForm" novalidate>
        <input type="hidden" id="userId" name="id">
        <input type="hidden" id="userVersion" name="version">
        <div class="modal-body">
            <div class="form-error-banner" id="userFormError" role="alert" hidden></div>

            <div class="form-group full-width">
                <label class="form-label" for="userName">Имя пользователя <span class="required">*</span></label>
                <input type="text" class="form-control" id="userName" name="name"
                       minlength="4" maxlength="100" autocomplete="off" required>
                <span class="field-error" id="userNameError" aria-live="polite"></span>
            </div>

            <div class="form-group">
                <label class="form-label" for="userPassword">
                    Пароль <span class="required" id="userPasswordRequired">*</span>
                </label>
                <input type="password" class="form-control" id="userPassword" name="password"
                       minlength="6" maxlength="100" autocomplete="new-password">
                <span class="field-hint" id="userPasswordHint">Минимум 6 символов</span>
                <span class="field-error" id="userPasswordError" aria-live="polite"></span>
            </div>

            <div class="form-group">
                <label class="form-label" for="userPasswordConfirm">
                    Подтверждение пароля <span class="required" id="userPasswordConfirmRequired">*</span>
                </label>
                <input type="password" class="form-control" id="userPasswordConfirm" name="passwordConfirm"
                       minlength="6" maxlength="100" autocomplete="new-password">
                <span class="field-error" id="userPasswordConfirmError" aria-live="polite"></span>
            </div>

            <div class="form-group">
                <label class="form-label" for="userSubdivision">Подразделение <span class="required">*</span></label>
                <select class="form-control" id="userSubdivision" name="subDivisionId" required>
                    <option value="">Выберите...</option>
                    <#list mlmNodes as mlmNode>
                        <option value="${mlmNode.id}">${mlmNode.name}</option>
                    </#list>
                </select>
                <span class="field-error" id="userSubdivisionError" aria-live="polite"></span>
            </div>

            <div class="form-group">
                <label class="form-label" for="userRole">Роль <span class="required">*</span></label>
                <select class="form-control" id="userRole" name="role" required>
                    <#list roles as role>
                        <option value="${role}">${role}</option>
                    </#list>
                </select>
                <span class="field-error" id="userRoleError" aria-live="polite"></span>
            </div>

            <div class="form-group">
                <label class="form-label" for="userNotificationApp">
                    Приложение уведомлений <span class="required">*</span>
                </label>
                <select class="form-control" id="userNotificationApp" name="notificationApp" required>
                    <#list notificationApp as notification>
                        <option value="${notification}">${notification}</option>
                    </#list>
                </select>
                <span class="field-error" id="userNotificationAppError" aria-live="polite"></span>
            </div>

            <div class="form-group">
                <label class="form-label" for="userActive">Статус <span class="required">*</span></label>
                <select class="form-control" id="userActive" name="active" required>
                    <option value="true">Активный</option>
                    <option value="false">Отключённый</option>
                </select>
                <span class="field-error" id="userActiveError" aria-live="polite"></span>
            </div>

            <div class="form-group full-width">
                <label class="form-label" for="userChatId">
                    ChatID <span class="required" id="userChatIdRequired">*</span>
                </label>
                <input type="number" class="form-control" id="userChatId" name="chatId" step="1" inputmode="numeric">
                <span class="field-hint" id="userChatIdHint"></span>
                <span class="field-error" id="userChatIdError" aria-live="polite"></span>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary user-dialog-cancel">Отмена</button>
            <button type="submit" class="btn btn-primary" id="userSaveBtn">
                <span class="btn-spinner" aria-hidden="true"></span>
                <span class="btn-label">Сохранить</span>
            </button>
        </div>

        <div class="dialog-loading" id="userDialogLoading" hidden>
            <span class="spinner" aria-hidden="true"></span>
            <span>Загрузка данных...</span>
        </div>
    </form>
</dialog>
</body>
</html>

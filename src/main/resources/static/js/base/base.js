/// <reference path="type/generalType.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Base {
    constructor(rowContainer, itemsPerPage = Infinity, visibleRow = Infinity, ...initCallbacks) {
        this.locks = new Map();
        this.handlers = [];
        this.selectedRows = new Set();
        this.localCache = new Map();
        this.currentPage = 1;
        this.saveMassive = {};
        this.cache = new CacheBormashImpl();
        this.dialog = new DialogImpl();
        //Блокировка параллельного выполнения
        this.lock = (fn) => (...args) => __awaiter(this, void 0, void 0, function* () {
            const key = fn.name;
            if (this.locks.get(key))
                return;
            this.locks.set(key, true);
            try {
                return yield fn(...args);
            }
            finally {
                this.locks.set(key, false);
            }
        });
        this.createHandler = (event, selector, handler, locked = false) => {
            this.handlers.push({
                event,
                selector,
                handler: locked ? this.lock(handler) : handler,
            });
        };
        this.createNotificationContainer = () => {
            const notificationsContainer = $(`<div id="notifications-container" popover="manual"></div>`);
            $('body').append(notificationsContainer);
        };
        this.updateRow = (item, rowIndex) => {
            const $oldRow = $(`[data-index="${rowIndex}"]`);
            const $newRow = this.createRow(item).hide();
            $oldRow.fadeOut(100, () => {
                $oldRow.replaceWith($newRow);
                $newRow.fadeIn(280);
                this.localCache.set(item.id, item);
            });
        };
        this.switchVisibilityRow = (rowIndex, hide) => {
            $(`[data-index="${rowIndex}"]`)[hide ? 'fadeOut' : 'fadeIn'](300);
        };
        this.save = (url, ...items) => __awaiter(this, void 0, void 0, function* () {
            const results = yield Promise.all(items.map(item => {
                const id = item.id;
                const version = item.version;
                const changes = item.changes;
                return this.requestToApi(`${url}/${id}${version != null ? `?version=${version}` : ''}`, 'PATCH', changes);
            }));
            results.forEach(item => {
                this.updateRow(item, item.id);
                delete this.saveMassive[item.id];
            });
            this.createNotification('Успешно обновлено', NotificationType.SUCCESS);
            return results;
        });
        this.requestToApi = (url, type, param) => __awaiter(this, void 0, void 0, function* () {
            return yield $.ajax({
                url: url,
                method: type,
                contentType: param instanceof FormData ? false : 'application/json',
                processData: !(param instanceof FormData),
                data: param instanceof FormData ? param : JSON.stringify(param)
            }).catch((xhr) => {
                const errorResponse = xhr.responseJSON;
                this.createNotification(errorResponse.message, errorResponse.notificationType);
                throw xhr;
            });
        });
        // Экранирование HTML для защиты от XSS
        this.escapeHtml = (unsafe) => {
            if (unsafe == null)
                return '';
            return String(unsafe)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        };
        //Скачивает все файлы с api
        this.downloadFile = (url, params) => __awaiter(this, void 0, void 0, function* () {
            try {
                url = url + (params ? `?${new URLSearchParams(params).toString()}` : '');
                const response = yield this.requestToApi(url, 'GET');
                const files = Array.isArray(response) ? response : [response];
                for (const file of files) {
                    // @ts-ignore
                    //Тут может быть какая-то ошибка
                    const binaryString = atob(file.data);
                    const uint8Array = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        uint8Array[i] = binaryString.charCodeAt(i);
                    }
                    const blob = new Blob([uint8Array]);
                    const objectUrl = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = objectUrl;
                    link.download = file.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setTimeout(() => URL.revokeObjectURL(objectUrl), 250);
                    if (files.length > 1)
                        yield new Promise(resolve => setTimeout(resolve, 1250));
                }
            }
            catch (error) {
                this.createNotification('Ошибка при скачивании файла', NotificationType.ERROR);
                console.error(error);
            }
        });
        this.createEntity = (url, dto) => {
            return this.requestToApi(url, 'POST', dto);
        };
        this.deleteEntity = (url) => {
            return this.requestToApi(`${url}`, 'DELETE');
        };
        //Создание уведомления в левом верхнем углу
        this.createNotification = (message, type, params, error) => {
            try {
                const text = params ? message.replace(/{(\w+)}/g, (m, k) => params[k]) : message;
                const container = document.getElementById('notifications-container');
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.innerHTML = `<div class="msg">${text}</div>`;
                container.appendChild(notification);
                if (!container.matches(':popover-open')) {
                    container.showPopover();
                }
                if (error)
                    console.error(error);
                setTimeout(() => notification.classList.add('show'), 10);
                setTimeout(() => {
                    notification.classList.remove('show');
                    notification.classList.add('hiding');
                    setTimeout(() => {
                        notification.remove();
                        if (container.children.length === 0) {
                            container.hidePopover();
                        }
                    }, 350);
                }, 3000);
            }
            catch (error) {
                console.error(error);
            }
        };
        //Диалог с подтверждением действия
        this.createConfirmationDialog = this.lock((message, params) => {
            return new Promise((resolve) => {
                const text = params ? message.replace(/{(\w+)}/g, (m, k) => params[k]) : message;
                let $dialog = $('#confirmDialog');
                if ($dialog.length === 0) {
                    $dialog = $(`
                    <dialog id="confirmDialog" class="confirm-dialog">
                        <div class="confirm-content">
                            <div class="confirm-message" id="confirmMessage">${text}</div>
                            <div class="confirm-buttons">
                                <button class="confirm-btn confirm-cancel" id="confirmCancel">Отмена</button>
                                <button class="confirm-btn confirm-ok" id="confirmOk">Подтвердить</button>
                            </div>
                        </div>
                    </dialog>
                `);
                    $('body').append($dialog);
                }
                else {
                    $('#confirmMessage').text(text);
                }
                const cleanup = () => {
                    $('#confirmCancel').off('click');
                    $('#confirmOk').off('click');
                    this.dialog.close('confirmDialog');
                };
                $('#confirmCancel').on('click', () => {
                    cleanup();
                    resolve(false);
                });
                $('#confirmOk').on('click', () => {
                    cleanup();
                    resolve(true);
                });
                this.dialog.open('confirmDialog', {
                    clearFields: false,
                    onClose: () => {
                        cleanup();
                        resolve(false);
                    }
                });
            });
        });
        //Контекстное меню
        this.createContextMenu = (items, x, y) => {
            $('#context-menu').remove();
            const menu = $('<div id="context-menu" popover="manual"></div>');
            items.forEach(item => {
                const $item = $(`<div id="${item.idAction}">${item.label}</div>`);
                $item.on('click', () => {
                    item.action();
                    menu[0].hidePopover();
                });
                menu.append($item);
            });
            $('body').append(menu.css({
                left: x + 'px',
                top: y + 'px',
            }));
            menu[0].showPopover();
            $(document).one('click', (e) => {
                if (!$(e.target).closest('#context-menu').length) {
                    menu[0].hidePopover();
                }
            });
        };
        this.showToolTip = (event) => {
            const element = event.currentTarget;
            const tooltipTimeout = setTimeout(() => {
                const description = element.getAttribute('data-description');
                if (!description)
                    return;
                const tooltip = document.createElement('div');
                tooltip.className = 'custom-tooltip';
                tooltip.textContent = description;
                tooltip.style.visibility = 'hidden';
                document.body.appendChild(tooltip);
                const rect = element.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();
                const gap = 6;
                let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
                let top = rect.bottom + gap;
                left = Math.min(Math.max(gap, left), window.innerWidth - tooltipRect.width - gap);
                if (top + tooltipRect.height > window.innerHeight - gap) {
                    top = rect.top - tooltipRect.height - gap;
                }
                top = Math.max(gap, top);
                tooltip.style.position = 'fixed';
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
                tooltip.style.visibility = 'visible';
                element._currentTooltip = tooltip;
            }, 450);
            element._tooltipTimeout = tooltipTimeout;
            const hideHandler = () => {
                clearTimeout(tooltipTimeout);
                if (element._currentTooltip) {
                    element._currentTooltip.remove();
                    element._currentTooltip = null;
                }
                element.removeEventListener('mouseleave', hideHandler);
            };
            element.addEventListener('mouseleave', hideHandler);
        };
        this.formatDate = (dateString) => {
            if (!dateString)
                return "";
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU');
        };
        this.formatDateTime = (dateString) => {
            if (!dateString)
                return "";
            const date = new Date(dateString);
            return date.toLocaleString('ru-RU', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };
        this.calculateColor = (color) => {
            switch (color) {
                case Color.NONE:
                    return 'var(--default-color, #f1f1f1)';
                case Color.RED:
                    return 'var(--critical-color, #ef4444)';
                case Color.GREEN:
                    return 'var(--success-color, #10b981)';
                case Color.YELLOW:
                    return 'var(--warning-color, #f59e0b)';
                case Color.BLUE:
                    return 'var(--info-color, #3b82f6)';
            }
        };
        this.lockScreen = (message = "Загрузка...") => {
            const overlay = $(`<div class="lock-overlay">${message}</div>`);
            $(document.body).addClass('locked').append(overlay);
            return () => {
                overlay.remove();
                $(document.body).removeClass('locked');
            };
        };
        // ============================================================
        // УНИВЕРСАЛЬНЫЕ МЕТОДЫ ДЛЯ НАСЛЕДНИКОВ
        // ============================================================
        // --- Поиск / фильтрация ---
        this.searchText = '';
        this.bindSearchInput = (selector, onSearch) => {
            this.createHandler('input', selector, (event) => {
                this.searchText = $(event.target).val().toString().toLowerCase().trim();
                if (onSearch) {
                    onSearch(this.searchText);
                }
                else {
                    this.applyFilters();
                }
            }, true);
        };
        // --- Режим редактирования ---
        this.editMode = false;
        /**
         * Включает режим редактирования для выбранных строк или конкретной строки.
         * @param dateTimeFields — массив имён полей, которые должны стать <input type="date">
         * @param row — конкретная строка (jQuery-объект), если null — все выбранные строки
         * @param specialFields — объекты {name: string, transform: ($div: any) => any} для кастомных полей
         */
        this.enableEditMode = (dateTimeFields = [], row, specialFields = []) => {
            const processElement = ($div) => {
                var _a;
                const dataName = $div.attr('data-name');
                const special = specialFields.find(f => f.name === dataName);
                if (special) {
                    $div.replaceWith(special.transform($div));
                    return;
                }
                if (dateTimeFields.indexOf(dataName) !== -1) {
                    const rowId = row ? row.attr('id') : $div.closest('.table-row').attr('id');
                    const cacheKey = (rowId && rowId.indexOf('.') !== -1) ? rowId : Number(rowId);
                    const value = (_a = this.localCache.get(cacheKey)) === null || _a === void 0 ? void 0 : _a[dataName];
                    const element = $(`<input type="date" data-name="${dataName}">`).val(value);
                    $div.replaceWith(element);
                }
                else {
                    $div.attr('contenteditable', 'true');
                }
            };
            if (row) {
                row.find('div[contenteditable="false"]').each(function () {
                    processElement($(this));
                });
                this.editMode = true;
                return;
            }
            for (const rowId of this.selectedRows) {
                const $row = $(`.table-row[id="${rowId}"]`);
                $row.find('div[contenteditable="false"]').each(function () {
                    processElement($(this));
                });
            }
            this.editMode = true;
        };
        /**
         * Выключает режим редактирования.
         * @param dateTimeFields — массив имён полей с датами
         * @param protectedFields — поля, которые не трогаем (document, references и т.п.)
         * @param row — конкретная строка, если null — все выбранные
         * @param extraCenterFields — поля, которые должны быть с классом center
         */
        this.disableEditMode = (dateTimeFields = [], protectedFields = [], row, extraCenterFields = []) => {
            if (this.editMode &&
                Object.keys(this.saveMassive).length > 0 &&
                ((row && row.find('.change').length > 0) || !row && $('.table-row .change').length > 0)) {
                this.createNotification("Сохраните изменения", NotificationType.WARNING);
                return;
            }
            const centerFields = new Set([...dateTimeFields, ...extraCenterFields]);
            const processElement = ($field) => {
                const dataName = $field.attr("data-name");
                if (protectedFields.indexOf(dataName) !== -1)
                    return;
                let value;
                if (dateTimeFields.indexOf(dataName) !== -1) {
                    value = this.formatDate($field.val());
                }
                else {
                    value = $field.is('select') ? $field.find('option:selected').text() : $field.text();
                }
                const centerClass = centerFields.has(dataName) ? ' center' : '';
                $field.replaceWith(`<div class="field-container${centerClass}" data-name="${dataName}" contenteditable="false">${value}</div>`);
            };
            if (row) {
                row.find('div[contenteditable="true"], select[data-name], input[data-name]').each(function () {
                    processElement($(this));
                });
                return;
            }
            for (const rowId of this.selectedRows) {
                const $row = $(`.table-row[id="${rowId}"]`);
                $row.find('div[contenteditable="true"], select[data-name], input[data-name]').each(function () {
                    processElement($(this));
                });
            }
            this.editMode = false;
        };
        /**
         * Универсальный toggle выбора строки (для circle-row клика).
         * @param event — событие клика
         * @param checkEditChanges — проверять несохранённые изменения перед снятием выделения
         */
        this.toggleRowSelection = (event, checkEditChanges = true) => {
            const circle = $(event.currentTarget);
            const currentRow = circle.closest('.table-row, .row-items-row');
            const currentRowId = currentRow.attr('id');
            const changes = checkEditChanges ? currentRow.find('.change').length : 0;
            if (this.editMode && changes > 0) {
                this.createNotification("Сохраните изменения", NotificationType.WARNING);
                return;
            }
            if (!this.selectedRows.has(currentRowId)) {
                this.selectedRows.add(currentRowId);
                currentRow.addClass('selected');
                circle.addClass('active-critical');
            }
            else {
                this.selectedRows.delete(currentRowId);
                currentRow.removeClass('selected');
                circle.removeClass('active-critical');
                // Снимаем выделение с header-circle если нет выбранных строк
                if (this.selectedRows.size === 0) {
                    $('.circle-header').removeClass('active');
                }
            }
        };
        /**
         * Выбрать/снять все видимые строки (для circle-header).
         * @param event — событие
         * @param rowSelector — селектор строки (по умолчанию '.table-row')
         * @param circleRowSelector — селектор кружка в строке
         */
        this.editDateFields = [];

        this.toggleAllRowsSelection = (event, rowSelector = '.table-row', circleRowSelector = '.circle-row') => {
            const circle = $(event.currentTarget);
            const allRows = $(`${rowSelector}:visible`);
            // If in edit mode, allow cancelling selection and properly exit edit mode for each row.
            if (this.editMode) {
                if (circle.hasClass('active')) {
                    // For each selected row, disable edit mode for that specific row so special fields are converted correctly
                    allRows.each((_, row) => {
                        const $row = $(row);
                        if ($row.hasClass('selected')) {
                            try {
                                this.disableEditMode(this.editDateFields, [], $row);
                            }
                            catch (e) {
                                console.error(e);
                            }
                        }
                    });
                    this.selectedRows.clear();
                    allRows.removeClass('selected');
                    allRows.each((_, row) => {
                        $(row).find(circleRowSelector).removeClass('active-critical');
                    });
                    circle.removeClass('active');
                    this.editMode = false;
                    return;
                }
                this.createNotification('Выключите режим редактирования', NotificationType.INFO);
                return;
            }
            if (circle.hasClass('active')) {
                this.selectedRows.clear();
                allRows.removeClass('selected');
                allRows.each((_, row) => {
                    $(row).find(circleRowSelector).removeClass('active-critical');
                });
                circle.removeClass('active');
            }
            else {
                this.selectedRows.clear();
                allRows.each((_, row) => {
                    const $row = $(row);
                    const rowId = $row.attr('id');
                    this.selectedRows.add(rowId);
                    $row.addClass('selected');
                    $row.find(circleRowSelector).addClass('active-critical');
                });
                circle.addClass('active');
            }
        };
        /**
         * Привязывает обработчик input для отслеживания изменений в полях строки.
         * Автоматически сохраняет в saveMassive[id][name] = value.
         */
        this.bindFieldChanges = (fieldSelector = '[data-name]', rowSelector = '.table-row') => {
            this.createHandler('input', fieldSelector, (event) => {
                const $el = $(event.target);
                const id = $el.closest(rowSelector).attr('id');
                const name = $el.attr('data-name');
                const value = $el.is('div') ? $el.text().trim() : $el.val();
                this.saveMassive[id] = Object.assign(Object.assign({}, this.saveMassive[id]), { [name]: value });
                $el.addClass('change');
            }, true);
        };
        /**
         * Универсальный диалог выбора элемента из списка с поиском.
         * @param fieldName — имя поля ('employee' / 'subDivision')
         * @param dialogId — ID диалога
         * @param modalDiv — jQuery-элемент, куда вставить результат
         * @param currentId — ID текущей строки (для saveMassive)
         * @param dataFilter — опциональный фильтр данных
         * @param columns — колонки для рендера [{key, label}]
         */
        this.openSelectionDialog = (fieldName_1, dialogId_1, modalDiv_1, currentId_1, dataFilter_1, ...args_1) => __awaiter(this, [fieldName_1, dialogId_1, modalDiv_1, currentId_1, dataFilter_1, ...args_1], void 0, function* (fieldName, dialogId, modalDiv, currentId, dataFilter, columns = [{ key: 'name', label: 'Наименование', width: '250' }]) {
            const dialog = $(`#${dialogId}`);
            const rowContainer = dialog.find('.dialog-content-rows');
            const searchInput = dialog.find('.choice-field input');
            const changeButton = dialog.find('[id^="change"]').first();
            let selected;
            const rawData = yield this.cache.get(fieldName);
            const data = dataFilter ? dataFilter(rawData) : rawData;
            const renderRows = (items) => {
                rowContainer.empty();
                items.forEach(item => {
                    let colsHtml = columns.map(col => `<div class="content-row-column col-${col.width || '250'}">${item[col.key] || (item[col.key + 'Name'] ? item[col.key + 'Name'] : '')}</div>`).join('');
                    rowContainer.append(`<div class="dialog-content-rows-row" data-id="${item.id}">${colsHtml}</div>`);
                });
            };
            renderRows(data);
            searchInput.off('input').on('input', function () {
                const searchText = $(this).val().toString().toLowerCase().trim();
                const filtered = data.filter((e) => columns.some(col => (e[col.key] || '').toString().toLowerCase().indexOf(searchText) !== -1));
                renderRows(filtered);
            });
            this.dialog.open(dialogId);
            rowContainer.off('click').on('click', '.dialog-content-rows-row', function () {
                const id = $(this).data('id');
                selected = data.find((e) => e.id === id);
                $('.dialog-content-rows-row').removeClass('selected');
                $(this).addClass('selected');
            });
            changeButton.off('click').on('click', () => {
                if (!selected) {
                    const label = fieldName === 'employee' ? 'сотрудника' : 'подразделение';
                    this.createNotification(`Выберите ${label} из списка`, NotificationType.WARNING);
                    return;
                }
                modalDiv.text(selected.name);
                modalDiv.val(selected.name);
                if (currentId) {
                    this.saveMassive[currentId] = Object.assign(Object.assign({}, this.saveMassive[currentId]), { [fieldName]: selected });
                }
                else {
                    this.saveMassive[fieldName] = selected;
                }
                modalDiv.addClass('change-textarea');
                this.dialog.close(dialogId);
            });
            modalDiv.addClass('change');
        });
        // --- Диалог документов ---
        /**
         * Универсальный диалог просмотра/загрузки файлов документа.
         * @param event — событие клика на иконку документа
         * @param documentId — ID документа (или поле в кэше)
         * @param getDocumentUrl — URL для получения документа
         * @param uploadUrlBase — базовый URL для загрузки (с условием PATCH/POST)
         * @param deleteUrlBase — базовый URL для удаления
         * @param onFileAdded — колбэк после добавления файла
         */
        this.openDocumentDialog = (event, documentId, getDocumentUrl, uploadUrlBase, deleteUrlBase, onFileAdded) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dialog = $('#documentDialog');
            const currentRow = $(event.currentTarget).closest('.table-row, .table-card, .row-items-row');
            const rowId = currentRow.attr('id');
            const rowContainer = dialog.find('.dialog-content-rows');
            rowContainer.empty();
            if (documentId !== null) {
                const document = yield this.requestToApi(getDocumentUrl, "GET");
                this.localCache.set('document', document);
                (_a = document.files) === null || _a === void 0 ? void 0 : _a.forEach((file) => {
                    this.createDocumentFileRow(file, rowContainer, deleteUrlBase);
                });
            }
            rowContainer.append(`
            <div class="dialog-content-rows-row" id="newFileRow" style="height: 50px">
                <div class="content-row-column col-450" style="border: none;"></div>
                <div class="content-row-column col-100"></div>
                <div class="content-row-column col-100 center" style="padding: 0;border-bottom: 1px solid var(--border-color);">
                    <i style="float: right" class="uploadIcon upload-file fas fa-file-upload tooltip-trigger" data-description="Добавить документацию" onclick="$('#fileInput').click()"></i>
                    <input type="file" id="fileInput" style="display: none;"/>
                </div>
            </div>`);
            dialog.off('change', '#fileInput').on('change', '#fileInput', (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    Array.from(e.target.files).forEach((file) => {
                        const fileName = file.name;
                        if (rowContainer.find(`.col-450:contains("${fileName}")`).length > 0) {
                            this.createNotification(`Файл "${fileName}" уже существует`, NotificationType.WARNING);
                            return;
                        }
                        this.uploadDocumentFile(e, rowId, documentId, uploadUrlBase, (files) => {
                            rowContainer.find('#newFileRow').remove();
                            const fileList = files.files || files;
                            for (const f of fileList) {
                                this.createDocumentFileRow(f, rowContainer, deleteUrlBase);
                            }
                            if (onFileAdded)
                                onFileAdded(files);
                        });
                    });
                }
            });
            // Контекстное меню удаления файла
            dialog.off('contextmenu', '.dialog-content-rows-row').on('contextmenu', '.dialog-content-rows-row', (ev) => {
                const $row = $(ev.currentTarget);
                const fileId = $row.attr('id');
                if (!fileId || fileId === 'newFileRow')
                    return;
                ev.preventDefault();
                const mouseEv = ev;
                this.createContextMenu([
                    {
                        label: 'Удалить файл',
                        idAction: "deleteFileButton",
                        action: () => {
                            this.deleteEntity(`${deleteUrlBase}/${fileId}`).then(() => {
                                this.createNotification('Файл успешно удален', NotificationType.SUCCESS);
                                this.deleteRow(fileId);
                            });
                        }
                    }
                ], mouseEv.clientX, mouseEv.clientY);
            });
            this.dialog.open('documentDialog');
        });
        /**
         * Создаёт строку файла в диалоге документов.
         */
        this.createDocumentFileRow = (file, rowContainer, deleteUrlBase) => {
            const rowHtml = `
            <div class="dialog-content-rows-row" id="${file.id}">
                <div class="content-row-column col-450">${file.baseFileName}</div>
                <div class="content-row-column col-100 center">${file.type}</div>
                <div class="content-row-column col-100 file-items">
                    <i class="fas fa-arrows-rotate reload-icon tooltip-trigger" data-description="Обновить документацию" data-file-id="${file.id}" onclick="$('#reloadFileInput').click()"></i>
                    <input type="file" id="reloadFileInput" class="reload-file-input" style="display: none;"/>
                    <i style="float: right" class="download fas fa-download tooltip-trigger" data-description="Скачать документацию" data-file-id="${file.id}"></i>
                </div>
            </div>`;
            rowContainer.append(rowHtml);
        };
        /**
         * Загрузка файла в документ.
         */
        this.uploadDocumentFile = (event, rowId, documentId, uploadUrlBase, onSuccess) => __awaiter(this, void 0, void 0, function* () {
            const formData = new FormData();
            const currentInput = event.currentTarget;
            if (currentInput.files) {
                Array.from(currentInput.files).forEach(file => formData.append('files', file));
            }
            const url = documentId
                ? `${uploadUrlBase}/${documentId}`
                : uploadUrlBase;
            const requestType = documentId ? 'PATCH' : 'POST';
            const unlock = this.lockScreen();
            this.requestToApi(url, requestType, formData)
                .then(onSuccess)
                .catch(console.error)
                .then(() => unlock());
            currentInput.value = '';
        });
        /**
         * Обработчик клика на иконку скачивания в диалоге.
         * @param event — событие
         * @param baseUrl — базовый URL для скачивания (без ID файла)
         */
        this.handleDownloadFileFromDialog = (event, baseUrl) => {
            const fileId = $(event.target).closest('.dialog-content-rows-row').attr('id');
            if (fileId) {
                this.downloadFile(`${baseUrl}/${fileId}`).catch(console.error);
            }
            else {
                this.createNotification("Файл не найден", NotificationType.INFO);
            }
        };
        // --- Контекстное меню удаления строки ---
        /**
         * Создаёт контекстное меню с пунктом «Удалить» для строки.
         * @param event — событие contextmenu
         * @param deleteUrl — URL удаления (с ID строки)
         * @param entityName — название сущности для сообщения
         * @param nameSelector — селектор для получения имени (по умолчанию '[data-name="name"]')
         * @param onAfterDelete — колбэк после удаления
         */
        this.createRowDeleteContextMenu = (event, deleteUrl, entityName = 'запись', nameSelector = '[data-name="name"]', onAfterDelete) => {
            if ($(event.target).is('div[contenteditable="true"]') || $(event.target).closest('div[contenteditable="true"]').length > 0) {
                return;
            }
            event.preventDefault();
            const mouseEvent = event;
            const $row = $(event.currentTarget);
            const rowName = $row.find(nameSelector).text().trim();
            const rowId = $row.attr('id');
            this.createContextMenu([
                {
                    label: 'Удалить',
                    idAction: "deleteEntityButton",
                    action: () => {
                        this.createConfirmationDialog(`Подтвердите удаление ${entityName}: {name}`, { name: rowName }).then((confirmed) => {
                            // @ts-ignore
                            if (confirmed) {
                                this.deleteEntity(`${deleteUrl}/${rowId}`).then(() => {
                                    this.deleteRow(rowId);
                                    this.createNotification(`${entityName} успешно удалён(а)`, NotificationType.SUCCESS);
                                    if (onAfterDelete)
                                        onAfterDelete();
                                }).catch(() => {
                                    this.createNotification(`Ошибка при удалении ${entityName}`, NotificationType.ERROR);
                                });
                            }
                        });
                    }
                }
            ], mouseEvent.clientX, mouseEvent.clientY);
        };
        /**
         * Универсальный обработчик формы создания сущности.
         * @param event — событие
         * @param url — URL для POST
         * @param dialogId — ID диалога с формой
         * @param extractData — функция извлечения данных из формы {fieldName: $dialog => value}
         * @param onSuccess — колбэк (newItem) => void
         * @param useFormData — использовать FormData (true) или JSON (false)
         */
        this.handleCreateForm = (event_1, url_1, dialogId_1, extractData_1, onSuccess_1, ...args_1) => __awaiter(this, [event_1, url_1, dialogId_1, extractData_1, onSuccess_1, ...args_1], void 0, function* (event, url, dialogId, extractData, onSuccess, useFormData = false) {
            var _a;
            event.preventDefault();
            const button = $(event.target);
            const dialog = $(`#${dialogId}`);
            const form = button.closest('form').get(0);
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            button.prop('disabled', true);
            let payload;
            if (useFormData) {
                payload = new FormData(form);
            }
            else {
                const data = extractData(dialog);
                payload = data instanceof FormData ? data : JSON.stringify(data);
            }
            try {
                const newItem = yield this.createEntity(url, payload);
                this.saveMassive = {};
                this.localCache.set(newItem.id, newItem);
                this.dialog.close(dialogId);
                onSuccess(newItem);
                this.createNotification('Успешно создано', NotificationType.SUCCESS);
            }
            catch (error) {
                this.saveMassive = {};
                (_a = form === null || form === void 0 ? void 0 : form.reset) === null || _a === void 0 ? void 0 : _a.call(form);
                this.createNotification('Ошибка при создании', NotificationType.ERROR);
            }
            finally {
                button.prop('disabled', false);
            }
        });
        /**
         * Универсальное сохранение изменений из saveMassive.
         * @param updateUrl — URL обновления
         * @param getItemVersionAndChanges — функция для маппинга из кэша
         */
        this.saveMassiveChanges = (updateUrl, getItemVersionAndChanges) => __awaiter(this, void 0, void 0, function* () {
            if (Object.keys(this.saveMassive).length === 0)
                return;
            const itemsArray = Object.keys(this.saveMassive).map(id => {
                const cacheData = this.localCache.get(id);
                return getItemVersionAndChanges(id, cacheData, this.saveMassive[id]);
            });
            yield this.save(updateUrl, ...itemsArray);
            this.selectedRows.forEach(id => this.selectedRows.delete(id));
        });
        this.rowContainer = rowContainer;
        this.itemsPerPage = itemsPerPage;
        this.visibleRow = visibleRow;
        this.init(...initCallbacks);
    }
    init(...callbacks) {
        $(() => {
            this.createHandler('mouseenter', '.tooltip-trigger', this.showToolTip.bind(this), true);
            this.createHandler('click', '[name="closeDialog"]', (e) => {
                const dialogId = $(e.currentTarget).closest('dialog').attr('id');
                this.dialog.close(dialogId);
            });
            $(this.rowContainer).on('scroll', this.onScroll.bind(this));
            this.createNotificationContainer();
            this.initializeHandlers();
            callbacks.forEach(callback => callback());
        });
    }
    initializeHandlers() {
        this.handlers.forEach(({ event, selector, handler }) => {
            $(document).on(event, selector, handler);
        });
    }
    deleteRow(rowIndex) {
        const $row = $(`#${rowIndex}`);
        $row.fadeOut(300, () => {
            $row.remove();
            this.localCache.delete(rowIndex);
        });
    }
    displayPage(url, param, ...callbacks) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentPage > 1) {
                param = Object.assign(Object.assign({}, param), { page: this.currentPage });
            }
            const request = yield this.requestToApi(url, 'GET', param);
            const visibleItems = request.data.slice(0, this.visibleRow);
            const hiddenItems = request.data.slice(this.visibleRow);
            visibleItems.forEach(item => {
                this.localCache.set(item.id, item);
                const row = this.createRow(item);
                this.rowContainer.append(row);
            });
            hiddenItems.forEach(item => {
                this.localCache.set(item.id, item);
                const row = this.createRow(item).hide();
                this.rowContainer.append(row);
            });
            callbacks.forEach(callback => callback === null || callback === void 0 ? void 0 : callback(request.data, request.count));
        });
    }
    ;
    print(param) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.reports.length)
                return this.createNotification("Нет доступных для печати отчетов", NotificationType.INFO);
            const dialogId = 'printDialog';
            $(`#${dialogId}`).remove();
            const $dialog = $(`
        <dialog id="${dialogId}" class="print-dialog">
            <div class="print-content">
                <h3>Выберите отчёт и формат</h3>
                <select id="reportSelect" class="print-select">
                    ${this.reports.map(r => `<option value="${r.api}">${r.name}</option>`).join('')}
                </select>
                <div class="format-block">
                    <div class="format-toggle">
                        <button type="button" class="format-btn active" data-format="PDF">PDF</button>
                        <button type="button" class="format-btn" data-format="XLSX">XLSX</button>
                    </div>
                </div>
                <div class="print-buttons">
                    <button id="printCancel">Отмена</button>
                    <button id="printOk">Печать</button>
                </div>
            </div>
        </dialog>
    `);
            let format = "PDF";
            $dialog.find('.format-btn').off('click').on('click', function () {
                $dialog.find('.format-btn').removeClass('active');
                $(this).addClass('active');
                format = $(this).data('format');
            });
            $('body').append($dialog);
            this.dialog.open(dialogId);
            return new Promise((resolve) => {
                $('#printCancel').on('click', () => {
                    this.dialog.close(dialogId);
                    $dialog.remove();
                    resolve();
                });
                $('#printOk').on('click', () => __awaiter(this, void 0, void 0, function* () {
                    const api = $('#reportSelect').val();
                    const report = this.reports.find(r => r.api === api);
                    this.dialog.close(dialogId);
                    $dialog.remove();
                    const unlock = this.lockScreen('Формирование отчета');
                    try {
                        if (report.function) {
                            yield report.function(format);
                            resolve();
                            return;
                        }
                        const params = `?format=${format}` + (report.params ? `&${new URLSearchParams(report.params).toString()}` : '');
                        yield this.downloadFile(report.api, params);
                    }
                    catch (e) {
                        this.createNotification('Ошибка при печати', NotificationType.ERROR);
                    }
                    finally {
                        unlock();
                        resolve();
                    }
                }));
            });
        });
    }
    parseInteger(value) {
        if (value === null || value === undefined || value === '') {
            return null;
        }
        const normalized = String(value).trim();
        if (!/^-?\d+$/.test(normalized)) {
            return null;
        }
        return Number(normalized);
    }
    validateIntegerFields(fields) {
        const result = {};
        for (const field of fields) {
            const rawValue = field.value === '' || field.value === null || field.value === undefined
                ? field.defaultValue
                : field.value;
            const parsedValue = this.parseInteger(rawValue);
            if (parsedValue === null || parsedValue < field.min) {
                this.createNotification(`${field.label} должно быть целым числом не меньше ${field.min}`, NotificationType.WARNING);
                return null;
            }
            result[field.key] = parsedValue;
        }
        return result;
    }
    // Переопределяется в наследниках для конкретной логики фильтрации
    applyFilters() {
        // По умолчанию — no-op; наследники переопределяют
    }
}

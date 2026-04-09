"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class NtDocuments extends Base {
    constructor(itemsPerPage = Infinity, visibleRow = Infinity) {
        super($(`.table-body`), itemsPerPage, visibleRow, () => {
            this.displayPage('/api/ntd/get-page-ntd', undefined).catch(console.error);
        });
        this.createNtd = (event) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleCreateForm(event, '/api/ntd/create-ntd', 'create-dialog', (dialog) => ({
                name: dialog.find('input[name="name"]').val(),
                type: dialog.find('textarea[name="type"]').val(),
                dateVerification: dialog.find('input[name="dateVerification"]').val(),
                comment: dialog.find('textarea[name="comment"]').val()
            }), (newNtd) => {
                const newRow = this.createRow(newNtd);
                $(`.table-body`).append(newRow);
            });
        });
        this.selectRow = (event) => __awaiter(this, void 0, void 0, function* () {
            this.toggleRowSelection(event, true);
            const circle = $(event.currentTarget);
            const currentRow = circle.closest('.table-row');
            const rowId = currentRow.attr('id');
            if (this.selectedRows.has(rowId) && this.editMode) {
                this.enableEditMode(['dateVerification'], currentRow, [
                    { name: 'document', transform: ($d) => $d },
                    { name: 'references', transform: ($d) => $d }
                ]);
            }
            else if (!this.selectedRows.has(rowId)) {
                this.disableEditMode(['dateVerification'], ['document', 'references'], currentRow, ['dateVerification', 'type']);
            }
        });
        this.openDocument = (event) => __awaiter(this, void 0, void 0, function* () {
            const currentRow = $(event.currentTarget).closest('.table-row');
            const currentNtdId = currentRow.attr('id');
            const ntd = this.localCache.get(currentNtdId);
            yield this.openDocumentDialog(event, ntd.documentId, `/api/document/get-document/${ntd.documentId}`, ntd.documentId
                ? `/api/document/add-file-to-document`
                : `/api/ntd/create-document/${ntd.id}`, '/api/document/delete-file-from-document', (files) => {
                this.createNotification("Файлы добавлены", NotificationType.SUCCESS);
            });
            // Добавляем специфичную логику перезагрузки файла
            const dialog = $('#documentDialog');
            dialog.off('change', '#reloadFileInput').on('change', '#reloadFileInput', (reloadEvent) => {
                const currentInput = reloadEvent.currentTarget;
                if (!currentInput.files || currentInput.files.length === 0)
                    return;
                let multipartFile = currentInput.files[0];
                const fileId = $(currentInput).closest('.dialog-content-rows-row').attr('id');
                const unlock = this.lockScreen();
                this.deleteEntity(`/api/document/delete-file-from-document/${fileId}`).then(() => {
                    const formData = new FormData();
                    formData.append('file', multipartFile);
                    return this.requestToApi(`/api/document/add-file-2-document/${ntd.documentId}`, "PATCH", formData);
                }).then((file) => {
                    this.createRowOnDocument(file, fileId);
                    return this.requestToApi(`/api/ntd/calculate-references?id=${currentNtdId}`, 'POST');
                }).then(() => {
                    this.createNotification('Файл успешно перезагружен', NotificationType.SUCCESS);
                    ntd.references.forEach((refId) => {
                        const ref = this.localCache.get(refId);
                        ref.color = Color.RED;
                        this.updateRow(ref, refId);
                    });
                    unlock();
                }).catch(() => {
                    this.createNotification('Произошла ошибка при перезагрузки документации', NotificationType.ERROR);
                    unlock();
                });
            });
        });
        this.createRowOnDocument = (file, index) => {
            const rowContainer = $('#documentDialog').find('.dialog-content-rows');
            const rowHtml = `
                <div class="dialog-content-rows-row" id="${file.id}">
                    <div class="content-row-column col-450">${file.baseFileName}</div>
                    <div class="content-row-column col-100 center">
                        ${file.type}</div>
                    <div class="content-row-column col-100 file-items">
                        <i class="fas fa-arrows-rotate reload-icon tooltip-trigger" data-description="Обновить документацию" data-file-id="${file.id}" onclick="$('#reloadFileInput').click()"></i>
                        <input type="file" id="reloadFileInput" class="reload-file-input" style="display: none;"/>
                        <i style="float: right" class="download fas fa-download tooltip-trigger" data-description="Скачать документацию" data-file-id="${file.id}"></i>
                    </div>
                </div>`;
            if (index) {
                rowContainer.find(`#${index}`).replaceWith(rowHtml);
            }
            else {
                rowContainer.append(rowHtml);
            }
        };
        this.openReferences = (event) => __awaiter(this, void 0, void 0, function* () {
            const dialog = $('#referencesDialog');
            const currentRow = $(event.currentTarget).closest('.table-row');
            const currentNtdId = currentRow.attr('id');
            const ntd = this.localCache.get(currentNtdId);
            const rowContainer = dialog.find('.dialog-content-rows');
            if (!dialog.find('.search-container').length) {
                dialog.find('.dialog-container-header').append(`
            <div class="search-container" style="margin: 10px 0;">
                <input type="text" id="search-input" class="search-input" placeholder="Поиск по наименованию..."
                       style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
        `);
            }
            rowContainer.empty();
            const renderReference = (references, checked) => {
                references.forEach((ref) => {
                    rowContainer.append(`
                    <div class="dialog-content-rows-row" id="${ref.id}" data-name="${ref.name.toLowerCase()}">
                        <div class="content-row-column" style="width: 500px">${ref.name}</div>
                        <div class="content-row-column center" style="width:150px;">${ref.type}</div>
                        <div class="content-row-column center" style="width:200px;">${this.formatDate(ref.dateVerification)}</div>
                        <div class="content-row-column" style="width: 100px; text-align: center">
                            <div class="frame" style="background-color: ${this.calculateColor(ref.color)}">
                                <i class="download-inn fa-solid fa-file tooltip-trigger" data-description="Скачать документ" id="${ref.documentId}"></i>
                            </div>
                        </div>
                        <div class="content-row-column" style="width: 500px">${ref.comment}</div>
                        <div class="content-row-column center" style="width: 100px">
                            <label class="container-checkbox tooltip-trigger" data-description="${checked ? 'Отвязать документацию' : 'Связать документацию'}">
                                <input class="checkbox" ${checked ? 'checked="checked"' : ''} type="checkbox">
                                <div class="checkmark"></div>
                            </label>
                        </div>
                    </div>`);
                });
            };
            if (ntd.references.length > 0) {
                const references = yield this.requestToApi(`/api/ntd/get-references?ids=${ntd.references}`, "GET");
                this.localCache.set('references', references);
                renderReference(references, true);
            }
            const references = yield this.requestToApi(`/api/ntd/get-all-references?id=${ntd.id}&ids=${ntd.references}`, "GET");
            renderReference(references, false);
            dialog.off('input', '.search-input').on('input', '.search-input', function () {
                const searchText = $(this).val().toString().toLowerCase();
                $('.dialog-content-rows-row').each(function () {
                    const rowName = $(this).find('.content-row-column').first().text().toLowerCase();
                    $(this).toggle(rowName.includes(searchText));
                });
            });
            dialog.off('click', '.container-checkbox').on('click', '.container-checkbox', (e) => __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                const $container = $(e.currentTarget);
                const $checkbox = $container.find('input[type="checkbox"]');
                const referenceId = $container.closest('.dialog-content-rows-row').attr('id');
                const newState = !$checkbox.prop('checked');
                if (newState) {
                    yield this.requestToApi(`/api/ntd/add-reference?id=${ntd.id}&referenceId=${referenceId}`, "PATCH");
                    ntd.references.push(referenceId);
                }
                else {
                    yield this.requestToApi(`/api/ntd/remove-reference?id=${ntd.id}&referenceId=${referenceId}`, "PATCH");
                    ntd.references = ntd.references.filter(ref => ref !== referenceId);
                }
                $checkbox.prop('checked', newState);
                $container.toggleClass('checked', newState);
            }));
            dialog.off('click', '.download-inn').on('click', '.download-inn', (e) => {
                const $icon = $(e.currentTarget);
                const documentId = $icon.attr('id');
                if (documentId) {
                    this.downloadFile(`/api/document/download-all-document-file/${documentId}`).catch(console.error);
                }
                else {
                    this.createNotification("Файл не прикреплен", NotificationType.INFO);
                }
            });
            this.dialog.open('referencesDialog', {
                onClose: () => {
                    $('#referencesDialog .search-input').val('');
                }
            });
        });
        this.showRowContextMenu = (event) => {
            this.createRowDeleteContextMenu(event, '/api/ntd/delete', 'документации');
        };
        this.createHandler('click', '.circle-row', this.selectRow.bind(this), true);
        this.createHandler('click', '#edit-button', () => {
            if (!this.editMode) {
                this.enableEditMode(['dateVerification'], undefined, [
                    { name: 'document', transform: ($d) => $d },
                    { name: 'references', transform: ($d) => $d }
                ]);
                $('#edit-button').addClass('active');
            }
            else {
                this.disableEditMode(['dateVerification'], ['document', 'references'], undefined, ['dateVerification', 'type']);
                if (!this.editMode)
                    $('#edit-button').removeClass('active');
            }
        }, true);
        this.createHandler('click', '#create-button', () => this.dialog.open('create-dialog'), true);
        this.createHandler('click', '#save-button', () => this.saveNtd(), true);
        this.bindFieldChanges();
        this.createHandler('click', '.document', this.openDocument.bind(this), true);
        this.createHandler('click', '.references', this.openReferences.bind(this), true);
        this.createHandler('click', '.download', this.handleDownloadFile.bind(this), true);
        this.createHandler('click', '#createBtn', this.createNtd, true);
        this.createHandler('contextmenu', '.table-row.selected', this.showRowContextMenu, true);
        this.bindSearchInput('#searchInput');
    }
    createRow(ntd) {
        const row = `
            <div class="table-row" id="${ntd.id}" data-index="${ntd.id}">
                <div class="table-cell" style="width: var(--name); position: relative">
                    <div class="circle circle-row tooltip-trigger" data-description="Выделить строку"></div>
                    <div class="field-container" data-name="name" contenteditable="false">
                        ${ntd.name}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--type);">
                    <div class="field-container center" data-name="type" contenteditable="false">
                        ${ntd.type}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--dateVerification);">
                    <div class="field-container center" data-name="dateVerification" contenteditable="false">
                        ${this.formatDate(ntd.dateVerification)}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--file); padding: 0">
                    <div data-name="document" contenteditable="false" style="height: 100%; width: 100%">
                        <div class="frame" style="background-color: ${this.calculateColor(ntd.color)}">
                            <i class="document fa-solid fa-file tooltip-trigger" data-description="Открыть окно документа"></i>
                        </div>
                    </div>
                </div>
                <div class="table-cell" style="width: var(--references); padding: 0">
                    <div data-name="references" contenteditable="false">
                        <i class="references fa-solid fa-book tooltip-trigger" data-description="Открыть окно связанных документов"></i>
                    </div>
                </div>
                <div class="table-cell" style="width: var(--comment);">
                    <div class="field-container" data-name="comment" contenteditable="false">
                        ${ntd.comment}
                    </div>
                </div>
            </div>`;
        return $(row);
    }
    onScroll() {
    }
    saveNtd() {
        if (Object.keys(this.saveMassive).length === 0) {
            return;
        }
        const itemsArray = Object.keys(this.saveMassive).map(id => {
            const cacheData = this.localCache.get(id);
            return {
                id: id,
                version: cacheData.version,
                changes: this.saveMassive[id]
            };
        });
        this.save('/api/ntd/update', ...itemsArray).then(() => {
            this.disableEditMode(['dateVerification'], ['document', 'references']);
            itemsArray.forEach((id) => this.selectedRows.delete(id.toString()));
        });
    }
    handleDownloadFile(event) {
        this.handleDownloadFileFromDialog(event, '/api/document/download-document-file');
    }
    // Фильтрация — переопределяется для конкретного поведения
    applyFilters() {
        // Здесь можно добавить логику фильтрации строк по searchText
        $('.table-row').each(function () {
            const name = $(this).find('[data-name="name"]').text().toLowerCase();
            const type = $(this).find('[data-name="type"]').text().toLowerCase();
            const comment = $(this).find('[data-name="comment"]').text().toLowerCase();
            const match = name.includes(this.searchText) || type.includes(this.searchText) || comment.includes(this.searchText);
            $(this).toggle(match);
        }.bind(this));
    }
}
$(document).ready(() => {
    new NtDocuments();
});
//# sourceMappingURL=ntd.js.map
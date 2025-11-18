// @ts-ignore
declare const $: any;

class NtDocuments extends Base {

    constructor(itemsPerPage = Infinity, visibleRow = Infinity) {
        super($(`.table-body`), itemsPerPage, visibleRow, () => {
            this.displayPage('/api/ntd/get-page-ntd', undefined).catch(console.error);
        });
        this.createHandler('click', '.circle-row', this.selecteRow.bind(this), true);
        this.createHandler('click', '#edit-button', () => {
            if (!this.editMode) {
                this.enableEditMode()
            } else this.disableEditMode();
        }, true);
        this.createHandler('click', '#create-button', () => this.dialog.open('create-dialog'), true);
        this.createHandler('click', '#save-button', () => this.saveNtd(), true);
        this.createHandler('input', '[data-name]', this.inputChanges.bind(this), true);
        this.createHandler('click', '.document', this.openDocument.bind(this), true);
        this.createHandler('change', '#fileInput', this.addFileToDocument.bind(this), true);
        this.createHandler('click', '.download', this.handleDownloadFile.bind(this), true);
        this.createHandler('click', '#createBtn', this.createNtd, true);
        this.createHandler('contextmenu', '.table-row.selected', this.showRowContextMenu, true);
    }

    searchText = '';
    editMode: boolean = false;

    public createRow(ntd: NtdIn) {
        const row = `
            <div class="table-row" id="${ntd.id}" data-index="${ntd.id}">
                <div class="table-cell" style="width: var(--name); position: relative">
                    <div class="circle circle-row tooltip-trigger" data-description="Выделить строку"></div>
                    <div data-name="name" contenteditable="false">
                        ${ntd.name}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--type);">
                    <div data-name="type" contenteditable="false">
                        ${ntd.type}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--dateVerification);">
                    <div data-name="dateVerification" contenteditable="false">
                        ${this.formatDate(ntd.dateVerification)}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--file);">
                    <div data-name="document" contenteditable="false">
                        <i class="document fa-solid fa-file tooltip-trigger" data-description="Открыть окно документа"></i>
                    </div>
                </div>
                <div class="table-cell" style="width: var(--references);">
                    <div data-name="references" contenteditable="false">
                        <i class="document fa-solid fa-file tooltip-trigger" data-description="Открыть окно связанных документов"></i>
                    </div>
                </div>
                <div class="table-cell" style="width: var(--comment);">
                    <div data-name="comment" contenteditable="false">
                        ${ntd.comment}
                    </div>
                </div>
            </div>`;

        return $(row);
    }

    public onScroll(): void {
    }

    private saveNtd() {
        if (Object.keys(this.saveMassive).length === 0) {
            return;
        }
        const itemsArray = Object.keys(this.saveMassive).map(id => {
            const cacheData = this.localCache.get(id) as NtdIn;
            return {
                id: id,
                version: cacheData.version,
                changes: this.saveMassive[id]
            };
        });
        this.save('/api/ntd/update', ...itemsArray).then(() => {
            this.disableEditMode();
            itemsArray.forEach((id) => this.selectedRows.delete(id.toString()));
        });
    }

    private createNtd = async (event: Event) => {
        event.preventDefault();

        const button = $(event.target);
        const form = button.closest('form').get(0);
        const dialog = $('#create-dialog');

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        button.prop('disabled', true);

        const formData = {
            name: dialog.find('input[name="name"]').val(),
            type: dialog.find('textarea[name="type"]').val(),
            dateVerification: dialog.find('input[name="dateVerification"]').val(),
            comment: dialog.find('textarea[name="comment"]').val()
        };

        try {
            const newNtd: NtdIn = await this.createEntity('/api/ntd/create-ntd', formData);
            this.saveMassive = {};
            this.localCache.set(newNtd.id, newNtd);
            this.dialog.close("create-dialog");
            const newRow = this.createRow(newNtd);
            $(`.table-body`).append(newRow);
            button.prop('disabled', false);
        } catch (error) {
            this.saveMassive = {};
            form.reset();
            this.createNotification('Ошибка при создании NTD', NotificationType.ERROR);
            button.prop('disabled', false);
        }
    }

    private enableEditMode(row?: any): void {
        const dateTime: string[] = ['dateVerification'];

        const processElement = ($div: any) => {
            const text = $div.text().trim();
            const dataName: string = $div.attr('data-name');
            let element: any;

            if (dateTime.indexOf(dataName) !== -1) {
                const rowId = $(row).attr('id');
                const value = this.localCache.get(rowId)[dataName];
                element = $(`<input type="date" data-name="${dataName}">`).val(value);
            } else {
                element = $div;
                element.attr('contenteditable', 'true');
            }

            $div.replaceWith(element);
        };

        if (row) {
            $(row).find('div[contenteditable="false"]').each(function () {
                processElement($(this));
            });
            this.editMode = true;
            return;
        }

        for (const rowId of this.selectedRows) {
            row = $(`.table-row[id="${rowId}"]`);
            row.find('div[contenteditable="false"]').each(function () {
                processElement($(this));
            });
        }
        this.editMode = true;
        $('#edit-button').addClass('active');
    }

    private disableEditMode(row?: any): void {
        if (this.editMode &&
            Object.keys(this.saveMassive).length > 0 &&
            ((row && row.find('.change').length > 0) || $('.table-row .change').length > 0)) {
            this.createNotification("Сохраните изменения", NotificationType.WARNING);
            return;
        }
        const dateTime = ['dateVerification'];

        const processElement = ($field: any) => {
            const dataName = $field.attr("data-name");
            let value: string;
            if (dateTime.indexOf(dataName) !== -1) {
                value = this.formatDate($field.val());
            } else {
                value = $field.is('select') ? $field.find('option:selected').text() : $field.text();
            }
            $field.replaceWith(`<div data-name="${dataName}" contenteditable="false">${value}</div>`);
        };
        if (row) {
            $(row).find('div[contenteditable="true"], select[data-name], input[data-name]').each(function () {
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
        $('#edit-button').removeClass('active');
    }

    private async selecteRow(event: Event): Promise<void> {
        const circle = $(event.currentTarget);
        const currentRow = circle.closest('.table-row');
        const currentRowId: string = currentRow.attr('id');
        const changes = currentRow.find('.change').length;

        if (this.editMode && changes > 0) {
            this.createNotification("Сохраните изменения", NotificationType.WARNING);
            return
        }

        if (!this.selectedRows.has(currentRowId)) {
            this.selectedRows.add(currentRowId);
            currentRow.addClass('selected');
            circle.addClass('active-critical');
            if (this.editMode) {
                this.enableEditMode(currentRow);
            }
        } else {
            this.selectedRows.delete(currentRowId);
            this.disableEditMode(currentRow);
            currentRow.removeClass('selected');
            $('.circle-header').removeClass('active');
            circle.removeClass('active-critical');
        }
    }

    private inputChanges(event: Event): void {
        const $el = $(event.target);
        const id = $el.closest('.table-row').attr('id');
        const name = $el.attr('data-name');
        const value = $el.is('div') ? $el.text().trim() : $el.val();

        this.saveMassive[id] = {...this.saveMassive[id], [name]: value};
        $el.addClass('change');
    }

    private async openDocument(event: Event): Promise<void> {
        const dialog = $('#documentDialog');
        const currentRow = $(event.currentTarget).closest('.table-row');
        const currentNtdId = currentRow.attr('id');
        const ntd = this.localCache.get(currentNtdId) as NtdIn;
        const rowContainer = dialog.find('.dialog-content-rows');

        rowContainer.empty();

        if (ntd.documentId !== null) {
            const document: any = await this.requestToApi(`/api/document/get-document/${ntd.documentId}`, "GET");
            this.localCache.set('document', document);

            document.files.forEach((file: any) => {
                rowContainer.append(`
                <div class="dialog-content-rows-row" id="${file.id}">
                    <div class="content-row-column col-450">${file.baseFileName}</div>
                    <div class="content-row-column col-100">${file.type}</div>
                    <div class="content-row-column col-100"><i style="float: right" class="download fas fa-download"></i></div>
                </div>`
                );
            });
        }

        rowContainer.append(`
            <div class="dialog-content-rows-row">
                <div class="content-row-column col-450"></div>
                <div class="content-row-column col-100"></div>
                <div class="content-row-column col-100">
                    <i style="float: right" class="uploadIcon upload-file fas fa-file-upload" onclick="$('#fileInput').click()"></i>
                    <input type="file" id="fileInput" style="display: none;"/>
                </div>
            </div>`
        );

        const organizationSelect = $(`
            <select class="organization-select form-control">
                <option value="">Выберите организацию</option>
                <option value="organization1">Борисоглебский филиал ФБУ "Воронежский ЦСМ"</option>
                <option value="organization2">ФБУ "Воронежский ЦСМ"</option>
                <option value="organization3">ООО "СТАНДАРТ"</option>
            </select>
        `)

        dialog.find('.organization-row').empty().append(organizationSelect);

        $(document).off('change', '#fileInput').on('change', '#fileInput', (e) => this.addFileToDocument(e, currentNtdId));
        $(document).on('contextmenu', '.dialog-content-rows-row', (event: Event) => {
            const $row = $(event.currentTarget);
            const fileId = $row.attr('id');
            if (!fileId) {
                return;
            }
            event.preventDefault();
            const mouseEvent = event as MouseEvent;
            this.createContextMenu([
                {
                    label: 'Удалить файл',
                    action: () => {
                        this.deleteEntity(`/api/document/delete-file-from-document/${fileId}`).then(
                            () => {
                                this.createNotification('Файл успешно удален', NotificationType.SUCCESS);
                                this.deleteRow(fileId)
                            });
                    }
                }
            ], mouseEvent.clientX, mouseEvent.clientY);
        });

        this.dialog.open('documentDialog');
    }

    private addFileToDocument(event: Event, ntdId: string): void {
        const formData = new FormData();
        const currentInput = event.currentTarget as HTMLInputElement;
        const ntd = this.localCache.get(ntdId) as NtdIn;

        if (currentInput.files) {
            Array.from(currentInput.files).forEach(file => {
                formData.append('files', file);
            });
        }

        const url = ntd.documentId
            ? `/api/document/add-file-to-document/${ntd.documentId}`
            : `/api/ntd/create-document/${ntd.id}`;

        const requestType = ntd.documentId ? 'PATCH' : 'POST';

        this.requestToApi(url, requestType, formData).then((document: DocumentBormash) => {
            const dialog = $('#documentDialog');
            const rowContainer = dialog.find('.dialog-content-rows');
            rowContainer.empty();
            for (const file of document.files) {
                rowContainer.append(`
                    <div class="dialog-content-rows-row" id="${file.id}">
                        <div class="content-row-column col-450">${file.baseFileName}</div>
                        <div class="content-row-column col-100">${file.type}</div>
                        <div class="content-row-column col-100"><i style="float: right" class="download fas fa-download"></i></div>
                    </div>`
                );
            }
            rowContainer.append(`
            <div class="dialog-content-rows-row">
                <div class="content-row-column col-450"></div>
                <div class="content-row-column col-100"></div>
                <div class="content-row-column col-100">
                    <i style="float: right" class="uploadIcon upload-file fas fa-file-upload" onclick="$('#fileInput').click()"></i>
                    <input type="file" id="fileInput" style="display: none;"/>
                </div>
            </div>`
            );
            this.createNotification("Файлы добавлены", NotificationType.SUCCESS);
        }).catch(console.error);

        currentInput.value = '';
    }

    private handleDownloadFile(event: Event): void {
        const fileId = $(event.target).closest('.dialog-content-rows-row').attr('id');
        this.downloadFile(`/api/document/download-document-file/${fileId}`).catch(console.error);
    }

    private showRowContextMenu = (event: Event) => {
        if ($(event.target).is('div[contenteditable="true"]') || $(event.target).closest('div[contenteditable="true"]').length > 0) {
            return;
        }
        event.preventDefault();

        const mouseEvent = event as MouseEvent;
        const $row = $(event.currentTarget);
        const rowName = $row.find('[data-name="name"]').text().trim();
        const rowId = $row.attr('id');

        this.createContextMenu([
            {
                label: 'Удалить',
                action: () => {
                    this.createConfirmationDialog("Подтвердите удаление документации: {outNumber}", {name: rowName}).then((confirmed) => {
                        // @ts-ignore
                        if (confirmed) {
                            this.deleteEntity(`/api/ntd/delete/${rowId}`).then(() => {
                                this.deleteRow(rowId);
                                this.createNotification("Документация успешно удалена", NotificationType.SUCCESS);
                            }).catch(() => {
                                this.createNotification("Возникла ошибка при удалении документации", NotificationType.ERROR);
                            });
                        }
                    });
                }
            }
        ], mouseEvent.clientX, mouseEvent.clientY);
    }
}

$(document).ready(() => {
    new NtDocuments();
});
// @ts-ignore
declare const $: any;

class Spe extends Base {

    constructor(itemsPerPage = Infinity) {
        super(itemsPerPage, () => {
            this.displayPage('/api/spe/get-page-spe', undefined, (data: any[]) => this.fullData(data)).catch(console.error);
        });
        this.createHandler('dblclick', '.table-row', this.dblClickOnRow.bind(this), true);
        this.createHandler('click', '#edit-button', () => this.enableEditMode(), true);
        this.createHandler('click', '#print-button', () => this.print('/api/report/print/spe', this.selectedRows), true);
        this.createHandler('click', '#save-button', () => this.save('/api/spe/update/', this.saveMassive), true);
        this.createHandler('input', '[data-name]', this.inputChanges.bind(this), true);
        this.createHandler('click', '.area-modal', this.workWithModal.bind(this), true);
        this.createHandler('click', '.document', this.openDocument.bind(this), true);
        this.createHandler('change', '#fileInput', this.addFileToDocument.bind(this), true);
        this.createHandler('click', '.download', this.handleDownloadFile.bind(this), true);
        this.createHandler('click', '#createBtn', this.createSpe, true);
        this.createHandler('click', '.filter-status', this.filterButtonHandler, true);
        this.createHandler('click', '.subdivision-button', this.subDivisionHandler.bind(this), true);
        this.createHandler('input', '#searchInput', (event) => {
            this.searchText = $(event.target).val().toString().toLowerCase().trim();
            this.applyFilters();
        }, true);
        this.createHandler('contextmenu', '.table-row.selected', this.showRowContextMenu, true);
    }

    currentStatus = 'NONE';
    currentSubDivision = '';
    searchText = '';

    editMode: boolean = false;

    public override createRow(spe: SpeIn): any {
        const status = (() => {
            switch (spe.status) {
                case 'NONE':
                    return 'Нет';
                case 'WRITE_OFF':
                    return 'Списан';
                case 'VERIFICATION_REQUIRED':
                    return 'Требуется поверка';
                case 'EXPIRED':
                    return 'Срок поверки истек';
                case 'AT_INSPECTION':
                    return 'На поверке';
            }
        })();
        const row = `
                <div class="table-row" id="${spe.id}">
                    <div class="table-cell" style="width: var(--equipment);">
                        <div class="equipment">
                            <div data-name="name" contenteditable="false">
                                ${spe.name}
                            </div>
                            <div class="equipments">
                                <div class="equipment-type">
                                    <div contenteditable="false" data-name="type">
                                        ${spe.type}
                                    </div>
                                </div>
                                <div class="equipment-number">
                                    <div contenteditable="false" data-name="outNumber">
                                        ${spe.outNumber}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--characteristics);">
                        <div class="characteristics">
                            <div contenteditable="false" data-name="accuracyClass">
                                ${spe.accuracyClass}
                            </div>
                            <div contenteditable="false" data-name="limitMeasurement">
                                ${spe.limitMeasurement}
                            </div>
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--subdivision);">
                        <div contenteditable="false" data-name="subDivision">
                            ${spe.subDivision.name}
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--responsible);">
                        <div contenteditable="false" class="responsible" data-name="employee">
                            ${spe.employee.name}
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--mark);">
                        <div contenteditable="false" data-name="mark">
                            ${spe.mark}
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--preparationDate);">
                        <div contenteditable="false" data-name="datePreparation">
                            ${this.formatDate(spe.datePreparation)}
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--verificationDate);">
                        <div contenteditable="false" data-name="dateVerification">
                            ${this.formatDate(spe.dateVerification)}
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--certificate);">
                        <div contenteditable="false" data-name="certificateNumber">
                            ${spe.certificateNumber}
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--periodicity);">
                        <div contenteditable="false" data-name="periodicity">
                            ${spe.periodicity}
                        </div> месяцев
                    </div>
                    <div class="table-cell" style="width: var(--file);">
                        <i class="document fa-solid fa-file"></i>
                    </div>
                    <div class="table-cell" style="width: var(--status);">
                        <span class="status-indicator status-good" data-status="${spe.status}">
                           ${status}
                        </span>
                    </div>
                </div>`;
        $(`.table-body`).append(row);
        return $(row);
    }

    private fullData(data: SpeIn[]): void {
        $('#total-units').text(data.length);
        $('#written-off').text(data.filter(s => s.status === 'WRITE_OFF').length);
        $('#verification-required').text(data.filter(s => s.status === 'VERIFICATION_REQUIRED').length);
        $('#verification-period-has-expired').text(data.filter(s => s.status === 'EXPIRED').length);
        $('#at-inspection').text(data.filter(s => s.status === 'AT_INSPECTION').length);
    }

    private enableEditMode(row?: any): void {
        if (this.editMode && Object.keys(this.saveMassive).length === 0) {
            this.disableEditMode(row);
            return;
        }
        const dateTime: string[] = ['datePreparation', 'dateVerification'];

        const processElement = ($div: any) => {
            const text = $div.text().trim();
            const dataName: string = $div.attr('data-name');
            let element: any;

            if (dataName === 'mark') {
                element = $(`<select data-name="${dataName}"></select>`);
                element.append($(`<option selected>${text}</option>`));
                element.append($(`<option>${text === 'списан' ? 'на поверке' : 'списан'}</option>`));
            } else if (dateTime.indexOf(dataName) !== -1) {
                const rowId = Number($(row).attr('id'));
                const value = this.localCache.get(rowId)[dataName];
                element = $(`<input type="date" data-name="${dataName}">`).val(value);
            } else {
                element = $div;
                element.attr('contenteditable', 'true');
            }

            if (dataName === 'employee' || dataName === 'subDivision') {
                element.addClass('area-modal').attr('contenteditable', 'false');
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
    }

    private disableEditMode(row?: any): void {
        if (this.editMode && Object.keys(this.saveMassive).length > 0) {
            this.createNotification("Сохраните изменения", NotificationType.WARNING);
            return;
        }
        const dateTime = ['datePreparation', 'dateVerification'];

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
            this.editMode = false;
            return;
        }

        for (const rowId of this.selectedRows) {
            const $row = $(`.table-row[id="${rowId}"]`);
            $row.find('div[contenteditable="true"], select[data-name], input[data-name]').each(function () {
                processElement($(this));
            });
        }
        this.editMode = false;
    }

    private async dblClickOnRow(event: Event): Promise<void> {
        const currentRow = $(event.currentTarget);
        const currentRowId: string = currentRow.attr('id');

        if (!this.selectedRows.has(currentRowId)) {
            this.selectedRows.add(currentRowId);
            currentRow.addClass('selected');
            if (this.editMode) {
                this.enableEditMode(currentRow);
            }
        } else {
            this.selectedRows.delete(currentRowId);
            this.disableEditMode(currentRow);
            currentRow.removeClass('selected');
        }
    }

    private inputChanges(event: Event): void {
        const $el = $(event.target);
        const id = $el.closest('.table-row').attr('id');
        const name = $el.attr('data-name');
        const value = $el.is('div') ? $el.text().trim() : $el.val();

        this.saveMassive[id] = {...this.saveMassive[id], [name]: value};
        $el.addClass('change-textarea');
    }

    private async workWithModal(event: Event): Promise<void> {
        const modalDiv = $(event.currentTarget);
        const fieldName = modalDiv.attr('data-name');
        const currentId = modalDiv.closest('.table-row').attr('id');
        let selected: any;

        if (fieldName === 'subDivision' || fieldName === 'employee') {
            const isEmployee = fieldName === 'employee';
            const dialog = $(isEmployee ? '#employeeDialog' : '#subDivisionDialog');
            const rowContainer = dialog.find('.dialog-content-rows');
            const searchInput = dialog.find('.choice-field input');
            const changeButton = $(isEmployee ? '#changeEmployee' : '#changeSubDivision');

            const data: any = await this.cache.get(fieldName);

            const renderRows = (items: any[]) => {
                rowContainer.empty();
                items.forEach(item => {
                    rowContainer.append(`
                    <div class="dialog-content-rows-row" data-id="${item.id}">
                        <div class="content-row-column col-250">${item.name}</div>
                        ${isEmployee ? `<div class="content-row-column col-250">${item.mlmNode?.name || ''}</div>` : ''}
                    </div>`
                    );
                });
            };

            renderRows(data);

            searchInput.off('input').on('input', function () {
                const searchText = $(this).val().toString().toLowerCase().trim();
                const filtered = data.filter((e: any) => e.name.toLowerCase().includes(searchText));
                renderRows(filtered);
            });

            (dialog[0] as any).showModal();

            rowContainer.off('click').on('click', '.dialog-content-rows-row', function () {
                const id = $(this).data('id');
                selected = data.find((e: any) => e.id === id);
                $('.dialog-content-rows-row').removeClass('selected');
                $(this).addClass('selected');
            });

            changeButton.off('click').on('click', () => {
                if (!selected) {
                    this.createNotification(`Выберите ${isEmployee ? 'сотрудника' : 'подразделение'} из списка`, NotificationType.WARNING);
                    return;
                }

                modalDiv.text(selected.name);

                if (currentId) {
                    this.saveMassive[currentId] = {
                        ...this.saveMassive[currentId],
                        [fieldName]: selected
                    };
                } else {
                    this.saveMassive[fieldName] = selected;
                }

                modalDiv.addClass('change-textarea');
                (dialog[0] as any).close();
            });
        }

        modalDiv.addClass('change-area');
    }

    private async openDocument(event: Event): Promise<void> {
        const dialog = $('#documentDialog');
        const currentRow = $(event.currentTarget).closest('.table-row');
        const currentSpeId = currentRow.attr('id');
        const spe = this.localCache.get(Number(currentSpeId)) as SpeIn;
        const rowContainer = dialog.find('.dialog-content-rows');

        rowContainer.empty();

        if (spe.documentId !== null) {
            const document: any = await this.requestToApi(`/api/document/get-document/${spe.documentId}`, "GET");
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

        $(document).off('change', '#fileInput').on('change', '#fileInput', (e) => this.addFileToDocument(e, currentSpeId));

        (dialog[0] as any).showModal();
    }

    private addFileToDocument(event: Event, speId: string): void {
        const formData = new FormData();
        const currentInput = event.currentTarget as HTMLInputElement;
        const spe = this.localCache.get(Number(speId)) as SpeIn;

        if (currentInput.files) {
            Array.from(currentInput.files).forEach(file => {
                formData.append('files', file);
            });
        }

        const url = spe.documentId
            ? `/api/document/add-file-to-document/${spe.documentId}`
            : `/api/spe/create-document/${spe.id}`;

        const requestType = spe.documentId ? 'PATCH' : 'POST';

        this.requestToApi(url, requestType, formData).then(() => {
            this.createNotification("Файлы добавлены", NotificationType.SUCCESS);
        }).catch(console.error);

        currentInput.value = '';
    }

    private handleDownloadFile(event: Event): void {
        const fileId = $(event.target).closest('.dialog-content-rows-row').attr('id');
        this.downloadFile(`/api/document/download-document-file/${fileId}`).catch(console.error);
    }

    private createSpe = async (event: Event) => {
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
            name: $('input[name="name"]').val(),
            type: $('textarea[name="type"]').val(),
            outNumber: $('textarea[name="outNumber"]').val(),
            accuracyClass: $('textarea[name="accuracyClass"]').val(),
            limitMeasurement: $('textarea[name="limitMeasurement"]').val(),
            subDivision: this.saveMassive['subDivision'],
            employee: this.saveMassive['employee'],
            periodicity: $('textarea[name="periodicity"]').val(),
            datePreparation: $('input[name="datePreparation"]').val(),
            dateVerification: $('input[name="dateVerification"]').val(),
            certificateNumber: $('textarea[name="certificateNumber"]').val()
        };

        try {
            const newSPE: SpeIn = await this.createEntity('/api/spe/create-spe', formData);
            this.saveMassive = {};
            this.localCache.set(newSPE.id, newSPE);
            (dialog[0] as any).close();
            this.createRow(newSPE);
            button.prop('disabled', false);
        } catch (error) {
            this.saveMassive = {};
            this.createNotification('Ошибка при создании SPE', NotificationType.ERROR);
            button.prop('disabled', false);
        }
    }

    private applyFilters = () => {
        $('.table-row').each((_, element) => {
            const row = $(element);
            const statusMatch: boolean = this.currentStatus === 'NONE' || row.find('[data-status]').attr('data-status') === this.currentStatus;
            const subDivisionMatch: boolean = !this.currentSubDivision || row.find('[data-name="subDivision"]').text().trim() === this.currentSubDivision;
            const textMatch: boolean = this.searchText === '' || row.text().toLowerCase().includes(this.searchText.toLowerCase());
            row.toggle(statusMatch && subDivisionMatch && textMatch);
        });
    }

    private filterButtonHandler = (event: Event) => {
        this.currentStatus = $(event.target).data('status');
        $('.filter-btn').removeClass('active');
        $(event.target).addClass('active');
        this.applyFilters();
    }

    private async subDivisionHandler(event: Event) {
        const button = $(event.target);
        const dialog = $('#subDivisionDialog');
        const rowContainer = dialog.find('.dialog-content-rows');
        let selectedName = '';
        const cancelBtn = dialog.find('.close');
        const dialogName = dialog.find('.dialog-name');

        try {
            const subDivisions: SubDivision[] = await this.cache.get('subDivision');

            function render(list: SubDivision[]) {
                rowContainer.empty();
                list.forEach(e => rowContainer.append(`<div class="dialog-content-rows-row"><div class="content-row-column">${e.name}</div></div>`));
            }

            cancelBtn.text('Сбросить фильтры');
            dialogName.text('Фильтр по подразделению');
            render(subDivisions);

            dialog.find('.choice-field input').on('input', function () {
                const search = $(this).val().toString().toLowerCase();
                const filtered = subDivisions.filter((e: any) => e.name.toLowerCase().includes(search));
                render(filtered);
            });

            rowContainer.on('click', '.dialog-content-rows-row', function () {
                selectedName = $(this).find('.content-row-column').text().trim();
            });

            $('#changeSubDivision').on('click', () => {
                this.currentSubDivision = selectedName;
                this.applyFilters();
                button.css('border-color', 'red');
                (dialog[0] as any).close();
            });

            $('.close').on('click', () => {
                this.currentSubDivision = '';
                button.css('border-color', '#e2e8f0');
                this.applyFilters();
            });

            dialog.on('close', function () {
                cancelBtn.text('Отмена');
                dialogName.text('Окно выбора подразделения');
            });

            (dialog[0] as any).showModal();
        } catch (error) {
            this.createNotification('Ошибка при загрузке подразделений', NotificationType.ERROR);
        }
    }

    private showRowContextMenu = (event: Event) => {
        event.preventDefault();
        const mouseEvent = event as MouseEvent;
        const row = $(event.currentTarget);
        const rowId = row.attr('id');

        this.createContextMenu([
            {
                label: 'Удалить',
                action: () => {
                    this.deleteEntity(`/api/spe/delete/${rowId}`).then(() => {
                        this.deleteRow(rowId);
                        this.createNotification("Оборудование успешно удалено", NotificationType.SUCCESS);
                    }).catch(() => {
                        this.createNotification("Возникла ошибка при удалении оборудования", NotificationType.ERROR);
                    });
                }
            }
        ], mouseEvent.clientX, mouseEvent.clientY);
    }

}

$(document).ready(() => {
    new Spe();
});

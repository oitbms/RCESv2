// @ts-ignore
declare const $: any;

class PdItem extends Base {

    constructor(itemsPerPage = Infinity, visibleRow = Infinity) {
        super($(`.table-body`), itemsPerPage, visibleRow, () => {
            this.displayPage('/api/parts-directory/get-page-pdi', undefined).catch(console.error);
        });
        this.createHandler('click', '#create-button', () => this.dialog.open('create-dialog'), true);
        this.createHandler('click', '#createBtn', this.createPdi, true);
        this.createHandler('click', '.area-modal', this.workWithModal.bind(this), true);
        this.createHandler('click', '.circle-header', this.selecteRows.bind(this),true);
        this.createHandler('click', '.circle-row', this.selecteRow.bind(this), true);
        this.createHandler('click', '#edit-button', () => {
            if (!this.editMode) {
                this.enableEditMode()
            } else this.disableEditMode();
        }, true);
        this.createHandler('click', '#save-button', () => this.saveSpe(), true);
        this.createHandler('click', '#print-button', this.print = this.print.bind(this), true);
        this.createHandler('input', '[data-name]', this.inputChanges.bind(this), true);
    }

    editMode: boolean = false;

    public createRow(pdi: pdItemIn) {
        const status = (() => {
            switch (pdi.status) {
                case 'NEW':
                    return 'Новый';
                case 'WORK':
                    return 'В работе';
                case 'REQUIRED':
                    return 'Требуется в срок';
                case 'COMPLETE':
                    return 'Готов';
            }
        })();
        const row = `
            <div class="table-row" id="${pdi.id}" data-index="${pdi.id}">
                <div class="table-cell" style="width: var(--customerOrder); position: relative">
                    <div class="circle circle-row tooltip-trigger" data-description="Выделить строку"></div>
                    <div class="field-container center" data-name="customerOrder" contenteditable="false">
                        ${pdi.customerOrder.name}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--name);">
                    <div class="field-container center" data-name="name" contenteditable="false">
                        ${pdi.name}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--scheme);">
                    <div class="field-container center" data-name="scheme" contenteditable="false">
                        ${pdi.scheme}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--thickness); padding: 0">
                    <div class="field-container center" data-name="thickness" contenteditable="false">
                        ${pdi.thickness}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--steel); padding: 0">
                    <div class="field-container center" data-name="steel" contenteditable="false">
                        ${pdi.steel}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--qty);">
                    <div class="field-container left" data-name="qty" contenteditable="false">
                        ${pdi.qty}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--qtyCompleted);">
                    <div class="field-container right" data-name="qtyCompleted" contenteditable="false">
                        ${pdi.qtyCompleted}
                    </div>
                </div>
                 <div class="table-cell" style="width: var(--measurements);">
                    <div class="field-container center" data-name="measurements" contenteditable="false">
                        ${pdi.measurements}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--program);">
                    <div class="field-container" data-name="program" contenteditable="false">
                        ${pdi.program}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--comment);">
                    <div class="field-container" data-name="comment" contenteditable="false">
                        ${pdi.comment}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--status);">
                    <span class="status-indicator" style="background-color: ${this.calculateColor(pdi.color)}" data-status="${pdi.status}">
                        ${status}
                    </span> 
                </div>
            </div>`;
        return $(row);
    }

    public onScroll(): void {
    }

    public override async print() {
        if (!this.selectedRows || this.selectedRows.size === 0) {
            return this.createNotification('Не выбрано ни одной строки', NotificationType.WARNING);
        }

        this.reports = [
            {
                name: 'Акт-наряд',
                api: '/api/report/print/pdi-act',
                params: Array.from(this.selectedRows).map(id => `idList=${id}`).join('&')
            }
        ];

        return super.print();
    }

    private createPdi = async (event: Event) => {
        event.preventDefault();

        const button = $(event.target);
        const form = button.closest('form').get(0);
        const dialog = $('#create-dialog');

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        button.prop('disabled', true);

        const employeeInput = dialog.find('input[name="hiddenEmployee"]').val() as string;
        const employee = JSON.parse(employeeInput);
        const validatedFields = this.validateIntegerFields([
            {key: 'qty', value: dialog.find('input[name="qty"]').val(), min: 1, label: 'Количество'},
            {key: 'qtyCompleted', value: dialog.find('input[name="qtyCompleted"]').val(), min: 0, label: 'Выполненное количество', defaultValue: 0}
        ]);
        if (!validatedFields) {
            button.prop('disabled', false);
            return;
        }

        const formData = {
            customerOrder: dialog.find('input[name="customerOrder"]').val(),
            name: dialog.find('input[name="name"]').val(),
            thickness: dialog.find('input[name="thickness"]').val(),
            measurements: dialog.find('input[name="measurements"]').val(),
            steel: dialog.find('input[name="steel"]').val(),
            scheme: dialog.find('input[name="scheme"]').val(),
            qty: validatedFields.qty,
            qtyCompleted: validatedFields.qtyCompleted,
            comment: dialog.find('textarea[name="comment"]').val(),
            machine: dialog.find('input[name="machine"]').val(),
            program: dialog.find('input[name="program"]').val(),
            employee: employee,
            status: dialog.find('select[name="status"]').val(),
            dateCompletion: dialog.find('input[name="dateCompletion"]').val()
        };

        try {
            const newPdi: pdItemIn = await this.createEntity('/api/parts-directory/create-item', formData);
            this.saveMassive = {};
            this.localCache.set(newPdi.id, newPdi);
            this.dialog.close("create-dialog");
            const newRow = this.createRow(newPdi);
            $(`.table-body`).append(newRow);
            button.prop('disabled', false);
        } catch (error) {
            this.saveMassive = {};
            form.reset();
            this.createNotification('Ошибка при создании PDI', NotificationType.ERROR);
            button.prop('disabled', false);
        }
    }

    private async workWithModal(event: Event): Promise<void> {
        const modalDiv = $(event.currentTarget);
        const fieldName = modalDiv.attr('data-field');
        const currentId = modalDiv.closest('.row-items-row').attr('id');
        let selected: any;

        if (fieldName === 'subDivision' || fieldName === 'employee') {
            const isEmployee = fieldName === 'employee';
            const dialog = $(isEmployee ? '#employeeDialog' : '#subDivisionDialog');
            const rowContainer = dialog.find('.dialog-content-rows');
            const searchInput = dialog.find('.choice-field input');
            const changeButton = $(isEmployee ? '#changeEmployee' : '#changeSubDivision');

            const data: any = await this.cache.get(fieldName);
            const filteredEmployees = data.filter(employee =>
                ['EVENT', 'CONTROL'].some(role => role === employee.role)
            );

            const renderRows = (items: any[]) => {
                rowContainer.empty();
                items.forEach(item => {
                    rowContainer.append(`
                    <div class="dialog-content-rows-row" id="${item.id}">
                        <div class="content-row-column col-250">${item.name}</div>
                        ${isEmployee ? `<div class="content-row-column col-250">${item.subDivision?.name || ''}</div>` : ''}
                    </div>`
                    );
                });
            };

            renderRows(filteredEmployees);

            searchInput.off('input').on('input', function () {
                const searchText = $(this).val().toString().toLowerCase().trim();
                const filtered = data.filter((e: any) => e.name.toLowerCase().includes(searchText));
                renderRows(filtered);
            });

            this.dialog.open('employeeDialog');

            rowContainer.off('click').on('click', '.dialog-content-rows-row', function (e: Event) {
                const id = $(e.currentTarget).attr('id');
                selected = data.find((e: any) => e.id === Number(id));
                $('.dialog-content-rows-row').removeClass('selected');
                $(this).addClass('selected');
            });

            changeButton.off('click').on('click', () => {
                if (!selected) {
                    this.createNotification(`Выберите ${isEmployee ? 'сотрудника' : 'подразделение'} из списка`, NotificationType.WARNING);
                    return;
                }

                modalDiv.text(selected.name);
                modalDiv.val(selected.name);

                if (isEmployee) {
                    const employeeJson = JSON.stringify(selected);
                    $('#create-dialog').find('input[name="hiddenEmployee"]').val(employeeJson);
                }

                if (currentId) {
                    this.saveMassive[currentId] = {
                        ...this.saveMassive[currentId],
                        [fieldName]: selected
                    };
                } else {
                    this.saveMassive[fieldName] = selected;
                }

                modalDiv.addClass('change-textarea');
                this.dialog.close('employeeDialog');
            });
        }

        modalDiv.addClass('change');
    }

    private async selecteRows(event: Event): Promise<void> {
        if (this.editMode) {
            this.createNotification('Выключите режим редактирования', NotificationType.INFO);
            return;
        }
        const circle = $(event.currentTarget);
        const allRows = $('.table-row:visible');

        if (circle.hasClass('active')) {
            this.selectedRows.clear();
            allRows.removeClass('selected');
            allRows.each((_, row) => {
                const circle = $(row).find('.circle-row');
                circle.removeClass('active-critical');
            });
            circle.removeClass('active');
        } else {
            this.selectedRows.clear();
            allRows.each((_, row) => {
                const circle = $(row).find('.circle-row')
                const rowId = $(row).attr('id');
                this.selectedRows.add(rowId);
                $(row).addClass('selected');
                circle.addClass('active-critical')
            });
            circle.addClass('active');
        }
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

    private enableEditMode(row?: any): void {
        const dateTime: string[] = ['datePreparation', 'dateVerification'];

        const processElement = ($div: any) => {
            const text = $div.text().trim();
            const dataName: string = $div.attr('data-name');
            let element: any;

            if (dataName === 'mark') {
                element = $(`<select data-name="${dataName}"></select>`);
                const statuses = ['исправен', 'списан', 'на поверке', 'ремонт'];
                if (text === '' || text === null) {
                    element.append($(`<option selected value=""></option>`));
                }
                statuses.forEach(status => {
                    const isSelected = text !== '' && text !== null && status === text;
                    element.append($(`<option ${isSelected ? 'selected' : ''}>${status}</option>`));
                });
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
        $('#edit-button').addClass('active');
    }

    private disableEditMode(row?: any): void {
        if (this.editMode &&
            Object.keys(this.saveMassive).length > 0 &&
            ((row && row.find('.change').length > 0) || $('.table-row .change').length > 0)) {
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

    private saveSpe() {
        if (Object.keys(this.saveMassive).length === 0) {
            return;
        }
        for (const id of Object.keys(this.saveMassive)) {
            const cacheData = this.localCache.get(Number(id)) as pdItemIn;
            const changes = this.saveMassive[id] || {};
            const qtyValue = changes.qty ?? cacheData.qty;
            const qtyCompletedValue = changes.qtyCompleted ?? cacheData.qtyCompleted;
            const validatedFields = this.validateIntegerFields([
                {key: 'qty', value: qtyValue, min: 1, label: 'Количество'},
                {key: 'qtyCompleted', value: qtyCompletedValue, min: 0, label: 'Выполненное количество', defaultValue: 0}
            ]);

            if (!validatedFields) {
                return;
            }

            this.saveMassive[id] = {
                ...changes,
                qty: validatedFields.qty,
                qtyCompleted: validatedFields.qtyCompleted
            };
        }

        const itemsArray = Object.keys(this.saveMassive).map(id => {
            const cacheData = this.localCache.get(Number(id)) as SpeIn;
            return {
                id: id,
                version: cacheData.version,
                changes: this.saveMassive[id]
            };
        });
        this.save('/api/parts-directory/update', ...itemsArray).then(() => {
            this.disableEditMode();
            itemsArray.forEach((id) => this.selectedRows.delete(Number(id)));
        });
    }
    private inputChanges(event: Event): void {
        const $el = $(event.target);
        const id = $el.closest('.table-row').attr('id');
        const name = $el.attr('data-name');
        const value = $el.is('div') ? $el.text().trim() : $el.val();

        this.saveMassive[id] = {...this.saveMassive[id], [name]: value};
        $el.addClass('change');
    }


}

$(document).ready(() => {
    new PdItem();
});

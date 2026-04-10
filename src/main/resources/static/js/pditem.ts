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
        this.createHandler('click', '.circle-header', this.toggleAllRowsSelection.bind(this), true);
        this.createHandler('click', '.circle-row', this.selectRow.bind(this), true);
        this.createHandler('click', '#edit-button', () => {
            if (!this.editMode) {
                this.enableEditMode();
                $('#edit-button').addClass('active');
            } else {
                this.disableEditMode();
                if (!this.editMode) $('#edit-button').removeClass('active');
            }
        }, true);
        this.createHandler('click', '#save-button', () => this.savePdi(), true);
        this.createHandler('click', '#print-button', this.print = this.print.bind(this), true);
        this.createHandler('input', '[data-name]', this.inputChanges.bind(this), true);
    }

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
                        ${this.escapeHtml(pdi.customerOrder.name)}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--name);">
                    <div class="field-container center" data-name="name" contenteditable="false">
                        ${this.escapeHtml(pdi.name)}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--scheme);">
                    <div class="field-container center" data-name="scheme" contenteditable="false">
                        ${this.escapeHtml(pdi.scheme)}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--thickness); padding: 0">
                    <div class="field-container center" data-name="thickness" contenteditable="false">
                        ${this.escapeHtml(String(pdi.thickness))}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--steel); padding: 0">
                    <div class="field-container center" data-name="steel" contenteditable="false">
                        ${this.escapeHtml(pdi.steel)}
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
                        ${this.escapeHtml(pdi.measurements)}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--program);">
                    <div class="field-container" data-name="program" contenteditable="false">
                        ${this.escapeHtml(pdi.program)}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--comment);">
                    <div class="field-container" data-name="comment" contenteditable="false">
                        ${this.escapeHtml(pdi.comment)}
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

    public override async print(): Promise<void> {
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

    private savePdi(): void {
        if (Object.keys(this.saveMassive).length === 0) return;

        for (const id of Object.keys(this.saveMassive)) {
            const cacheData = this.localCache.get(id) as pdItemIn | undefined;
            if (!cacheData) return;
            const changes = this.saveMassive[id] || {};
            const qtyValue = changes.qty ?? cacheData.qty;
            const qtyCompletedValue = changes.qtyCompleted ?? cacheData.qtyCompleted;
            const validatedFields = this.validateIntegerFields([
                {key: 'qty', value: qtyValue, min: 1, label: 'Количество'},
                {
                    key: 'qtyCompleted',
                    value: qtyCompletedValue,
                    min: 0,
                    label: 'Выполненное количество',
                    defaultValue: 0
                }
            ]);
            if (!validatedFields) return;

            this.saveMassive[id] = {...changes, qty: validatedFields.qty, qtyCompleted: validatedFields.qtyCompleted};
        }

        const itemsArray = Object.keys(this.saveMassive).map(id => {
            const cacheData = this.localCache.get(id) as pdItemIn | undefined;
            return {id: id, version: cacheData?.version, changes: this.saveMassive[id]};
        });

        this.save('/api/parts-directory/update', ...itemsArray).then(() => {
            this.disableEditMode();
            itemsArray.forEach((item) => this.selectedRows.delete(item.id));
            $('#edit-button').removeClass('active');
        });
    }

    private createPdi = async (event: Event): Promise<void> => {
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
            {
                key: 'qtyCompleted',
                value: dialog.find('input[name="qtyCompleted"]').val(),
                min: 0,
                label: 'Выполненное количество',
                defaultValue: 0
            }
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
            employee,
            status: dialog.find('select[name="status"]').val(),
            dateCompletion: dialog.find('input[name="dateCompletion"]').val()
        };

        try {
            const newPdi: pdItemIn = await this.createEntity('/api/parts-directory/create-item', formData);
            this.saveMassive = {};
            this.localCache.set(newPdi.id, newPdi);
            this.dialog.close("create-dialog");
            $(`.table-body`).append(this.createRow(newPdi));
        } catch {
            this.saveMassive = {};
            form.reset();
            this.createNotification('Ошибка при создании PDI', NotificationType.ERROR);
        } finally {
            button.prop('disabled', false);
        }
    }

    private workWithModal = async (event: Event): Promise<void> => {
        const modalDiv = $(event.currentTarget);
        const fieldName = modalDiv.attr('data-field');
        const currentId = modalDiv.closest('.row-items-row')?.attr('id');

        if (fieldName === 'employee') {
            await this.openSelectionDialog('employee', 'employeeDialog', modalDiv, currentId, undefined,
                [{key: 'name', label: 'Имя', width: '250'}]);
        }
        modalDiv.addClass('change');
    };

    private selectRow = async (event: Event): Promise<void> => {
        this.toggleRowSelection(event, true);
        const circle = $(event.currentTarget);
        const currentRow = circle.closest('.table-row');
        const rowId = currentRow.attr('id');
        if (!rowId) return;

        if (this.selectedRows.has(rowId) && this.editMode) {
            this.enableEditMode([], currentRow);
        } else if (!this.selectedRows.has(rowId)) {
            this.disableEditMode();
            if (!this.editMode) $('#edit-button').removeClass('active');
        }
    };

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

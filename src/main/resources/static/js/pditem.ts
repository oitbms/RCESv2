import { Base } from './base/base';
import { NotificationType } from './core/types';

class PdItem extends Base {

    private readonly pdSpecialFields: { name: string, transform: ($div: any) => any }[] = [
        {
            name: 'dateCompletion',
            transform: ($div: any) => {
                const dataName = $div.attr('data-name');
                const rowId = $div.closest('.table-row').attr('id');
                const cacheKey = (rowId && rowId.indexOf('.') !== -1) ? rowId : Number(rowId);
                const value = (this.localCache.get(cacheKey) || {})[dataName];
                if (!value) return $(`<div class="field-container" style="width: 95%">
                                        <input type="datetime-local" class="form-control" style="padding: 0; font-size: 14px" data-name="${dataName}">
                                       </div>`);
                const date = new Date(value);
                const pad = (n: number) => n.toString().padStart(2, '0');
                const val = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

                return $(`<div class="field-container" style="width: 95%">
                            <input type="datetime-local" class="form-control" style="padding: 0; font-size: 14px" data-name="${dataName}">
                          </div>`)
                    .find('input').val(val).end();
            }
        },
        {
            name: 'team',
            transform: ($div: any) => {
                const dataName = $div.attr('data-name');
                const value = $div.text() || '';
                return $(`<div class="field-container team-field area-modal center" data-name="${dataName}" contenteditable="false">${this.escapeHtml(value)}</div>`);
            }
        }
    ];

    private selectedTeamForEdit: any = null;
    private selectedEmployeeIds: number[] = [];
    private allTeamsCache: any[] = [];
    private allEmployeesCache: any[] = [];
    private selectedReadinessRowId: string | null = null;
    private loadFrom1cRows: partsDirectoryFrom1CPreviewRow[] = [];
    private selectedLoadFrom1cRowIndexes = new Set<number>();
    private loadFrom1cSearchText = '';
    private loadFrom1cSteelFilterText = '';
    private readinessFilter: 'ALL' | 'READY' | 'NOT_READY' = 'ALL';

    constructor(itemsPerPage = Infinity, visibleRow = Infinity) {
        super($(`.table-body`), itemsPerPage, visibleRow, () => {
            this.displayPage('/api/parts-directory/get-page-pdi', undefined).catch(console.error);
        });
        this.createHandler('click', '#create-button', () => this.dialog.open('create-dialog'), true);
        this.createHandler('click', '#load-1c-button', () => this.openLoadFrom1cDialog(), true);
        this.createHandler('click', '#createBtn', this.createPdi, true);
        this.createHandler('submit', '#loadFrom1cForm', (event: Event) => event.preventDefault());
        this.createHandler('click', '#loadFrom1cBtn', this.handleLoadFrom1c.bind(this), true);
        this.createHandler('click', '#createFrom1cBtn', this.createSelectedFrom1cItems.bind(this), true);
        this.createHandler('input', '#loadFrom1cSearchInput', this.handleLoadFrom1cSearch.bind(this), true);
        this.createHandler('input', '#loadFrom1cSteelFilterInput', this.handleLoadFrom1cSteelFilter.bind(this), true);
        this.createHandler('change', '#load-1c-select-all', this.toggleAllLoadFrom1cRowsSelection.bind(this), true);
        this.createHandler('change', '.load-1c-row-checkbox', this.toggleLoadFrom1cRowSelection.bind(this), true);
        this.createHandler('click', '.area-modal', this.workWithModal.bind(this), true);
        this.bindTableSelection();
        this.createHandler('click', '.circle-row', this.selectRow.bind(this), true);
        this.createHandler('click', '#edit-button', () => {
            if (!this.editMode) {
                this.enableEditMode(['dateCompletion'], undefined, this.pdSpecialFields);
                $('#edit-button').addClass('active');
            } else {
                this.disableEditMode(['dateCompletion'], []);
                if (!this.editMode) $('#edit-button').removeClass('active');
            }
            this.syncEditModeUi();
        }, true);
        this.createHandler('click', '#save-button', () => this.savePdi(), true);
        this.createHandler('click', '#print-button', this.print = this.print.bind(this), true);
        this.createHandler('click', '#teams-button', () => this.openTeamEditDialog(), true);
        this.bindFieldChanges();
        this.createHandler('click', '.ready-checkbox', (e) => {
            if (this.blockReadinessInEditMode(e)) {
                return;
            }

            const $row = $(e.currentTarget).closest('.table-row');
            const rowId = Number($row.attr('id'));
            const pdItem = this.localCache.get(rowId) as pdItemIn;

            if (pdItem.ready) {
                const params = new URLSearchParams();
                params.set('id', String(rowId));
                params.set('ready', 'false');
                this.requestToApi(`/api/parts-directory/ready?${params.toString()}`, "PATCH").then((pdi: pdItemIn) => {
                    this.updateRow(pdi, rowId);
                    setTimeout(() => this.applyFilters(), 150);
                });
            } else {
                this.openReadinessDialog(e);
            }
        }, true);
        this.createHandler('click', '#saveReadiness', this.saveReadinessHandler.bind(this), true);
        this.createHandler('click', '#cancelReadiness', this.closeReadinessDialog.bind(this), true);
        this.createHandler('click', '#closeReadinessDialog', this.closeReadinessDialog.bind(this), true);
        this.createHandler('click', '#readyFilterButton', this.toggleReadinessFilter.bind(this), true);
        this.createHandler('input', '#searchInput', (event) => {
            this.searchText = $(event.target).val().toString().toLowerCase().trim();
            this.applyFilters();
        }, true);
        this.createHandler('contextmenu', '.table-row.selected', this.showRowContextMenu.bind(this), true);
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
                        ${this.escapeHtml(pdi.thickness || '')}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--steel); padding: 0">
                    <div class="field-container center" data-name="steel" contenteditable="false">
                        ${this.escapeHtml(pdi.steel)}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--qty);">
                    <div class="field-container center" data-name="qty" contenteditable="false">
                        ${pdi.qty}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--qtyCompleted);">
                    <div class="field-container center" data-name="qtyCompleted" contenteditable="false">
                        ${pdi.qtyCompleted}
                    </div>
                </div>
                 <div class="table-cell" style="width: var(--measurements);">
                    <div class="field-container center" data-name="measurements" contenteditable="false">
                        ${this.escapeHtml(pdi.measurements)}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--machine);">
                    <div class="field-container center" data-name="machine" contenteditable="false">
                        ${this.escapeHtml(pdi.machine || '')}
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
                <div class="table-cell" style="width: var(--team);">
                    <div class="field-container team-field center" data-name="team" contenteditable="false">
                        ${this.escapeHtml(pdi.team?.name || '')}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--preparationDate);">
                    <div contenteditable="false" data-name="dateCompletion">
                        ${this.formatDate(pdi.dateCompletion)}
                    </div>
                </div>
                <div class="table-cell center" style="width: var(--ready);">
                    <div class="checkbox-wrapper-ready">
                        <input type="checkbox" class="ready-checkbox" id="toggleReady-${pdi.id}" ${pdi.ready ? 'checked' : ''}>
                        <svg viewBox="0 0 35.6 35.6">
                            <circle class="background" cx="17.8" cy="17.8" r="17.8"></circle>
                            <circle class="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                            <polyline class="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
                        </svg>
                    </div>
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
            const pdItem = this.localCache.get(Number(id)) as pdItemIn;

            const changes = this.saveMassive[id] || {};
            const qtyValue = changes.qty ?? pdItem.qty;
            const qtyCompletedValue = changes.qtyCompleted ?? pdItem.qtyCompleted;
            const validatedFields = this.validateIntegerFields([
                {key: 'qty', value: qtyValue, min: 0, label: 'Количество'},
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

        this.saveMassiveChanges('/api/parts-directory/update', (id: string | number, cacheData: any, changes: any) => ({
            id: id,
            version: cacheData?.version,
            changes: changes
        })).then(() => {
            this.disableEditMode(['dateCompletion'], []);
            $('#edit-button').removeClass('active');
            this.syncEditModeUi();
        }).catch(console.error);
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

        const hiddenEmployee = dialog.find('input[name="hiddenEmployee"]').val();
        const employee = this.saveMassive['employee'] || (hiddenEmployee ? JSON.parse(String(hiddenEmployee)) : null);
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

        const hiddenTeam = dialog.find('input[name="hiddenTeam"]').val() as string;
        const team = hiddenTeam ? JSON.parse(hiddenTeam) : null;

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
            team,
            status: dialog.find('select[name="status"]').val(),
            dateCompletion: dialog.find('input[name="dateCompletion"]').val()
        };

        try {
            const newPdi: pdItemIn = await this.createEntity('/api/parts-directory/create-item', formData);
            this.saveMassive = {};
            this.localCache.set(newPdi.id, newPdi);
            this.dialog.close("create-dialog");
            $(`.table-body`).append(this.createRow(newPdi));
            this.applyFilters();
        } catch {
            this.saveMassive = {};
            form.reset();
            this.createNotification('Ошибка при создании PDI', NotificationType.ERROR);
        } finally {
            button.prop('disabled', false);
        }
    }

    private resetLoadFrom1cPreview(): void {
        const dialog = $('#load-1c-dialog');

        this.loadFrom1cRows = [];
        this.loadFrom1cSearchText = '';
        this.loadFrom1cSteelFilterText = '';
        this.selectedLoadFrom1cRowIndexes.clear();

        dialog.removeClass('has-results has-loaded-1c show-create-from-1c');
        dialog.find('#load-1c-results').attr('hidden', 'hidden');
        dialog.find('#load-1c-result-summary').text('');
        dialog.find('#load-1c-rows').empty();
        dialog.find('#loadFrom1cSearchInput').val('');
        dialog.find('#loadFrom1cSteelFilterInput').val('');
        dialog.find('#load-1c-select-all')
            .prop('checked', false)
            .prop('indeterminate', false)
            .prop('disabled', true);
        dialog.find('#createFrom1cBtn').prop('disabled', true);
    }

    private extractLoadFrom1cOrderNumber(customerOrder: string): string {
        const value = customerOrder?.trim() || '';
        if (!value) {
            return '';
        }

        const match = value.match(/\d[\d./-]*/);
        return match ? match[0] : value;
    }

    private getLoadFrom1cField<T>(item: partsDirectoryFrom1CRowIn, camelKey: keyof partsDirectoryFrom1CRowIn, russianKey: keyof partsDirectoryFrom1CRowIn): T | undefined {
        const camelValue = item[camelKey] as T | undefined;
        if (camelValue !== undefined && camelValue !== null && camelValue !== '') {
            return camelValue;
        }

        const russianValue = item[russianKey] as T | undefined;
        return russianValue !== undefined && russianValue !== null && russianValue !== '' ? russianValue : undefined;
    }

    private mapLoadFrom1cRows(response: partsDirectoryFrom1CIn): partsDirectoryFrom1CPreviewRow[] {
        const rows = Array.isArray(response?.response)
            ? response.response
            : Array.isArray(response?.['Запрос'])
                ? response['Запрос']
                : [];

        return rows.map((item, index) => {
            const customerOrder = this.getLoadFrom1cField<string>(item, 'customerOrder', 'НаименованиеПодзаказа') || '';
            const drawing = this.getLoadFrom1cField<string>(item, 'item', 'Чертеж') || '';
            const detail = this.getLoadFrom1cField<string>(item, 'scheme', 'Деталь') || '';
            const quantity = this.getLoadFrom1cField<string | number>(item, 'name', 'КоличествоДеталей');
            const size = this.getLoadFrom1cField<string>(item, 'thickness', 'Размер') || '';
            const steel = this.getLoadFrom1cField<string>(item, 'steel', 'Сталь') || '';
            const steelQty = this.getLoadFrom1cField<string | number>(item, 'qty', 'КоличествоСтали');
            const quantityNumber = Number(quantity);
            const steelQtyNumber = Number(steelQty);

            return {
                index,
                customerOrder: this.extractLoadFrom1cOrderNumber(customerOrder),
                drawing: [drawing, detail].filter(Boolean).join(' '),
                detail,
                quantity: quantity != null ? String(quantity) : '',
                quantityNumber: Number.isFinite(quantityNumber) ? quantityNumber : 0,
                size,
                steel,
                steelQty: steelQty != null ? String(steelQty) : '',
                steelQtyNumber: Number.isFinite(steelQtyNumber) ? steelQtyNumber : 0,
            };
        });
    }

    private getFilteredLoadFrom1cRows(): partsDirectoryFrom1CPreviewRow[] {
        return this.loadFrom1cRows.filter((row) => {
            const matchesGeneral = !this.loadFrom1cSearchText || [
                row.customerOrder,
                row.drawing,
                row.detail,
                row.quantity,
                row.size
            ].some((value) => value.toLowerCase().includes(this.loadFrom1cSearchText));

            const matchesSteel = !this.loadFrom1cSteelFilterText
                || row.steel.toLowerCase().includes(this.loadFrom1cSteelFilterText);

            return matchesGeneral && matchesSteel;
        });
    }

    private handleLoadFrom1cSearch(event: Event): void {
        this.loadFrom1cSearchText = $(event.target).val()?.toString().toLowerCase().trim() || '';
        this.renderLoadFrom1cRows();
    }

    private handleLoadFrom1cSteelFilter(event: Event): void {
        this.loadFrom1cSteelFilterText = $(event.target).val()?.toString().toLowerCase().trim() || '';
        this.renderLoadFrom1cRows();
    }

    private updateLoadFrom1cSummary(): void {
        const dialog = $('#load-1c-dialog');
        const total = this.loadFrom1cRows.length;
        const filteredRows = this.getFilteredLoadFrom1cRows();
        const filteredTotal = filteredRows.length;
        const selected = this.selectedLoadFrom1cRowIndexes.size;
        const selectedVisible = filteredRows.filter((row) => this.selectedLoadFrom1cRowIndexes.has(row.index)).length;

        let summary = 'По этому заказу строки не найдены.';
        if (total > 0) {
            summary = this.loadFrom1cSearchText || this.loadFrom1cSteelFilterText
                ? `Загружено строк: ${total}. По фильтру: ${filteredTotal}. Выбрано: ${selected}.`
                : `Найдено строк: ${total}. Выбрано: ${selected}.`;
        }

        dialog.find('#load-1c-result-summary').text(summary);

        dialog.find('#load-1c-select-all')
            .prop('checked', filteredTotal > 0 && selectedVisible === filteredTotal)
            .prop('indeterminate', selectedVisible > 0 && selectedVisible < filteredTotal)
            .prop('disabled', filteredTotal === 0);
        dialog.find('#createFrom1cBtn').prop('disabled', selected === 0);
    }

    private renderLoadFrom1cRows(): void {
        const dialog = $('#load-1c-dialog');
        const rowsContainer = dialog.find('#load-1c-rows');
        const createButton = dialog.find('#createFrom1cBtn');
        const filteredRows = this.getFilteredLoadFrom1cRows();

        dialog.addClass('has-results');
        dialog.find('#load-1c-results').removeAttr('hidden');

        if (!this.loadFrom1cRows.length) {
            dialog.removeClass('has-loaded-1c show-create-from-1c');
            createButton.prop('disabled', true);
            rowsContainer.html('<div class="load-1c-empty">По этому заказу строки не найдены.</div>');
            this.updateLoadFrom1cSummary();
            return;
        }

        dialog.addClass('has-loaded-1c show-create-from-1c');
        createButton.prop('disabled', this.selectedLoadFrom1cRowIndexes.size === 0);

        if (!filteredRows.length) {
            rowsContainer.html('<div class="load-1c-empty">По фильтру строки не найдены.</div>');
            this.updateLoadFrom1cSummary();
            return;
        }

        const rowsHtml = filteredRows.map((row) => {
            const checked = this.selectedLoadFrom1cRowIndexes.has(row.index) ? 'checked' : '';
            const selectedClass = checked ? ' is-selected' : '';

            return `
                <div class="load-1c-grid__row${selectedClass}">
                    <label class="load-1c-grid__cell load-1c-grid__cell--checkbox">
                        <input type="checkbox" class="load-1c-row-checkbox" data-row-index="${row.index}" ${checked} aria-label="Выбрать строку">
                    </label>
                    <div class="load-1c-grid__cell"><span>${this.escapeHtml(row.customerOrder)}</span></div>
                    <div class="load-1c-grid__cell"><span>${this.escapeHtml(row.drawing)}</span></div>
                    <div class="load-1c-grid__cell"><span>${this.escapeHtml(row.quantity)}</span></div>
                    <div class="load-1c-grid__cell"><span>${this.escapeHtml(row.size)}</span></div>
                    <div class="load-1c-grid__cell"><span>${this.escapeHtml(row.steel)}</span></div>
                </div>
            `;
        }).join('');

        rowsContainer.html(rowsHtml);
        this.updateLoadFrom1cSummary();
    }

    private toggleAllLoadFrom1cRowsSelection(event: Event): void {
        const isChecked = (event.currentTarget as HTMLInputElement).checked;
        const filteredRows = this.getFilteredLoadFrom1cRows();
        const rowCheckboxes = $('#load-1c-rows').find('.load-1c-row-checkbox');

        rowCheckboxes.each((_, checkbox) => {
            const input = checkbox as HTMLInputElement;
            const rowIndex = Number($(input).attr('data-row-index'));

            input.checked = isChecked;
            $(input).closest('.load-1c-grid__row').toggleClass('is-selected', isChecked);

            if (isChecked && !Number.isNaN(rowIndex)) {
                this.selectedLoadFrom1cRowIndexes.add(rowIndex);
            } else if (!isChecked && !Number.isNaN(rowIndex)) {
                this.selectedLoadFrom1cRowIndexes.delete(rowIndex);
            }
        });

        filteredRows.forEach((row) => {
            if (isChecked) {
                this.selectedLoadFrom1cRowIndexes.add(row.index);
            } else {
                this.selectedLoadFrom1cRowIndexes.delete(row.index);
            }
        });

        this.updateLoadFrom1cSummary();
    }

    private toggleLoadFrom1cRowSelection(event: Event): void {
        const checkbox = event.currentTarget as HTMLInputElement;
        const rowIndex = Number($(checkbox).attr('data-row-index'));

        if (Number.isNaN(rowIndex)) {
            return;
        }

        if (checkbox.checked) {
            this.selectedLoadFrom1cRowIndexes.add(rowIndex);
        } else {
            this.selectedLoadFrom1cRowIndexes.delete(rowIndex);
        }

        $(checkbox).closest('.load-1c-grid__row').toggleClass('is-selected', checkbox.checked);
        this.updateLoadFrom1cSummary();
    }

    private openLoadFrom1cDialog(): void {
        this.resetLoadFrom1cPreview();
        $('#load-1c-dialog').find('input[name="orderNumber"]').val('');
        this.dialog.open('load-1c-dialog', {
            onOpen: () => {
                $('#load-1c-dialog').find('input[name="orderNumber"]').trigger('focus');
            }
        });
    }

    private async handleLoadFrom1c(event: Event): Promise<void> {
        event.preventDefault();

        const dialog = $('#load-1c-dialog');
        const form = dialog.find('#loadFrom1cForm').get(0) as HTMLFormElement;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const orderNumber = dialog.find('input[name="orderNumber"]').val()?.toString().trim();
        if (!orderNumber) {
            this.createNotification('Введите номер заказа', NotificationType.WARNING);
            return;
        }

        const button = dialog.find('#loadFrom1cBtn');
        const unlock = this.lockScreen('Загрузка данных из 1C...');

        this.resetLoadFrom1cPreview();
        button.prop('disabled', true);

        try {
            const response = await this.requestToApi(
                `/api/parts-directory/from-1c?customerOrder=${encodeURIComponent(orderNumber)}`,
                'GET'
            ) as partsDirectoryFrom1CIn;

            this.loadFrom1cRows = this.mapLoadFrom1cRows(response);
            this.loadFrom1cSearchText = '';
            this.loadFrom1cSteelFilterText = '';
            this.selectedLoadFrom1cRowIndexes.clear();
            this.renderLoadFrom1cRows();

            if (this.loadFrom1cRows.length) {
                this.createNotification(`Получено строк из 1C: ${this.loadFrom1cRows.length}`, NotificationType.SUCCESS);
            } else {
                this.createNotification('По этому заказу строки в 1C не найдены', NotificationType.INFO);
            }
        } catch (error) {
            console.error(error);
        } finally {
            unlock();
            button.prop('disabled', false);
        }
    }

    private async createSelectedFrom1cItems(event: Event): Promise<void> {
        event.preventDefault();

        if (this.selectedLoadFrom1cRowIndexes.size === 0) {
            this.createNotification('Выберите хотя бы одну строку', NotificationType.WARNING);
            return;
        }

        const payload = this.loadFrom1cRows
            .filter(row => this.selectedLoadFrom1cRowIndexes.has(row.index))
            .map(row => ({
                customerOrder: row.customerOrder,
                scheme: row.drawing,
                name: row.detail,
                qty: row.quantityNumber,
                steel: row.steel,
                measurements: row.size
            }));

        const button = $('#createFrom1cBtn');
        const unlock = this.lockScreen('Создание строк из 1C...');

        button.prop('disabled', true);

        try {
            const createdRows = await this.requestToApi(
                '/api/parts-directory/create-item-from-1c',
                'POST',
                payload
            ) as pdItemIn[];

            createdRows.forEach((row) => {
                this.localCache.set(row.id, row);
                $('.table-body').append(this.createRow(row));
            });
            this.applyFilters();

            this.dialog.close('load-1c-dialog');
            this.resetLoadFrom1cPreview();
            this.createNotification(`Создано строк: ${createdRows.length}`, NotificationType.SUCCESS);
        } catch (error) {
            console.error(error);
        } finally {
            unlock();
            button.prop('disabled', false);
        }
    }

    private workWithModal = async (event: Event): Promise<void> => {
        const modalDiv = $(event.currentTarget);
        const fieldName = modalDiv.attr('data-field') || modalDiv.attr('data-name');
        const currentId = modalDiv.closest('.table-row')?.attr('id');

        if (fieldName === 'employee') {
            const dialog = $('#employeeDialog');
            const rowContainer = dialog.find('.dialog-content-rows');
            const searchInput = dialog.find('.choice-field input');
            const changeButton = $('#changeEmployee');
            let selected: any;

            const data: any = await this.cache.get('employee');

            const renderRows = (items: any[]) => {
                rowContainer.empty();
                items.forEach(item => {
                    rowContainer.append(`
                        <div class="dialog-content-rows-row" id="${item.id}">
                            <div class="content-row-column col-250">${item.name}</div>
                            <div class="content-row-column col-250">${item.subDivision?.name || ''}</div>
                        </div>`
                    );
                });
            };

            renderRows(data);

            searchInput.off('input').on('input', function (this: HTMLInputElement) {
                const searchText = $(this).val()!.toString().toLowerCase().trim();
                const filtered = data.filter((e: any) =>
                    e.name.toLowerCase().includes(searchText)
                );
                renderRows(filtered);
            });

            this.dialog.open('employeeDialog');

            rowContainer.off('click').on('click', '.dialog-content-rows-row', (e) => {
                const target = e.currentTarget as HTMLElement;
                const id = target.id;
                selected = data.find((item: any) => item.id === Number(id));
                rowContainer.find('.dialog-content-rows-row').removeClass('selected');
                $(target).addClass('selected');
            });

            changeButton.off('click').on('click', () => {
                if (!selected) {
                    this.createNotification('Выберите сотрудника из списка', NotificationType.WARNING);
                    return;
                }

                // Записываем имя в видимое поле
                modalDiv.text(selected.name);
                modalDiv.val(selected.name);

                // Записываем объект сотрудника в скрытое поле для отправки на API
                const employeeJson = JSON.stringify(selected);
                $('#create-dialog').find('input[name="hiddenEmployee"]').val(employeeJson);

                if (currentId) {
                    this.saveMassive[currentId] = {...this.saveMassive[currentId], employee: selected};
                }

                modalDiv.addClass('change-textarea');
                this.dialog.close('employeeDialog');
            });
        } else if (fieldName === 'team') {
            await this.openTeamSelectionDialog(modalDiv, currentId);
        }
        modalDiv.addClass('change');
    };

    private openTeamSelectionDialog = async (modalDiv: any, currentId: string | undefined): Promise<void> => {
        const allTeams: any = await this.requestToApi('/api/team/get-page', 'GET');
        const teamsList = allTeams.data || [];
        await this.openSelectionDialog('team', 'teamDialog', modalDiv, currentId, teamsList, undefined, [
            {key: 'name', label: 'Название', width: '160'},
            {
                label: 'Сотрудники',
                width: '500',
                renderer: (t: any) => (t.employees || []).map((e: any) => e.name).join(', ')
            }
        ]);
    };

    private selectRow = async (event: Event): Promise<void> => {
        const wasSelected = this.selectedRows.has($(event.currentTarget).closest('.table-row').attr('id'));
        this.toggleRowSelection(event, true);
        const circle = $(event.currentTarget);
        const currentRow = circle.closest('.table-row');
        const rowId = currentRow.attr('id');
        if (!rowId) return;

        if (this.selectedRows.has(rowId) && !wasSelected && this.editMode) {
            this.enableEditMode(['dateCompletion'], currentRow, this.pdSpecialFields);
        } else if (!this.selectedRows.has(rowId)) {
            this.disableEditMode(['dateCompletion'], []);
            if (!this.editMode) $('#edit-button').removeClass('active');
            this.syncEditModeUi();
        }
    };

    private syncEditModeUi(): void {
        document.body.classList.toggle('pd-edit-mode', this.editMode);
    }

    private blockReadinessInEditMode(event?: Event): boolean {
        if (!this.editMode) {
            return false;
        }

        event?.preventDefault();
        event?.stopPropagation();
        this.createNotification('Выключите режим редактирования', NotificationType.INFO);
        return true;
    }

    private openReadinessDialog(event: Event): void {
        if (this.blockReadinessInEditMode(event)) {
            return;
        }

        const $row = $(event.currentTarget).closest('.table-row');
        const rowId = $row.attr('id');
        if (!rowId) return;

        this.selectedReadinessRowId = rowId;

        // Получаем данные из кэша для отображения текущих операций
        const cacheData = this.localCache.get(rowId) as pdItemIn | undefined;
        const operations = cacheData?.operation || [];

        // Отмечаем чекбоксы на основе существующих операций
        const dialog = $('#readiness-dialog');
        dialog.find('#operationThermal').prop('checked', operations.indexOf('thermal') !== -1);
        dialog.find('#operationLocksmith').prop('checked', operations.indexOf('locksmith') !== -1);
        dialog.find('#operationBaikal').prop('checked', operations.indexOf('baikal') !== -1);
        dialog.find('#operationShearingPunching').prop('checked', operations.indexOf('shearingpunching') !== -1);
        dialog.find('#operationDrilling').prop('checked', operations.indexOf('drilling') !== -1);
        dialog.find('#operationBending').prop('checked', operations.indexOf('bending') !== -1);
        dialog.find('#operationPressing').prop('checked', operations.indexOf('pressing') !== -1);

        this.dialog.open('readiness-dialog');
    }

    private closeReadinessDialog = (): void => {
        this.dialog.close('readiness-dialog');
        this.selectedReadinessRowId = null;
    };

    private saveReadinessHandler = async (): Promise<void> => {
        if (!this.selectedReadinessRowId) return;
        if (this.blockReadinessInEditMode()) {
            this.closeReadinessDialog();
            return;
        }

        const dialog = $('#readiness-dialog');
        const isThermal = dialog.find('#operationThermal').is(':checked');
        const isLocksmith = dialog.find('#operationLocksmith').is(':checked');
        const isBaikal = dialog.find('#operationBaikal').is(':checked');
        const isShearingPunching = dialog.find('#operationShearingPunching').is(':checked');
        const isDrilling = dialog.find('#operationDrilling').is(':checked');
        const isBending = dialog.find('#operationBending').is(':checked');
        const isPressing = dialog.find('#operationPressing').is(':checked');

        // Собираем выбранные операции
        const operations: string[] = [];
        if (isThermal) operations.push('thermal');
        if (isLocksmith) operations.push('locksmith');
        if (isBaikal) operations.push('baikal');
        if (isShearingPunching) operations.push('shearingpunching');
        if (isDrilling) operations.push('drilling');
        if (isBending) operations.push('bending');
        if (isPressing) operations.push('pressing');

        // Готовность = true если выбрана хотя бы одна операция
        const ready = operations.length > 0;

        const unlock = this.lockScreen('Сохранение готовности...');
        try {
            const params = new URLSearchParams();
            params.set('id', this.selectedReadinessRowId);
            params.set('ready', String(ready));
            operations.forEach(op => params.append('operations', op));

            await this.requestToApi(`/api/parts-directory/ready?${params.toString()}`, 'PATCH').then((pdi: pdItemIn) => {
                // @ts-ignore
                this.updateRow(pdi, this.selectedReadinessRowId);
                setTimeout(() => this.applyFilters(), 150);
            });

            // Обновляем кэш и UI
            const cacheData = this.localCache.get(this.selectedReadinessRowId) as pdItemIn | undefined;
            if (cacheData) {
                cacheData.ready = ready;
                cacheData.operation = operations as any;
            }

            // Обновляем чекбокс в таблице
            const $row = $(`.table-row[id="${this.selectedReadinessRowId}"]`);
            const checkbox = $row.find('.ready-checkbox');
            checkbox.prop('checked', ready);

            this.createNotification('Готовность успешно обновлена', NotificationType.SUCCESS);
            this.closeReadinessDialog();
        } catch {
            this.createNotification('Ошибка при сохранении готовности', NotificationType.ERROR);
        } finally {
            unlock();
        }
    };

    private toggleReadinessFilter(event: Event): void {
        event.preventDefault();

        const nextFilter = {
            ALL: 'READY',
            READY: 'NOT_READY',
            NOT_READY: 'ALL'
        } as const;

        this.readinessFilter = nextFilter[this.readinessFilter];
        this.updateReadinessFilterButton();
        this.applyFilters();
    }

    private updateReadinessFilterButton(): void {
        const config = {
            ALL: {
                icon: 'fa-filter',
                description: 'Фильтр по готовности: все',
                className: ''
            },
            READY: {
                icon: 'fa-check',
                description: 'Фильтр по готовности: только готовые',
                className: 'ready-filter-button--ready active'
            },
            NOT_READY: {
                icon: 'fa-xmark',
                description: 'Фильтр по готовности: только не готовые',
                className: 'ready-filter-button--not-ready active'
            }
        }[this.readinessFilter];

        const $button = $('#readyFilterButton');
        $button
            .removeClass('ready-filter-button--ready ready-filter-button--not-ready active')
            .addClass(config.className)
            .attr('data-description', config.description)
            .attr('aria-label', config.description);
        $button.find('i').attr('class', `fas ${config.icon}`);
    }

    private matchesReadinessFilter($row: any): boolean {
        if (this.readinessFilter === 'ALL') {
            return true;
        }

        const rowId = $row.attr('id');
        const numericRowId = Number(rowId);
        const pdItem = this.localCache.get(Number.isNaN(numericRowId) ? rowId : numericRowId) as pdItemIn | undefined;
        const isReady = pdItem ? Boolean(pdItem.ready) : $row.find('.ready-checkbox').prop('checked') === true;

        return this.readinessFilter === 'READY' ? isReady : !isReady;
    }

    protected override applyFilters(): void {
        $('.table-row').each((_, row) => {
            const $row = $(row);
            const text = $row.text().toLowerCase();
            const textMatches = !this.searchText || text.includes(this.searchText);
            $row.toggle(textMatches && this.matchesReadinessFilter($row));
        });
    }

    private getSelectedPdiIds = (fallbackId: string): string[] => {
        const selectedIds = Array.from(this.selectedRows)
            .map(id => String(id))
            .filter(id => id && $(`.table-row[id="${id}"]`).hasClass('selected'));

        if (!selectedIds.includes(fallbackId)) {
            selectedIds.push(fallbackId);
        }

        return Array.from(new Set(selectedIds));
    };

    private removeDeletedPdiRow = (id: string): void => {
        const $row = $(`.table-row[id="${id}"]`);
        $row.removeClass('selected');
        $row.find('.circle-row').removeClass('active-critical');

        this.deleteRow(id);
        this.selectedRows.delete(id);

        const numericId = Number(id);
        if (!Number.isNaN(numericId)) {
            this.selectedRows.delete(numericId);
            this.localCache.delete(numericId);
        }

        delete this.saveMassive[id];
    };

    private showRowContextMenu = (event: Event): void => {
        event.preventDefault();
        const $row = $(event.currentTarget);
        const rowId = $row.attr('id');
        if (!rowId) return;

        const idsToDelete = this.getSelectedPdiIds(rowId);
        const mouseEvent = event as MouseEvent;
        this.createContextMenu([
            {
                label: idsToDelete.length > 1 ? `Удалить выбранные (${idsToDelete.length})` : 'Удалить запись',
                idAction: 'deletePdi',
                action: () => {
                    this.deletePdiHandler(idsToDelete);
                }
            },
        ], mouseEvent.clientX, mouseEvent.clientY);
    };

    private deletePdiHandler = async (ids: string[]): Promise<void> => {
        const idsToDelete = Array.from(new Set(ids.map(id => String(id)).filter(Boolean)));
        if (idsToDelete.length === 0) return;

        let unlock: (() => void) | null = null;
        try {
            const confirmed = await this.createConfirmationDialog(
                idsToDelete.length > 1
                    ? `Подтвердите удаление выбранных записей: ${idsToDelete.length}`
                    : 'Подтвердите удаление мероприятия'
            );
            if (!confirmed) return;

            unlock = this.lockScreen(idsToDelete.length > 1 ? 'Удаление выбранных записей...' : 'Удаление записи...');

            const deletedIds: string[] = [];
            const failedIds: string[] = [];

            for (const id of idsToDelete) {
                try {
                    await this.deleteEntity(`/api/parts-directory/delete/${id}`);
                    deletedIds.push(id);
                } catch {
                    failedIds.push(id);
                }
            }

            deletedIds.forEach(id => this.removeDeletedPdiRow(id));

            if ($('.table-row.selected').length === 0) {
                this.selectedRows.clear();
                $('.circle-header').removeClass('active');
            }

            if (failedIds.length > 0) {
                this.createNotification(
                    deletedIds.length > 0
                        ? `Удалено записей: ${deletedIds.length}. Ошибка при удалении записей: ${failedIds.length}`
                        : 'Ошибка при удалении записей',
                    NotificationType.ERROR
                );
                return;
            }

            this.createNotification(
                deletedIds.length > 1 ? `Удалено записей: ${deletedIds.length}` : 'Запись успешно удалена',
                NotificationType.SUCCESS
            );
        } catch {
            this.createNotification('Ошибка при удалении записей', NotificationType.ERROR);
        } finally {
            if (unlock) unlock();
        }
    };

    private openDetailDialog = (event: Event): void => {
    }

    private openTeamEditDialog = async (): Promise<void> => {
        const dialog = $('#teamEditDialog');

        const teamsResponse: any = await this.requestToApi('/api/team/get-page', 'GET');
        this.allTeamsCache = teamsResponse.data || [];

        this.allEmployeesCache = await this.cache.get("employee");

        this.selectedTeamForEdit = null;
        this.selectedEmployeeIds = [];

        this.renderTeamList();
        this.renderEmployeeList();
        this.updateFooterButtons();

        dialog.find('#editTeamName').val('');

        dialog.find('#teamSearchInput').off('input').on('input', () => {
            const searchText = dialog.find('#teamSearchInput').val().toString().toLowerCase().trim();
            this.renderTeamList(searchText);
        });

        dialog.find('#teamListRows').off('click').on('click', '.dialog-content-rows-row', (e: Event) => {
            const $row = $(e.currentTarget);
            const teamId = $row.data('id');
            const team = this.allTeamsCache.find((t: any) => t.id === teamId);
            if (!team) return;

            this.selectedTeamForEdit = team;
            dialog.find('#teamListRows .dialog-content-rows-row').removeClass('selected');
            $row.addClass('selected');

            dialog.find('#editTeamName').val(team.name);
            this.selectedEmployeeIds = team.employees?.map((e: any) => e.id) || [];
            this.renderEmployeeList();
            this.updateFooterButtons();
        });

        dialog.find('#createNewTeamBtn').off('click').on('click', () => {
            this.selectedTeamForEdit = null;
            this.selectedEmployeeIds = [];
            dialog.find('#editTeamName').val('');
            dialog.find('#teamListRows .dialog-content-rows-row').removeClass('selected');
            this.renderEmployeeList();
            this.updateFooterButtons();
            dialog.find('#editTeamName').focus();
        });

        dialog.find('#saveTeam').off('click').on('click', () => this.saveTeamHandler());

        dialog.find('#deleteTeam').off('click').on('click', () => this.deleteTeamHandler());

        dialog.find('#employeeSearchInput').off('input').on('input', () => {
            const searchText = dialog.find('#employeeSearchInput').val().toString().toLowerCase().trim();
            this.renderEmployeeList(searchText);
        });

        dialog.find('#selectAllEmployees').off('change').on('change', (e) => {
            const target = e.currentTarget as HTMLInputElement;
            const isChecked = target.checked;

            dialog.find('#employeeRows .employee-checkbox').each((_, el) => {
                const checkbox = el as HTMLInputElement;
                const empId = parseInt($(checkbox).data('id'));

                checkbox.checked = isChecked;

                if (isChecked) {
                    if (!this.selectedEmployeeIds.includes(empId)) {
                        this.selectedEmployeeIds.push(empId);
                    }
                } else {
                    const idx = this.selectedEmployeeIds.indexOf(empId);
                    if (idx > -1) this.selectedEmployeeIds.splice(idx, 1);
                }
            });
        });

        dialog.find('#employeeRows').off('change', '.employee-checkbox').on('change', '.employee-checkbox', (e) => {
            const target = e.currentTarget as HTMLInputElement;
            const empId = parseInt($(target).data('id'));
            if (target.checked) {
                if (!this.selectedEmployeeIds.includes(empId)) {
                    this.selectedEmployeeIds.push(empId);
                }
            } else {
                const idx = this.selectedEmployeeIds.indexOf(empId);
                if (idx > -1) this.selectedEmployeeIds.splice(idx, 1);
            }
            const allCheckboxes = dialog.find('#employeeRows .employee-checkbox');
            const checkedBoxes = dialog.find('#employeeRows .employee-checkbox:checked');
            dialog.find('#selectAllEmployees').prop(
                'checked',
                allCheckboxes.length === checkedBoxes.length && allCheckboxes.length > 0
            );
        });

        this.dialog.open('teamEditDialog');
    };

    private updateFooterButtons = (): void => {
        const dialog = $('#teamEditDialog');
        if (this.selectedTeamForEdit) {
            dialog.find('#deleteTeam').show();
        } else {
            dialog.find('#deleteTeam').hide();
        }
    };

    private renderTeamList = (searchText: string = ''): void => {
        const dialog = $('#teamEditDialog');
        const rowContainer = dialog.find('#teamListRows');
        rowContainer.empty();

        const filtered = this.allTeamsCache.filter((t: any) =>
            t.name.toLowerCase().includes(searchText.toLowerCase())
        );

        filtered.forEach((team: any) => {
            const employeesText = team.employees?.map((e: any) => e.name).join(', ') || '';
            const isSelected = this.selectedTeamForEdit?.id === team.id ? 'selected' : '';
            rowContainer.append(`
                <div class="dialog-content-rows-row ${isSelected}" data-id="${team.id}">
                    <div class="content-row-column" style="flex: 1">${this.escapeHtml(team.name)}</div>
                    <div class="content-row-column" style="flex: 2">${this.escapeHtml(employeesText)}</div>
                </div>
            `);
        });
    };

    private renderEmployeeList = (searchText: string = ''): void => {
        const dialog = $('#teamEditDialog');
        const rowContainer = dialog.find('#employeeRows');
        rowContainer.empty();

        const filtered = this.allEmployeesCache.filter((e: any) =>
            e.name.toLowerCase().includes(searchText.toLowerCase())
        );

        filtered.forEach((emp: any) => {
            const subDivisionName = emp.subDivision?.name || '';
            const isChecked = this.selectedEmployeeIds.includes(emp.id) ? 'checked' : '';
            rowContainer.append(`
                <div class="dialog-content-rows-row" data-id="${emp.id}">
                    <div class="content-row-column" style="flex: 1">
                        <input type="checkbox" class="employee-checkbox" data-id="${emp.id}" ${isChecked}>
                    </div>
                    <div class="content-row-column" style="flex: 1">${this.escapeHtml(emp.name)}</div>
                    <div class="content-row-column" style="flex: 1">${this.escapeHtml(subDivisionName)}</div>
                </div>
            `);
        });
    };

    private saveTeamHandler = async (): Promise<void> => {
        const dialog = $('#teamEditDialog');
        const name = dialog.find('#editTeamName').val().toString().trim();

        if (!name) {
            this.createNotification('Введите название бригады', NotificationType.WARNING);
            return;
        }

        if (this.selectedTeamForEdit) {
            const version = this.selectedTeamForEdit.version;
            if (version === undefined || version === null) {
                this.createNotification('Ошибка: версия бригады не определена', NotificationType.ERROR);
                return;
            }

            const changes: any = {
                name,
                employeeIds: this.selectedEmployeeIds
            };

            const unlock = this.lockScreen('Сохранение бригады...');
            try {
                const updatedTeam = await this.requestToApi(
                    `/api/team/update/${this.selectedTeamForEdit.id}?version=${version}`,
                    'PATCH',
                    changes
                ) as TeamIn;

                const idx = this.allTeamsCache.findIndex((t: any) => t.id === updatedTeam.id);
                if (idx !== -1) {
                    this.allTeamsCache[idx] = updatedTeam;
                }

                this.localCache.forEach((pdi: any, key: any) => {
                    if (pdi.team?.id === updatedTeam.id) {
                        pdi.team = updatedTeam;
                        const $row = $(`.table-row[id="${key}"]`);
                        $row.find('[data-name="team"]').text(updatedTeam.name);
                    }
                });

                this.createNotification('Бригада успешно обновлена', NotificationType.SUCCESS);
                this.selectedTeamForEdit = updatedTeam;
                this.renderTeamList();
            } catch {
                this.createNotification('Ошибка при сохранении бригады', NotificationType.ERROR);
            } finally {
                unlock();
            }
        } else {
            const dto: any = {
                name,
                employeeIds: this.selectedEmployeeIds
            };

            const unlock = this.lockScreen('Создание бригады...');
            try {
                const newTeam = await this.requestToApi('/api/team/create', 'POST', dto) as TeamIn;

                this.allTeamsCache.push(newTeam);

                this.createNotification('Бригада успешно создана', NotificationType.SUCCESS);
                this.selectedTeamForEdit = newTeam;
                this.renderTeamList();
                dialog.find('#teamListRows .dialog-content-rows-row').removeClass('selected');
                dialog.find(`#teamListRows .dialog-content-rows-row[data-id="${newTeam.id}"]`).addClass('selected');
                this.updateFooterButtons();
            } catch {
                this.createNotification('Ошибка при создании бригады', NotificationType.ERROR);
            } finally {
                unlock();
            }
        }
    };

    private deleteTeamHandler = async (): Promise<void> => {
        if (!this.selectedTeamForEdit) {
            this.createNotification('Выберите бригаду для удаления', NotificationType.WARNING);
            return;
        }
        const unlock = this.lockScreen('Удаление бригады...');
        try {
            this.createConfirmationDialog("Подтвердите удаление мероприятия").then((confirmed) => {
                // @ts-ignore
                if (confirmed) {
                    this.requestToApi(`/api/team/delete/${this.selectedTeamForEdit.id}`, 'DELETE').then(() => {
                        const idx = this.allTeamsCache.findIndex((t: any) => t.id === this.selectedTeamForEdit.id);
                        if (idx !== -1) {
                            this.allTeamsCache.splice(idx, 1);
                        }
                        this.localCache.forEach((pdi: any, key: any) => {
                            if (pdi.team?.id === this.selectedTeamForEdit.id) {
                                pdi.team = null;
                                const $row = $(`.table-row[id="${key}"]`);
                                $row.find('[data-name="team"]').text('');
                            }
                        });
                        this.createNotification('Бригада успешно удалена', NotificationType.SUCCESS);
                        this.selectedTeamForEdit = null;
                        this.selectedEmployeeIds = [];
                        $('#teamEditDialog').find('#editTeamName').val('');
                        this.renderTeamList();
                        this.renderEmployeeList();
                        this.updateFooterButtons();
                    });
                }
            });
        } catch {
            this.createNotification('Ошибка при удалении бригады', NotificationType.ERROR);
        } finally {
            unlock();
        }
    };
}

$(document).ready(() => {
    new PdItem();
});

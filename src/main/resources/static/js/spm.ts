import { Base } from './base/base';
import { NotificationType } from './core/types';

class Spm extends Base {

    private loadFrom1cRows: partsDirectoryFrom1CPreviewRow[] = [];
    private selectedLoadFrom1cRowIndexes = new Set<number>();
    private loadFrom1cSearchText = '';
    private loadFrom1cSteelFilterText = '';
    private currentSpmIdForLoad: number | null = null;

    constructor(itemsPerPage = Infinity, visibleRow = Infinity) {
        super($(`.table-body`), itemsPerPage, visibleRow, () => {
            this.displayPage('/api/spm/get-page-spm', undefined).catch(console.error);
        });
        this.createHandler('click', '#create-button', () => this.dialog.open('create-dialog'), true);
        this.createHandler('click', '#createBtn', this.createItemFromSpm, true);
        this.createHandler('click', '#load-1c-button', () => this.openLoadFrom1cDialog(), true);
        this.createHandler('submit', '#loadFrom1cForm', (event: Event) => event.preventDefault());
        this.createHandler('click', '#loadFrom1cBtn', this.handleLoadFrom1c.bind(this), true);
        this.createHandler('click', '#createFrom1cBtn', this.createSelectedFrom1cItems.bind(this), true);
        this.createHandler('input', '#loadFrom1cSearchInput', this.handleLoadFrom1cSearch.bind(this), true);
        this.createHandler('input', '#loadFrom1cSteelFilterInput', this.handleLoadFrom1cSteelFilter.bind(this), true);
        this.createHandler('change', '#load-1c-select-all', this.toggleAllLoadFrom1cRowsSelection.bind(this), true);
        this.createHandler('change', '.load-1c-row-checkbox', this.toggleLoadFrom1cRowSelection.bind(this), true);
        this.createHandler('click', '#edit-button', () => {
            if (!this.editMode) {
                this.enableEditMode(['dateStart']);
                $('#edit-button').addClass('active');
            } else {
                this.disableEditMode(['dateStart'], []);
                if (!this.editMode) $('#edit-button').removeClass('active');
            }
            this.syncEditModeUi();
        }, true);
        this.createHandler('click', '#save-button', () => this.saveSpm(), true);
        this.bindFieldChanges();
        this.createHandler('click', '.circle-row', (event) => this.toggleRowSelection(event, true), true);
        this.bindTableSelection();
        this.createHandler('input', '#searchInput', (event) => {
            this.searchText = $(event.target).val().toString().toLowerCase().trim();
            this.applyFilters();
        }, true);
        this.createHandler('contextmenu', '.table-row.selected', this.showRowContextMenu, true);
    }

    public createRow(spm: SpmIn) {
        const row = `
            <div class="table-row" id="${spm.id}" data-index="${spm.id}">
                <div class="table-cell" style="width: var(--customerOrderLine); position: relative">
                    <div class="circle circle-row tooltip-trigger" data-description="Выделить строку"></div>
                    <div class="field-container center" data-name="customerOrderLine" contenteditable="false">
                        ${this.escapeHtml(spm.customerOrderLine || '')}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--dateStart);">
                    <div class="field-container center" data-name="dateStart" contenteditable="false">
                        ${this.formatDate(spm.dateStart)}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--priority);">
                    <div class="field-container center" data-name="priority" contenteditable="false">
                        ${spm.priority ?? ''}
                    </div>
                </div>
                <div class="table-cell center" style="width: var(--loaded);">
                    <div class="checkbox-wrapper-loaded">
                        <input type="checkbox" class="loaded-checkbox" id="toggleLoaded-${spm.id}" ${spm.loaded ? 'checked' : ''} disabled>
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

    private syncEditModeUi(): void {
        document.body.classList.toggle('spm-edit-mode', this.editMode);
    }

    private saveSpm(): void {
        if (Object.keys(this.saveMassive).length === 0) return;

        this.saveMassiveChanges('/api/spm/update', (id: string | number, cacheData: any, changes: any) => ({
            id: id,
            version: cacheData?.version,
            changes: changes
        })).then(() => {
            this.disableEditMode(['dateStart'], []);
            $('#edit-button').removeClass('active');
            this.syncEditModeUi();
        }).catch(console.error);
    }

    private createItemFromSpm = async (event: Event): Promise<void> => {
        event.preventDefault();
        const button = $(event.target);
        const form = button.closest('form').get(0);
        const dialog = $('#create-dialog');

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        button.prop('disabled', true);

        const payload = [{
            customerOrderLine: dialog.find('input[name="customerOrderLine"]').val(),
            dateStart: dialog.find('input[name="dateStart"]').val(),
            priority: dialog.find('input[name="priority"]').val() || null,
        }];

        try {
            const newSpmList: SpmIn[] = await this.createEntity('/api/spm/create-item-from-spm', payload);
            const newSpm = newSpmList[0];
            this.saveMassive = {};
            this.localCache.set(newSpm.id, newSpm);
            this.dialog.close("create-dialog");
            $(`.table-body`).append(this.createRow(newSpm));
            this.applyFilters();
        } catch {
            this.saveMassive = {};
            form.reset();
            this.createNotification('Ошибка при создании записи', NotificationType.ERROR);
        } finally {
            button.prop('disabled', false);
        }
    }

    protected override applyFilters(): void {
        $('.table-row').each((_, row) => {
            const $row = $(row);
            const text = $row.text().toLowerCase();
            const textMatches = !this.searchText || text.includes(this.searchText);
            $row.toggle(textMatches);
        });
    }

    private getSelectedSpm(): SpmIn | null {
        if (this.selectedRows.size !== 1) {
            return null;
        }

        const rowId = Array.from(this.selectedRows)[0];
        const numericId = Number(rowId);
        if (Number.isNaN(numericId)) {
            return null;
        }

        return (this.localCache.get(numericId) as SpmIn) || null;
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
            const quantityNumber = Number(quantity);

            return {
                index,
                customerOrder: this.extractLoadFrom1cOrderNumber(customerOrder),
                drawing: [drawing, detail].filter(Boolean).join(' '),
                detail,
                quantity: quantity != null ? String(quantity) : '',
                quantityNumber: Number.isFinite(quantityNumber) ? quantityNumber : 0,
                size,
                steel,
                steelQty: '',
                steelQtyNumber: 0,
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
        const filteredRows = this.getFilteredLoadFrom1cRows();

        dialog.addClass('has-results');
        dialog.find('#load-1c-results').removeAttr('hidden');

        if (!this.loadFrom1cRows.length) {
            dialog.removeClass('has-loaded-1c show-create-from-1c');
            rowsContainer.html('<div class="load-1c-empty">По этому заказу строки не найдены.</div>');
            this.updateLoadFrom1cSummary();
            return;
        }

        dialog.addClass('has-loaded-1c show-create-from-1c');

        if (!filteredRows.length) {
            rowsContainer.html('<div class="load-1c-empty">По фильтру строки не найдены.</div>');
            this.updateLoadFrom1cSummary();
            return;
        }

        rowsContainer.html(filteredRows.map((row) => {
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
                </div>`;
        }).join(''));

        this.updateLoadFrom1cSummary();
    }

    private toggleAllLoadFrom1cRowsSelection(event: Event): void {
        const isChecked = (event.target as HTMLInputElement).checked;
        const filteredRows = this.getFilteredLoadFrom1cRows();

        filteredRows.forEach((row) => {
            if (isChecked) {
                this.selectedLoadFrom1cRowIndexes.add(row.index);
            } else {
                this.selectedLoadFrom1cRowIndexes.delete(row.index);
            }
        });

        this.renderLoadFrom1cRows();
    }

    private toggleLoadFrom1cRowSelection(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        const rowIndex = Number(checkbox.dataset.rowIndex);

        if (checkbox.checked) {
            this.selectedLoadFrom1cRowIndexes.add(rowIndex);
        } else {
            this.selectedLoadFrom1cRowIndexes.delete(rowIndex);
        }

        $(checkbox).closest('.load-1c-grid__row').toggleClass('is-selected', checkbox.checked);
        this.updateLoadFrom1cSummary();
    }

    private openLoadFrom1cDialog(): void {
        const spm = this.getSelectedSpm();
        if (!spm) {
            this.createNotification('Выберите одну запись СПМ', NotificationType.WARNING);
            return;
        }

        if (spm.loaded) {
            this.createNotification('Строки для этой записи уже загружены из 1C', NotificationType.WARNING);
            return;
        }

        const orderName = spm.customerOrder?.name;
        if (!orderName) {
            this.createNotification('У записи не указан заказ клиента', NotificationType.WARNING);
            return;
        }

        this.currentSpmIdForLoad = spm.id;
        this.resetLoadFrom1cPreview();
        $('#spm-load-order-name').text(orderName);
        this.dialog.open('load-1c-dialog');
    }

    private async handleLoadFrom1c(event: Event): Promise<void> {
        event.preventDefault();

        const spm = this.currentSpmIdForLoad != null
            ? this.localCache.get(this.currentSpmIdForLoad) as SpmIn
            : null;
        const orderName = spm?.customerOrder?.name;

        if (!orderName) {
            this.createNotification('У записи не указан заказ клиента', NotificationType.WARNING);
            return;
        }

        const dialog = $('#load-1c-dialog');
        const button = dialog.find('#loadFrom1cBtn');
        const unlock = this.lockScreen('Загрузка данных из 1C...');

        this.resetLoadFrom1cPreview();
        $('#spm-load-order-name').text(orderName);
        button.prop('disabled', true);

        try {
            const response = await this.requestToApi(
                `/api/parts-directory/from-1c?customerOrder=${encodeURIComponent(orderName)}`,
                'GET'
            ) as partsDirectoryFrom1CIn;

            this.loadFrom1cRows = this.mapLoadFrom1cRows(response);
            this.selectedLoadFrom1cRowIndexes.clear();
            this.renderLoadFrom1cRows();

            if (this.loadFrom1cRows.length) {
                this.createNotification(`Получено строк из 1C: ${this.loadFrom1cRows.length}`, NotificationType.SUCCESS);
            }
        } catch (error) {
            console.error(error);
            this.createNotification('Ошибка при загрузке данных из 1C', NotificationType.ERROR);
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

        if (this.currentSpmIdForLoad == null) {
            this.createNotification('Не выбрана запись СПМ', NotificationType.WARNING);
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
        const unlock = this.lockScreen('Создание строк в СЗЦ...');
        button.prop('disabled', true);

        try {
            const createdRows = await this.requestToApi(
                '/api/parts-directory/create-item-from-1c',
                'POST',
                payload
            ) as unknown[];

            const updatedSpm = await this.requestToApi(
                `/api/spm/mark-loaded/${this.currentSpmIdForLoad}`,
                'PATCH'
            ) as SpmIn;

            this.localCache.set(updatedSpm.id, updatedSpm);
            const $row = $(`#${updatedSpm.id}`);
            $row.find('.loaded-checkbox').prop('checked', true);

            this.dialog.close('load-1c-dialog');
            this.resetLoadFrom1cPreview();
            this.currentSpmIdForLoad = null;
            this.createNotification(`Создано строк в СЗЦ: ${createdRows.length}`, NotificationType.SUCCESS);
        } catch (error) {
            console.error(error);
            this.createNotification('Ошибка при создании строк в СЗЦ', NotificationType.ERROR);
        } finally {
            unlock();
            button.prop('disabled', false);
        }
    }

    private showRowContextMenu = (event: Event): void => {
        event.preventDefault();
        const $row = $(event.currentTarget);
        const rowId = $row.attr('id');
        if (!rowId) return;

        this.createContextMenu([
            {
                label: 'Удалить запись',
                idAction: 'deleteSpm',
                action: () => {
                    this.deleteSpmHandler(rowId);
                }
            },
        ], (event as MouseEvent).clientX, (event as MouseEvent).clientY);
    };

    private deleteSpmHandler = async (id: string): Promise<void> => {
        try {
            const confirmed = await this.createConfirmationDialog('Подтвердите удаление записи');
            if (!confirmed) return;

            await this.deleteEntity(`/api/spm/delete/${id}`);
            const numericId = Number(id);
            this.deleteRow(id);
            this.selectedRows.delete(id);
            if (!Number.isNaN(numericId)) {
                this.selectedRows.delete(numericId);
                this.localCache.delete(numericId);
            }
            this.createNotification('Запись успешно удалена', NotificationType.SUCCESS);
        } catch {
            this.createNotification('Ошибка при удалении записи', NotificationType.ERROR);
        }
    };
}

new Spm();

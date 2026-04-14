var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Team extends Base {
    constructor(itemsPerPage = Infinity, visibleRow = Infinity) {
        super($(`.table-body`), itemsPerPage, visibleRow, () => {
            this.displayPage('/api/team/get-page', undefined).catch(console.error);
        });
        this.editMode = false;
        this.createTeam = (event) => __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const button = $(event.target);
            const form = button.closest('form').get(0);
            const dialog = $('#create-dialog');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            button.prop('disabled', true);
            const hiddenEmployees = dialog.find('input[name="hiddenEmployees"]').val();
            const employeeIds = hiddenEmployees ? JSON.parse(hiddenEmployees) : [];
            const formData = {
                name: dialog.find('input[name="name"]').val(),
                employeeIds: employeeIds
            };
            try {
                const newTeam = yield this.createEntity('/api/team/create', formData);
                this.saveMassive = {};
                this.localCache.set(newTeam.id, newTeam);
                this.dialog.close("create-dialog");
                const newRow = this.createRow(newTeam);
                $(`.table-body`).append(newRow);
                button.prop('disabled', false);
            }
            catch (error) {
                this.saveMassive = {};
                form.reset();
                this.createNotification('Ошибка при создании бригады', NotificationType.ERROR);
                button.prop('disabled', false);
            }
        });
        this.createHandler('click', '#create-button', () => this.dialog.open('create-dialog'), true);
        this.createHandler('click', '#createBtn', this.createTeam, true);
        this.createHandler('click', '.area-modal', this.workWithModal.bind(this), true);
        this.createHandler('click', '.circle-header', this.selectAllRows.bind(this), true);
        this.createHandler('click', '.circle-row', this.selectRow.bind(this), true);
        this.createHandler('click', '#edit-button', () => {
            if (!this.editMode) {
                this.enableEditMode();
            }
            else
                this.disableEditMode();
        }, true);
        this.createHandler('click', '#save-button', () => this.saveTeam(), true);
        this.createHandler('input', '[data-name]', this.inputChanges.bind(this), true);
        this.createHandler('input', '#searchInput', (event) => {
            this.searchText = $(event.target).val().toString().toLowerCase().trim();
            this.applyFilters();
        }, true);
        this.createHandler('contextmenu', '.table-row.selected', this.showRowContextMenu.bind(this), true);
    }
    createRow(team) {
        const employeesText = (team.employees ? team.employees.map(e => e.name).join(', ') : '');
        const row = `
            <div class="table-row" id="${team.id}" data-index="${team.id}">
                <div class="table-cell" style="width: var(--no); position: relative">
                    <div class="circle circle-row tooltip-trigger" data-description="Выделить строку"></div>
                    <div class="field-container center" data-name="id" contenteditable="false">
                        ${team.id}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--name);">
                    <div class="field-container center" data-name="name" contenteditable="false">
                        ${team.name}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--employees);">
                    <div class="field-container" data-name="employees" contenteditable="false">
                        ${employeesText}
                    </div>
                </div>
            </div>`;
        return $(row);
    }
    onScroll() {
    }
    workWithModal(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const modalDiv = $(event.currentTarget);
            const fieldName = modalDiv.attr('data-field');
            if (fieldName === 'employees') {
                yield this.openEmployeeSelectionDialog(modalDiv);
            }
            modalDiv.addClass('change');
        });
    }
    openEmployeeSelectionDialog(modalDiv) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = $('#employeeDialog');
            const rowContainer = dialog.find('.dialog-content-rows');
            const searchInput = dialog.find('.choice-field input');
            const allEmployees = yield this.cache.get('employee');
            const selectedEmployeeIds = [];
            const renderRows = (employees) => {
                rowContainer.empty();
                employees.forEach(emp => {
                    var _a;
                    const subDivisionName = ((_a = emp.subDivision) === null || _a === void 0 ? void 0 : _a.name) || '';
                    const isChecked = selectedEmployeeIds.includes(emp.id) ? 'checked' : '';
                    rowContainer.append(`
                    <div class="dialog-content-rows-row" data-id="${emp.id}">
                        <div class="content-row-column col-250">
                            <input type="checkbox" class="employee-checkbox" data-id="${emp.id}" ${isChecked}>
                        </div>
                        <div class="content-row-column col-250">${emp.name}</div>
                        <div class="content-row-column col-250">${subDivisionName}</div>
                    </div>`);
                });
            };
            renderRows(allEmployees);
            dialog.find('#selectAllEmployees').off('change').on('change', function () {
                const isChecked = $(this).prop('checked');
                rowContainer.find('.employee-checkbox').each(function () {
                    $(this).prop('checked', isChecked);
                    const empId = parseInt($(this).data('id'));
                    if (isChecked) {
                        if (!selectedEmployeeIds.includes(empId))
                            selectedEmployeeIds.push(empId);
                    }
                    else {
                        const idx = selectedEmployeeIds.indexOf(empId);
                        if (idx > -1)
                            selectedEmployeeIds.splice(idx, 1);
                    }
                });
            });
            rowContainer.off('change', '.employee-checkbox').on('change', '.employee-checkbox', function () {
                const empId = parseInt($(this).data('id'));
                if ($(this).prop('checked')) {
                    if (!selectedEmployeeIds.includes(empId))
                        selectedEmployeeIds.push(empId);
                }
                else {
                    const idx = selectedEmployeeIds.indexOf(empId);
                    if (idx > -1)
                        selectedEmployeeIds.splice(idx, 1);
                }
                const allChecked = rowContainer.find('.employee-checkbox').length ===
                    rowContainer.find('.employee-checkbox:checked').length;
                dialog.find('#selectAllEmployees').prop('checked', allChecked);
            });
            searchInput.off('input').on('input', function () {
                const searchText = $(this).val().toString().toLowerCase().trim();
                const filtered = allEmployees.filter(e => e.name.toLowerCase().includes(searchText));
                renderRows(filtered);
            });
            this.dialog.open('employeeDialog');
            dialog.find('#changeEmployee').off('click').on('click', () => {
                const selectedEmployees = allEmployees.filter(e => selectedEmployeeIds.includes(e.id));
                const names = selectedEmployees.map(e => e.name).join(', ');
                modalDiv.val(names);
                modalDiv.text(names);
                const createDialog = $('#create-dialog');
                createDialog.find('input[name="hiddenEmployees"]').val(JSON.stringify(selectedEmployeeIds));
                modalDiv.addClass('change-textarea');
                this.dialog.close('employeeDialog');
            });
        });
    }
    selectAllRows(event) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    $(row).find('.circle-row').removeClass('active-critical');
                });
                circle.removeClass('active');
            }
            else {
                this.selectedRows.clear();
                allRows.each((_, row) => {
                    const rowId = $(row).attr('id');
                    this.selectedRows.add(rowId);
                    $(row).addClass('selected');
                    $(row).find('.circle-row').addClass('active-critical');
                });
                circle.addClass('active');
            }
        });
    }
    selectRow(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const wasSelected = this.selectedRows.has($(event.currentTarget).closest('.table-row').attr('id'));
            this.toggleRowSelection(event, true);
            const circle = $(event.currentTarget);
            const currentRow = circle.closest('.table-row');
            const rowId = currentRow.attr('id');
            if (!rowId)
                return;
            if (this.selectedRows.has(rowId) && !wasSelected && this.editMode) {
                this.enableEditMode([], currentRow);
            }
            else if (!this.selectedRows.has(rowId)) {
                this.disableEditMode();
                if (!this.editMode)
                    $('#edit-button').removeClass('active');
            }
        });
    }
    enableEditMode(row) {
        const processElement = ($div) => {
            const text = $div.text().trim();
            const dataName = $div.attr('data-name');
            let element;
            element = $div;
            element.attr('contenteditable', 'true');
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
    disableEditMode(row) {
        if (this.editMode &&
            Object.keys(this.saveMassive).length > 0 &&
            ((row && row.find('.change').length > 0) || $('.table-row .change').length > 0)) {
            this.createNotification("Сохраните изменения", NotificationType.WARNING);
            return;
        }
        const processElement = ($field) => {
            const dataName = $field.attr("data-name");
            const value = $field.text();
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
    saveTeam() {
        if (Object.keys(this.saveMassive).length === 0) {
            return;
        }
        const itemsArray = Object.keys(this.saveMassive).map(id => {
            const cacheData = this.localCache.get(Number(id));
            return {
                id: id,
                version: cacheData.version,
                changes: this.saveMassive[id]
            };
        });
        this.save('/api/team/update', ...itemsArray).then(() => {
            this.disableEditMode();
            itemsArray.forEach((item) => this.selectedRows.delete(item.id));
            $('#edit-button').removeClass('active');
        });
    }
    inputChanges(event) {
        const $el = $(event.target);
        const id = $el.closest('.table-row').attr('id');
        const name = $el.attr('data-name');
        const value = $el.is('div') ? $el.text().trim() : $el.val();
        this.saveMassive[id] = Object.assign(Object.assign({}, this.saveMassive[id]), { [name]: value });
        $el.addClass('change');
    }
    showRowContextMenu(event) {
        event.preventDefault();
        const $row = $(event.currentTarget);
        const rowId = $row.attr('id');
        if (!rowId)
            return;
        const mouseEvent = event;
        this.createContextMenu([
            {
                label: 'Удалить бригаду',
                idAction: 'deleteTeam',
                action: () => {
                    this.deleteTeamHandler(Number(rowId));
                }
            },
        ], mouseEvent.clientX, mouseEvent.clientY);
    }
    deleteTeamHandler(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const confirmed = yield this.createConfirmationDialog('Вы действительно хотите удалить эту бригаду?');
            if (!confirmed)
                return;
            try {
                yield this.deleteEntity(`/api/team/delete/${id}`);
                this.createNotification('Бригада успешно удалена', NotificationType.SUCCESS);
                this.deleteRow(id);
                this.selectedRows.delete(id);
            }
            catch (error) {
                this.createNotification('Ошибка при удалении бригады', NotificationType.ERROR);
            }
        });
    }
    applyFilters() {
        if (!this.searchText) {
            $('.table-row').show();
            return;
        }
        $('.table-row').each((_, row) => {
            const $row = $(row);
            const text = $row.text().toLowerCase();
            $row.toggle(text.includes(this.searchText));
        });
    }
}
$(document).ready(() => {
    new Team();
});

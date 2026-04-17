"use strict";
class Team extends Base {
    constructor(itemsPerPage = Infinity, visibleRow = Infinity) {
        super($(`.table-body`), itemsPerPage, visibleRow, () => {
            this.displayPage('/api/team/get-page', undefined).catch(console.error);
        });
        this.createTeam = async (event) => {
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
                const newTeam = await this.createEntity('/api/team/create', formData);
                this.saveMassive = {};
                this.localCache.set(newTeam.id, newTeam);
                this.dialog.close("create-dialog");
                $(`.table-body`).append(this.createRow(newTeam));
            }
            catch (_a) {
                this.saveMassive = {};
                form.reset();
                this.createNotification('Ошибка при создании бригады', NotificationType.ERROR);
            }
            finally {
                button.prop('disabled', false);
            }
        };
        this.workWithModal = async (event) => {
            const modalDiv = $(event.currentTarget);
            const fieldName = modalDiv.attr('data-field');
            if (fieldName === 'employees') {
                await this.openEmployeeSelectionDialog(modalDiv);
            }
            modalDiv.addClass('change');
        };
        this.openEmployeeSelectionDialog = async (modalDiv) => {
            await this.openSelectionDialog('employee', 'employeeDialog', modalDiv, undefined, undefined, [
                { key: 'name', label: 'Имя', width: '250' },
                { label: 'Подразделение', width: '250', renderer: (e) => { var _a; return ((_a = e.subDivision) === null || _a === void 0 ? void 0 : _a.name) || ''; } }
            ], true);
        };
        this.selectRow = async (event) => {
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
        };
        this.showRowContextMenu = (event) => {
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
        };
        this.deleteTeamHandler = async (id) => {
            try {
                this.createConfirmationDialog("Подтвердите удаление мероприятия").then((confirmed) => {
                    // @ts-ignore
                    if (confirmed) {
                        this.deleteEntity(`/api/team/delete/${id}`).then(() => {
                            this.createNotification('Бригада успешно удалена', NotificationType.SUCCESS);
                            this.deleteRow(id);
                            this.selectedRows.delete(id);
                        });
                    }
                });
            }
            catch (_a) {
                this.createNotification('Ошибка при удалении бригады', NotificationType.ERROR);
            }
        };
        this.createHandler('click', '#create-button', () => this.dialog.open('create-dialog'), true);
        this.createHandler('click', '#createBtn', this.createTeam, true);
        this.createHandler('click', '.area-modal', this.workWithModal.bind(this), true);
        this.createHandler('click', '.circle-header', this.toggleAllRowsSelection.bind(this), true);
        this.createHandler('click', '.circle-row', this.selectRow.bind(this), true);
        this.createHandler('click', '#edit-button', () => {
            if (!this.editMode) {
                this.enableEditMode();
                $('#edit-button').addClass('active');
            }
            else {
                this.disableEditMode();
                if (!this.editMode)
                    $('#edit-button').removeClass('active');
            }
        }, true);
        this.createHandler('click', '#save-button', () => this.saveTeam(), true);
        this.bindFieldChanges();
        this.createHandler('input', '#searchInput', (event) => {
            this.searchText = $(event.target).val().toString().toLowerCase().trim();
            this.applyFilters();
        }, true);
        this.createHandler('contextmenu', '.table-row.selected', this.showRowContextMenu.bind(this), true);
    }
    createRow(team) {
        var _a;
        const employeesText = ((_a = team.employees) === null || _a === void 0 ? void 0 : _a.map(e => e.name).join(', ')) || '';
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
                        ${this.escapeHtml(team.name)}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--employees);">
                    <div class="field-container" data-name="employees" contenteditable="false">
                        ${this.escapeHtml(employeesText)}
                    </div>
                </div>
            </div>`;
        return $(row);
    }
    onScroll() {
    }
    saveTeam() {
        this.saveMassiveChanges('/api/team/update', (id, cacheData, changes) => ({
            id: id,
            version: cacheData === null || cacheData === void 0 ? void 0 : cacheData.version,
            changes: changes
        })).then(() => {
            this.disableEditMode();
            $('#edit-button').removeClass('active');
        }).catch(console.error);
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
//# sourceMappingURL=team.js.map
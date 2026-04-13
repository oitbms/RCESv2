// @ts-ignore
declare const $: any;

class Team extends Base {

    constructor(itemsPerPage = Infinity, visibleRow = Infinity) {
        super($(`.table-body`), itemsPerPage, visibleRow, () => {
            this.displayPage('/api/team/get-page', undefined).catch(console.error);
        });
        this.createHandler('click', '#create-button', () => this.dialog.open('create-dialog'), true);
        this.createHandler('click', '#createBtn', this.createTeam, true);
        this.createHandler('click', '.area-modal', this.workWithModal.bind(this), true);
        this.createHandler('click', '.circle-header', this.selectAllRows.bind(this), true);
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
        this.createHandler('click', '#save-button', () => this.saveTeam(), true);
        this.createHandler('input', '[data-name]', this.inputChanges.bind(this), true);
        this.createHandler('input', '#searchInput', (event) => {
            this.searchText = $(event.target).val().toString().toLowerCase().trim();
            this.applyFilters();
        }, true);
        this.createHandler('contextmenu', '.table-row.selected', this.showRowContextMenu.bind(this), true);
    }

    public createRow(team: TeamIn) {
        const employeesText = team.employees?.map(e => e.name).join(', ') || '';
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

    public onScroll(): void {
    }

    private saveTeam(): void {
        if (Object.keys(this.saveMassive).length === 0) return;

        const itemsArray = Object.keys(this.saveMassive).map(id => {
            const cacheData = this.localCache.get(id) as TeamIn | undefined;
            return {id: id, version: cacheData?.version, changes: this.saveMassive[id]};
        });

        this.save('/api/team/update', ...itemsArray).then(() => {
            this.disableEditMode();
            itemsArray.forEach((item) => this.selectedRows.delete(item.id));
            $('#edit-button').removeClass('active');
        });
    }

    private createTeam = async (event: Event): Promise<void> => {
        event.preventDefault();
        const button = $(event.target);
        const form = button.closest('form').get(0);
        const dialog = $('#create-dialog');

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        button.prop('disabled', true);

        const hiddenEmployees = dialog.find('input[name="hiddenEmployees"]').val() as string;
        const employeeIds = hiddenEmployees ? JSON.parse(hiddenEmployees) : [];

        const formData = {
            name: dialog.find('input[name="name"]').val(),
            employeeIds: employeeIds
        };

        try {
            const newTeam: TeamIn = await this.createEntity('/api/team/create', formData);
            this.saveMassive = {};
            this.localCache.set(newTeam.id, newTeam);
            this.dialog.close("create-dialog");
            $(`.table-body`).append(this.createRow(newTeam));
        } catch {
            this.saveMassive = {};
            form.reset();
            this.createNotification('Ошибка при создании бригады', NotificationType.ERROR);
        } finally {
            button.prop('disabled', false);
        }
    }

    private workWithModal = async (event: Event): Promise<void> => {
        const modalDiv = $(event.currentTarget);
        const fieldName = modalDiv.attr('data-field');

        if (fieldName === 'employees') {
            await this.openEmployeeSelectionDialog(modalDiv);
        }
        modalDiv.addClass('change');
    };

    private openEmployeeSelectionDialog = async (modalDiv: any): Promise<void> => {
        const dialog = $('#employeeDialog');
        const rowContainer = dialog.find('.dialog-content-rows');
        const searchInput = dialog.find('.choice-field input');

        const allEmployees: Employee[] = await this.cache.get('employee');
        const selectedEmployeeIds: number[] = [];

        const renderRows = (employees: Employee[]) => {
            rowContainer.empty();
            employees.forEach(emp => {
                const subDivisionName = emp.subDivision?.name || '';
                const isChecked = selectedEmployeeIds.includes(emp.id) ? 'checked' : '';
                rowContainer.append(`
                    <div class="dialog-content-rows-row" data-id="${emp.id}">
                        <div class="content-row-column col-250">
                            <input type="checkbox" class="employee-checkbox" data-id="${emp.id}" ${isChecked}>
                        </div>
                        <div class="content-row-column col-250">${emp.name}</div>
                        <div class="content-row-column col-250">${subDivisionName}</div>
                    </div>`
                );
            });
        };

        renderRows(allEmployees);

        // Select all
        dialog.find('#selectAllEmployees').off('change').on('change', (e) => {
                const isChecked = (e.currentTarget as HTMLInputElement).checked;
                rowContainer.find('.employee-checkbox').each((_, el) => {
                    const checkbox = el as HTMLInputElement;
                    checkbox.checked = isChecked;
                    const empId = Number($(checkbox).data('id'));
                    if (isChecked) {
                        if (!selectedEmployeeIds.includes(empId)) {
                            selectedEmployeeIds.push(empId);
                        }
                    } else {
                        const idx = selectedEmployeeIds.indexOf(empId);
                        if (idx > -1) selectedEmployeeIds.splice(idx, 1);
                    }
                });
            });

        // Individual checkboxes
        rowContainer.off('change', '.employee-checkbox').on('change', '.employee-checkbox', (e) => {
                const el = e.currentTarget as HTMLInputElement;
                const empId = Number($(el).data('id'));
                if (el.checked) {
                    if (!selectedEmployeeIds.includes(empId)) {
                        selectedEmployeeIds.push(empId);
                    }
                } else {
                    const idx = selectedEmployeeIds.indexOf(empId);
                    if (idx > -1) selectedEmployeeIds.splice(idx, 1);
                }
                const all = rowContainer.find('.employee-checkbox').length;
                const checked = rowContainer.find('.employee-checkbox:checked').length;
                dialog.find('#selectAllEmployees').prop('checked', all === checked);
            });

        // Search
        searchInput.off('input').on('input', (e) => {
            const input = e.currentTarget as HTMLInputElement;
            const searchText = input.value.toLowerCase().trim();
            const filtered = allEmployees.filter(e =>
                e.name.toLowerCase().includes(searchText)
            );
            renderRows(filtered);
        });

        this.dialog.open('employeeDialog');

        // Confirm button
        dialog.find('#changeEmployee').off('click').on('click', () => {
            const selectedEmployees = allEmployees.filter(e => selectedEmployeeIds.includes(e.id));
            const names = selectedEmployees.map(e => e.name).join(', ');

            modalDiv.val(names);
            modalDiv.text(names);

            const dialog = $('#create-dialog');
            dialog.find('input[name="hiddenEmployees"]').val(JSON.stringify(selectedEmployeeIds));

            modalDiv.addClass('change-textarea');
            this.dialog.close('employeeDialog');
        });
    };

    private selectRow = async (event: Event): Promise<void> => {
        const wasSelected = this.selectedRows.has($(event.currentTarget).closest('.table-row').attr('id'));
        this.toggleRowSelection(event, true);
        const circle = $(event.currentTarget);
        const currentRow = circle.closest('.table-row');
        const rowId = currentRow.attr('id');
        if (!rowId) return;

        if (this.selectedRows.has(rowId) && !wasSelected && this.editMode) {
            this.enableEditMode([], currentRow);
        } else if (!this.selectedRows.has(rowId)) {
            this.disableEditMode();
            if (!this.editMode) $('#edit-button').removeClass('active');
        }
    };

    private showRowContextMenu = (event: Event): void => {
        event.preventDefault();
        const $row = $(event.currentTarget);
        const rowId = $row.attr('id');
        if (!rowId) return;

        const mouseEvent = event as MouseEvent;
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

    private deleteTeamHandler = async (id: number): Promise<void> => {
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
        } catch {
            this.createNotification('Ошибка при удалении бригады', NotificationType.ERROR);
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

    private async selectAllRows(event: Event): Promise<void> {
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
        } else {
            this.selectedRows.clear();
            allRows.each((_, row) => {
                const rowId = $(row).attr('id');
                this.selectedRows.add(rowId);
                $(row).addClass('selected');
                $(row).find('.circle-row').addClass('active-critical');
            });
            circle.addClass('active');
        }
    }

    protected override applyFilters(): void {
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

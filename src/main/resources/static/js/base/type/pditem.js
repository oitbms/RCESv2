var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class PdItem extends Base {
    constructor(itemsPerPage = Infinity, visibleRow = Infinity) {
        super($(`.table-body`), itemsPerPage, visibleRow, () => {
            this.displayPage('/api/parts-directory/get-page-pdi', undefined).catch(console.error);
        });
        this.selectedTeamForEdit = null;
        this.selectedEmployeeIds = [];
        this.createSelectedEmployeeIds = [];
        this.allTeamsCache = [];
        this.allEmployeesCache = [];
        this.editMode = false;
        this.createPdi = (event) => __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const button = $(event.target);
            const form = button.closest('form').get(0);
            const dialog = $('#create-dialog');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            button.prop('disabled', true);
            const employeeInput = dialog.find('input[name="hiddenEmployee"]').val();
            const employee = JSON.parse(employeeInput);
            const hiddenTeam = dialog.find('input[name="hiddenTeam"]').val();
            const team = hiddenTeam ? JSON.parse(hiddenTeam) : null;
            const validatedFields = this.validateIntegerFields([
                { key: 'qty', value: dialog.find('input[name="qty"]').val(), min: 1, label: 'Количество' },
                { key: 'qtyCompleted', value: dialog.find('input[name="qtyCompleted"]').val(), min: 0, label: 'Выполненное количество', defaultValue: 0 }
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
                team: team,
                status: dialog.find('select[name="status"]').val(),
                dateCompletion: dialog.find('input[name="dateCompletion"]').val()
            };
            try {
                const newPdi = yield this.createEntity('/api/parts-directory/create-item', formData);
                this.saveMassive = {};
                this.localCache.set(newPdi.id, newPdi);
                this.dialog.close("create-dialog");
                const newRow = this.createRow(newPdi);
                $(`.table-body`).append(newRow);
                button.prop('disabled', false);
            }
            catch (error) {
                this.saveMassive = {};
                form.reset();
                this.createNotification('Ошибка при создании PDI', NotificationType.ERROR);
                button.prop('disabled', false);
            }
        });
        this.createHandler('click', '#create-button', () => this.dialog.open('create-dialog'), true);
        this.createHandler('click', '#createBtn', this.createPdi, true);
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
        this.createHandler('click', '#save-button', () => this.saveSpe(), true);
        this.createHandler('click', '#print-button', this.print = this.print.bind(this), true);
        this.createHandler('click', '#teams-button', () => this.openTeamEditDialog(), true);
        this.createHandler('input', '[data-name]', this.inputChanges.bind(this), true);
        this.createHandler('click', '.ready-checkbox', this.openReadinessDialog.bind(this), true);
        this.createHandler('input', '#searchInput', (event) => {
            this.searchText = $(event.target).val().toString().toLowerCase().trim();
            this.applyFilters();
        }, true);
        this.createHandler('contextmenu', '.table-row.selected', this.showRowContextMenu.bind(this), true);
    }
    createRow(pdi) {
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
                <div class="table-cell" style="width: var(--team);">
                    <div class="field-container team-field center" data-name="team" contenteditable="false">
                        ${pdi.team ? pdi.team.name : ''}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--ready);">
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
    onScroll() {
    }
    print() {
        const _super = Object.create(null, {
            print: { get: () => super.print }
        });
        return __awaiter(this, void 0, void 0, function* () {
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
            return _super.print.call(this);
        });
    }
    workWithModal(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const modalDiv = $(event.currentTarget);
            const fieldName = modalDiv.attr('data-field') || modalDiv.attr('data-name');
            const currentId = modalDiv.closest('.table-row').attr('id');
            let selected;
            if (fieldName === 'subDivision' || fieldName === 'employee') {
                const isEmployee = fieldName === 'employee';
                const dialog = $(isEmployee ? '#employeeDialog' : '#subDivisionDialog');
                const rowContainer = dialog.find('.dialog-content-rows');
                const searchInput = dialog.find('.choice-field input');
                const changeButton = $(isEmployee ? '#changeEmployee' : '#changeSubDivision');
                const data = yield this.cache.get(fieldName);
                const filteredEmployees = data.filter(employee => ['EVENT', 'CONTROL'].some(role => role === employee.role));
                const renderRows = (items) => {
                    rowContainer.empty();
                    items.forEach(item => {
                        var _a;
                        rowContainer.append(`
                    <div class="dialog-content-rows-row" id="${item.id}">
                        <div class="content-row-column col-250">${item.name}</div>
                        ${isEmployee ? `<div class="content-row-column col-250">${((_a = item.subDivision) === null || _a === void 0 ? void 0 : _a.name) || ''}</div>` : ''}
                    </div>`);
                    });
                };
                renderRows(filteredEmployees);
                searchInput.off('input').on('input', function () {
                    const searchText = $(this).val().toString().toLowerCase().trim();
                    const filtered = data.filter((e) => e.name.toLowerCase().includes(searchText));
                    renderRows(filtered);
                });
                this.dialog.open('employeeDialog');
                rowContainer.off('click').on('click', '.dialog-content-rows-row', function (e) {
                    const id = $(e.currentTarget).attr('id');
                    selected = data.find((e) => e.id === Number(id));
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
                        this.saveMassive[currentId] = Object.assign(Object.assign({}, this.saveMassive[currentId]), { [fieldName]: selected });
                    }
                    else {
                        this.saveMassive[fieldName] = selected;
                    }
                    modalDiv.addClass('change-textarea');
                    this.dialog.close('employeeDialog');
                });
            }
            else if (fieldName === 'team') {
                yield this.openTeamSelectionDialog(modalDiv, currentId);
            }
            modalDiv.addClass('change');
        });
    }
    openTeamSelectionDialog(modalDiv, currentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = $('#teamDialog');
            const rowContainer = dialog.find('.dialog-content-rows');
            const searchInput = dialog.find('.choice-field input');
            const allTeams = yield this.requestToApi('/api/team/get-page', 'GET');
            const teamsList = allTeams.data || [];
            let selectedTeamId;
            const renderRows = (teams) => {
                rowContainer.empty();
                teams.forEach(team => {
                    const employeesText = team.employees ? team.employees.map(e => e.name).join(', ') : '';
                    rowContainer.append(`
                    <div class="dialog-content-rows-row" data-id="${team.id}">
                        <div class="content-row-column col-50">${team.name}</div>
                        <div class="content-row-column col-50">${employeesText}</div>
                    </div>`);
                });
            };
            renderRows(teamsList);
            searchInput.off('input').on('input', function () {
                const searchText = $(this).val().toString().toLowerCase().trim();
                const filtered = teamsList.filter(t => t.name.toLowerCase().includes(searchText));
                renderRows(filtered);
            });
            this.dialog.open('teamDialog');
            rowContainer.off('click').on('click', '.dialog-content-rows-row', function (e) {
                const id = $(e.currentTarget).data('id');
                selectedTeamId = id;
                dialog.find('.dialog-content-rows-row').removeClass('selected');
                $(this).addClass('selected');
            });
            dialog.find('#changeTeam').off('click').on('click', () => {
                if (!selectedTeamId) {
                    this.createNotification('Выберите бригаду из списка', NotificationType.WARNING);
                    return;
                }
                const selectedTeam = teamsList.find(t => t.id == selectedTeamId);
                if (!selectedTeam) return;
                modalDiv.text(selectedTeam.name);
                modalDiv.val(selectedTeam.name);
                if (currentId) {
                    this.saveMassive[currentId] = Object.assign(Object.assign({}, this.saveMassive[currentId]), { team: selectedTeam });
                }
                else {
                    const createDialog = $('#create-dialog');
                    createDialog.find('input[name="hiddenTeam"]').val(JSON.stringify(selectedTeam));
                }
                modalDiv.addClass('change-textarea');
                this.dialog.close('teamDialog');
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
                    const circle = $(row).find('.circle-row');
                    circle.removeClass('active-critical');
                });
                circle.removeClass('active');
            }
            else {
                this.selectedRows.clear();
                allRows.each((_, row) => {
                    const circle = $(row).find('.circle-row');
                    const rowId = $(row).attr('id');
                    this.selectedRows.add(rowId);
                    $(row).addClass('selected');
                    circle.addClass('active-critical');
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
                this.enableEditMode(currentRow);
            }
            else if (!this.selectedRows.has(rowId)) {
                this.disableEditMode(currentRow);
                if (!this.editMode)
                    $('#edit-button').removeClass('active');
            }
        });
    }
    enableEditMode(row) {
        const self = this;
        const processElement = ($div) => {
            const dataName = $div.attr('data-name');
            if (dataName === 'employee' || dataName === 'subDivision') {
                $div.addClass('area-modal').attr('contenteditable', 'false');
                return;
            }
            if (dataName === 'team') {
                $div.addClass('area-modal team-field').attr('contenteditable', 'false');
                $div.off('click').on('click', function(e) {
                    self.workWithModal(e);
                });
                return;
            }
            $div.attr('contenteditable', 'true');
        };
        const isRowValid = row && row.length && row.length > 0;
        if (isRowValid) {
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
        const isRowValid = row && row.length && row.length > 0;
        if (this.editMode &&
            Object.keys(this.saveMassive).length > 0 &&
            ((isRowValid && row.find('.change').length > 0) || $('.table-row .change').length > 0)) {
            this.createNotification("Сохраните изменения", NotificationType.WARNING);
            return;
        }
        const processElement = ($field) => {
            const dataName = $field.attr("data-name");
            let value;
            if (dataName === 'team') {
                value = $field.text().trim();
            } else {
                value = $field.is('select') ? $field.find('option:selected').text() : $field.text();
            }
            const extraClasses = dataName === 'team' ? ' team-field' : '';
            $field.replaceWith(`<div class="field-container center${extraClasses}" data-name="${dataName}" contenteditable="false">${value}</div>`);
        };
        if (isRowValid) {
            $(row).find('div[contenteditable="true"], div.area-modal, select[data-name], input[data-name]').each(function () {
                processElement($(this));
            });
            return;
        }
        for (const rowId of this.selectedRows) {
            const $row = $(`.table-row[id="${rowId}"]`);
            $row.find('div[contenteditable="true"], div.area-modal, select[data-name], input[data-name]').each(function () {
                processElement($(this));
            });
        }
        this.editMode = false;
        $('#edit-button').removeClass('active');
    }
    saveSpe() {
        var _a, _b;
        if (Object.keys(this.saveMassive).length === 0) {
            return;
        }
        for (const id of Object.keys(this.saveMassive)) {
            const cacheData = this.localCache.get(Number(id));
            const changes = this.saveMassive[id] || {};
            const qtyValue = (_a = changes.qty) !== null && _a !== void 0 ? _a : cacheData.qty;
            const qtyCompletedValue = (_b = changes.qtyCompleted) !== null && _b !== void 0 ? _b : cacheData.qtyCompleted;
            const validatedFields = this.validateIntegerFields([
                { key: 'qty', value: qtyValue, min: 1, label: 'Количество' },
                { key: 'qtyCompleted', value: qtyCompletedValue, min: 0, label: 'Выполненное количество', defaultValue: 0 }
            ]);
            if (!validatedFields) {
                return;
            }
            this.saveMassive[id] = Object.assign(Object.assign({}, changes), { qty: validatedFields.qty, qtyCompleted: validatedFields.qtyCompleted });
        }
        const itemsArray = Object.keys(this.saveMassive).map(id => {
            const cacheData = this.localCache.get(Number(id));
            return {
                id: id,
                version: cacheData.version,
                changes: this.saveMassive[id]
            };
        });
        this.save('/api/parts-directory/update', ...itemsArray).then(() => {
            this.disableEditMode();
            itemsArray.forEach((id) => this.selectedRows.delete(Number(id)));
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
    openReadinessDialog(event) {
        this.dialog.open('readiness-dialog');
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
                label: 'Удалить запись',
                idAction: 'deletePdi',
                action: () => {
                    this.deletePdiHandler(rowId);
                }
            },
        ], mouseEvent.clientX, mouseEvent.clientY);
    }
    deletePdiHandler(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const confirmed = yield this.createConfirmationDialog('Вы действительно хотите удалить эту запись?');
            if (!confirmed)
                return;
            try {
                yield this.deleteEntity(`/api/parts-directory/delete/${id}`);
                this.createNotification('Запись успешно удалена', NotificationType.SUCCESS);
                this.deleteRow(id);
                this.selectedRows.delete(id);
            }
            catch (error) {
                this.createNotification('Ошибка при удалении записи', NotificationType.ERROR);
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

    openTeamEditDialog() {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = $('#teamEditDialog');
            const teamsResponse = yield this.requestToApi('/api/team/get-page', 'GET');
            this.allTeamsCache = teamsResponse.data || [];
            const employeesResponse = yield this.requestToApi('/api/employees', 'GET');
            this.allEmployeesCache = Array.isArray(employeesResponse) ? employeesResponse : (employeesResponse.data || []);
            this.selectedTeamForEdit = null;
            this.selectedEmployeeIds = [];
            this.createSelectedEmployeeIds = [];
            this.renderTeamList();
            dialog.find('#deleteTeam').hide();
            dialog.find('#saveTeam').hide();
            dialog.find('#createTeam').show();
            this.switchTeamTab('team-list');
            dialog.find('#teamSearchInput').off('input').on('input', () => {
                const searchText = dialog.find('#teamSearchInput').val().toString().toLowerCase().trim();
                this.renderTeamList(searchText);
            });
            dialog.find('.team-tab').off('click').on('click', (e) => {
                const tab = $(e.currentTarget).data('tab');
                this.switchTeamTab(tab);
            });
            dialog.find('#teamListRows').off('click').on('click', '.dialog-content-rows-row', (e) => {
                const $row = $(e.currentTarget);
                const teamId = $row.data('id');
                const team = this.allTeamsCache.find(t => t.id === teamId);
                if (!team) return;
                this.selectedTeamForEdit = team;
                dialog.find('#teamListRows .dialog-content-rows-row').removeClass('selected');
                $row.addClass('selected');
                dialog.find('#deleteTeam').show();
                dialog.find('#saveTeam').show();
            });
            dialog.find('#teamListRows').off('dblclick').on('dblclick', '.dialog-content-rows-row', (e) => {
                const $row = $(e.currentTarget);
                const teamId = $row.data('id');
                const team = this.allTeamsCache.find(t => t.id === teamId);
                if (!team) return;
                this.selectedTeamForEdit = team;
                this.switchTeamTab('team-edit');
                this.populateTeamEditForm(team);
            });
            dialog.find('#saveTeam').off('click').on('click', () => this.saveTeamHandler());
            dialog.find('#deleteTeam').off('click').on('click', () => this.deleteTeamHandler());
            dialog.find('#createTeam').off('click').on('click', () => this.createTeamHandler());
            dialog.find('#employeeSearchInput').off('input').on('input', () => {
                const searchText = dialog.find('#employeeSearchInput').val().toString().toLowerCase().trim();
                this.renderEmployeeListForEdit(searchText);
            });
            dialog.find('#createEmployeeSearchInput').off('input').on('input', () => {
                const searchText = dialog.find('#createEmployeeSearchInput').val().toString().toLowerCase().trim();
                this.renderEmployeeListForCreate(searchText);
            });
            dialog.find('#selectAllEmployees').off('change').on('change', function () {
                const isChecked = $(this).prop('checked');
                const self = this;
                dialog.find('#employeeRows .employee-checkbox').each(function () {
                    const empId = parseInt($(this).data('id'));
                    $(this).prop('checked', isChecked);
                    if (isChecked) {
                        if (!self.selectedEmployeeIds.includes(empId)) {
                            self.selectedEmployeeIds.push(empId);
                        }
                    } else {
                        const idx = self.selectedEmployeeIds.indexOf(empId);
                        if (idx > -1) self.selectedEmployeeIds.splice(idx, 1);
                    }
                });
            }.bind(this));
            dialog.find('#employeeRows').off('change', '.employee-checkbox').on('change', '.employee-checkbox', function () {
                const empId = parseInt($(this).data('id'));
                const self = this;
                if ($(this).prop('checked')) {
                    if (!self.selectedEmployeeIds.includes(empId)) {
                        self.selectedEmployeeIds.push(empId);
                    }
                } else {
                    const idx = self.selectedEmployeeIds.indexOf(empId);
                    if (idx > -1) self.selectedEmployeeIds.splice(idx, 1);
                }
                const allCheckboxes = dialog.find('#employeeRows .employee-checkbox');
                const checkedBoxes = dialog.find('#employeeRows .employee-checkbox:checked');
                dialog.find('#selectAllEmployees').prop('checked', allCheckboxes.length === checkedBoxes.length && allCheckboxes.length > 0);
            }.bind(this));
            dialog.find('#createSelectAllEmployees').off('change').on('change', function (e) {
                const isChecked = $(e.target).prop('checked');
                dialog.find('#createEmployeeRows .employee-checkbox').each(function () {
                    const empId = parseInt($(this).data('id'));
                    $(this).prop('checked', isChecked);
                    if (isChecked) {
                        if (!this.createSelectedEmployeeIds.includes(empId)) {
                            this.createSelectedEmployeeIds.push(empId);
                        }
                    } else {
                        const idx = this.createSelectedEmployeeIds.indexOf(empId);
                        if (idx > -1) this.createSelectedEmployeeIds.splice(idx, 1);
                    }
                }.bind(this));
            }.bind(this));
            dialog.find('#createEmployeeRows').off('change', '.employee-checkbox').on('change', '.employee-checkbox', function (e) {
                const $checkbox = $(e.target);
                const empId = parseInt($checkbox.data('id'));
                console.log('Checkbox changed! empId:', empId, 'checked:', $checkbox.prop('checked'));
                console.log('Before update, createSelectedEmployeeIds:', this.createSelectedEmployeeIds);
                if ($checkbox.prop('checked')) {
                    if (!this.createSelectedEmployeeIds.includes(empId)) {
                        this.createSelectedEmployeeIds.push(empId);
                    }
                } else {
                    const idx = this.createSelectedEmployeeIds.indexOf(empId);
                    if (idx > -1) this.createSelectedEmployeeIds.splice(idx, 1);
                }
                console.log('After update, createSelectedEmployeeIds:', this.createSelectedEmployeeIds);
                const allCheckboxes = dialog.find('#createEmployeeRows .employee-checkbox');
                const checkedBoxes = dialog.find('#createEmployeeRows .employee-checkbox:checked');
                dialog.find('#createSelectAllEmployees').prop('checked', allCheckboxes.length === checkedBoxes.length && allCheckboxes.length > 0);
            }.bind(this));
            this.dialog.open('teamEditDialog');
        });
    }

    renderTeamList(searchText = '') {
        const dialog = $('#teamEditDialog');
        const rowContainer = dialog.find('#teamListRows');
        rowContainer.empty();
        const filtered = this.allTeamsCache.filter(t => t.name.toLowerCase().includes(searchText.toLowerCase()));
        filtered.forEach(team => {
            const employeesText = team.employees ? team.employees.map(e => e.name).join(', ') : '';
            const isSelected = this.selectedTeamForEdit && this.selectedTeamForEdit.id === team.id ? 'selected' : '';
            rowContainer.append(`<div class="dialog-content-rows-row ${isSelected}" data-id="${team.id}"><div class="content-row-column col-50">${this.escapeHtml(team.name)}</div><div class="content-row-column col-50">${this.escapeHtml(employeesText)}</div></div>`);
        });
    }

    renderEmployeeListForEdit(searchText = '') {
        const dialog = $('#teamEditDialog');
        const rowContainer = dialog.find('#employeeRows');
        rowContainer.empty();
        const filtered = this.allEmployeesCache.filter(e => e.name.toLowerCase().includes(searchText.toLowerCase()));
        filtered.forEach(emp => {
            const subDivisionName = emp.subDivision ? emp.subDivision.name : '';
            const isChecked = this.selectedEmployeeIds.includes(emp.id) ? 'checked' : '';
            rowContainer.append(`<div class="dialog-content-rows-row" data-id="${emp.id}"><div class="content-row-column col-250"><input type="checkbox" class="employee-checkbox" data-id="${emp.id}" ${isChecked}></div><div class="content-row-column col-250">${this.escapeHtml(emp.name)}</div><div class="content-row-column col-250">${this.escapeHtml(subDivisionName)}</div></div>`);
        });
    }

    renderEmployeeListForCreate(searchText = '') {
        const dialog = $('#teamEditDialog');
        const rowContainer = dialog.find('#createEmployeeRows');
        rowContainer.empty();
        const filtered = this.allEmployeesCache.filter(e => e.name.toLowerCase().includes(searchText.toLowerCase()));
        filtered.forEach(emp => {
            const subDivisionName = emp.subDivision ? emp.subDivision.name : '';
            const isChecked = this.createSelectedEmployeeIds.includes(emp.id) ? 'checked' : '';
            rowContainer.append(`<div class="dialog-content-rows-row" data-id="${emp.id}"><div class="content-row-column col-250"><input type="checkbox" class="employee-checkbox" data-id="${emp.id}" ${isChecked}></div><div class="content-row-column col-250">${this.escapeHtml(emp.name)}</div><div class="content-row-column col-250">${this.escapeHtml(subDivisionName)}</div></div>`);
        });
    }

    switchTeamTab(tabName) {
        const dialog = $('#teamEditDialog');
        dialog.find('.team-tab').removeClass('active');
        dialog.find(`.team-tab[data-tab="${tabName}"]`).addClass('active');
        dialog.find('.team-tab-content').removeClass('active');
        dialog.find(`.team-tab-content[data-tab-content="${tabName}"]`).addClass('active');
        if (tabName === 'team-list') {
            dialog.find('#deleteTeam').hide();
            dialog.find('#saveTeam').hide();
            dialog.find('#createTeam').show();
            this.renderTeamList();
        } else if (tabName === 'team-edit') {
            if (this.selectedTeamForEdit) {
                dialog.find('#deleteTeam').show();
                dialog.find('#saveTeam').show();
                dialog.find('#createTeam').hide();
                this.populateTeamEditForm(this.selectedTeamForEdit);
            }
        } else if (tabName === 'team-create') {
            dialog.find('#deleteTeam').hide();
            dialog.find('#saveTeam').hide();
            dialog.find('#createTeam').show();
            this.clearTeamCreateForm();
        }
    }

    populateTeamEditForm(team) {
        const dialog = $('#teamEditDialog');
        dialog.find('#editTeamName').val(team.name);
        this.selectedEmployeeIds = team.employees ? team.employees.map(e => e.id) : [];
        this.renderEmployeeListForEdit();
        const allCheckboxes = dialog.find('#employeeRows .employee-checkbox');
        const checkedBoxes = dialog.find('#employeeRows .employee-checkbox:checked');
        dialog.find('#selectAllEmployees').prop('checked', allCheckboxes.length === checkedBoxes.length && allCheckboxes.length > 0);
    }

    clearTeamCreateForm() {
        const dialog = $('#teamEditDialog');
        dialog.find('#createTeamName').val('');
        this.createSelectedEmployeeIds = [];
        this.renderEmployeeListForCreate();
        dialog.find('#createSelectAllEmployees').prop('checked', false);
    }

    saveTeamHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.selectedTeamForEdit) {
                this.createNotification('Выберите бригаду для редактирования', NotificationType.WARNING);
                return;
            }
            const dialog = $('#teamEditDialog');
            const name = dialog.find('#editTeamName').val().toString().trim();
            if (!name) {
                this.createNotification('Введите название бригады', NotificationType.WARNING);
                return;
            }
            const changes = { name };
            if (this.selectedEmployeeIds.length > 0) {
                changes.employeeIds = this.selectedEmployeeIds;
            }
            const unlock = this.lockScreen('Сохранение бригады...');
            try {
                const updatedTeam = yield this.requestToApi(`/api/team/update/${this.selectedTeamForEdit.id}?version=${this.selectedTeamForEdit.version}`, 'PATCH', changes);
                const idx = this.allTeamsCache.findIndex(t => t.id === updatedTeam.id);
                if (idx !== -1) {
                    this.allTeamsCache[idx] = updatedTeam;
                }
                this.localCache.forEach((pdi, key) => {
                    if (pdi.team && pdi.team.id === updatedTeam.id) {
                        pdi.team = updatedTeam;
                        const $row = $(`.table-row[id="${key}"]`);
                        $row.find('[data-name="team"]').text(updatedTeam.name);
                    }
                });
                this.createNotification('Бригада успешно обновлена', NotificationType.SUCCESS);
                this.renderTeamList();
                this.switchTeamTab('team-list');
            } catch {
                this.createNotification('Ошибка при сохранении бригады', NotificationType.ERROR);
            } finally {
                unlock();
            }
        });
    }

    createTeamHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = $('#teamEditDialog');
            const name = dialog.find('#createTeamName').val().toString().trim();
            if (!name) {
                this.createNotification('Введите название бригады', NotificationType.WARNING);
                return;
            }
            const dto = { 
                name: name,
                employeeIds: this.createSelectedEmployeeIds
            };
            console.log('=== Creating Team ===');
            console.log('createSelectedEmployeeIds:', this.createSelectedEmployeeIds);
            console.log('DTO being sent:', dto);
            const unlock = this.lockScreen('Создание бригады...');
            try {
                const newTeam = yield this.requestToApi('/api/team/create', 'POST', dto);
                this.allTeamsCache.push(newTeam);
                this.createNotification('Бригада успешно создана', NotificationType.SUCCESS);
                this.renderTeamList();
                this.switchTeamTab('team-list');
            } catch {
                this.createNotification('Ошибка при создании бригады', NotificationType.ERROR);
            } finally {
                unlock();
            }
        });
    }

    deleteTeamHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.selectedTeamForEdit) {
                this.createNotification('Выберите бригаду для удаления', NotificationType.WARNING);
                return;
            }
            const confirmed = yield this.createConfirmationDialog('Вы действительно хотите удалить эту бригаду?');
            if (!confirmed) return;
            const unlock = this.lockScreen('Удаление бригады...');
            try {
                yield this.requestToApi(`/api/team/delete/${this.selectedTeamForEdit.id}`, 'DELETE');
                const idx = this.allTeamsCache.findIndex(t => t.id === this.selectedTeamForEdit.id);
                if (idx !== -1) {
                    this.allTeamsCache.splice(idx, 1);
                }
                this.localCache.forEach((pdi, key) => {
                    if (pdi.team && pdi.team.id === this.selectedTeamForEdit.id) {
                        pdi.team = null;
                        const $row = $(`.table-row[id="${key}"]`);
                        $row.find('[data-name="team"]').text('');
                    }
                });
                this.createNotification('Бригада успешно удалена', NotificationType.SUCCESS);
                this.selectedTeamForEdit = null;
                this.renderTeamList();
            } catch {
                this.createNotification('Ошибка при удалении бригады', NotificationType.ERROR);
            } finally {
                unlock();
            }
        });
    }
}
$(document).ready(() => {
    new PdItem();
});

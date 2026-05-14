"use strict";
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
        this.allTeamsCache = [];
        this.allEmployeesCache = [];
        this.selectedReadinessRowId = null;
        this.loadFrom1cRows = [];
        this.selectedLoadFrom1cRowIndexes = new Set();
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
            const employee = employeeInput ? JSON.parse(employeeInput) : null;
            const validatedFields = this.validateIntegerFields([
                { key: 'qty', value: dialog.find('input[name="qty"]').val(), min: 1, label: 'Количество' },
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
            const hiddenTeam = dialog.find('input[name="hiddenTeam"]').val();
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
                const newPdi = yield this.createEntity('/api/parts-directory/create-item', formData);
                this.saveMassive = {};
                this.localCache.set(newPdi.id, newPdi);
                this.dialog.close("create-dialog");
                $(`.table-body`).append(this.createRow(newPdi));
            }
            catch (_a) {
                this.saveMassive = {};
                form.reset();
                this.createNotification('Ошибка при создании PDI', NotificationType.ERROR);
            }
            finally {
                button.prop('disabled', false);
            }
        });
        this.openLoadFrom1cDialog = () => {
            this.resetLoadFrom1cPreview();
            this.dialog.open('load-1c-dialog', {
                onOpen: () => {
                    $('#load-1c-dialog').find('input[name="orderNumber"]').trigger('focus');
                }
            });
        };
        this.handleLoadFrom1c = (event) => __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const dialog = $('#load-1c-dialog');
            const form = dialog.find('#loadFrom1cForm').get(0);
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            const orderNumberValue = dialog.find('input[name="orderNumber"]').val();
            const orderNumber = orderNumberValue ? orderNumberValue.toString().trim() : '';
            if (!orderNumber) {
                this.createNotification('Введите номер заказа', NotificationType.WARNING);
                return;
            }
            const button = dialog.find('#loadFrom1cBtn');
            const unlock = this.lockScreen('Загрузка данных из 1C...');
            button.prop('disabled', true);
            try {
                const response = yield this.requestToApi(`/api/parts-directory/from-1c?customerOrder=${encodeURIComponent(orderNumber)}`, 'POST');
                this.loadFrom1cRows = this.mapLoadFrom1cRows(response);
                this.selectedLoadFrom1cRowIndexes.clear();
                this.renderLoadFrom1cRows();
                if (this.loadFrom1cRows.length) {
                    this.createNotification(`Получено строк из 1C: ${this.loadFrom1cRows.length}`, NotificationType.SUCCESS);
                }
                else {
                    this.createNotification('По этому заказу строки в 1C не найдены', NotificationType.INFO);
                }
            }
            catch (error) {
                console.error(error);
            }
            finally {
                unlock();
                button.prop('disabled', false);
            }
        });
        this.workWithModal = (event) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const modalDiv = $(event.currentTarget);
            const fieldName = modalDiv.attr('data-field') || modalDiv.attr('data-name');
            const currentId = (_a = modalDiv.closest('.table-row')) === null || _a === void 0 ? void 0 : _a.attr('id');
            if (fieldName === 'employee') {
                const dialog = $('#employeeDialog');
                const rowContainer = dialog.find('.dialog-content-rows');
                const searchInput = dialog.find('.choice-field input');
                const changeButton = $('#changeEmployee');
                let selected;
                const data = yield this.cache.get('employee');
                const renderRows = (items) => {
                    rowContainer.empty();
                    items.forEach(item => {
                        var _a;
                        rowContainer.append(`
                        <div class="dialog-content-rows-row" id="${item.id}">
                            <div class="content-row-column col-250">${item.name}</div>
                            <div class="content-row-column col-250">${((_a = item.subDivision) === null || _a === void 0 ? void 0 : _a.name) || ''}</div>
                        </div>`);
                    });
                };
                renderRows(data);
                searchInput.off('input').on('input', function () {
                    const searchText = $(this).val().toString().toLowerCase().trim();
                    const filtered = data.filter((e) => e.name.toLowerCase().includes(searchText));
                    renderRows(filtered);
                });
                this.dialog.open('employeeDialog');
                rowContainer.off('click').on('click', '.dialog-content-rows-row', (e) => {
                    const target = e.currentTarget;
                    const id = target.id;
                    selected = data.find((item) => item.id === Number(id));
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
                        this.saveMassive[currentId] = Object.assign(Object.assign({}, this.saveMassive[currentId]), { employee: selected });
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
        this.openTeamSelectionDialog = (modalDiv, currentId) => __awaiter(this, void 0, void 0, function* () {
            const dialog = $('#teamDialog');
            const rowContainer = dialog.find('.dialog-content-rows');
            const searchInput = dialog.find('.choice-field input');
            const allTeams = yield this.requestToApi('/api/team/get-page', 'GET');
            const teamsList = allTeams.data || [];
            let selectedTeamId;
            const renderRows = (teams) => {
                rowContainer.empty();
                teams.forEach(team => {
                    var _a;
                    const employeesText = ((_a = team.employees) === null || _a === void 0 ? void 0 : _a.map((e) => e.name).join(', ')) || '';
                    const isSelected = selectedTeamId === team.id ? 'selected' : '';
                    rowContainer.append(`
                    <div class="dialog-content-rows-row" data-id="${team.id}" class="${isSelected}">
                        <div class="content-row-column col-50">${team.name}</div>
                        <div class="content-row-column col-50">${employeesText}</div>
                    </div>`);
                });
            };
            renderRows(teamsList);
            searchInput.off('input').on('input', function () {
                const searchText = $(this).val().toString().toLowerCase().trim();
                const filtered = teamsList.filter((t) => t.name.toLowerCase().includes(searchText));
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
                const selectedTeam = teamsList.find((t) => t.id == selectedTeamId);
                if (!selectedTeam)
                    return;
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
        this.selectRow = (event) => __awaiter(this, void 0, void 0, function* () {
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
                this.disableEditMode(['dateCompletion'], [], currentRow);
                if (!this.editMode)
                    $('#edit-button').removeClass('active');
            }
        });
        this.closeReadinessDialog = () => {
            this.dialog.close('readiness-dialog');
            this.selectedReadinessRowId = null;
        };
        this.saveReadinessHandler = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.selectedReadinessRowId)
                return;
            const dialog = $('#readiness-dialog');
            const isThermal = dialog.find('#operationThermal').is(':checked');
            const isLocksmith = dialog.find('#operationLocksmith').is(':checked');
            // Собираем выбранные операции
            const operations = [];
            if (isThermal)
                operations.push('thermal');
            if (isLocksmith)
                operations.push('locksmith');
            // Готовность = true если выбрана хотя бы одна операция
            const ready = operations.length > 0;
            const unlock = this.lockScreen('Сохранение готовности...');
            try {
                const params = new URLSearchParams();
                params.set('id', this.selectedReadinessRowId);
                params.set('ready', String(ready));
                operations.forEach(op => params.append('operations', op));
                yield this.requestToApi(`/api/parts-directory/ready?${params.toString()}`, 'PATCH');
                // Обновляем кэш и UI
                const cacheData = this.localCache.get(this.selectedReadinessRowId);
                if (cacheData) {
                    cacheData.ready = ready;
                    cacheData.operation = operations;
                }
                // Обновляем чекбокс в таблице
                const $row = $(`.table-row[id="${this.selectedReadinessRowId}"]`);
                const checkbox = $row.find('.ready-checkbox');
                checkbox.prop('checked', ready);
                this.createNotification('Готовность успешно обновлена', NotificationType.SUCCESS);
                this.closeReadinessDialog();
            }
            catch (_a) {
                this.createNotification('Ошибка при сохранении готовности', NotificationType.ERROR);
            }
            finally {
                unlock();
            }
        });
        this.showRowContextMenu = (event) => {
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
        };
        this.deletePdiHandler = (id) => __awaiter(this, void 0, void 0, function* () {
            const confirmed = yield this.createConfirmationDialog('Вы действительно хотите удалить эту запись?');
            if (!confirmed)
                return;
            try {
                yield this.deleteEntity(`/api/parts-directory/delete/${id}`);
                this.createNotification('Запись успешно удалена', NotificationType.SUCCESS);
                this.deleteRow(id);
                this.selectedRows.delete(id);
            }
            catch (_a) {
                this.createNotification('Ошибка при удалении записи', NotificationType.ERROR);
            }
        });
        // ========== TEAM MANAGEMENT ==========
        this.openTeamEditDialog = () => __awaiter(this, void 0, void 0, function* () {
            const dialog = $('#teamEditDialog');
            const teamsResponse = yield this.requestToApi('/api/team/get-page', 'GET');
            this.allTeamsCache = teamsResponse.data || [];
            this.allEmployeesCache = yield this.cache.get('employee');
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
            dialog.find('#teamListRows').off('click').on('click', '.dialog-content-rows-row', (e) => {
                const $row = $(e.currentTarget);
                const teamId = $row.data('id');
                const team = this.allTeamsCache.find((t) => t.id === teamId);
                if (!team)
                    return;
                this.selectedTeamForEdit = team;
                dialog.find('#teamListRows .dialog-content-rows-row').removeClass('selected');
                $row.addClass('selected');
                dialog.find('#editTeamName').val(team.name);
                this.selectedEmployeeIds = team.employees?.map((e) => e.id) || [];
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
                const target = e.currentTarget;
                const isChecked = target.checked;
                dialog.find('#employeeRows .employee-checkbox').each((_, el) => {
                    const checkbox = el;
                    const empId = parseInt($(checkbox).data('id'));
                    checkbox.checked = isChecked;
                    if (isChecked) {
                        if (!this.selectedEmployeeIds.includes(empId)) {
                            this.selectedEmployeeIds.push(empId);
                        }
                    }
                    else {
                        const idx = this.selectedEmployeeIds.indexOf(empId);
                        if (idx > -1)
                            this.selectedEmployeeIds.splice(idx, 1);
                    }
                });
            });
            dialog.find('#employeeRows').off('change', '.employee-checkbox').on('change', '.employee-checkbox', (e) => {
                const target = e.currentTarget;
                const empId = parseInt($(target).data('id'));
                if (target.checked) {
                    if (!this.selectedEmployeeIds.includes(empId)) {
                        this.selectedEmployeeIds.push(empId);
                    }
                }
                else {
                    const idx = this.selectedEmployeeIds.indexOf(empId);
                    if (idx > -1)
                        this.selectedEmployeeIds.splice(idx, 1);
                }
                const allCheckboxes = dialog.find('#employeeRows .employee-checkbox');
                const checkedBoxes = dialog.find('#employeeRows .employee-checkbox:checked');
                dialog.find('#selectAllEmployees').prop('checked', allCheckboxes.length === checkedBoxes.length && allCheckboxes.length > 0);
            });
            this.dialog.open('teamEditDialog');
        });
        this.updateFooterButtons = () => {
            const dialog = $('#teamEditDialog');
            if (this.selectedTeamForEdit) {
                dialog.find('#deleteTeam').show();
            }
            else {
                dialog.find('#deleteTeam').hide();
            }
        };
        this.renderTeamList = (searchText = '') => {
            const dialog = $('#teamEditDialog');
            const rowContainer = dialog.find('#teamListRows');
            rowContainer.empty();
            const filtered = this.allTeamsCache.filter((t) => t.name.toLowerCase().includes(searchText.toLowerCase()));
            filtered.forEach((team) => {
                var _a, _b;
                const employeesText = ((_a = team.employees) === null || _a === void 0 ? void 0 : _a.map((e) => e.name).join(', ')) || '';
                const isSelected = ((_b = this.selectedTeamForEdit) === null || _b === void 0 ? void 0 : _b.id) === team.id ? 'selected' : '';
                rowContainer.append(`
                <div class="dialog-content-rows-row ${isSelected}" data-id="${team.id}">
                    <div class="content-row-column" style="flex: 1">${this.escapeHtml(team.name)}</div>
                    <div class="content-row-column" style="flex: 2">${this.escapeHtml(employeesText)}</div>
                </div>
            `);
            });
        };
        this.renderEmployeeList = (searchText = '') => {
            const dialog = $('#teamEditDialog');
            const rowContainer = dialog.find('#employeeRows');
            rowContainer.empty();
            const filtered = this.allEmployeesCache.filter((e) => e.name.toLowerCase().includes(searchText.toLowerCase()));
            filtered.forEach((emp) => {
                var _a;
                const subDivisionName = ((_a = emp.subDivision) === null || _a === void 0 ? void 0 : _a.name) || '';
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

        this.saveTeamHandler = () => __awaiter(this, void 0, void 0, function* () {
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
                const changes = { name };
                if (this.selectedEmployeeIds.length > 0) {
                    changes.employeeIds = this.selectedEmployeeIds;
                }
                const unlock = this.lockScreen('Сохранение бригады...');
                try {
                    const updatedTeam = yield this.requestToApi(`/api/team/update/${this.selectedTeamForEdit.id}?version=${version}`, 'PATCH', changes);
                    const idx = this.allTeamsCache.findIndex((t) => t.id === updatedTeam.id);
                    if (idx !== -1) {
                        this.allTeamsCache[idx] = updatedTeam;
                    }
                    this.localCache.forEach((pdi, key) => {
                        var _a;
                        if (((_a = pdi.team) === null || _a === void 0 ? void 0 : _a.id) === updatedTeam.id) {
                            pdi.team = updatedTeam;
                            const $row = $(`.table-row[id="${key}"]`);
                            $row.find('[data-name="team"]').text(updatedTeam.name);
                        }
                    });
                    this.createNotification('Бригада успешно обновлена', NotificationType.SUCCESS);
                    this.selectedTeamForEdit = updatedTeam;
                    this.renderTeamList();
                }
                catch (_a) {
                    this.createNotification('Ошибка при сохранении бригады', NotificationType.ERROR);
                }
                finally {
                    unlock();
                }
            }
            else {
                const dto = {
                    name,
                    employeeIds: this.selectedEmployeeIds
                };
                const unlock = this.lockScreen('Создание бригады...');
                try {
                    const newTeam = yield this.requestToApi('/api/team/create', 'POST', dto);
                    this.allTeamsCache.push(newTeam);
                    this.createNotification('Бригада успешно создана', NotificationType.SUCCESS);
                    this.selectedTeamForEdit = newTeam;
                    this.renderTeamList();
                    dialog.find('#teamListRows .dialog-content-rows-row').removeClass('selected');
                    dialog.find(`#teamListRows .dialog-content-rows-row[data-id="${newTeam.id}"]`).addClass('selected');
                    this.updateFooterButtons();
                }
                catch (_a) {
                    this.createNotification('Ошибка при создании бригады', NotificationType.ERROR);
                }
                finally {
                    unlock();
                }
            }
        });
        this.deleteTeamHandler = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.selectedTeamForEdit) {
                this.createNotification('Выберите бригаду для удаления', NotificationType.WARNING);
                return;
            }
            const confirmed = yield this.createConfirmationDialog('Вы действительно хотите удалить эту бригаду?');
            if (!confirmed)
                return;
            const unlock = this.lockScreen('Удаление бригады...');
            try {
                yield this.requestToApi(`/api/team/delete/${this.selectedTeamForEdit.id}`, 'DELETE');
                // Удаляем из кэша
                const idx = this.allTeamsCache.findIndex((t) => t.id === this.selectedTeamForEdit.id);
                if (idx !== -1) {
                    this.allTeamsCache.splice(idx, 1);
                }
                // Обновляем localCache для PDI записей с этой бригадой
                this.localCache.forEach((pdi, key) => {
                    var _a;
                    if (((_a = pdi.team) === null || _a === void 0 ? void 0 : _a.id) === this.selectedTeamForEdit.id) {
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
            }
            catch (_a) {
                this.createNotification('Ошибка при удалении бригады', NotificationType.ERROR);
            }
            finally {
                unlock();
            }
        });
        this.editDateFields = ['dateCompletion'];
        this.createHandler('click', '#create-button', () => this.dialog.open('create-dialog'), true);
        this.createHandler('click', '#load-1c-button', () => this.openLoadFrom1cDialog(), true);
        this.createHandler('click', '#createBtn', this.createPdi, true);
        this.createHandler('submit', '#loadFrom1cForm', (event) => event.preventDefault());
        this.createHandler('click', '#loadFrom1cBtn', this.handleLoadFrom1c.bind(this), true);
        this.createHandler('change', '#load-1c-select-all', this.toggleAllLoadFrom1cRowsSelection.bind(this), true);
        this.createHandler('change', '.load-1c-row-checkbox', this.toggleLoadFrom1cRowSelection.bind(this), true);
        this.createHandler('click', '.area-modal', this.workWithModal.bind(this), true);
        this.createHandler('click', '.circle-header', this.selectAllRows.bind(this), true);
        this.createHandler('click', '.circle-row', this.selectRow.bind(this), true);
        this.createHandler('click', '#edit-button', () => {
            if (!this.editMode) {
                this.enableEditMode();
                $('#edit-button').addClass('active');
            }
            else {
                this.disableEditMode(['dateCompletion'], []);
                if (!this.editMode)
                    $('#edit-button').removeClass('active');
            }
        }, true);
        this.createHandler('click', '#save-button', () => this.savePdi(), true);
        this.createHandler('click', '#print-button', this.print = this.print.bind(this), true);
        this.createHandler('click', '#teams-button', () => this.openTeamEditDialog(), true);
        this.createHandler('input', '[data-name]', this.inputChanges.bind(this), true);
        this.createHandler('click', '.ready-checkbox', (event) => {
            const $row = $(event.currentTarget).closest('.table-row');
            const rowId = $row.attr('id');
            if (!rowId) return;
            
            const cacheData = this.localCache.get(rowId);
            
            if (cacheData && cacheData.ready) {
                // Если уже ready - просто отправляем false на API
                this.requestToApi("/api/parts-directory/ready", "PATCH", {id: rowId, ready: false});
            } else {
                // Если не ready - открываем диалог
                this.openReadinessDialog(event);
            }
        }, true);
        this.createHandler('click', '#saveReadiness', this.saveReadinessHandler.bind(this), true);
        this.createHandler('click', '#cancelReadiness', this.closeReadinessDialog.bind(this), true);
        this.createHandler('click', '#closeReadinessDialog', this.closeReadinessDialog.bind(this), true);
        this.createHandler('input', '#searchInput', (event) => {
            this.searchText = $(event.target).val().toString().toLowerCase().trim();
            this.applyFilters();
        }, true);
        this.createHandler('contextmenu', '.table-row.selected', this.showRowContextMenu.bind(this), true);
    }
    createRow(pdi) {
        var _a;
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
                <div class="table-cell" style="width: var(--team);">
                    <div class="field-container team-field center" data-name="team" contenteditable="false">
                        ${this.escapeHtml(((_a = pdi.team) === null || _a === void 0 ? void 0 : _a.name) || '')}
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
    resetLoadFrom1cPreview() {
        const dialog = $('#load-1c-dialog');
        this.loadFrom1cRows = [];
        this.selectedLoadFrom1cRowIndexes.clear();
        dialog.removeClass('has-results');
        dialog.find('#load-1c-results').attr('hidden', 'hidden');
        dialog.find('#load-1c-result-summary').text('');
        dialog.find('#load-1c-rows').empty();
        dialog.find('#load-1c-select-all')
            .prop('checked', false)
            .prop('indeterminate', false)
            .prop('disabled', true);
    }
    extractLoadFrom1cOrderNumber(customerOrder) {
        const value = (customerOrder === null || customerOrder === void 0 ? void 0 : customerOrder.trim()) || '';
        if (!value) {
            return '';
        }
        const match = value.match(/\d[\d./-]*/);
        return match ? match[0] : value;
    }
    mapLoadFrom1cRows(response) {
        const rows = Array.isArray(response === null || response === void 0 ? void 0 : response.response)
            ? response.response
            : Array.isArray(response === null || response === void 0 ? void 0 : response["Запрос"])
                ? response["Запрос"]
                : [];
        return rows.map((item, index) => ({
            index,
            customerOrder: this.extractLoadFrom1cOrderNumber(item.customerOrder || ''),
            drawing: item.item || '',
            quantity: item.name != null ? String(item.name) : '',
            size: item.thickness || '',
            steel: item.steel || ''
        }));
    }
    updateLoadFrom1cSummary() {
        const dialog = $('#load-1c-dialog');
        const total = this.loadFrom1cRows.length;
        const selected = this.selectedLoadFrom1cRowIndexes.size;
        dialog.find('#load-1c-result-summary').text(total ? `Найдено строк: ${total}. Выбрано: ${selected}.` : 'По этому заказу строки не найдены.');
        dialog.find('#load-1c-select-all')
            .prop('checked', total > 0 && selected === total)
            .prop('indeterminate', selected > 0 && selected < total)
            .prop('disabled', total === 0);
    }
    renderLoadFrom1cRows() {
        const dialog = $('#load-1c-dialog');
        const rowsContainer = dialog.find('#load-1c-rows');
        dialog.addClass('has-results');
        dialog.find('#load-1c-results').removeAttr('hidden');
        if (!this.loadFrom1cRows.length) {
            rowsContainer.html('<div class="load-1c-empty">По этому заказу строки не найдены.</div>');
            this.updateLoadFrom1cSummary();
            return;
        }
        const rowsHtml = this.loadFrom1cRows.map((row) => {
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
    toggleAllLoadFrom1cRowsSelection(event) {
        const isChecked = event.currentTarget.checked;
        const rowCheckboxes = $('#load-1c-rows').find('.load-1c-row-checkbox');
        this.selectedLoadFrom1cRowIndexes.clear();
        rowCheckboxes.each((_, checkbox) => {
            const input = checkbox;
            const rowIndex = Number($(input).attr('data-row-index'));
            input.checked = isChecked;
            $(input).closest('.load-1c-grid__row').toggleClass('is-selected', isChecked);
            if (isChecked && !Number.isNaN(rowIndex)) {
                this.selectedLoadFrom1cRowIndexes.add(rowIndex);
            }
        });
        this.updateLoadFrom1cSummary();
    }
    toggleLoadFrom1cRowSelection(event) {
        const checkbox = event.currentTarget;
        const rowIndex = Number($(checkbox).attr('data-row-index'));
        if (Number.isNaN(rowIndex)) {
            return;
        }
        if (checkbox.checked) {
            this.selectedLoadFrom1cRowIndexes.add(rowIndex);
        }
        else {
            this.selectedLoadFrom1cRowIndexes.delete(rowIndex);
        }
        $(checkbox).closest('.load-1c-grid__row').toggleClass('is-selected', checkbox.checked);
        this.updateLoadFrom1cSummary();
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
    savePdi() {
        var _a, _b;
        if (Object.keys(this.saveMassive).length === 0)
            return;
        for (const id of Object.keys(this.saveMassive)) {
            const cacheData = this.localCache.get(id);
            if (!cacheData)
                return;
            const changes = this.saveMassive[id] || {};
            const qtyValue = (_a = changes.qty) !== null && _a !== void 0 ? _a : cacheData.qty;
            const qtyCompletedValue = (_b = changes.qtyCompleted) !== null && _b !== void 0 ? _b : cacheData.qtyCompleted;
            const validatedFields = this.validateIntegerFields([
                { key: 'qty', value: qtyValue, min: 1, label: 'Количество' },
                {
                    key: 'qtyCompleted',
                    value: qtyCompletedValue,
                    min: 0,
                    label: 'Выполненное количество',
                    defaultValue: 0
                }
            ]);
            if (!validatedFields)
                return;
            this.saveMassive[id] = Object.assign(Object.assign({}, changes), { qty: validatedFields.qty, qtyCompleted: validatedFields.qtyCompleted });
        }
        const itemsArray = Object.keys(this.saveMassive).map(id => {
            const cacheData = this.localCache.get(id);
            return { id: id, version: cacheData === null || cacheData === void 0 ? void 0 : cacheData.version, changes: this.saveMassive[id] };
        });
        this.save('/api/parts-directory/update', ...itemsArray).then(() => {
            this.disableEditMode(['dateCompletion'], []);
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
    openReadinessDialog(event) {
        const $row = $(event.currentTarget).closest('.table-row');
        const rowId = $row.attr('id');
        if (!rowId)
            return;
        this.selectedReadinessRowId = rowId;
        // Получаем данные из кэша для отображения текущих операций
        const cacheData = this.localCache.get(rowId);
        const operations = (cacheData === null || cacheData === void 0 ? void 0 : cacheData.operation) || [];
        // Отмечаем чекбоксы на основе существующих операций
        const dialog = $('#readiness-dialog');
        dialog.find('#operationThermal').prop('checked', operations.indexOf('thermal') !== -1);
        dialog.find('#operationLocksmith').prop('checked', operations.indexOf('locksmith') !== -1);
        this.dialog.open('readiness-dialog');
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
    new PdItem();
});

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
        this.createSelectedEmployeeIds = [];
        this.allTeamsCache = [];
        this.allEmployeesCache = [];
        this.selectedReadinessRowId = null;
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
        this.workWithModal = (event) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const modalDiv = $(event.currentTarget);
            const fieldName = modalDiv.attr('data-field') || modalDiv.attr('data-name');
            const currentId = (_a = modalDiv.closest('.table-row')) === null || _a === void 0 ? void 0 : _a.attr('id');
            if (fieldName === 'employee') {
                yield this.openSelectionDialog('employee', 'employeeDialog', modalDiv, currentId, undefined, [{ key: 'name', label: 'Имя', width: '250' }]);
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
            searchInput.off('input').on('input', (e) => {
                const input = e.currentTarget;
                const searchText = input.value.toLowerCase().trim();
                const filtered = teamsList.filter((t) => t.name.toLowerCase().includes(searchText));
                renderRows(filtered);
            });
            this.dialog.open('teamDialog');
            rowContainer.off('click').on('click', '.dialog-content-rows-row', function (e) {
                const target = e.currentTarget;
                selectedTeamId = $(target).data('id');
                dialog.find('.dialog-content-rows-row').removeClass('selected');
                $(target).addClass('selected');
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
                this.disableEditMode();
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
            try {
                this.createConfirmationDialog("Подтвердите удаление мероприятия").then((confirmed) => {
                    // @ts-ignore
                    if (confirmed) {
                        this.deleteEntity(`/api/parts-directory/delete/${id}`).then(() => {
                            this.createNotification('Запись успешно удалена', NotificationType.SUCCESS);
                            this.deleteRow(id);
                            this.selectedRows.delete(id);
                        });
                    }
                });
            }
            catch (_a) {
                this.createNotification('Ошибка при удалении записи', NotificationType.ERROR);
            }
        });
        // ========== TEAM MANAGEMENT ==========
        this.openTeamEditDialog = () => __awaiter(this, void 0, void 0, function* () {
            const dialog = $('#teamEditDialog');
            // Загружаем данные
            const teamsResponse = yield this.requestToApi('/api/team/get-page', 'GET');
            this.allTeamsCache = teamsResponse.data || [];
            const employeesResponse = yield this.cache.get("employee");
            this.allEmployeesCache = employeesResponse.data || [];
            // Сбрасываем состояние
            this.selectedTeamForEdit = null;
            this.selectedEmployeeIds = [];
            this.createSelectedEmployeeIds = [];
            // Рендерим список бригад
            this.renderTeamList();
            // Скрываем кнопки редактирования/удаления по умолчанию
            dialog.find('#deleteTeam').hide();
            dialog.find('#saveTeam').hide();
            dialog.find('#createTeam').show();
            // Активируем первую вкладку
            this.switchTeamTab('team-list');
            // Обработчик поиска бригад
            dialog.find('#teamSearchInput').off('input').on('input', () => {
                const searchText = dialog.find('#teamSearchInput').val().toString().toLowerCase().trim();
                this.renderTeamList(searchText);
            });
            // Обработчик переключения вкладок
            dialog.find('.team-tab').off('click').on('click', (e) => {
                const tab = $(e.currentTarget).data('tab');
                this.switchTeamTab(tab);
            });
            // Обработчик выбора бригады из списка
            dialog.find('#teamListRows').off('click').on('click', '.dialog-content-rows-row', (e) => {
                const $row = $(e.currentTarget);
                const teamId = $row.data('id');
                const team = this.allTeamsCache.find((t) => t.id === teamId);
                if (!team)
                    return;
                this.selectedTeamForEdit = team;
                dialog.find('#teamListRows .dialog-content-rows-row').removeClass('selected');
                $row.addClass('selected');
                // Показываем кнопки редактирования и удаления
                dialog.find('#deleteTeam').show();
                dialog.find('#saveTeam').show();
            });
            // Двойной клик - переход к редактированию
            dialog.find('#teamListRows').off('dblclick').on('dblclick', '.dialog-content-rows-row', (e) => {
                const $row = $(e.currentTarget);
                const teamId = $row.data('id');
                const team = this.allTeamsCache.find((t) => t.id === teamId);
                if (!team)
                    return;
                this.selectedTeamForEdit = team;
                this.switchTeamTab('team-edit');
                this.populateTeamEditForm(team);
            });
            // Обработчик кнопки "Сохранить"
            dialog.find('#saveTeam').off('click').on('click', () => this.saveTeamHandler());
            // Обработчик кнопки "Удалить"
            dialog.find('#deleteTeam').off('click').on('click', () => this.deleteTeamHandler());
            // Обработчик кнопки "Создать"
            dialog.find('#createTeam').off('click').on('click', () => this.createTeamHandler());
            // Поиск сотрудников в режиме редактирования
            dialog.find('#employeeSearchInput').off('input').on('input', () => {
                const searchText = dialog.find('#employeeSearchInput').val().toString().toLowerCase().trim();
                this.renderEmployeeListForEdit(searchText);
            });
            // Поиск сотрудников в режиме создания
            dialog.find('#createEmployeeSearchInput').off('input').on('input', () => {
                const searchText = dialog.find('#createEmployeeSearchInput').val().toString().toLowerCase().trim();
                this.renderEmployeeListForCreate(searchText);
            });
            // Select all employees (edit)
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
            // Individual employee checkboxes (edit)
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
            // Select all employees (create)
            dialog.find('#createSelectAllEmployees').off('change').on('change', (e) => {
                const target = e.currentTarget;
                const isChecked = target.checked;
                dialog.find('#createEmployeeRows .employee-checkbox').each((_, el) => {
                    const checkbox = el;
                    const empId = parseInt($(checkbox).data('id'));
                    checkbox.checked = isChecked;
                    if (isChecked) {
                        if (!this.createSelectedEmployeeIds.includes(empId)) {
                            this.createSelectedEmployeeIds.push(empId);
                        }
                    }
                    else {
                        const idx = this.createSelectedEmployeeIds.indexOf(empId);
                        if (idx > -1)
                            this.createSelectedEmployeeIds.splice(idx, 1);
                    }
                });
            });
            // Individual employee checkboxes (create)
            dialog.find('#createEmployeeRows').off('change', '.employee-checkbox').on('change', '.employee-checkbox', (e) => {
                const checkbox = e.currentTarget;
                const $checkbox = $(checkbox);
                const empId = Number($checkbox.data('id'));
                if (checkbox.checked) {
                    if (!this.createSelectedEmployeeIds.includes(empId)) {
                        this.createSelectedEmployeeIds.push(empId);
                    }
                }
                else {
                    const idx = this.createSelectedEmployeeIds.indexOf(empId);
                    if (idx > -1)
                        this.createSelectedEmployeeIds.splice(idx, 1);
                }
                const allCheckboxes = dialog.find('#createEmployeeRows .employee-checkbox');
                const checkedBoxes = dialog.find('#createEmployeeRows .employee-checkbox:checked');
                dialog.find('#createSelectAllEmployees').prop('checked', allCheckboxes.length === checkedBoxes.length && allCheckboxes.length > 0);
            });
            this.dialog.open('teamEditDialog');
        });
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
                    <div class="content-row-column col-50">${this.escapeHtml(team.name)}</div>
                    <div class="content-row-column col-50">${this.escapeHtml(employeesText)}</div>
                </div>
            `);
            });
        };
        this.renderEmployeeListForEdit = (searchText = '') => {
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
                    <div class="content-row-column col-250">
                        <input type="checkbox" class="employee-checkbox" data-id="${emp.id}" ${isChecked}>
                    </div>
                    <div class="content-row-column col-250">${this.escapeHtml(emp.name)}</div>
                    <div class="content-row-column col-250">${this.escapeHtml(subDivisionName)}</div>
                </div>
            `);
            });
        };
        this.renderEmployeeListForCreate = (searchText = '') => {
            const dialog = $('#teamEditDialog');
            const rowContainer = dialog.find('#createEmployeeRows');
            rowContainer.empty();
            const filtered = this.allEmployeesCache.filter((e) => e.name.toLowerCase().includes(searchText.toLowerCase()));
            filtered.forEach((emp) => {
                var _a;
                const subDivisionName = ((_a = emp.subDivision) === null || _a === void 0 ? void 0 : _a.name) || '';
                const isChecked = this.createSelectedEmployeeIds.includes(emp.id) ? 'checked' : '';
                rowContainer.append(`
                <div class="dialog-content-rows-row" data-id="${emp.id}">
                    <div class="content-row-column col-250">
                        <input type="checkbox" class="employee-checkbox" data-id="${emp.id}" ${isChecked}>
                    </div>
                    <div class="content-row-column col-250">${this.escapeHtml(emp.name)}</div>
                    <div class="content-row-column col-250">${this.escapeHtml(subDivisionName)}</div>
                </div>
            `);
            });
        };
        this.switchTeamTab = (tabName) => {
            const dialog = $('#teamEditDialog');
            // Обновляем кнопки вкладок
            dialog.find('.team-tab').removeClass('active');
            dialog.find(`.team-tab[data-tab="${tabName}"]`).addClass('active');
            // Обновляем контент вкладок
            dialog.find('.team-tab-content').removeClass('active');
            dialog.find(`.team-tab-content[data-tab-content="${tabName}"]`).addClass('active');
            // Действия при переключении
            if (tabName === 'team-list') {
                dialog.find('#deleteTeam').hide();
                dialog.find('#saveTeam').hide();
                dialog.find('#createTeam').show();
                this.renderTeamList();
            }
            else if (tabName === 'team-edit') {
                if (this.selectedTeamForEdit) {
                    dialog.find('#deleteTeam').show();
                    dialog.find('#saveTeam').show();
                    dialog.find('#createTeam').hide();
                    this.populateTeamEditForm(this.selectedTeamForEdit);
                }
            }
            else if (tabName === 'team-create') {
                dialog.find('#deleteTeam').hide();
                dialog.find('#saveTeam').hide();
                dialog.find('#createTeam').show();
                this.clearTeamCreateForm();
            }
        };
        this.populateTeamEditForm = (team) => {
            var _a;
            const dialog = $('#teamEditDialog');
            dialog.find('#editTeamName').val(team.name);
            // Заполняем выбранных сотрудников
            this.selectedEmployeeIds = ((_a = team.employees) === null || _a === void 0 ? void 0 : _a.map((e) => e.id)) || [];
            this.renderEmployeeListForEdit();
            // Обновляем select all
            const allCheckboxes = dialog.find('#employeeRows .employee-checkbox');
            const checkedBoxes = dialog.find('#employeeRows .employee-checkbox:checked');
            dialog.find('#selectAllEmployees').prop('checked', allCheckboxes.length === checkedBoxes.length && allCheckboxes.length > 0);
        };
        this.clearTeamCreateForm = () => {
            const dialog = $('#teamEditDialog');
            dialog.find('#createTeamName').val('');
            this.createSelectedEmployeeIds = [];
            this.renderEmployeeListForCreate();
            dialog.find('#createSelectAllEmployees').prop('checked', false);
        };
        this.saveTeamHandler = () => __awaiter(this, void 0, void 0, function* () {
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
                // Обновляем кэш
                const idx = this.allTeamsCache.findIndex((t) => t.id === updatedTeam.id);
                if (idx !== -1) {
                    this.allTeamsCache[idx] = updatedTeam;
                }
                // Обновляем localCache для PDI записей с этой бригадой
                this.localCache.forEach((pdi, key) => {
                    var _a;
                    if (((_a = pdi.team) === null || _a === void 0 ? void 0 : _a.id) === updatedTeam.id) {
                        pdi.team = updatedTeam;
                        // Обновляем отображение в таблице
                        const $row = $(`.table-row[id="${key}"]`);
                        $row.find('[data-name="team"]').text(updatedTeam.name);
                    }
                });
                this.createNotification('Бригада успешно обновлена', NotificationType.SUCCESS);
                this.renderTeamList();
                this.switchTeamTab('team-list');
            }
            catch (_a) {
                this.createNotification('Ошибка при сохранении бригады', NotificationType.ERROR);
            }
            finally {
                unlock();
            }
        });
        this.createTeamHandler = () => __awaiter(this, void 0, void 0, function* () {
            const dialog = $('#teamEditDialog');
            const name = dialog.find('#createTeamName').val().toString().trim();
            if (!name) {
                this.createNotification('Введите название бригады', NotificationType.WARNING);
                return;
            }
            const dto = {
                name,
                employeeIds: this.createSelectedEmployeeIds
            };
            console.log('=== Creating Team ===');
            console.log('createSelectedEmployeeIds:', this.createSelectedEmployeeIds);
            console.log('DTO being sent:', dto);
            const unlock = this.lockScreen('Создание бригады...');
            try {
                const newTeam = yield this.requestToApi('/api/team/create', 'POST', dto);
                // Добавляем в кэш
                this.allTeamsCache.push(newTeam);
                this.createNotification('Бригада успешно создана', NotificationType.SUCCESS);
                this.renderTeamList();
                this.switchTeamTab('team-list');
            }
            catch (_a) {
                this.createNotification('Ошибка при создании бригады', NotificationType.ERROR);
            }
            finally {
                unlock();
            }
        });
        this.deleteTeamHandler = () => __awaiter(this, void 0, void 0, function* () {
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
                            const idx = this.allTeamsCache.findIndex((t) => t.id === this.selectedTeamForEdit.id);
                            if (idx !== -1) {
                                this.allTeamsCache.splice(idx, 1);
                            }
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
                            this.renderTeamList();
                        });
                    }
                });
            }
            catch (_a) {
                this.createNotification('Ошибка при удалении бригады', NotificationType.ERROR);
            }
            finally {
                unlock();
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
                $('#edit-button').addClass('active');
            }
            else {
                this.disableEditMode();
                if (!this.editMode)
                    $('#edit-button').removeClass('active');
            }
        }, true);
        this.createHandler('click', '#save-button', () => this.savePdi(), true);
        this.createHandler('click', '#print-button', this.print = this.print.bind(this), true);
        this.createHandler('click', '#teams-button', () => this.openTeamEditDialog(), true);
        this.createHandler('input', '[data-name]', this.inputChanges.bind(this), true);
        this.createHandler('click', '.ready-checkbox', this.openReadinessDialog.bind(this), true);
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
//# sourceMappingURL=pditem.js.map
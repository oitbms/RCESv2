import { Base } from './base/base';
import { NotificationType, type ErrorResponse } from './core/types';

type EmployeeUser = {
    id: number;
    version: number;
    name: string;
    subDivision: { id: number; code: string; name: string } | null;
    role: string;
    active: boolean;
    chatId: number | null;
    notificationApp: string | null;
};

type PageResponse = {
    data: EmployeeUser[];
    count: number;
};

const BACKEND_FIELD_TO_ELEMENT: Record<string, string> = {
    name: 'userName',
    password: 'userPassword',
    role: 'userRole',
    subDivisionId: 'userSubdivision',
    chatId: 'userChatId',
    notificationApp: 'userNotificationApp',
    active: 'userActive'
};

const EDITABLE_ELEMENT_IDS = [
    'userName',
    'userPassword',
    'userPasswordConfirm',
    'userSubdivision',
    'userRole',
    'userNotificationApp',
    'userActive',
    'userChatId'
];

class AdminUsers extends Base {

    private page = 1;
    private readonly size = 15;
    private totalCount = 0;
    private sortField = 'name';
    private sortDirection: 'asc' | 'desc' = 'asc';
    private editingId: number | null = null;
    private saving = false;
    private loading = false;
    private loadToken = 0;
    private formBaseline: string | null = null;
    private closePromptPending = false;

    constructor() {
        super($('#usersBody'), Infinity, Infinity, () => {
            this.updateSortIndicators();
            this.load();
        });

        this.createHandler('click', '#create-user-btn', () => this.openCreateDialog(), true);
        this.createHandler('click', '#search-button', () => {
            this.page = 1;
            this.load();
        }, true);
        this.createHandler('keydown', '#user-search', (event: Event) => {
            if ((event as KeyboardEvent).key === 'Enter') {
                event.preventDefault();
                this.page = 1;
                this.load();
            }
        }, true);
        this.createHandler('change', '#role-filter', () => this.applyFiltersAndReload(), true);
        this.createHandler('change', '#subdivision-filter', () => this.applyFiltersAndReload(), true);
        this.createHandler('change', '#active-filter', () => this.applyFiltersAndReload(), true);
        this.createHandler('click', '#reset-filters', () => this.resetFilters(), true);
        this.createHandler('click', '.table-header-cell.sortable', (event: Event) => this.changeSort(event), true);
        this.createHandler('click', '.edit-user', (event: Event) => this.openEditDialog(event));
        this.createHandler('click', '.delete-user', (event: Event) => this.deleteUser(event));
        this.createHandler('click', '.page-btn', (event: Event) => this.goToPage(event), true);

        this.createHandler('submit', '#userForm', (event: Event) => this.submitUserForm(event));
        this.createHandler('click', '.user-dialog-close, .user-dialog-cancel', () => this.requestCloseUserDialog());
        this.createHandler('keydown', '#userDialog', (event: Event) => this.trapFocus(event as KeyboardEvent));
    }

    public createRow(user: EmployeeUser): any {
        const subDivisionName = user.subDivision?.name ?? '—';
        const statusClass = user.active ? 'status-active' : 'status-inactive';
        const statusText = user.active ? 'Активен' : 'Отключён';
        const row = `
            <div class="table-row" id="${user.id}" data-index="${user.id}">
                <div class="table-cell">${user.id}</div>
                <div class="table-cell">${this.escapeHtml(user.name)}</div>
                <div class="table-cell">${this.escapeHtml(subDivisionName)}</div>
                <div class="table-cell">${this.escapeHtml(user.role ?? '')}</div>
                <div class="table-cell">${this.escapeHtml(user.notificationApp ?? '—')}</div>
                <div class="table-cell">${user.chatId ?? '—'}</div>
                <div class="table-cell"><span class="status-badge ${statusClass}">${statusText}</span></div>
                <div class="table-cell">
                    <button type="button" class="btn-action edit-user" data-id="${user.id}" title="Редактировать">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button type="button" class="btn-action delete-user" data-id="${user.id}" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`;
        return $(row);
    }

    public onScroll(): void {
    }

    private applyFiltersAndReload(): void {
        this.page = 1;
        this.load();
    }

    private async load(): Promise<void> {
        const params = new URLSearchParams();
        const query = ($('#user-search').val() as string ?? '').trim();
        const role = $('#role-filter').val() as string ?? '';
        const active = $('#active-filter').val() as string ?? '';
        const subDivisionId = $('#subdivision-filter').val() as string ?? '';

        if (query) params.set('query', query);
        if (role) params.set('role', role);
        if (active !== '') params.set('active', active);
        if (subDivisionId) params.set('subDivisionId', subDivisionId);
        params.set('page', String(this.page));
        params.set('size', String(this.size));
        params.set('sort', this.sortField);
        params.set('direction', this.sortDirection);

        const unlock = this.lockScreen('Загрузка пользователей...');
        try {
            const response = await this.requestToApi(`/api/admin/users?${params.toString()}`, 'GET') as PageResponse;
            this.totalCount = response.count ?? 0;
            this.renderRows(response.data ?? []);
            this.renderPagination();
        } catch (error) {
            console.error(error);
        } finally {
            unlock();
        }
    }

    private renderRows(users: EmployeeUser[]): void {
        this.localCache.clear();
        this.rowContainer.empty();

        if (!users.length) {
            this.rowContainer.append('<div class="empty-state">Пользователи не найдены</div>');
            return;
        }

        users.forEach(user => {
            this.localCache.set(user.id, user);
            this.rowContainer.append(this.createRow(user));
        });
    }

    private renderPagination(): void {
        const totalPages = Math.max(1, Math.ceil(this.totalCount / this.size));
        const $pagination = $('#pagination');
        $pagination.empty();

        const from = this.totalCount === 0 ? 0 : (this.page - 1) * this.size + 1;
        const to = Math.min(this.page * this.size, this.totalCount);
        $('#page-info').text(`Показано ${from}-${to} из ${this.totalCount}`);

        const addButton = (label: string, targetPage: number, disabled: boolean, active = false) => {
            const $button = $(`<button type="button" class="page-btn${active ? ' active' : ''}">${label}</button>`);
            if (disabled) {
                $button.prop('disabled', true);
            } else {
                $button.attr('data-page', targetPage);
            }
            $pagination.append($button);
        };

        addButton('«', this.page - 1, this.page <= 1);

        const windowSize = 5;
        let start = Math.max(1, this.page - Math.floor(windowSize / 2));
        const end = Math.min(totalPages, start + windowSize - 1);
        start = Math.max(1, end - windowSize + 1);

        for (let i = start; i <= end; i++) {
            addButton(String(i), i, false, i === this.page);
        }

        addButton('»', this.page + 1, this.page >= totalPages);
    }

    private goToPage(event: Event): void {
        const targetPage = Number($(event.currentTarget).attr('data-page'));
        if (!targetPage || targetPage === this.page) return;
        this.page = targetPage;
        this.load();
    }

    private changeSort(event: Event): void {
        const sort = $(event.currentTarget).attr('data-sort');
        if (!sort) return;

        if (this.sortField === sort) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = sort;
            this.sortDirection = 'asc';
        }
        this.page = 1;
        this.updateSortIndicators();
        this.load();
    }

    private updateSortIndicators(): void {
        $('.table-header-cell.sortable .sort-arrow').remove();
        $('.table-header-cell.sortable').each((_, cell) => {
            const $cell = $(cell);
            if ($cell.attr('data-sort') === this.sortField) {
                $cell.append(`<span class="sort-arrow">${this.sortDirection === 'asc' ? '▲' : '▼'}</span>`);
            }
        });
    }

    private resetFilters(): void {
        $('#user-search').val('');
        $('#role-filter').val('');
        $('#subdivision-filter').val('');
        $('#active-filter').val('');
        this.page = 1;
        this.load();
    }

    // ---------------------------------------------------------------- dialog

    private setMode(isCreate: boolean): void {
        $('#userDialogTitle').text(isCreate ? 'Создание пользователя' : 'Редактирование пользователя');
        $('#userSaveBtn .btn-label').text(isCreate ? 'Создать' : 'Сохранить');
        $('#userPasswordRequired').prop('hidden', !isCreate);
        $('#userPasswordConfirmRequired').prop('hidden', !isCreate);
        $('#userPasswordHint').text(isCreate ? 'Минимум 6 символов' : 'Оставьте пустым, чтобы не менять пароль');
        $('#userChatIdRequired').prop('hidden', !isCreate);
        $('#userChatIdHint').text(isCreate ? '' : 'Оставьте пустым, чтобы не менять');
    }

    private openCreateDialog(): void {
        this.loadToken++;
        this.editingId = null;
        this.setMode(true);
        this.dialog.open('userDialog', { onBeforeClose: () => this.confirmDiscardIfDirty() });

        $('#userRole').val('USER');
        $('#userNotificationApp').val('TELEGRAM');
        $('#userActive').val('true');

        this.clearFieldErrors();
        this.hideFormError();
        this.setLoading(false);
        this.setSaving(false);
        this.formBaseline = this.serializeForm();
        this.focusFirstField();
    }

    private async openEditDialog(event: Event): Promise<void> {
        const id = Number($(event.currentTarget).attr('data-id'));
        if (!Number.isFinite(id)) return;

        const token = ++this.loadToken;
        this.editingId = id;
        this.setMode(false);
        this.dialog.open('userDialog', { onBeforeClose: () => this.confirmDiscardIfDirty() });

        this.clearFieldErrors();
        this.hideFormError();
        this.setSaving(false);
        this.setLoading(true);
        this.formBaseline = this.serializeForm();

        try {
            const user = await this.requestToApi(`/api/admin/users/${id}`, 'GET') as EmployeeUser;
            if (token !== this.loadToken || this.editingId !== id) return;
            this.populateForm(user);
            this.formBaseline = this.serializeForm();
        } catch (error) {
            if (token !== this.loadToken) return;
            console.error(error);
            this.loadToken++;
            this.dialog.close('userDialog');
            return;
        } finally {
            if (token === this.loadToken) {
                this.setLoading(false);
            }
        }
        this.focusFirstField();
    }

    private populateForm(user: EmployeeUser): void {
        $('#userId').val(user.id);
        $('#userVersion').val(user.version);
        $('#userName').val(user.name ?? '');
        $('#userPassword').val('');
        $('#userPasswordConfirm').val('');
        $('#userSubdivision').val(user.subDivision ? String(user.subDivision.id) : '');
        $('#userRole').val(user.role ?? 'USER');
        $('#userNotificationApp').val(user.notificationApp ?? 'TELEGRAM');
        $('#userActive').val(user.active ? 'true' : 'false');
        $('#userChatId').val(user.chatId ?? '');
    }

    private async requestCloseUserDialog(): Promise<void> {
        if (await this.confirmDiscardIfDirty()) {
            this.dialog.close('userDialog');
        }
    }

    private confirmDiscardIfDirty = async (): Promise<boolean> => {
        if (this.saving || this.loading || this.closePromptPending) {
            return false;
        }
        if (!this.isDirty()) {
            this.loadToken++;
            return true;
        }
        this.closePromptPending = true;
        try {
            const confirmed = await this.createConfirmationDialog(
                'Внесённые изменения не сохранены. Закрыть окно без сохранения?'
            ) as boolean;
            if (confirmed) {
                this.loadToken++;
            }
            return confirmed;
        } finally {
            this.closePromptPending = false;
        }
    };

    private isDirty(): boolean {
        return this.formBaseline !== null && this.serializeForm() !== this.formBaseline;
    }

    private serializeForm(): string {
        return JSON.stringify(EDITABLE_ELEMENT_IDS.map(id => ($(`#${id}`).val() ?? '').toString()));
    }

    private focusFirstField(): void {
        const input = document.getElementById('userName') as HTMLInputElement | null;
        input?.focus();
    }

    private trapFocus(event: KeyboardEvent): void {
        if (event.key !== 'Tab') return;
        const dialogEl = document.getElementById('userDialog') as HTMLDialogElement | null;
        if (!dialogEl || !this.dialog.isOpen('userDialog')) return;

        const $focusable = $(dialogEl)
            .find('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
            .filter(':visible')
            .filter((_, el) => (el as HTMLElement).tabIndex !== -1);
        if (!$focusable.length) return;

        const first = $focusable.get(0) as HTMLElement;
        const last = $focusable.get($focusable.length - 1) as HTMLElement;
        const active = document.activeElement as HTMLElement | null;

        if (event.shiftKey) {
            if (active === first || !active || !$.contains(dialogEl, active)) {
                event.preventDefault();
                last.focus();
            }
        } else if (active === last) {
            event.preventDefault();
            first.focus();
        }
    }

    private setLoading(loading: boolean): void {
        this.loading = loading;
        $('#userDialogLoading').prop('hidden', !loading);
        $('#userDialog').toggleClass('is-loading', loading);
        this.applyBusyState();
    }

    private setSaving(saving: boolean): void {
        this.saving = saving;
        $('#userSaveBtn').toggleClass('saving', saving);
        this.applyBusyState();
    }

    private applyBusyState(): void {
        const busy = this.saving || this.loading;
        const $form = $('#userForm');
        $form.find('input, select, textarea').prop('disabled', busy);
        $form.find('button').prop('disabled', busy);
    }

    private resetErrors(): void {
        this.clearFieldErrors();
        this.hideFormError();
    }

    private clearFieldErrors(): void {
        EDITABLE_ELEMENT_IDS.forEach(id => this.clearFieldError(id));
    }

    private clearFieldError(elementId: string): void {
        $(`#${elementId}Error`).text('');
        $(`#${elementId}`).removeClass('is-invalid').removeAttr('aria-invalid');
    }

    private setFieldError(elementId: string, message: string): void {
        $(`#${elementId}Error`).text(message);
        $(`#${elementId}`).addClass('is-invalid').attr('aria-invalid', 'true');
    }

    private showFormError(message: string): void {
        $('#userFormError').text(message).prop('hidden', false);
    }

    private hideFormError(): void {
        $('#userFormError').text('').prop('hidden', true);
    }

    private validateForm(): boolean {
        this.resetErrors();

        const isCreate = this.editingId === null;
        const name = ($('#userName').val() as string ?? '').trim();
        const password = $('#userPassword').val() as string ?? '';
        const passwordConfirm = $('#userPasswordConfirm').val() as string ?? '';
        const subDivision = ($('#userSubdivision').val() as string ?? '');
        const chatIdRaw = ($('#userChatId').val() as string ?? '').trim();

        let firstInvalid: string | null = null;
        const fail = (elementId: string, message: string) => {
            this.setFieldError(elementId, message);
            if (!firstInvalid) firstInvalid = elementId;
        };

        if (!name) {
            fail('userName', 'Укажите имя пользователя');
        } else if (name.length < 4) {
            fail('userName', 'Имя должно содержать минимум 4 символа');
        } else if (name.length > 100) {
            fail('userName', 'Имя должно содержать не более 100 символов');
        }

        if (isCreate) {
            if (!password) {
                fail('userPassword', 'Укажите пароль');
            } else if (password.length < 6) {
                fail('userPassword', 'Пароль должен содержать минимум 6 символов');
            }
            if (!passwordConfirm) {
                fail('userPasswordConfirm', 'Повторите пароль');
            } else if (password && passwordConfirm !== password) {
                fail('userPasswordConfirm', 'Пароли не совпадают');
            }
        } else if (password || passwordConfirm) {
            if (password.length < 6) {
                fail('userPassword', 'Пароль должен содержать минимум 6 символов');
            }
            if (!passwordConfirm) {
                fail('userPasswordConfirm', 'Повторите пароль');
            } else if (passwordConfirm !== password) {
                fail('userPasswordConfirm', 'Пароли не совпадают');
            }
        }

        if (!subDivision) {
            fail('userSubdivision', 'Выберите подразделение');
        }

        if (isCreate) {
            if (chatIdRaw === '') {
                fail('userChatId', 'Укажите ChatID');
            } else if (!/^-?\d+$/.test(chatIdRaw)) {
                fail('userChatId', 'ChatID должен быть целым числом');
            }
        } else if (chatIdRaw !== '' && !/^-?\d+$/.test(chatIdRaw)) {
            fail('userChatId', 'ChatID должен быть целым числом');
        }

        if (firstInvalid) {
            this.showFormError('Проверьте правильность заполнения полей');
            (document.getElementById(firstInvalid) as HTMLElement | null)?.focus();
            return false;
        }
        return true;
    }

    private async submitUserForm(event: Event): Promise<void> {
        event.preventDefault();

        if (this.saving || this.loading) return;
        if (!this.validateForm()) return;

        const isCreate = this.editingId === null;
        const name = ($('#userName').val() as string ?? '').trim();
        const password = $('#userPassword').val() as string ?? '';
        const role = $('#userRole').val() as string ?? '';
        const notificationApp = $('#userNotificationApp').val() as string ?? '';
        const active = ($('#userActive').val() as string) === 'true';
        const subDivisionId = Number($('#userSubdivision').val());
        const chatIdRaw = ($('#userChatId').val() as string ?? '').trim();
        const chatId = chatIdRaw === '' ? null : Number(chatIdRaw);

        const payload: Record<string, unknown> = { name, role, subDivisionId, notificationApp, active };
        if (isCreate) {
            payload.password = password;
            payload.chatId = chatId;
        } else {
            if (password) payload.password = password;
            if (chatId !== null) payload.chatId = chatId;
        }

        this.setSaving(true);
        try {
            if (isCreate) {
                await this.createEntity('/api/admin/users', payload);
                this.createNotification('Пользователь создан', NotificationType.SUCCESS);
            } else {
                const version = Number($('#userVersion').val());
                await this.requestToApi(`/api/admin/users/${this.editingId}?version=${version}`, 'PATCH', payload);
                this.createNotification('Пользователь обновлён', NotificationType.SUCCESS);
            }
            this.loadToken++;
            this.formBaseline = this.serializeForm();
            this.dialog.close('userDialog');
            this.page = 1;
            await this.load();
        } catch (error) {
            this.applyServerErrors(error as JQuery.jqXHR);
        } finally {
            this.setSaving(false);
        }
    }

    private applyServerErrors(xhr: JQuery.jqXHR): void {
        const response = xhr?.responseJSON as ErrorResponse | undefined;
        if (!response) {
            this.showFormError('Не удалось сохранить пользователя. Проверьте соединение и повторите попытку.');
            return;
        }

        const fieldErrors = response.fieldErrors;
        if (fieldErrors && Object.keys(fieldErrors).length) {
            let hasUnmapped = false;
            Object.keys(fieldErrors).forEach(field => {
                const elementId = BACKEND_FIELD_TO_ELEMENT[field];
                if (elementId) {
                    this.setFieldError(elementId, fieldErrors[field]);
                } else {
                    hasUnmapped = true;
                }
            });
            const firstEl = Object.keys(fieldErrors)
                .map(field => BACKEND_FIELD_TO_ELEMENT[field])
                .find(Boolean);
            (firstEl ? document.getElementById(firstEl) : null)?.focus();
            if (hasUnmapped) {
                this.showFormError(response.message);
            }
            return;
        }

        this.showFormError(response.message ?? 'Не удалось сохранить пользователя');
    }

    private async deleteUser(event: Event): Promise<void> {
        if (this.saving) return;
        const id = Number($(event.currentTarget).attr('data-id'));
        const user = this.localCache.get(id) as unknown as EmployeeUser | undefined;
        const name = user?.name ?? '';

        const confirmed = await this.createConfirmationDialog('Удалить пользователя «{name}»?', {name}) as boolean;
        if (!confirmed) return;

        try {
            await this.deleteEntity(`/api/admin/users/${id}`);
            this.createNotification('Пользователь удалён', NotificationType.SUCCESS);
            await this.load();
        } catch (error) {
            console.error(error);
        }
    }
}

$(document).ready(() => {
    new AdminUsers();
});

// TEAM — Константы

const TEAM_API = {
    GET_PAGE: '/api/team/get-page',
    UPDATE: '/api/team/update',
    CREATE: '/api/team/create',
    DELETE: '/api/team/delete',
};

const TEAM_DIALOGS = {
    CREATE: 'create-dialog',
    EMPLOYEE: 'employeeDialog',
};

const TEAM_FIELDS = {
    ID: 'id',
    NAME: 'name',
    EMPLOYEES: 'employees',
};

const TEAM_MESSAGES = {
    CREATED: 'Бригада создана',
    UPDATED: 'Бригада обновлена',
    DELETED: 'Бригада удалена',
    ERROR_CREATE: 'Ошибка при создании бригады',
    ERROR_UPDATE: 'Ошибка при обновлении бригады',
    NO_SELECTION: 'Не выбрано ни одной строки',
};

const TEAM_SELECTORS = {
    TABLE_BODY: '.table-body',
    SEARCH_INPUT: '#searchInput',
    EDIT_BUTTON: '#edit-button',
    SAVE_BUTTON: '#save-button',
    CREATE_BUTTON: '#create-button',
};

const TEAM_DATE_FIELDS: string[] = [];

// ============================================================
// PDITEM — Константы
// ============================================================

const PDITEM_API = {
    GET_PAGE: '/api/pditem/get-page',
    UPDATE: '/api/pditem/update',
    CREATE: '/api/pditem/create',
    DELETE: '/api/pditem/delete',
    PRINT: '/api/report/print/pditem',
} as const;

const PDITEM_DIALOGS = {
    CREATE: 'create-dialog',
    EMPLOYEE: 'employeeDialog',
} as const;

const PDITEM_FIELDS = {
    CUSTOMER_ORDER: 'customerOrder',
    NAME: 'name',
    THICKNESS: 'thickness',
    MEASUREMENTS: 'measurements',
    STEEL: 'steel',
    SCHEME: 'scheme',
    QTY: 'qty',
    QTY_COMPLETED: 'qtyCompleted',
    COMMENT: 'comment',
    MACHINE: 'machine',
    PROGRAM: 'program',
    EMPLOYEE: 'employee',
    STATUS: 'status',
    DATE_COMPLETION: 'dateCompletion',
} as const;

// Статусы PDItem
const PDITEM_STATUS = {
    NEW: 'NEW',
    WORK: 'WORK',
    REQUIRED: 'REQUIRED',
    COMPLETE: 'COMPLETE',
} as const;

const PDITEM_STATUS_LABELS: Record<string, string> = {
    NEW: 'Новый',
    WORK: 'В работе',
    REQUIRED: 'Требуется в строк',
    COMPLETE: 'Готов',
} as const;

const PDITEM_MESSAGES = {
    EDIT_MODE_ON: 'Выключите режим редактирования',
    SAVE_SUCCESS: 'Записи успешно сохранены',
    DELETE_SUCCESS: 'Запись успешно удалена',
    DELETE_ERROR: 'Ошибка при удалении записи',
    CREATE_SUCCESS: 'Запись успешно создана',
    CREATE_ERROR: 'Ошибка при создании записи',
    SELECT_EMPLOYEE: 'Выберите сотрудника из списка',
} as const;

const PDITEM_SELECTORS = {
    EDIT_BUTTON: '#edit-button',
    SAVE_BUTTON: '#save-button',
    PRINT_BUTTON: '#print-button',
    CREATE_BUTTON: '#create-button',
    CREATE_BTN: '#createBtn',
    SEARCH_INPUT: '#searchInput',
    CHANGE_EMPLOYEE: '#changeEmployee',
} as const;

// Поля дат
const PDITEM_DATE_FIELDS = ['dateCompletion'] as const;

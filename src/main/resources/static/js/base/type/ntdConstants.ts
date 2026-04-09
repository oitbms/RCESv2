// ============================================================
// NTD — Константы
// ============================================================

const NTD_API = {
    GET_PAGE: '/api/ntd/get-page-ntd',
    UPDATE: '/api/ntd/update',
    CREATE: '/api/ntd/create-ntd',
    DELETE: '/api/ntd/delete',
    CREATE_DOCUMENT: '/api/ntd/create-document',
    CALCULATE_REFERENCES: '/api/ntd/calculate-references',
    GET_REFERENCES: '/api/ntd/get-references',
    GET_ALL_REFERENCES: '/api/ntd/get-all-references',
    ADD_REFERENCE: '/api/ntd/add-reference',
    REMOVE_REFERENCE: '/api/ntd/remove-reference',
} as const;

const NTD_DIALOGS = {
    CREATE: 'create-dialog',
    DOCUMENT: 'documentDialog',
    REFERENCES: 'referencesDialog',
} as const;

const NTD_FIELDS = {
    NAME: 'name',
    TYPE: 'type',
    DATE_VERIFICATION: 'dateVerification',
    COMMENT: 'comment',
    DOCUMENT: 'document',
    REFERENCES: 'references',
} as const;

const NTD_MESSAGES = {
    SAVE_CHANGES: 'Сохраните изменения',
    DELETE_CONFIRM: (name: string) => `Подтвердите удаление документации: ${name}`,
    DELETE_SUCCESS: 'Документация успешно удалена',
    DELETE_ERROR: 'Возникла ошибка при удалении документации',
    FILE_DELETED: 'Файл успешно удален',
    FILE_RELOADED: 'Файл успешно перезагружен',
    FILE_ADD_ERROR: 'Произошла ошибка при перезагрузки документации',
    FILE_ADDED: 'Файлы добавлены',
    FILE_EXISTS: (name: string) => `Файл "${name}" уже существует`,
    FILE_NOT_ATTACHED: 'Файл не прикреплен',
    CREATE_ERROR: 'Ошибка при создании NTD',
    SELECT_FILE: 'Выберите файл',
} as const;

const NTD_SELECTORS = {
    EDIT_BUTTON: '#edit-button',
    SAVE_BUTTON: '#save-button',
    CREATE_BUTTON: '#create-button',
    CREATE_BTN: '#createBtn',
    SEARCH_INPUT: '#searchInput',
    FILE_INPUT: '#fileInput',
    RELOAD_FILE_INPUT: '#reloadFileInput',
    SEARCH_INPUT_REFERENCES: '#search-input',
} as const;

// Поля, которые являются датами
const NTD_DATE_FIELDS = ['dateVerification'] as const;

// Поля, которые не трогаем при редактировании
const NTD_PROTECTED_FIELDS = ['document', 'references'] as const;

// Поля, которые центрируются
const NTD_CENTER_FIELDS = ['dateVerification', 'type'] as const;

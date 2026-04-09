// ============================================================
// SPE — Константы
// ============================================================

// API endpoints
const SPE_API = {
    GET_PAGE: '/api/spe/get-page-spe',
    UPDATE: '/api/spe/update',
    CREATE_SPE: '/api/spe/create-spe',
    CREATE_SPE_FGIS: '/api/spe/create-spe-fgis',
    DELETE: '/api/spe/delete',
} as const;

const DOCUMENT_API = {
    GET: '/api/document/get-document',
    ADD_FILE: '/api/document/add-file-to-document-and-get',
    ADD_FILE_TO_EXISTING: '/api/document/add-file-to-document',
    DELETE_FILE: '/api/document/delete-file-from-document',
    DOWNLOAD: '/api/document/download-document-file',
    DOWNLOAD_ALL: '/api/document/download-all-document-file',
} as const;

const REPORT_API = {
    PRINT_SPE: '/api/report/print/spe',
    PRINT_SCHEDULE: '/api/report/print/spe-schedule',
    UNLOAD: '/api/report/print/spe-unload',
} as const;

// Статусы SPE
const SPE_STATUS = {
    NONE: 'NONE',
    WRITE_OFF: 'WRITE_OFF',
    VERIFICATION_REQUIRED: 'VERIFICATION_REQUIRED',
    EXPIRED: 'EXPIRED',
    AT_INSPECTION: 'AT_INSPECTION',
    CORRECTED: 'CORRECTED',
    REPAIR: 'REPAIR',
} as const;

// Отображаемые названия статусов
const SPE_STATUS_LABELS: Record<string, string> = {
    NONE: 'Новый',
    WRITE_OFF: 'Списан',
    VERIFICATION_REQUIRED: 'Требуется поверка',
    EXPIRED: 'Срок поверки истек',
    AT_INSPECTION: 'На поверке',
    CORRECTED: 'Исправен',
    REPAIR: 'На ремонте',
};

// Статусы для поля "Отметка"
const MARK_STATUSES = ['исправен', 'списан', 'на поверке', 'ремонт'] as const;

// Организации
const ORGANIZATIONS = [
    { value: 'organization1', label: 'Борисоглебский филиал ФБУ "Воронежский ЦСМ"' },
    { value: 'organization2', label: 'ФБУ "Воронежский ЦСМ"' },
    { value: 'organization3', label: 'ООО "СТАНДАРТ"' },
] as const;

// ID диалогов
const SPE_DIALOGS = {
    CREATE_FGIS: 'create-fgis-dialog',
    CREATE: 'create-dialog',
    EMPLOYEE: 'employeeDialog',
    SUBDIVISION: 'subDivisionDialog',
    DOCUMENT: 'documentDialog',
} as const;

// Имена полей (data-name)
const SPE_FIELDS = {
    MARK: 'mark',
    EMPLOYEE: 'employee',
    SUBDIVISION: 'subDivision',
    NAME: 'name',
    TYPE: 'type',
    OUT_NUMBER: 'outNumber',
    ACCURACY_CLASS: 'accuracyClass',
    LIMIT_MEASUREMENT: 'limitMeasurement',
    DATE_PREPARATION: 'datePreparation',
    DATE_VERIFICATION: 'dateVerification',
    CERTIFICATE_NUMBER: 'certificateNumber',
    PERIODICITY: 'periodicity',
} as const;

// Кэши
const CACHE_KEYS = {
    EMPLOYEE: 'employee',
    SUBDIVISION: 'subDivision',
    DOCUMENT: 'document',
} as const;

// Сообщения уведомлений
const SPE_MESSAGES = {
    NO_ROWS_SELECTED: 'Не выбрано ни одной строки',
    EDIT_MODE_ON: 'Выключите режим редактирования',
    SAVE_SUCCESS: 'Успешно обновлено',
    FILE_DELETED: 'Файл успешно удален',
    FILE_ADDED: 'Файлы добавлены',
    EQUIPMENT_DELETED: 'Оборудование успешно удалено',
    DELETE_ERROR: 'Возникла ошибка при удалении оборудования',
    CREATE_ERROR: 'Ошибка при создании SPE',
    LOAD_EMPLOYEES_ERROR: 'Ошибка при загрузке сотрудников',
    LOAD_SUBDIVISIONS_ERROR: 'Ошибка при загрузке подразделений',
    FGIS_NOT_FOUND: 'СИ не найдено в реестре ФГИС',
    SELECT_FROM_LIST: (field: string) => `Выберите ${field} из списка`,
    ORG_MISSING: (list: string[]) => `Оборудование без организации не попавшие в отчет: ${list.join(', ')}`,
} as const;

// Селекторы элементов
const SPE_SELECTORS = {
    EDIT_BUTTON: '#edit-button',
    SAVE_BUTTON: '#save-button',
    PRINT_BUTTON: '#print-button',
    UNLOAD_BUTTON: '#unload-button',
    CREATE_BUTTON: '#create-button',
    CREATE_FGIS_BUTTON: '#create-fgis-button',
    CREATE_BTN: '#createBtn',
    CREATE_FGIS_BTN: '#createFgisBtn',
    SEARCH_INPUT: '#searchInput',
    TOTAL_UNITS: '#total-units',
    WRITTEN_OFF: '#written-off',
    VERIFICATION_REQUIRED: '#verification-required',
    VERIFICATION_EXPIRED: '#verification-period-has-expired',
    AT_INSPECTION: '#at-inspection',
    AT_REPAIR: '#at-repair',
    NO_DOCUMENT: '#no-document',
    CHANGE_EMPLOYEE: '#changeEmployee',
    CHANGE_SUBDIVISION: '#changeSubDivision',
} as const;

// ============================================================
// INSPECTION — Константы
// ============================================================

const INSPECTION_API = {
    GET_PAGE: '/api/inspection/get-page-inspection',
    CREATE: '/api/inspection/create-inspection',
    CREATE_SECONDARY: '/api/inspection/create-secondary-inspection',
    DELETE: '/api/inspection/delete-inspection',
    GET_VIOLATION: '/api/inspection/get-violation',
    CREATE_VIOLATION: '/api/inspection/create-violation',
    DELETE_VIOLATION: '/api/inspection/delete-violation',
    CHANGE_STATUS: '/api/inspection/change-status-violation',
    GET_IMAGES: '/api/inspection/get-images-inspection',
    PRINT: '/api/report/print/inspection',
} as const;

const INSPECTION_DIALOGS = {
    CREATE: 'create-dialog',
    VIEW: 'viewInspectionDialog',
    ADD_VIOLATION: 'addViolationDialog',
    SUBDIVISION: 'subDivisionDialog',
    PHOTOS: 'photosDialog',
    REPORT: 'reportDialog',
} as const;

// Подразделения для фильтрации инспекций
const INSPECTION_ALLOWED_SUBDIVISIONS = ['ОГТ', 'ОГМ', 'ОТиТБ', 'ПДО'] as const;

// Критерии нарушений и их максимальные баллы
const VIOLATION_CRITERIA: Record<string, number> = {
    'Технологическая дисциплина': 3,
    'Организация рабочих мест': 2,
    'Документация': 3,
    'Безопасность и охрана труда': 5,
} as const;

const VIOLATION_CRITERIA_OPTIONS = [
    { value: 'Безопасность и охрана труда', label: 'Безопасность и охрана труда' },
    { value: 'Технологическая дисциплина', label: 'Технологическая дисциплина' },
    { value: 'Организация рабочих мест', label: 'Организация рабочих мест' },
    { value: 'Документация', label: 'Документация' },
] as const;

// Статусы нарушений
const VIOLATION_STATUS = {
    NOT_FIXED: 'Не исправлено',
    FIXED: 'Исправлено',
} as const;

const INSPECTION_MESSAGES = {
    DELETE_WITH_SECONDARY: 'Нельзя удалять инспекцию с вторичной инспекцией',
    DELETE_CONFIRM: 'Подтвердите удаление инспекции',
    DELETE_SUCCESS: 'Инспекция успешно удалена',
    DELETE_VIOLATION_CONFIRM: 'Подтвердите удаление нарушения',
    DELETE_VIOLATION_SUCCESS: 'Нарушение успешно удалено',
    DELETE_VIOLATION_WITH_SECONDARY: 'Нельзя удалять нарушение у инспекции, если есть вторичная инспекция',
    SECONDARY_SUCCESS: 'Вторичная инспекция успешно создана',
    SECONDARY_ERROR: 'Ошибка при создании вторичной инспекции',
    CREATE_SUCCESS: 'Инспекция успешно создана',
    VIOLATION_CREATED: 'Нарушение успешно создано',
    VIOLATION_HAS_SECONDARY: 'У инспекции есть вторичная инспекция',
    STATUS_CHANGED: 'Статус изменен',
    NO_VIOLATIONS: 'Нарушений не найдено',
    NO_PHOTOS: 'Фотографии не прикреплены',
    PHOTO_LOAD_ERROR: 'Ошибка загрузки фотографий',
    SELECT_SUBDIVISION: 'Выберите подразделение из списка',
    NO_REPORTS: 'Нет доступных для печати отчетов',
} as const;

const INSPECTION_SELECTORS = {
    CREATE_BUTTON: '#create-button',
    CREATE_BTN: '#createBtn',
    CREATE_SECONDARY_BTN: '#createSecondaryBtn',
    REPORT_BTN: '#report-btn',
    PRINT_BUTTON: '#print-button',
    CLOSE_BTN: '#closeBtn',
    ADD_VIOLATION_BTN: '#addViolationBtn',
    CANCEL_ADD_BTN: '#cancelAddBtn',
    CREATE_VIOLATION_BTN: '#createViolation',
    CRITERIA_SELECT: '#criteriaSelect',
    SCORE_SELECT: '#scoreSelect',
    VIOLATIONS_CONTAINER: '.violations-container',
    BTN_DELETE: '.btn-delete',
    BTN_FIXED: '.btn-fixed',
    PHOTO_ICON: '.photo-icon',
    DELETE_INSPECTION: '.delete-inspection',
    MODAL_INPUT_CHANGE: '.modal-input-change',
} as const;

// Склонение слова "балл"
function getScoreText(score: number): string {
    const lastDigit = score % 10;
    const lastTwoDigits = score % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${score} баллов`;
    if (lastDigit === 1) return `${score} балл`;
    if (lastDigit >= 2 && lastDigit <= 4) return `${score} балла`;
    return `${score} баллов`;
}

// ============================================================
// SGI — Константы
// ============================================================

const SGI_API = {
    GET_PAGE: '/api/sgi/get-page-sgi',
    CREATE: '/api/sgi/create-sgi',
    UPDATE: '/api/sgi/update',
    DELETE: '/api/sgi/delete',
    AGREE: '/api/sgi/agree',
    GET_IMAGES_SGI: '/api/sgi/get-images-sgi',
    GET_IMAGES_FACT_SGI: '/api/sgi/get-images-fact-sgi',
    PRINT: '/api/report/print/sgi',
} as const;

const SGI_DIALOGS = {
    CREATE: 'create-dialog',
    EDITING: 'editing-dialog',
    EXECUTION: 'execution-dialog',
    FILTER: 'filter-dialog',
    EMPLOYEE: 'employeeDialog',
    SUBDIVISION: 'subDivisionDialog',
    DOCUMENT: 'documentDialog',
} as const;

const SGI_FIELDS = {
    NUMBER: 'number',
    WORKCENTER: 'workcenter',
    EVENT: 'event',
    ACTIONS: 'actions',
    DEPARTMENT: 'department',
    EMPLOYEE: 'employee',
    DESIRED_DATE: 'desiredDate',
    PLAN_DATE: 'planDate',
    NOTE: 'note',
    COMMENT: 'comment',
    IMAGES_SGI: 'imagesSGI',
    EXECUTION_DATE: 'executionDate',
    REPORT: 'report',
    IMAGES_FACT_SGI: 'imagesFactSGI',
} as const;

// Отделы
const SGI_DEPARTMENTS = {
    MECHANIC: 'ОГМ',
    BUILDER: 'ОРС',
    PROTECTION: 'ОТиПК',
    ENERGY: 'ОГЭ',
} as const;

const SGI_DEPARTMENT_OPTIONS = [
    { value: 'mechanic', label: 'ОГМ' },
    { value: 'builder', label: 'ОРС' },
    { value: 'protection', label: 'ОТиПК' },
    { value: 'energy', label: 'ОГЭ' },
] as const;

// Роли сотрудников для фильтрации
const SGI_EMPLOYEE_ROLES = ['EVENT', 'CONTROL'] as const;

const SGI_MESSAGES = {
    CREATE_SUCCESS: (num: number) => `Создано новое мероприятие под номером ${num}`,
    CREATE_SUB_SUCCESS: (num: number) => `Создана новая подзадача для мероприятия под номером ${num}`,
    CREATE_ERROR: 'Ошибка при создании SGI',
    EDIT_AGREED: 'Нельзя редактировать выполненное мероприятие',
    EDIT_CREATOR_ONLY: 'Редактировать может только создатель задачи',
    EDIT_SUCCESS: 'Мероприятие успешно отредактировано',
    FACT_SUCCESS: 'Факт выполнения сохранен',
    FACT_NOT_SET: 'Редактировать может только создатель задачи',
    FACT_DATE_REQUIRED: 'Не заполнена дата выполнения',
    AGREE_SUCCESS: (agreed: boolean) => agreed ? 'Мероприятие согласовано' : 'Согласование отменено',
    AGREE_ERROR: 'Вы не можете закрывать/открывать мероприятие',
    AGREE_ALL_SUB: 'Все подзадачи должны быть согласованы!',
    AGREE_NO_CANCEL: 'Нельзя отменить согласование подзадачи, если родительская задача согласована!',
    PLAN_DATE_REQUIRED: 'Не заполнено поле планируемый срок!',
    DELETE_SUCCESS: 'Мероприятие успешно удалено',
    DELETE_ERROR: 'Возникла ошибка при удалении мероприятия',
    DELETE_AGREED: 'Нельзя удалять согласованное мероприятие!',
    PAGE_LOAD_ERROR: 'Ошибка загрузки страницы:',
    FILE_DELETE: 'Удалить',
    FILE_PRINT: 'Печать',
    SELECT_EMPLOYEE: (label: string) => `Выберите ${label} из списка`,
    EMPTY: '',
} as const;

const SGI_SELECTORS = {
    CREATE_BUTTON: '#create-button',
    CREATE_BTN: '#createBtn',
    FILTER_BUTTON: '#filter-button',
    SAVE_BTN: '#saveBtn',
    CANCEL_BTN: '#cancelButton',
    CREATE_SUB_SGI: '#createSubSGI',
    CHANGE_EMPLOYEE: '#changeEmployee',
    CHANGE_SUBDIVISION: '#changeSubDivision',
    LAST_PAGE: '#last-page',
    HIDDEN_EMPLOYEE: 'input[name="hiddenEmployee"]',
    PARENT_ID: 'input[name="parentId"]',
    PAGINATION_BTN: '.page-btn',
    PRINT_MENU_ITEM: '.print-menu-item',
    SELECTED_ROW: '.selected-row',
    ROW_ITEMS_ROW: '.row-items-row',
} as const;

// HTTP методы
const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
} as const;

// Shared domain types and enums

export enum NotificationType {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info'
}

export enum Color {
    NONE = 'NONE',
    RED = 'RED',
    GREEN = 'GREEN',
    YELLOW = 'YELLOW',
    GREY = 'GREY',
    BLUE = 'BLUE'
}

export interface FileDTO {
    name: string;
    data: string;
}

export interface ReportItem {
    api: string;
    name: string;
    params?: Record<string, string> | string;
    function?: (format?: string) => Promise<void>;
}

export interface RequestDataDTO {
    data: Array<{ id: string | number } & Record<string, unknown>>;
    count: number;
}

export interface IntegerFieldValidationConfig {
    key: string;
    value: unknown;
    min: number;
    label: string;
    defaultValue?: number;
}

export interface DialogOptions {
    clearFields?: boolean;
    onClose?: () => void;
    onOpen?: () => void;
}

export interface ErrorResponse {
    statusError: number;
    message: string;
    timestamp: string;
    notificationType: NotificationType;
}

export type Employee = {
    id: number;
    name: string;
    subDivision: SubDivision;
    role: string;
    isActive: boolean;
    chatId: number;
};

export type SubDivision = {
    id: number;
    code: string;
    name: string;
};

export type DocumentBormash = {
    id: string;
    name: string;
    files: DocumentFile[];
};

export type DocumentFile = {
    id: string;
    baseFileName: string;
    type: string;
};

/** Изображение сущности (не путать с DOM Image) */
export type AppImage = {
    id: string;
    name: string;
    data: string;
    mainlink: string;
};

export type CustomerOrder = {
    id: string;
    name: string;
    createdDate: string;
    employeeName: string;
};

export type SpecialFieldTransform = {
    name: string;
    transform: ($div: JQuery) => JQuery;
};

export type EditModeOptions = {
    dateFields?: string[];
    disableFields?: string[];
    readOnlyFields?: string[];
    specialFields?: SpecialFieldTransform[];
};

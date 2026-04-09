// ============================================================
// ENUM
// ============================================================

enum NotificationType {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info'
}

enum Color {
    NONE = 'NONE',
    RED = 'RED',
    GREEN = 'GREEN',
    YELLOW = "YELLOW",
    GREY = 'GREY',
    BLUE = 'BLUE'
}

// ============================================================
// ИНТЕРФЕЙСЫ БАЗОВОГО КЛАССА (Base)
// ============================================================

interface FileDTO {
    name: string;
    data: [];
}

interface ReportItem {
    api: string;
    name: string;
    params: any;
    function?: Function;
}

interface RequestDataDTO {
    data: any;
    count: number
}

interface IntegerFieldValidationConfig {
    key: string;
    value: any;
    min: number;
    label: string;
    defaultValue?: number;
}

interface DialogOptions {
    clearFields?: boolean;
    onClose?: () => void;
    onOpen?: () => void;
}

interface ErrorResponse {
    statusError: number;
    message: string;
    timestamp: string;
    notificationType: NotificationType
}

// ============================================================
// ОБЩИЕ ТИПЫ
// ============================================================

type Employee = {
    id: number;
    name: string;
    subDivision: SubDivision;
    role: string;
    isActive: boolean;
    chatId: number;
}

type subDivision = {
    id: number;
    name: string;
    code: string;
}

type SubDivision = {
    id: number;
    code: string;
    name: string;
}

type DocumentBormash = {
    id: string;
    name: string;
    files: DocumentFile[];
}

type DocumentFile = {
    id: string;
    baseFileName: string;
    type: string;
}

type Image = {
    id: string;
    name: string;
    data: string;
    mainlink: string;
}

type CustomerOrder = {
    id: string;
    name: string;
    createdDate: string;
    employeeName: string;
}


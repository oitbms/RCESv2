/// <reference types="jquery" />

declare type RequestDataDTO = {
    data: Array<{ id: string | number } & Record<string, unknown>>;
    count: number;
};

/** Доменные типы (глобальные — совместимость с существующим кодом) */
declare type Employee = {
    id: number;
    name: string;
    subDivision: SubDivision;
    role: string;
    isActive: boolean;
    chatId: number;
};

declare type SubDivision = {
    id: number;
    code: string;
    name: string;
};

declare type TeamIn = {
    id: number;
    version: number;
    name: string;
    employees: Employee[];
};

declare type SpeIn = {
    id: number;
    version: number;
    name: string;
    type: string;
    outNumber: string;
    accuracyClass: string;
    limitMeasurement: string;
    subDivision: SubDivision;
    employee: Employee;
    mark: string;
    datePreparation: string;
    dateVerification: string;
    certificateNumber: string;
    periodicity: number;
    documentId: string;
    status: string;
    color: string;
    organization: string;
};

declare type OrganizationSPE = {
    name: string;
    position: string;
    verifier: string;
};

declare type NtdIn = {
    id: number;
    version: number;
    name: string;
    type: string;
    dateVerification: string;
    documentId: number;
    comment: string;
    references: string[];
    color: string;
};

declare type NtdRefIn = {
    id: number;
    version: number;
    name: string;
    type: string;
    dateVerification: string;
    documentId: number;
    comment: string;
    color: string;
};

declare type SgiIn = {
    id: string;
    number: string;
    color: string;
    workcenter: string;
    event: string;
    actions: string;
    department: string;
    departmentName: string;
    employee: Employee;
    desiredDate: string;
    planDate: string;
    note: string;
    comment: string;
    agree: boolean;
    subSGI: SubSgiIn[];
    factExecution: FactExecutionSGIIn | null;
    parent?: string;
    documentId: string | null;
    imagesSGI: unknown;
};

declare type FactExecutionSGIIn = {
    id: string;
    executionDate: string | null;
    report: string | null;
    imagesFactSGI: unknown;
};

declare type SubSgiIn = {
    id: string;
    number: string;
    color: string;
    workcenter: string;
    event: string;
    actions: string;
    department: string;
    departmentName: string;
    employee: Employee;
    desiredDate: string;
    planDate: string;
    note: string;
    comment: string;
    agree: boolean;
    factExecution: FactExecutionSGIIn | null;
    parent?: string;
    documentId: string | null;
    imagesSGI: unknown;
};

declare type InspectionIn = {
    id: number;
    subDivision: SubDivision;
    dateInspection: string;
    type: string;
    violation: InspectionViolationIn[];
    haveSecondInspection: boolean;
    primaryInspectionId: number;
};

declare type InspectionViolationIn = {
    id: string;
    createdBy: Employee;
    createdDate: string;
    inspectionId: number;
    description: string;
    criteria: string;
    score: number;
    subDivision: SubDivision;
    status: string;
};

declare type pdItemIn = {
    id: number;
    version: number;
    customerOrder: CustomerOrder;
    employee: Employee;
    name: string;
    scheme: string;
    thickness: string;
    steel: string;
    qty: number;
    qtyCompleted: number;
    measurements: string;
    program: string;
    machine: string;
    status: string;
    comment: string;
    color: string;
    ready: boolean;
    team: TeamIn;
    dateCompletion: string;
    operation: string[];
};

declare type CustomerOrder = {
    id: string;
    name: string;
    createdDate: string;
    employeeName: string;
};

declare type partsDirectoryFrom1CIn = {
    response?: partsDirectoryFrom1CRowIn[];
    'Запрос'?: partsDirectoryFrom1CRowIn[];
};

declare type partsDirectoryFrom1CRowIn = {
    customerOrder?: string;
    item?: string;
    scheme?: string;
    name?: string | number;
    thickness?: string;
    steel?: string;
    qty?: number | string | null;
    'НаименованиеПодзаказа'?: string;
    'Чертеж'?: string;
    'Деталь'?: string;
    'КоличествоДеталей'?: string;
    'Размер'?: string;
    'Сталь'?: string;
    'КоличествоСтали'?: number | string | null;
};

declare type partsDirectoryFrom1CPreviewRow = {
    index: number;
    customerOrder: string;
    drawing: string;
    detail: string;
    quantity: string;
    quantityNumber: number;
    size: string;
    steel: string;
    steelQty: string;
    steelQtyNumber: number;
};

/** Изображение сущности (не DOM Image) */
declare type AppImage = {
    id: string;
    name: string;
    data: string;
    mainlink: string;
};

declare type DocumentFile = {
    id: string;
    baseFileName: string;
    type: string;
};

declare type DocumentBormash = {
    id: string;
    name: string;
    files: DocumentFile[];
};

declare interface Window {
    showPageNotification?: (message: string, duration?: number, type?: string) => void;
}

declare const SockJS: new (url: string) => WebSocket;
declare const Stomp: {
    over: (socket: WebSocket) => {
        debug: ((msg: string) => void) | null;
        connect: (headers: object, onConnect: (frame: unknown) => void, onError?: (err: unknown) => void) => void;
        subscribe: (destination: string, callback: (msg: { body: string }) => void) => void;
    };
};

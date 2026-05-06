type pdItemIn = {
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
    color: Color;
    ready: boolean;
    team: TeamIn;
    dateCompletion: string;
    operation: string[];
}

type TeamIn = {
    id: number;
    version: number;
    name: string;
    employees: Employee[];
}

type partsDirectoryFrom1CIn = {
    response?: partsDirectoryFrom1CRowIn[];
    'Запрос'?: partsDirectoryFrom1CRowIn[];
}

type partsDirectoryFrom1CRowIn = {
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
    'КоличествоДеталей'?: string | number;
    'Размер'?: string;
    'Сталь'?: string;
    'КоличествоСтали'?: number | string | null;
}

type partsDirectoryFrom1CPreviewRow = {
    index: number;
    customerOrder: string;
    drawing: string;
    detail: string;
    quantity: string;
    quantityNumber: number;
    size: string;
    steel: string;
}

type SgiIn = {
    id: string;
    number: string;
    color: Color;
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
    imagesSGI: any;
}

type FactExecutionSGIIn = {
    id: string;
    executionDate: string | null;
    report: string | null;
    imagesFactSGI: any;
}

type SubSgiIn = {
    id: string;
    number: string;
    color: Color;
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
    imagesSGI: any;
}


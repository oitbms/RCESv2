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
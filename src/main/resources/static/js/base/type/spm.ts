import {Color} from "../../core/types";

type SpmIn = {
    id: number;
    version: number;
    customerOrderLine: string;
    customerOrder?: {
        id: string;
        name: string;
    };
    loaded: boolean;
    dateStart: string;
    priority: number;
    color: Color;
}

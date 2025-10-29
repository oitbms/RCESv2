type Employee = {
    id: number;
    name: string;
    mlmNode: MlmNode;
    role: string;
    isActive: boolean;
    chatId: number;
}

type MlmNode = {
    name: string;
}

type SubDivision = {
    id: number;
    code: string;
    name: string;
}

type DocumentBormash = {
    id: string,
    name: string,
    files: DocumentFile[]
}

type DocumentFile = {
    id: string,
    baseFileName: string,
    type: string
}


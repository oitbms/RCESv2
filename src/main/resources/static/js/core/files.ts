import type { FileDTO } from './types';

export function appendQueryParams(url: string, params?: string | Record<string, unknown>): string {
    if (!params) return url;
    if (typeof params === 'string') {
        return url + (params.startsWith('?') ? params : `?${params}`);
    }
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
            value.forEach(v => search.append(key, String(v)));
        } else if (value != null) {
            search.append(key, String(value));
        }
    }
    return `${url}?${search.toString()}`;
}

export async function downloadFilesFromDto(response: FileDTO | FileDTO[]): Promise<void> {
    const files = Array.isArray(response) ? response : [response];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const binaryString = atob(file.data as unknown as string);
        const uint8Array = new Uint8Array(binaryString.length);
        for (let j = 0; j < binaryString.length; j++) {
            uint8Array[j] = binaryString.charCodeAt(j);
        }
        const blob = new Blob([uint8Array]);
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(objectUrl), 250);

        if (i < files.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1250));
        }
    }
}

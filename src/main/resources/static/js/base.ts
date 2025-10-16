interface FileDTO {
    name: string;
    data: string;
}
enum NotificationType {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info'
}
interface cache {
    endpoints: { employee: string; subDivision: string; [key: string]: string };

    get<T = any>(key: string): Promise<T>;

    set(key: string, data: any): this;
}
// @ts-ignore
abstract class Base {
    private locks = new Map<string, boolean>();
    private handlers: { event: string, selector: string, handler: Function }[] = [];
    public selectedRows = new Set<string | number>();
    public localCache = new Map<string | number, object>();
    private readonly itemsPerPage: number
    public currentPage: number = 1;
    public saveMassive: object = {};

    protected constructor(itemsPerPage: number = Infinity, ...initCallbacks: Function[]) {
        this.itemsPerPage = itemsPerPage;
        this.init(...initCallbacks);
    }

    private init(...callbacks: Function[]) {
        $(() => {
            this.initializeHandlers();
            callbacks.forEach(callback => callback());
        });
    }

    private initializeHandlers(): void {
        this.handlers.forEach(({event, selector, handler}) => {
            $(document).on(event, selector, handler);
        });
    }

    //Блокировка параллельного выполнения
    private lock = (fn: Function) => async (...args: any[]): Promise<void> => {
        const key = fn.name;
        if (this.locks.get(key)) return;

        this.locks.set(key, true);
        try {
            return await fn(...args);
        } finally {
            this.locks.set(key, false);
        }
    };

    public readonly createHandler = (event: string, selector: string, handler: Function, locked: boolean = false): void => {
        this.handlers.push({
            event,
            selector,
            handler: locked ? this.lock(handler) : handler,
        });
    };

    //Всегда должен возвращать jquery объект в виде any
    public abstract createRow(item: any): any;

    public readonly updateRow = (item: any, rowIndex: string | number): void => {
        const $oldRow = $(`[data-index="${rowIndex}"]`);
        const $newRow = this.createRow(item);
        $oldRow.fadeOut(300, () => {
            $oldRow.replaceWith($newRow);
            $newRow.hide().fadeIn(300);
            this.localCache.set(item.id, item);
        });
    };

    public readonly switchVisibilityRow = (rowIndex: string | number, hide: boolean): void => {
        $(`[data-index="${rowIndex}"]`)[hide ? 'fadeOut' : 'fadeIn'](300);
    };

    public readonly deleteRow = (rowIndex: string | number): void => {
        const $row = $(`#${rowIndex}`);
        $row.fadeOut(300, () => {
            $row.remove();
            this.localCache.delete(rowIndex);
        });
    }

    public readonly displayPage = this.lock(async (url: string, type: string, param?: object, ...callbacks: Function[]): Promise<void> => {
        const data: any[] = await this.requestToApi(url, type, param);
        for (const item of data) {
            this.localCache.set(item.id, item);
            this.createRow(item);
        }
        callbacks.forEach(callback => callback(data));
    });

    public readonly save = async (url: string, ...items: any[]): Promise<any> => {
        const results = await Promise.all(items.map(item =>
            this.requestToApi(`${url}/${item.id}`, 'PATCH', item)
        ));

        items.forEach(item => {
            this.localCache.set(item.id, item);
            this.updateRow(item, item.id);
        });

        return results;
    }

    public readonly requestToApi = async (url: string, type: string, param?: object | FormData): Promise<any> => {
        const isFormData = param instanceof FormData;
        return await $.ajax({
            url: url,
            method: type,
            contentType: isFormData ? false : 'application/json',
            processData: !isFormData,
            data: param
        });
    }

    public readonly print = async (url: string, params: any): Promise<void> => {
        window.open(url + (Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''));
    };

    public readonly downloadFile = async (url: string, params?: object): Promise<void> => {
        try {
            const file = await this.requestToApi(url, 'GET', params) as FileDTO;
            const binaryString = atob(file.data);
            const uint8Array = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                uint8Array[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([uint8Array]);
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
        } catch (error) {
            this.createNotification('Ошибка при скачивании файла', NotificationType.ERROR).catch(console.error);
        }
    }

    public readonly createEntity = (url: string, dto: any): any => {
        return this.requestToApi(url, 'POST', dto);
    }

    public readonly deleteEntity = (url: string): Promise<void> => {
        return this.requestToApi(url, 'DELETE');
    }

    //Создание уведомления в левом верхнем углу
    public readonly createNotification = this.lock((message: string, type: NotificationType, params?: any): void => {
        const text = params ? message.replace(/{(\w+)}/g, (m, k) => params[k]) : message;

        const $note = $(`<div class="notification ${type}">
            <div class="msg">${text}</div>
        </div>`).appendTo('body');

        setTimeout(() => $note.addClass('show'), 10);
        setTimeout(() => $note.remove(), 10000);
    });

    //Контекстное меню
    public readonly createContextMenu = (items: { label: string, action: () => void }[], x: number, y: number): void => {
        $('#context-menu').remove();

        const menu = $('<div id="context-menu"></div>');
        items.forEach(item => menu.append(`<div>${item.label}</div>`).on('click', item.action));

        $('body').append(menu.css({ left: x + 'px', top: y + 'px' }));
        $(document).one('click', () => menu.remove());
    }

    public readonly formatDate = (dateString: string): string => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    }

}


// @ts-ignore
declare global {
    interface Window {
        cache: cache;
    }
}
// @ts-ignore
declare const $: any;
(window as any).cache = {
    endpoints: {employee: '/api/employees', subDivision: '/api/sub-divisions'},

    async get<T>(key: string): Promise<T> {
        const cached = sessionStorage.getItem(key);
        if (cached) return JSON.parse(cached);

        const endpoint = this.endpoints[key];
        if (!endpoint) throw new Error(`Такого api нет: ${key}`);

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`Возникла ошибка сервера: ${response.status}`);

        const data: T = await response.json();
        this.set(key, data);
        return data;
    },

    set(key: string, data: any): Cache {
        sessionStorage.setItem(key, JSON.stringify(data));
        return this;
    }
};
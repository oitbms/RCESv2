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

enum Color {
    NONE = 'NONE',
    RED = 'RED',
    GREEN = 'GREEN',
    YELLOW = "YELLOW",
    GREY = 'GREY',
    BLUE = 'BLUE'
}

abstract class Base {
    private locks = new Map<string, boolean>();
    private handlers: { event: string, selector: string, handler: Function }[] = [];
    public selectedRows = new Set<string | number>();
    public localCache = new Map<string | number, object>();
    private readonly itemsPerPage: number
    public currentPage: number = 1;
    public saveMassive: object = {};

    public readonly rowContainer: any;

    protected cache: CacheBormash = new CacheBormashImpl();
    protected dialog: Dialog = new DialogImpl();

    protected constructor(rowContainer: any, itemsPerPage: number = Infinity, ...initCallbacks: Function[]) {
        this.rowContainer = rowContainer;
        this.itemsPerPage = itemsPerPage;
        // this.createHandler('mouseenter', '.tooltip', () => this.showToolTip, true);
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
        const $newRow = this.createRow(item).hide();

        $oldRow.fadeOut(350, () => {
            $oldRow.replaceWith($newRow);
            $newRow.fadeIn(350);
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

    public readonly displayPage = this.lock(async (url: string, param?: object, ...callbacks: Function[]): Promise<void> => {
        const data: any[] = await this.requestToApi(url, 'GET', param);
        for (const item of data) {
            this.localCache.set(item.id, item);
            const row = this.createRow(item);
            this.rowContainer.append(row);
        }
        callbacks.forEach(callback => callback?.(data));
    });

    public readonly save = async (url: string, ...items: any[]): Promise<any> => {
        const results = await Promise.all(items.map(item => {
            const id: number = item.id;
            const version = item.version;
            const changes = item.changes;
            return this.requestToApi(`${url}/${id}${version != null ? `?version=${version}` : ''}`, 'PATCH', changes);
        }));

        results.forEach(item => {
            this.updateRow(item, item.id);
            delete this.saveMassive[item.id];
        });

        this.createNotification('Оборудование успешно обновлено', NotificationType.SUCCESS);
        return results;
    }

    public readonly requestToApi = async (url: string, type: string, param?: object | FormData): Promise<any> => {
        const isFormData = param instanceof FormData;
        return await $.ajax({
            url: url,
            method: type,
            contentType: isFormData ? false : 'application/json',
            processData: !isFormData,
            data: isFormData ? param : JSON.stringify(param)
        });
    }

    public readonly print = (url: string, params: any): void => {
        if (!params?.length) return this.createNotification("Выберите строки для печати", NotificationType.INFO);
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
            this.createNotification('Ошибка при скачивании файла', NotificationType.ERROR);
        }
    }

    public readonly createEntity = (url: string, dto: any): any => {
        return this.requestToApi(url, 'POST', dto);
    }

    public readonly deleteEntity = (url: string): Promise<void> => {
        return this.requestToApi(`${url}`, 'DELETE');
    }

    //Создание уведомления в левом верхнем углу
    public readonly createNotification = (message: string, type: NotificationType, params?: any, error?: Error): void => {
        try {
            const text = params ? message.replace(/{(\w+)}/g, (m, k) => params[k]) : message;

            const $note = $(`
            <div class="notification ${type}">
                <div class="msg">${text}</div>
            </div>`)
                .appendTo('body');
            if (error) console.error(error);

            setTimeout(() => $note.addClass('show'), 10);
            setTimeout(() => {
                $note.removeClass('show').addClass('hiding');
                setTimeout(() => $note.remove(), 350);
            }, 4250);
        } catch (error) {
            console.error(error);
        }
    };

    //Диалог с подтверждением действия
    public readonly createConfirmationDialog = this.lock((message: string, params?: any): Promise<boolean> => {
        return new Promise((resolve) => {
            const text = params ? message.replace(/{(\w+)}/g, (m, k) => params[k]) : message;

            let $dialog = $('#confirmDialog');
            if ($dialog.length === 0) {
                $dialog = $(`
                    <dialog id="confirmDialog" class="confirm-dialog">
                        <div class="confirm-content">
                            <div class="confirm-message" id="confirmMessage">${text}</div>
                            <div class="confirm-buttons">
                                <button class="confirm-btn confirm-cancel" id="confirmCancel">Отмена</button>
                                <button class="confirm-btn confirm-ok" id="confirmOk">Подтвердить</button>
                            </div>
                        </div>
                    </dialog>
                `);
                $('body').append($dialog);
            } else {
                $('#confirmMessage').text(text);
            }

            const cleanup = () => {
                $('#confirmCancel').off('click');
                $('#confirmOk').off('click');
                this.dialog.close('confirmDialog');
            };

            $('#confirmCancel').on('click', () => {
                cleanup();
                resolve(false);
            });

            $('#confirmOk').on('click', () => {
                cleanup();
                resolve(true);
            });

            this.dialog.open('confirmDialog', {
                clearFields: false,
                onClose: () => {
                    cleanup();
                    resolve(false);
                }
            });
        });
    });

    //Контекстное меню
    public readonly createContextMenu = (items: {
        label: string,
        action: () => void
    }[], x: number, y: number): void => {
        $('#context-menu').remove();

        const menu = $('<div id="context-menu"></div>');
        items.forEach(item => {
            const $item = $(`<div>${item.label}</div>`);
            $item.on('click', () => {
                item.action();
                menu.remove();
            });
            menu.append($item);
        });
        $('body').append(menu.css({
            left: x + 'px',
            top: y + 'px',
            zIndex: 2147483647
        }));
        $(document).one('click', (e) => {
            if (!$(e.target).closest('#context-menu').length) {
                menu.remove();
            }
        });
    }

    // private readonly showToolTip = (event: Event) => {
    //     const element = event.target as HTMLElement;
    //
    // }

    public readonly formatDate = (dateString: string): string => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    }

    public readonly calculateColor = (color: Color): string => {
        switch (color) {
            case Color.NONE:
                return 'var(--default-color, #f1f1f1)';
            case Color.RED:
                return 'var(--critical-color, #ef4444)';
            case Color.GREEN:
                return 'var(--success-color, #10b981)';
            case Color.YELLOW:
                return 'var(--warning-color, #f59e0b)';
            case Color.BLUE:
                return 'var(--info-color, #3b82f6)';
        }
    }

}
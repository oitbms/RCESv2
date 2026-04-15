/// <reference path="type/generalType.ts" />

abstract class Base {
    private locks = new Map<string, boolean>();
    private handlers: { event: string, selector: string, handler: Function }[] = [];
    public selectedRows = new Set<string | number>();
    public localCache = new Map<string | number, object>();
    public readonly itemsPerPage: number;
    private readonly visibleRow: number;
    public currentPage: number = 1;
    public saveMassive: object = {};
    public reports: ReportItem[] = [];
    public searchText: string = '';
    public editMode: boolean = false;

    public readonly rowContainer: any;

    protected cache: CacheBormash = new CacheBormashImpl();
    protected dialog: Dialog = new DialogImpl();

    protected constructor(rowContainer: any,
                          itemsPerPage: number = Infinity,
                          visibleRow = Infinity,
                          ...initCallbacks: Function[]) {
        this.rowContainer = rowContainer;
        this.itemsPerPage = itemsPerPage;
        this.visibleRow = visibleRow;
        this.init(...initCallbacks);
    }

    private init(...callbacks: Function[]) {
        $(() => {
            this.createHandler('mouseenter', '.tooltip-trigger', this.showToolTip.bind(this), true);
            this.createHandler('click', '[name="closeDialog"]', (e) => {
                const dialogId = $(e.currentTarget).closest('dialog').attr('id');
                this.dialog.close(dialogId);
            });
            $(this.rowContainer).on('scroll', this.onScroll.bind(this));
            this.createNotificationContainer();
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

    public readonly createNotificationContainer = () => {
        const notificationsContainer = $(`<div id="notifications-container" popover="manual"></div>`);
        $('body').append(notificationsContainer);
    }

    //Всегда должен возвращать jquery объект в виде any
    public abstract createRow(item: any): any;

    //Обработчик при скролле в rowContainer
    public abstract onScroll(): void;

    public readonly updateRow = (item: any, rowIndex: string | number): void => {
        const $oldRow = $(`[data-index="${rowIndex}"]`);
        const $newRow = this.createRow(item).hide();

        $oldRow.fadeOut(100, () => {
            $oldRow.replaceWith($newRow);
            $newRow.fadeIn(280);
            this.localCache.set(item.id, item);
        });
    };

    public readonly switchVisibilityRow = (rowIndex: string | number, hide: boolean): void => {
        $(`[data-index="${rowIndex}"]`)[hide ? 'fadeOut' : 'fadeIn'](300);
    };

    public deleteRow(rowIndex: string | number): void {
        const $row = $(`#${rowIndex}`);
        $row.fadeOut(300, () => {
            $row.remove();
            this.localCache.delete(rowIndex);
        });
    }

    public async displayPage(url: string, param?: object, ...callbacks: Function[]): Promise<void> {
        if (this.currentPage > 1) {
            param = {...param, page: this.currentPage};
        }
        const request: RequestDataDTO = await this.requestToApi(url, 'GET', param);

        const visibleItems = request.data.slice(0, this.visibleRow);
        const hiddenItems = request.data.slice(this.visibleRow);

        visibleItems.forEach(item => {
            this.localCache.set(item.id, item);
            const row = this.createRow(item);
            this.rowContainer.append(row);
        });

        hiddenItems.forEach(item => {
            this.localCache.set(item.id, item);
            const row = this.createRow(item).hide();
            this.rowContainer.append(row);
        });

        callbacks.forEach(callback => callback?.(request.data, request.count));
    };

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

        this.createNotification('Успешно обновлено', NotificationType.SUCCESS);
        return results;
    }

    public readonly requestToApi = async (url: string, type: string, param?: object | FormData): Promise<any> => {
        return await $.ajax({
            url: url,
            method: type,
            contentType: param instanceof FormData ? false : 'application/json',
            processData: !(param instanceof FormData),
            data: param instanceof FormData ? param : JSON.stringify(param)
        }).catch((xhr) => {
            const errorResponse: ErrorResponse = xhr.responseJSON;
            this.createNotification(errorResponse.message, errorResponse.notificationType);
            throw xhr;
        });
    }

    // Экранирование HTML для защиты от XSS
    public readonly escapeHtml = (unsafe: string): string => {
        if (unsafe == null) return '';
        return String(unsafe)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    public async print(param?: any): Promise<void> {
        if (!this.reports.length) return this.createNotification("Нет доступных для печати отчетов", NotificationType.INFO);

        const dialogId = 'printDialog';
        let $dialog = $(`#${dialogId}`);
        if ($dialog.length) $dialog.remove();
        $('body').append($(printDialogTemplate(this.reports)));
        $dialog = $(`#${dialogId}`);

        let format = "PDF";
        $dialog.find('.format-btn').off('click').on('click', function (this: HTMLElement) {
            $dialog.find('.format-btn').removeClass('active');
            $(this).addClass('active');
            format = $(this).data('format') as string;
        });

        this.dialog.open(dialogId);

        return new Promise<void>((resolve) => {
            $('#printCancel').on('click', () => {
                this.dialog.close(dialogId);
                $dialog.remove();
                resolve();
            });

            $('#printOk').on('click', async () => {
                const api = $('#reportSelect').val() as string;
                const report = this.reports.find(r => r.api === api);
                if (!report) {
                    resolve();
                    return;
                }
                this.dialog.close(dialogId);
                $dialog.remove();

                const unlock = this.lockScreen('Формирование отчета');
                try {
                    if (report.function) {
                        await report.function(format);
                        resolve();
                        return;
                    }
                    const params = `?format=${format}` + (report.params ? `&${new URLSearchParams(report.params).toString()}` : '');
                    await this.downloadFile(report.api, params);
                } catch {
                    this.createNotification('Ошибка при печати', NotificationType.ERROR);
                } finally {
                    unlock();
                    resolve();
                }
            });
        });
    }

    //Скачивает все файлы с api
    public readonly downloadFile = async (url: string, params?: any): Promise<void> => {
        try {
            url = url + (params ? `?${new URLSearchParams(params).toString()}` : '');
            const response = await this.requestToApi(url, 'GET') as FileDTO | FileDTO[];

            const files = Array.isArray(response) ? response : [response];

            for (const file of files) {
                // @ts-ignore
                //Тут может быть какая-то ошибка
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
                setTimeout(() => URL.revokeObjectURL(objectUrl), 250);

                if (files.length > 1) await new Promise(resolve => setTimeout(resolve, 1250));
            }
        } catch (error) {
            this.createNotification('Ошибка при скачивании файла', NotificationType.ERROR);
            console.error(error);
        }
    }

    public readonly createEntity = (url: string, dto?: any): any => {
        return this.requestToApi(url, 'POST', dto);
    }

    public readonly deleteEntity = (url: string): Promise<void> => {
        return this.requestToApi(`${url}`, 'DELETE');
    }

    //Создание уведомления в левом верхнем углу
    public readonly createNotification = (
        message: string, type: NotificationType,
        params?: any, error?: Error): void => {
        try {
            const text = params ? message.replace(/{(\w+)}/g, (m, k) => params[k]) : message;
            const container = document.getElementById('notifications-container');
            if (!container) return;
            const notification = document.createElement('div');

            notification.className = `notification ${type}`;
            notification.innerHTML = `<div class="msg">${text}</div>`;
            container.appendChild(notification);
            if (!container.matches(':popover-open')) {
                container.showPopover();
            }
            if (error) console.error(error);
            setTimeout(() => notification.classList.add('show'), 10);
            setTimeout(() => {
                notification.classList.remove('show');
                notification.classList.add('hiding');
                setTimeout(() => {
                    notification.remove();
                    if (container.children.length === 0) {
                        container.hidePopover();
                    }
                }, 350);
            }, 3000);
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
                $('body').append($(confirmDialogTemplate()));
                $dialog = $('#confirmDialog');
            }
            $('#confirmMessage').text(text);

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
    public readonly createContextMenu = (items: { label: string, idAction: string, action: () => void }[],
                                         x: number,
                                         y: number): void => {
        $('#context-menu').remove();
        const menu = $('<div id="context-menu" popover="manual"></div>');
        items.forEach(item => {
            const $item = $(`<div id="${item.idAction}">${item.label}</div>`);
            $item.on('click', () => {
                item.action();
                menu[0].hidePopover();
            });
            menu.append($item);
        });
        $('body').append(menu.css({
            left: x + 'px',
            top: y + 'px',
        }));
        menu[0].showPopover();
        $(document).one('click', (e) => {
            if (!$(e.target).closest('#context-menu').length) {
                menu[0].hidePopover();
            }
        });
    }

    private readonly showToolTip = (event: Event) => {
        const element = event.currentTarget as HTMLElement;

        const tooltipTimeout = setTimeout(() => {
            const description = element.getAttribute('data-description');
            if (!description) return;

            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = description;
            document.body.appendChild(tooltip);

            const rect = element.getBoundingClientRect();
            tooltip.style.position = 'absolute';
            tooltip.style.left = `${rect.left + window.pageXOffset}px`;
            tooltip.style.top = `${rect.bottom + window.pageYOffset + 5}px`;

            (element as any)._currentTooltip = tooltip;
        }, 450);

        (element as any)._tooltipTimeout = tooltipTimeout;

        const hideHandler = () => {
            clearTimeout(tooltipTimeout);
            if ((element as any)._currentTooltip) {
                (element as any)._currentTooltip.remove();
                (element as any)._currentTooltip = null;
            }
            element.removeEventListener('mouseleave', hideHandler);
        };

        element.addEventListener('mouseleave', hideHandler);
    };

    public readonly formatDate = (dateString: string): string => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    }

    public readonly formatDateTime = (dateString: string): string => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    protected parseInteger(value: any): number | null {
        if (value === null || value === undefined || value === '') {
            return null;
        }
        const normalized = String(value).trim();
        if (!/^-?\d+$/.test(normalized)) {
            return null;
        }
        return Number(normalized);
    }

    protected validateIntegerFields(fields: IntegerFieldValidationConfig[]): Record<string, number> | null {
        const result: Record<string, number> = {};

        for (const field of fields) {
            const rawValue = field.value === '' || field.value === null || field.value === undefined
                ? field.defaultValue
                : field.value;
            const parsedValue = this.parseInteger(rawValue);

            if (parsedValue === null || parsedValue < field.min) {
                this.createNotification(
                    `${field.label} должно быть целым числом не меньше ${field.min}`,
                    NotificationType.WARNING
                );
                return null;
            }

            result[field.key] = parsedValue;
        }

        return result;
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
            case Color.GREY:
                return 'var(--grey-color, #9ca3af)';
        }
    }

    public readonly lockScreen = (message: string = "Загрузка..."): (() => void) => {
        const overlay = $(`<div class="lock-overlay">${message}</div>`);
        $(document.body).addClass('locked').append(overlay);

        return () => {
            overlay.remove();
            $(document.body).removeClass('locked');
        };
    };

    public readonly bindSearchInput = (selector: string, onSearch?: (text: string) => void): void => {
        this.createHandler('input', selector, (event: Event) => {
            this.searchText = $(event.target).val().toString().toLowerCase().trim();
            if (onSearch) {
                onSearch(this.searchText);
            } else {
                this.applyFilters();
            }
        }, true);
    };

    protected applyFilters(): void {
    }
    /**
     * Включает режим редактирования для выбранных строк или конкретной строки.
     * @param dateTimeFields — массив имён полей, которые должны стать <input type="date">
     * @param row — конкретная строка (jQuery-объект), если null — все выбранные строки
     * @param specialFields — объекты {name: string, transform: ($div: any) => any} для кастомных полей
     */
    public readonly enableEditMode = (
        dateTimeFields: string[] = [],
        row?: any,
        specialFields: { name: string, transform: ($div: any) => any }[] = []
    ): void => {
        const processElement = ($div: any) => {
            const dataName: string = $div.attr('data-name');
            const special = specialFields.find(f => f.name === dataName);
            if (special) {
                $div.replaceWith(special.transform($div));
                return;
            }
            if (dateTimeFields.indexOf(dataName) !== -1) {
                const rowId = row ? row.attr('id') : $div.closest('.table-row').attr('id');
                const cacheKey = (rowId && rowId.indexOf('.') !== -1) ? rowId : Number(rowId);
                const value = this.localCache.get(cacheKey)?.[dataName];
                const element = $(`<input type="date" data-name="${dataName}">`).val(value);
                $div.replaceWith(element);
            } else {
                $div.attr('contenteditable', 'true');
            }
        };

        if (row) {
            row.find('div[contenteditable="false"]').each(function (this: HTMLElement) {
                processElement($(this));
            });
            this.editMode = true;
            return;
        }

        for (const rowId of this.selectedRows) {
            const $row = $(`.table-row[id="${rowId}"]`);
            $row.find('div[contenteditable="false"]').each(function (this: HTMLElement) {
                processElement($(this));
            });
        }
        this.editMode = true;
    };

    /**
     * Выключает режим редактирования.
     * @param dateTimeFields — массив имён полей с датами
     * @param protectedFields — поля, которые не трогаем (document, references и т.п.)
     * @param row — конкретная строка, если null — все выбранные
     * @param extraCenterFields — поля, которые должны быть с классом center
     */
    public readonly disableEditMode = (
        dateTimeFields: string[] = [],
        protectedFields: string[] = [],
        row?: any,
        extraCenterFields: string[] = []
    ): void => {
        if (this.editMode &&
            Object.keys(this.saveMassive).length > 0 &&
            ((row && row.find('.change').length > 0) || !row && $('.table-row .change').length > 0)) {
            this.createNotification("Сохраните изменения", NotificationType.WARNING);
            return;
        }

        const centerFields = new Set([...dateTimeFields, ...extraCenterFields]);

        const processElement = ($field: any) => {
            const dataName = $field.attr("data-name");
            if (protectedFields.indexOf(dataName) !== -1) return;

            let value: string;
            if (dateTimeFields.indexOf(dataName) !== -1) {
                value = this.formatDate($field.val());
            } else {
                value = $field.is('select') ? $field.find('option:selected').text() : $field.text();
            }
            const centerClass = centerFields.has(dataName) ? ' center' : '';
            $field.replaceWith(`<div class="field-container${centerClass}" data-name="${dataName}" contenteditable="false">${value}</div>`);
        };

        if (row) {
            row.find('div[contenteditable="true"], select[data-name], input[data-name]')
                .each(function (this: HTMLElement) {
                    processElement($(this));
                });
            return;
        }

        for (const rowId of this.selectedRows) {
            const $row = $(`.table-row[id="${rowId}"]`);
            $row.find('div[contenteditable="true"], select[data-name], input[data-name]')
                .each(function (this: HTMLElement) {
                    processElement($(this));
                });
        }
        this.editMode = false;
    };

    /**
     * Универсальный toggle выбора строки (для circle-row клика).
     * @param event — событие клика
     * @param checkEditChanges — проверять несохранённые изменения перед снятием выделения
     */
    public readonly toggleRowSelection = (event: Event, checkEditChanges: boolean = true): void => {
        const circle = $(event.currentTarget);
        const currentRow = circle.closest('.table-row, .row-items-row');
        const currentRowId: string = currentRow.attr('id');
        const changes = checkEditChanges ? currentRow.find('.change').length : 0;

        if (this.editMode && changes > 0) {
            this.createNotification("Сохраните изменения", NotificationType.WARNING);
            return;
        }

        if (!this.selectedRows.has(currentRowId)) {
            this.selectedRows.add(currentRowId);
            currentRow.addClass('selected');
            circle.addClass('active-critical');
        } else {
            this.selectedRows.delete(currentRowId);
            currentRow.removeClass('selected');
            circle.removeClass('active-critical');
            // Снимаем выделение с header-circle если нет выбранных строк
            if (this.selectedRows.size === 0) {
                $('.circle-header').removeClass('active');
            }
        }
    };

    /**
     * Выбрать/снять все видимые строки (для circle-header).
     * @param event — событие
     * @param rowSelector — селектор строки (по умолчанию '.table-row')
     * @param circleRowSelector — селектор кружка в строке
     */
    public readonly toggleAllRowsSelection = (
        event: Event,
        rowSelector: string = '.table-row',
        circleRowSelector: string = '.circle-row'
    ): void => {
        if (this.editMode) {
            this.createNotification('Выключите режим редактирования', NotificationType.INFO);
            return;
        }
        const circle = $(event.currentTarget);
        const allRows = $(`${rowSelector}:visible`);

        if (circle.hasClass('active')) {
            this.selectedRows.clear();
            allRows.removeClass('selected');
            allRows.each((_, row) => {
                $(row).find(circleRowSelector).removeClass('active-critical');
            });
            circle.removeClass('active');
        } else {
            this.selectedRows.clear();
            allRows.each((_, row) => {
                const $row = $(row);
                const rowId = $row.attr('id');
                this.selectedRows.add(rowId);
                $row.addClass('selected');
                $row.find(circleRowSelector).addClass('active-critical');
            });
            circle.addClass('active');
        }
    };

    /**
     * Привязывает обработчик input для отслеживания изменений в полях строки.
     * Автоматически сохраняет в saveMassive[id][name] = value.
     */
    public readonly bindFieldChanges = (
        fieldSelector: string = '[data-name]',
        rowSelector: string = '.table-row'
    ): void => {
        this.createHandler('input', fieldSelector, (event: Event) => {
            const $el = $(event.target);
            const id = $el.closest(rowSelector).attr('id');
            const name = $el.attr('data-name');
            const value = $el.is('div') ? $el.text().trim() : $el.val();
            this.saveMassive[id] = {...this.saveMassive[id], [name]: value};
            $el.addClass('change');
        }, true);
    };

    /**
     * Универсальный диалог выбора элемента из списка с поиском.
     * @param fieldName — имя поля ('employee' / 'subDivision')
     * @param dialogId — ID диалога
     * @param modalDiv — jQuery-элемент, куда вставить результат
     * @param currentId — ID текущей строки (для saveMassive)
     * @param dataFilter — опциональный фильтр данных
     * @param columns — колонки для рендера [{key, label}]
     */
    public readonly openSelectionDialog = async (
        fieldName: string,
        dialogId: string,
        modalDiv: any,
        currentId?: string | number,
        rawData?: any[],
        dataFilter?: (items: any[]) => any[],
        columns: ({ key?: string, label: string, width?: string, renderer?: (item:any)=>string }[]) = [{key: 'name', label: 'Наименование', width: '250'}],
        multiSelect: boolean = false
    ): Promise<void> => {
        const dialog = $(`#${dialogId}`);
        const rowContainer = dialog.find('.dialog-content-rows');
        const searchInput = dialog.find('.choice-field input');
        const changeButton = dialog.find('[id^="change"]').first();
        let selected: any;

        const raw = rawData ? rawData : await this.cache.get(fieldName);
        const data = dataFilter ? dataFilter(raw) : raw || [];

        const getValue = (item: any, col: any) => {
            if (col.renderer) return col.renderer(item);
            if (col.key && col.key.indexOf('.') !== -1) {
                return col.key.split('.').reduce((acc: any, p: string) => acc ? acc[p] : '', item) || '';
            }
            return col.key ? (item[col.key] || item[col.key + 'Name'] || '') : '';
        };

        const renderRows = (items: any[]) => {
            rowContainer.empty();
            items.forEach(item => {
                let colsHtml = columns.map(col =>
                    `<div class="content-row-column col-${col.width || '250'}">${this.escapeHtml(String(getValue(item, col) || ''))}</div>`
                ).join('');
                if (multiSelect) {
                    colsHtml = `<div class="content-row-column col-40"><input type="checkbox" class="selection-checkbox" data-id="${item.id}"></div>` + colsHtml;
                }
                rowContainer.append(`<div class="dialog-content-rows-row" data-id="${item.id}">${colsHtml}</div>`);
            });
        };

        renderRows(data);

        searchInput.off('input').on('input', function (this: HTMLInputElement) {
            const searchText = $(this).val()!.toString().toLowerCase().trim();
            const filtered = data.filter((e: any) =>
                columns.some(col => (getValue(e, col) || '').toString().toLowerCase().includes(searchText))
            );

            renderRows(filtered);
        });

        this.dialog.open(dialogId);

        if (!multiSelect) {
            rowContainer.off('click').on('click', '.dialog-content-rows-row', function (this: HTMLElement) {
                    const id = $(this).data('id');
                    selected = data.find((e: any) => e.id === id);
                    $('.dialog-content-rows-row').removeClass('selected');
                    $(this).addClass('selected');
                }
            );
        } else {
            // Handle checkbox toggling
            rowContainer.off('change', '.selection-checkbox').on('change', '.selection-checkbox', function (this: HTMLInputElement) {
                const id = $(this).data('id');
                // toggle selected array stored in closure variable selected (as array)
                if (!Array.isArray(selected)) selected = [];
                const idx = selected.findIndex((s: any) => s.id == id);
                if ((this as any).checked) {
                    if (idx === -1) selected.push(data.find((e: any) => e.id == id));
                } else {
                    if (idx !== -1) selected.splice(idx, 1);
                }
            });
        }

        changeButton.off('click').on('click', () => {
            if (!selected || (Array.isArray(selected) && selected.length === 0)) {
                const label = fieldName === 'employee' ? 'сотрудника' : 'элемент';
                this.createNotification(`Выберите ${label} из списка`, NotificationType.WARNING);
                return;
            }

            if (!multiSelect) {
                modalDiv.text(selected.name);
                modalDiv.val(selected.name);
            } else {
                const selectedItems = Array.isArray(selected) ? selected : [];
                const names = selectedItems.map((s: any) => s.name).join(', ');
                modalDiv.val(names);
                modalDiv.text(names);
            }

            if (currentId) {
                this.saveMassive[currentId] = {...this.saveMassive[currentId], [fieldName]: selected};
            } else {
                this.saveMassive[fieldName] = selected;
            }

            // If there is a hidden input in a containing form, set its value (useful for older create dialogs)
            try {
                const form = modalDiv.closest('form');
                if (form.length) {
                    const hidden = form.find(`input[name="hidden${fieldName.charAt(0).toUpperCase()+fieldName.slice(1)}"]`);
                    if (hidden.length) hidden.val(JSON.stringify(selected));
                }
            } catch (e) {
                // ignore
            }

            modalDiv.addClass('change-textarea');
            this.dialog.close(dialogId);
        });

        modalDiv.addClass('change');
    };

    /**
     * Универсальный диалог просмотра/загрузки файлов документа.
     * @param event — событие клика на иконку документа
     * @param documentId — ID документа (или поле в кэше)
     * @param getDocumentUrl — URL для получения документа
     * @param uploadUrlBase — базовый URL для загрузки (с условием PATCH/POST)
     * @param deleteUrlBase — базовый URL для удаления
     * @param onFileAdded — колбэк после добавления файла
     */
    public readonly openDocumentDialog = async (
        event: Event,
        documentId: number | null,
        getDocumentUrl: string,
        uploadUrlBase: string,
        deleteUrlBase: string,
        onFileAdded?: (files: any) => void
    ): Promise<void> => {
        const dialog = $('#documentDialog');
        const currentRow = $(event.currentTarget).closest('.table-row, .table-card, .row-items-row');
        const rowId = currentRow.attr('id');
        const rowContainer = dialog.find('.dialog-content-rows');

        rowContainer.empty();

        if (documentId !== null) {
            const document: any = await this.requestToApi(getDocumentUrl, "GET");
            this.localCache.set('document', document);
            document.files?.forEach((file: any) => {
                this.createDocumentFileRow(file, rowContainer, deleteUrlBase);
            });
        }

        rowContainer.append(`
            <div class="dialog-content-rows-row" id="newFileRow" style="height: 50px">
                <div class="content-row-column col-450" style="border: none;"></div>
                <div class="content-row-column col-100"></div>
                <div class="content-row-column col-100 center" style="padding: 0;border-bottom: 1px solid var(--border-color);">
                    <i style="float: right" class="uploadIcon upload-file fas fa-file-upload tooltip-trigger" data-description="Добавить документацию" onclick="$('#fileInput').click()"></i>
                    <input type="file" id="fileInput" style="display: none;"/>
                </div>
            </div>`
        );

        dialog.off('change', '#fileInput').on('change', '#fileInput', (e) => {
            const input = e.target as HTMLInputElement;
            if (input.files && input.files.length > 0) {
                Array.from(input.files).forEach((file) => {
                    const fileName = file.name;
                    if (rowContainer.find(`.col-450:contains("${fileName}")`).length > 0) {
                        this.createNotification(`Файл "${fileName}" уже существует`, NotificationType.WARNING);
                        return;
                    }
                    this.uploadDocumentFile(e, rowId, documentId, uploadUrlBase, (files) => {
                        rowContainer.find('#newFileRow').remove();
                        const fileList = files.files || files;
                        for (const f of fileList) {
                            this.createDocumentFileRow(f, rowContainer, deleteUrlBase);
                        }
                        if (onFileAdded) onFileAdded(files);
                    });
                });
            }
        });

        // Контекстное меню удаления файла
        dialog.off('contextmenu', '.dialog-content-rows-row').on('contextmenu', '.dialog-content-rows-row', (ev: Event) => {
            const $row = $(ev.currentTarget);
            const fileId = $row.attr('id');
            if (!fileId || fileId === 'newFileRow') return;
            ev.preventDefault();
            const mouseEv = ev as MouseEvent;
            this.createContextMenu([
                {
                    label: 'Удалить файл',
                    idAction: "deleteFileButton",
                    action: () => {
                        this.deleteEntity(`${deleteUrlBase}/${fileId}`).then(() => {
                            this.createNotification('Файл успешно удален', NotificationType.SUCCESS);
                            this.deleteRow(fileId);
                        });
                    }
                }
            ], mouseEv.clientX, mouseEv.clientY);
        });

        this.dialog.open('documentDialog');
    };

    /**
     * Создаёт строку файла в диалоге документов.
     */
    public readonly createDocumentFileRow = (file: any, rowContainer: any, deleteUrlBase: string): void => {
        const rowHtml = `
            <div class="dialog-content-rows-row" id="${file.id}">
                <div class="content-row-column col-450">${file.baseFileName}</div>
                <div class="content-row-column col-100 center">${file.type}</div>
                <div class="content-row-column col-100 file-items">
                    <i class="fas fa-arrows-rotate reload-icon tooltip-trigger" data-description="Обновить документацию" data-file-id="${file.id}" onclick="$('#reloadFileInput').click()"></i>
                    <input type="file" id="reloadFileInput" class="reload-file-input" style="display: none;"/>
                    <i style="float: right" class="download fas fa-download tooltip-trigger" data-description="Скачать документацию" data-file-id="${file.id}"></i>
                </div>
            </div>`;
        rowContainer.append(rowHtml);
    };

    /**
     * Загрузка файла в документ.
     */
    public readonly uploadDocumentFile = async (
        event: Event,
        rowId: string,
        documentId: number | null,
        uploadUrlBase: string,
        onSuccess: (files: any) => void
    ): Promise<void> => {
        const formData = new FormData();
        const currentInput = event.currentTarget as HTMLInputElement;
        if (currentInput.files) {
            Array.from(currentInput.files).forEach(file => formData.append('files', file));
        }

        const url = documentId
            ? `${uploadUrlBase}/${documentId}`
            : uploadUrlBase;
        const requestType = documentId ? 'PATCH' : 'POST';
        const unlock = this.lockScreen();

        this.requestToApi(url, requestType, formData)
            .then(onSuccess)
            .catch(console.error)
            .then(() => unlock());

        currentInput.value = '';
    };

    /**
     * Обработчик клика на иконку скачивания в диалоге.
     * @param event — событие
     * @param baseUrl — базовый URL для скачивания (без ID файла)
     */
    public readonly handleDownloadFileFromDialog = (event: Event, baseUrl: string): void => {
        const fileId = $(event.target).closest('.dialog-content-rows-row').attr('id');
        if (fileId) {
            this.downloadFile(`${baseUrl}/${fileId}`).catch(console.error);
        } else {
            this.createNotification("Файл не найден", NotificationType.INFO);
        }
    };
    /**
     * Создаёт контекстное меню с пунктом «Удалить» для строки.
     * @param event — событие contextmenu
     * @param deleteUrl — URL удаления (с ID строки)
     * @param entityName — название сущности для сообщения
     * @param nameSelector — селектор для получения имени (по умолчанию '[data-name="name"]')
     * @param onAfterDelete — колбэк после удаления
     */
    public readonly createRowDeleteContextMenu = (
        event: Event,
        deleteUrl: string,
        entityName: string = 'запись',
        nameSelector: string = '[data-name="name"]',
        onAfterDelete?: () => void
    ): void => {
        if ($(event.target).is('div[contenteditable="true"]') || $(event.target).closest('div[contenteditable="true"]').length > 0) {
            return;
        }
        event.preventDefault();
        const mouseEvent = event as MouseEvent;
        const $row = $(event.currentTarget);
        const rowName = $row.find(nameSelector).text().trim();
        const rowId = $row.attr('id');

        this.createContextMenu([
            {
                label: 'Удалить',
                idAction: "deleteEntityButton",
                action: () => {
                    this.createConfirmationDialog(`Подтвердите удаление ${entityName}: {name}`, {name: rowName}).then((confirmed) => {
                        // @ts-ignore
                        if (confirmed) {
                            this.deleteEntity(`${deleteUrl}/${rowId}`).then(() => {
                                this.deleteRow(rowId);
                                this.createNotification(`${entityName} успешно удалён(а)`, NotificationType.SUCCESS);
                                if (onAfterDelete) onAfterDelete();
                            }).catch(() => {
                                this.createNotification(`Ошибка при удалении ${entityName}`, NotificationType.ERROR);
                            });
                        }
                    });
                }
            }
        ], mouseEvent.clientX, mouseEvent.clientY);
    };

    /**
     * Универсальный обработчик формы создания сущности.
     * @param event — событие
     * @param url — URL для POST
     * @param dialogId — ID диалога с формой
     * @param extractData — функция извлечения данных из формы {fieldName: $dialog => value}
     * @param onSuccess — колбэк (newItem) => void
     * @param useFormData — использовать FormData (true) или JSON (false)
     */
    public readonly handleCreateForm = async (
        event: Event,
        url: string,
        dialogId: string,
        extractData: ($dialog: any) => any,
        onSuccess: (newItem: any) => void,
        useFormData: boolean = false
    ): Promise<void> => {
        event.preventDefault();
        const button = $(event.target);
        const dialog = $(`#${dialogId}`);
        const form = button.closest('form').get(0);

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        button.prop('disabled', true);

        let payload: any;
        if (useFormData) {
            payload = new FormData(form);
        } else {
            const data = extractData(dialog);
            payload = data instanceof FormData ? data : JSON.stringify(data);
        }

        try {
            const newItem = await this.createEntity(url, payload);
            this.saveMassive = {};
            this.localCache.set(newItem.id, newItem);
            this.dialog.close(dialogId);
            onSuccess(newItem);
            this.createNotification('Успешно создано', NotificationType.SUCCESS);
        } catch (error) {
            this.saveMassive = {};
            form?.reset?.();
            this.createNotification('Ошибка при создании', NotificationType.ERROR);
        } finally {
            button.prop('disabled', false);
        }
    };

    /**
     * Универсальное сохранение изменений из saveMassive.
     * @param updateUrl — URL обновления
     * @param getItemVersionAndChanges — функция для маппинга из кэша
     */
    public readonly saveMassiveChanges = async (
        updateUrl: string,
        getItemVersionAndChanges: (id: string | number, cacheItem: any, changes: any) => { id: string | number, version: number, changes: any }
    ): Promise<void> => {
        if (Object.keys(this.saveMassive).length === 0) return;

        const itemsArray = Object.keys(this.saveMassive).map(id => {
            const cacheData = this.localCache.get(id) ?? this.localCache.get(Number(id));
            return getItemVersionAndChanges(id, cacheData, this.saveMassive[id]);
        });

        await this.save(updateUrl, ...itemsArray);
        this.selectedRows.forEach(id => this.selectedRows.delete(id));
    };

}

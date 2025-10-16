var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// @ts-ignore
class Base {
    constructor(itemsPerPage = Infinity, ...initCallbacks) {
        this.locks = new Map();
        this.handlers = [];
        this.selectedRows = new Set();
        this.localCache = new Map();
        this.currentPage = 1;
        this.saveMassive = {};
        //Блокировка параллельного выполнения
        this.lock = (fn) => (...args) => __awaiter(this, void 0, void 0, function* () {
            const key = fn.name;
            if (this.locks.get(key))
                return;
            this.locks.set(key, true);
            try {
                return yield fn(...args);
            }
            finally {
                this.locks.set(key, false);
            }
        });
        this.createHandler = (event, selector, handler, locked = false) => {
            this.handlers.push({
                event,
                selector,
                handler: locked ? this.lock(handler) : handler,
            });
        };
        this.updateRow = (item, rowIndex) => {
            const $oldRow = $(`[data-index="${rowIndex}"]`);
            const $newRow = this.createRow(item);
            $oldRow.fadeOut(300, () => {
                $oldRow.replaceWith($newRow);
                $newRow.hide().fadeIn(300);
                this.localCache.set(item.id, item);
            });
        };
        this.switchVisibilityRow = (rowIndex, hide) => {
            $(`[data-index="${rowIndex}"]`)[hide ? 'fadeOut' : 'fadeIn'](300);
        };
        this.deleteRow = (rowIndex) => {
            const $row = $(`#${rowIndex}`);
            $row.fadeOut(300, () => {
                $row.remove();
                this.localCache.delete(rowIndex);
            });
        };
        this.displayPage = this.lock((url, type, param, ...callbacks) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.requestToApi(url, type, param);
            for (const item of data) {
                this.localCache.set(item.id, item);
                this.createRow(item);
            }
            callbacks.forEach(callback => callback(data));
        }));
        this.save = (url, ...items) => __awaiter(this, void 0, void 0, function* () {
            const results = yield Promise.all(items.map(item => this.requestToApi(`${url}/${item.id}`, 'PATCH', item)));
            items.forEach(item => {
                this.localCache.set(item.id, item);
                this.updateRow(item, item.id);
            });
            return results;
        });
        this.requestToApi = (url, type, param) => __awaiter(this, void 0, void 0, function* () {
            const isFormData = param instanceof FormData;
            return yield $.ajax({
                url: url,
                method: type,
                contentType: isFormData ? false : 'application/json',
                processData: !isFormData,
                data: param
            });
        });
        this.print = (url, params) => __awaiter(this, void 0, void 0, function* () {
            window.open(url + (Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''));
        });
        this.downloadFile = (url, params) => __awaiter(this, void 0, void 0, function* () {
            try {
                const file = yield this.requestToApi(url, 'GET', params);
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
            }
            catch (error) {
                this.createNotification('Ошибка при скачивании файла', NotificationType.ERROR).catch(console.error);
            }
        });
        this.createEntity = (url, dto) => {
            return this.requestToApi(url, 'POST', dto);
        };
        this.deleteEntity = (url) => {
            return this.requestToApi(url, 'DELETE');
        };
        //Создание уведомления в левом верхнем углу
        this.createNotification = this.lock((message, type, params) => {
            const text = params ? message.replace(/{(\w+)}/g, (m, k) => params[k]) : message;
            const $note = $(`<div class="notification ${type}">
            <div class="msg">${text}</div>
        </div>`).appendTo('body');
            setTimeout(() => $note.addClass('show'), 10);
            setTimeout(() => $note.remove(), 10000);
        });
        //Контекстное меню
        this.createContextMenu = (items, x, y) => {
            $('#context-menu').remove();
            const menu = $('<div id="context-menu"></div>');
            items.forEach(item => menu.append(`<div>${item.label}</div>`).on('click', item.action));
            $('body').append(menu.css({ left: x + 'px', top: y + 'px' }));
            $(document).one('click', () => menu.remove());
        };
        this.formatDate = (dateString) => {
            if (!dateString)
                return "";
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU');
        };
        this.itemsPerPage = itemsPerPage;
        this.init(...initCallbacks);
    }
    init(...callbacks) {
        $(() => {
            this.initializeHandlers();
            callbacks.forEach(callback => callback());
        });
    }
    initializeHandlers() {
        this.handlers.forEach(({ event, selector, handler }) => {
            $(document).on(event, selector, handler);
        });
    }
}
var NotificationType;
(function (NotificationType) {
    NotificationType["SUCCESS"] = "success";
    NotificationType["ERROR"] = "error";
    NotificationType["WARNING"] = "warning";
    NotificationType["INFO"] = "info";
})(NotificationType || (NotificationType = {}));
window.cache = {
    endpoints: { employee: '/api/employees', subDivision: '/api/sub-divisions' },
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const cached = sessionStorage.getItem(key);
            if (cached)
                return JSON.parse(cached);
            const endpoint = this.endpoints[key];
            if (!endpoint)
                throw new Error(`Такого api нет: ${key}`);
            const response = yield fetch(endpoint);
            if (!response.ok)
                throw new Error(`Возникла ошибка сервера: ${response.status}`);
            const data = yield response.json();
            this.set(key, data);
            return data;
        });
    },
    set(key, data) {
        sessionStorage.setItem(key, JSON.stringify(data));
        return this;
    }
};

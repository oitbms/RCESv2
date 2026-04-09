class DialogImpl {
    constructor() {
        this.activeDialogs = new Map();
        this.BASE_Z_INDEX = 999;
        this.BACKDROP_Z_INDEX = 998;
        const rootStyle = getComputedStyle(document.documentElement);
        const cssZIndex = rootStyle.getPropertyValue('--dialog-z-index');
        this.currentZIndex = cssZIndex ? parseInt(cssZIndex) : this.BASE_Z_INDEX;
    }
    open(dialogId, options = {}) {
        const dialogElement = document.getElementById(dialogId);
        if (!dialogElement) {
            console.error(`Диалог с id ${dialogId} не найден`);
            return;
        }
        if (this.isOpen(dialogId)) {
            return;
        }
        if (options.clearFields !== false) {
            this.clearDialog(dialogId);
        }
        dialogElement.style.zIndex = this.currentZIndex.toString();
        if (this.activeDialogs.size === 0) {
            document.body.classList.add('no-scroll');
            this.addBackdrop();
        }
        else {
            this.activeDialogs.forEach((_, id) => {
                const el = document.getElementById(id);
                if (el)
                    el.style.display = 'none';
            });
        }
        // Используем show() вместо showModal() — backdrop управляется вручную
        dialogElement.show();
        this.activeDialogs.set(dialogId, this.currentZIndex);
        this.currentZIndex++;
        document.documentElement.style.setProperty('--dialog-z-index', this.currentZIndex.toString());
        this.setupCloseHandlers(dialogId, options.onClose);
        if (options.onOpen) {
            options.onOpen();
        }
    }
    close(dialogId) {
        var _a;
        const dialogElement = document.getElementById(dialogId);
        if (!dialogElement)
            return;
        (_a = dialogElement.close) === null || _a === void 0 ? void 0 : _a.call(dialogElement);
        dialogElement.style.display = '';
        this.activeDialogs.delete(dialogId);
        if (this.activeDialogs.size === 0) {
            document.body.classList.remove('no-scroll');
            this.removeBackdrop();
            const rootStyle = getComputedStyle(document.documentElement);
            const cssZIndex = rootStyle.getPropertyValue('--dialog-z-index');
            this.currentZIndex = cssZIndex ? parseInt(cssZIndex) : this.BASE_Z_INDEX;
        }
        else {
            const maxZIndex = Math.max(...Array.from(this.activeDialogs.values()));
            this.currentZIndex = maxZIndex + 1;
            document.documentElement.style.setProperty('--dialog-z-index', this.currentZIndex.toString());
            let topDialogId = '';
            this.activeDialogs.forEach((zIndex, id) => {
                if (zIndex === maxZIndex)
                    topDialogId = id;
            });
            if (topDialogId) {
                const topDialog = document.getElementById(topDialogId);
                if (topDialog) {
                    topDialog.style.removeProperty('display');
                }
            }
        }
    }
    clearDialog(dialogId) {
        const dialog = document.getElementById(dialogId);
        if (!dialog)
            return;
        const inputs = dialog.querySelectorAll('input[name], textarea[name], select[name]');
        inputs.forEach((input) => {
            var _a;
            const htmlInput = input;
            if (htmlInput.type === 'file') {
                const newInput = htmlInput.cloneNode(false);
                (_a = htmlInput.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(newInput, htmlInput);
            }
            else {
                htmlInput.value = '';
            }
        });
        const fileList = dialog.querySelector('.file-list');
        if (fileList) {
            fileList.innerHTML = '';
        }
        const localCache = window.localCache;
        if (localCache) {
            localCache.delete('validFileMap');
            localCache.delete('imagesMap');
        }
    }
    setupCloseHandlers(dialogId, onCloseCallback) {
        const dialogElement = document.getElementById(dialogId);
        if (!dialogElement)
            return;
        // Клик по backdrop закрывает диалог
        const handleBackdropClick = (e) => {
            const rect = dialogElement.getBoundingClientRect();
            const isInDialog = (rect.top <= e.clientY &&
                e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX &&
                e.clientX <= rect.left + rect.width);
            if (!isInDialog) {
                this.close(dialogId);
                if (onCloseCallback)
                    onCloseCallback();
            }
        };
        // Escape закрывает верхний диалог
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && this.isOpen(dialogId)) {
                const maxZIndex = Math.max(...Array.from(this.activeDialogs.values()));
                const currentZIndex = this.activeDialogs.get(dialogId);
                if (currentZIndex === maxZIndex) {
                    e.preventDefault();
                    this.close(dialogId);
                    if (onCloseCallback)
                        onCloseCallback();
                }
            }
        };
        // Удаляем старые обработчики (по новым ссылкам)
        const oldBackdropClick = dialogElement._dialogBackdropClick;
        const oldKeyDown = dialogElement._dialogKeyDown;
        if (oldBackdropClick)
            dialogElement.removeEventListener('click', oldBackdropClick);
        if (oldKeyDown)
            document.removeEventListener('keydown', oldKeyDown);
        dialogElement.addEventListener('click', handleBackdropClick);
        document.addEventListener('keydown', handleKeyDown);
        // Сохраняем ссылки для последующего удаления
        dialogElement._dialogBackdropClick = handleBackdropClick;
        dialogElement._dialogKeyDown = handleKeyDown;
        // Кнопка отмены
        const cancelBtn = dialogElement.querySelector('[name="closeDialog"], #cancelButton');
        if (cancelBtn) {
            const oldCancel = cancelBtn._dialogCancelClick;
            if (oldCancel)
                cancelBtn.removeEventListener('click', oldCancel);
            const handleCancel = () => {
                this.close(dialogId);
                if (onCloseCallback)
                    onCloseCallback();
            };
            cancelBtn.addEventListener('click', handleCancel);
            cancelBtn._dialogCancelClick = handleCancel;
        }
    }
    addBackdrop() {
        if (!document.querySelector('.backdrop')) {
            const backdrop = document.createElement('div');
            backdrop.className = 'backdrop';
            backdrop.style.zIndex = this.BACKDROP_Z_INDEX.toString();
            document.body.appendChild(backdrop);
        }
    }
    removeBackdrop() {
        const backdrop = document.querySelector('.backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    }
    isOpen(dialogId) {
        const dialogElement = document.getElementById(dialogId);
        if (!dialogElement)
            return false;
        return this.activeDialogs.has(dialogId);
    }
    closeAll() {
        const dialogIds = Array.from(this.activeDialogs.keys());
        dialogIds.forEach(dialogId => {
            var _a;
            const dialogElement = document.getElementById(dialogId);
            if (dialogElement) {
                (_a = dialogElement.close) === null || _a === void 0 ? void 0 : _a.call(dialogElement);
                dialogElement.style.display = '';
            }
        });
        this.activeDialogs.clear();
        document.body.classList.remove('no-scroll');
        this.removeBackdrop();
        const rootStyle = getComputedStyle(document.documentElement);
        const cssZIndex = rootStyle.getPropertyValue('--dialog-z-index');
        this.currentZIndex = cssZIndex ? parseInt(cssZIndex) : this.BASE_Z_INDEX;
    }
}

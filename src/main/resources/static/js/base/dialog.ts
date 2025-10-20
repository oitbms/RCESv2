interface Dialog {
    open(dialogId: string, options?: DialogOptions): void;
    close(dialogId: string): void;
    clearDialog(dialogId: string): void;
    isOpen(dialogId: string): boolean;
    closeAll(): void;
}

interface DialogOptions {
    clearFields?: boolean;
    onClose?: () => void;
    onOpen?: () => void;
}

class DialogImpl implements Dialog {
    private activeDialogs: Set<string> = new Set();

    open(dialogId: string, options: DialogOptions = {}): void {
        const dialogElement = document.getElementById(dialogId) as HTMLDialogElement;
        if (!dialogElement) {
            console.error(`Dialog with id ${dialogId} not found`);
            return;
        }
        if (options.clearFields !== false) {
            this.clearDialog(dialogId);
        }

        dialogElement.showModal();
        this.activeDialogs.add(dialogId);

        this.setupCloseHandlers(dialogId, options.onClose);

        if (options.onOpen) {
            options.onOpen();
        }
    }

    close(dialogId: string): void {
        const dialogElement = document.getElementById(dialogId) as HTMLDialogElement;
        if (dialogElement) {
            dialogElement.close();
            this.clearDialog(dialogId);
            this.activeDialogs.delete(dialogId);
        }
    }

    clearDialog(dialogId: string): void {
        const dialog = document.getElementById(dialogId);
        if (!dialog) return;

        const inputs = dialog.querySelectorAll('input[name], textarea[name], select[name]');
        inputs.forEach((input: Element) => {
            const htmlInput = input as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
            if (htmlInput.type === 'file') {
                // Для файловых инпутов создаем новый элемент
                const newInput = htmlInput.cloneNode(false) as HTMLInputElement;
                htmlInput.parentNode?.replaceChild(newInput, htmlInput);
            } else {
                htmlInput.value = '';
            }
        });

        const fileList = dialog.querySelector('.file-list');
        if (fileList) {
            fileList.innerHTML = '';
        }

        const localCache = (window as any).localCache as Map<string, any>;
        if (localCache) {
            localCache.delete('validFileMap');
            localCache.delete('imagesMap');
        }
    }

    private setupCloseHandlers(dialogId: string, onCloseCallback?: () => void): void {
        const dialogElement = document.getElementById(dialogId) as HTMLDialogElement;
        if (!dialogElement) return;

        const handleDialogClick = (e: MouseEvent) => {
            if (e.target === dialogElement) {
                this.close(dialogId);
                if (onCloseCallback) onCloseCallback();
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Escape' || e.key === 'Esc') && this.isOpen(dialogId)) {
                this.close(dialogId);
                if (onCloseCallback) onCloseCallback();
            }
        };
        dialogElement.removeEventListener('click', handleDialogClick.bind(this));
        document.removeEventListener('keydown', handleKeyDown.bind(this));

        dialogElement.addEventListener('click', handleDialogClick);
        document.addEventListener('keydown', handleKeyDown);

        const cancelBtn = dialogElement.querySelector('#cancelButton') as HTMLButtonElement;
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                this.close(dialogId);
                if (onCloseCallback) onCloseCallback();
            };
        }
    }

    isOpen(dialogId: string): boolean {
        return this.activeDialogs.has(dialogId);
    }

    closeAll(): void {
        this.activeDialogs.forEach(dialogId => {
            this.close(dialogId);
        });
    }
}
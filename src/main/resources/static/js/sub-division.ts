import {DocumentFile} from "./core/types";
import {describeError, fetchJson} from "./core/http";
import {initOtherSection, OtherFile} from "./core/other-section";
import {FilterableItem, initListFilter} from "./core/list-filter";
import {escapeHtml} from "./core/html";

interface SubDivision {
    id: number;
    subDivisionId?: number;
    subDivisionName: string;
    itemNumber: number;
    pdfs?: DocumentFile[];
    imageUrls?: any[];
    otherText?: string | null;
    otherPdfs?: OtherFile[];
}

interface ImageFile {
    id: string;
    name: string;
    data: string;
}

interface DocumentFileSubDivision {
    id: string;
    baseFileName: string;
}

interface SubDivisionMachine {
    id: string;
    name: string;
}

declare var Choices: any;
declare var QRCode: any;

class MachineManager {
    private readonly apiUrl = '/api/v1/sub-division';
    private readonly subDivisionApiUrl = '/api/sub-divisions';
    private imageModalInstance: any = null;

    private choicesInstances: { [key: string]: any } = {};
    private readonly canEdit = document.body.dataset.canEdit === 'true';

    constructor() {
        this.init();
    }

    private init(): void {
        if (document.getElementById('sub-division-table-body')) {
            this.initListPage();
        } else if (document.getElementById('sub-division-form')) {
            this.initFormPage();
        } else if (document.getElementById('sub-division-content')) {
            this.initDetailsPage();
        }
    }

    private async fetchData(url: string, options: RequestInit = {}): Promise<any> {
        return fetchJson(url, options);
    }

    private showError(error: unknown, action: string): void {
        console.error(action, error);
        this.showToast(describeError(error, action), 'danger');
    }

    private showLoading(show: boolean): void {
        const indicator = document.getElementById('buildings-loading-indicator') ?? document.getElementById('loading-indicator');
        if (indicator) {
            indicator.style.display = show ? 'block' : 'none';
        }
    }

    private async initListPage(): Promise<void> {
        this.showLoading(true);
        try {
            const subDivisions: SubDivision[] = await this.fetchData(this.apiUrl);

            const items: FilterableItem[] = subDivisions.map(s => {
                const subDivision = escapeHtml(s.subDivisionName);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${subDivision || '—'}</td>
                    <td class="tabular-nums">${s.itemNumber}</td>
                    <td>
                        <div class="d-flex justify-content-end gap-2">
                            <a href="/sub-division/${s.id}" class="btn btn-sm btn-outline-secondary icon-text" title="Просмотр">
                                <i class="bi bi-eye"></i>
                            </a>
                            ${this.canEdit ? `<a href="/sub-division/${s.id}/edit" class="btn btn-sm btn-outline-primary icon-text" title="Редактировать">
                                <i class="bi bi-pencil"></i>
                            </a>` : ''}
                        </div>
                    </td>
                `;

                const card = document.createElement('div');
                card.className = 'card mb-3';
                card.innerHTML = `
                        <div>
                            <h5 class="card-title mt-2 ms-2">${subDivision || 'Подразделение не указано'}</h5>
                            <h6 class="card-subtitle mb-2 ms-2 text-muted">Инвентарный номер: ${s.itemNumber}</h6>
                            <div class="d-flex justify-content-end gap-2 mt-3 mb-2 me-2">
                                <a href="/sub-division/${s.id}" class="btn btn-sm btn-outline-secondary icon-text">
                                    <i class="bi bi-eye"></i>
                                    <span>Просмотр</span>
                                </a>
                                ${this.canEdit ? `<a href="/sub-division/${s.id}/edit" class="btn btn-sm btn-outline-primary icon-text">
                                    <i class="bi bi-pencil"></i>
                                    <span>Редактировать</span>
                                </a>` : ''}
                            </div>
                        </div>
                `;

                return {
                    searchText: [s.subDivisionName, s.itemNumber].join(' '),
                    subDivisionName: s.subDivisionName,
                    row,
                    card,
                };
            });

            initListFilter({
                items,
                tableBody: document.getElementById('sub-division-table-body')!,
                cardView: document.getElementById('sub-division-card-view')!,
                searchInput: document.getElementById('buildings-search') as HTMLInputElement | null,
                subDivisionSelect: document.getElementById('buildings-subdivision-filter') as HTMLSelectElement | null,
                emptyMessage: document.getElementById('buildings-empty'),
                allLabel: 'Все подразделения',
            });
        } catch (error) {
            this.showError(error, 'Ошибка при загрузке зданий');
        } finally {
            this.showLoading(false);
        }
    }

    private async initFormPage(): Promise<void> {
        const form = document.getElementById('sub-division-form') as HTMLFormElement;
        const formTitle = document.getElementById('form-title')!;
        const numberInput = document.getElementById('number') as HTMLInputElement;

        const pathParts = window.location.pathname.split('/');
        const subDivisionCode = pathParts[pathParts.length - 2];
        const isEditMode = pathParts[pathParts.length - 1] === 'edit' && subDivisionCode;

        await this.getSubDivisionSelects();

        if (isEditMode) {
            formTitle.textContent = 'Редактирование здания';
            // Редактирование отправляет только JSON — файлы отсюда не сохранились бы, поэтому поля скрываем
            form.querySelectorAll<HTMLElement>('[data-create-only]').forEach(el => el.classList.add('d-none'));
            form.querySelectorAll<HTMLElement>('[data-edit-only]').forEach(el => el.classList.remove('d-none'));
            this.showLoading(true);
            try {
                const subDivision: SubDivision = await this.fetchData(`${this.apiUrl}/${subDivisionCode}`);
                numberInput.value = String(subDivision.itemNumber);
                if (subDivision.subDivisionId != null) {
                    this.choicesInstances['subDivision']?.setChoiceByValue(String(subDivision.subDivisionId));
                }

            } catch (error) {
                this.showError(error, 'Не удалось загрузить данные здания');
            } finally {
                this.showLoading(false);
            }
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const url = isEditMode ? `${this.apiUrl}/${subDivisionCode}` : this.apiUrl;

            try {
                if (isEditMode) {
                    const subDivisionData = {
                        itemNumber: Number(numberInput.value),
                        subDivisionId: Number((form.elements.namedItem('subDivisionId') as HTMLSelectElement).value) || null,
                    };
                    await this.fetchData(url, {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(subDivisionData)
                    });

                } else {
                    const formData = new FormData(form);

                    await this.fetchData(url, {
                        method: 'POST',
                        body: formData
                    });
                }

                this.showToast(`Здание успешно ${isEditMode ? 'обновлено' : 'создано'}!`, 'success');
                window.location.href = '/sub-division';
            } catch (error) {
                this.showError(error, 'Ошибка при сохранении здания');
            }
        });
    }

    private async initDetailsPage(): Promise<void> {
        const contentDiv = document.getElementById('sub-division-content')!;
        const pathParts = window.location.pathname.split('/');
        const subDivisionCode = pathParts[pathParts.length - 1];

        if (!subDivisionCode) return;

        const imageModalEl = document.getElementById('imageViewerModal');
        if (imageModalEl) {
            const modal = (window as any).bootstrap.Modal.getOrCreateInstance(imageModalEl);
            this.imageModalInstance = modal;

            const closeButton = imageModalEl.querySelector('.btn-close');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    modal.hide();
                });
            }

            imageModalEl.addEventListener('click', (e) => {
                if (e.target === imageModalEl) {
                    modal.hide();
                }
            });
        }

        this.showLoading(true);

        try {
            const subDivision: SubDivision = await this.fetchData(`${this.apiUrl}/${subDivisionCode}`);

            document.getElementById('machine-name')!.textContent = `Здание № ${subDivision.itemNumber}`;
            document.getElementById('subdivision-item-number')!.textContent = String(subDivision.itemNumber);
            const editButton = document.getElementById('edit-button') as HTMLAnchorElement | null;
            if (editButton) editButton.href = `/sub-division/${subDivision.id}/edit`;
            document.getElementById('machine-subdivision-name')!.textContent = subDivision.subDivisionName || 'Подразделение не указано.';

            this.renderDocumentList('documents-list', subDivision.pdfs, 'Документы не найдены.');
            this.renderPhotoGallery('photos-gallery', subDivision.imageUrls, 'Фотографии не найдены.');
            this.generateQrCode(subDivision.id);

            initOtherSection({
                apiBase: `${this.apiUrl}/${subDivision.id}`,
                filesUrl: `${this.apiUrl}/documents`,
                text: subDivision.otherText,
                files: subDivision.otherPdfs,
                canEdit: this.canEdit,
                reloadFiles: async () => (await this.fetchData(`${this.apiUrl}/${subDivision.id}`) as SubDivision).otherPdfs,
                notify: (message, type) => this.showToast(message, type),
            });

            document.getElementById('delete-button')?.addEventListener('click', async () => {
                if (confirm(`Вы уверены, что хотите удалить здание № ${subDivision.itemNumber}?`)) {
                    try {
                        await this.fetchData(`${this.apiUrl}/${subDivision.id}`, {method: 'DELETE'});
                        this.showToast('Здание успешно удалено.', 'success');
                        window.location.href = '/sub-division';
                    } catch (error) {
                        this.showError(error, 'Не удалось удалить здание');
                    }
                }
            });

            document.getElementById('upload-documents-button')?.addEventListener('click', async () => {
                const fileInput = document.getElementById('new-documents') as HTMLInputElement;
                if (fileInput.files && fileInput.files.length > 0) {
                    const formData = new FormData();
                    for (const file of Array.from(fileInput.files)) {
                        formData.append('files', file);
                    }
                    try {
                        await this.fetchData(`${this.apiUrl}/${subDivision.id}/documents`, {
                            method: 'POST',
                            body: formData
                        });

                        const updated: SubDivision = await this.fetchData(`${this.apiUrl}/${subDivision.id}`);
                        this.renderDocumentList('documents-list', updated.pdfs, 'Документы не найдены.');

                        fileInput.value = '';

                        const modalEl = document.getElementById('add-document-modal')!;
                        const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
                        modal?.hide();

                        this.showToast('Документы успешно загружены.', 'success');
                    } catch (error) {
                        this.showError(error, 'Ошибка при загрузке документов');
                    }
                }
            });

            contentDiv.style.display = 'block';
        } catch (error) {
            console.error('Failed to load machine details:', error);
            contentDiv.innerHTML = '<div class="alert alert-danger">Не удалось загрузить данные здания.</div>';
            contentDiv.style.display = 'block';
        } finally {
            this.showLoading(false);
        }
    }

    private renderPhotoGallery(elementId: string, items: ImageFile[] | undefined, emptyMessage: string): void {
        const galleryElement = document.getElementById(elementId)!;
        galleryElement.innerHTML = '';
        if (!items || items.length === 0) {
            galleryElement.innerHTML = `<div class="col"><p class="text-muted">${emptyMessage}</p></div>`;
            return;
        }

        const modalImageEl = document.getElementById('modalImage') as HTMLImageElement;

        items.forEach(item => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-3';
            col.innerHTML = `
                    <div class="card">
                        <img src="${item.data}" class="img-fluid img-thumbnail" alt="${item.name}" style="height: 200px; object-fit: cover;">
                    </div>
                `;

            col.addEventListener('click', () => {
                if (modalImageEl && this.imageModalInstance) {
                    modalImageEl.src = item.data;
                    this.imageModalInstance.show();
                }
            });

            galleryElement.appendChild(col);
        });
    }

    private renderDocumentList(elementId: string, items: DocumentFileSubDivision[] | undefined, emptyMessage: string): void {
        const listElement = document.getElementById(elementId)!;
        listElement.innerHTML = '';
        if (!items || items.length === 0) {
            listElement.innerHTML = `<li class="list-group-item text-muted">${emptyMessage}</li>`;
            return;
        }
        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                            <div class="icon-text">
                                <i class="bi bi-file-earmark-pdf text-danger"></i>
                                <a href="/api/v1/sub-division/documents/${item.id}" target="_blank" rel="noopener noreferrer">${item.baseFileName}</a>
                            </div>
                            ${this.canEdit ? `<button class="btn btn-sm btn-outline-danger delete-document-btn" data-doc-id="${item.id}" title="Удалить">
                                <i class="bi bi-trash"></i>
                            </button>` : ''}
                        `;
            listElement.appendChild(li);
        });

        listElement.querySelectorAll('.delete-document-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const btn = (e.currentTarget as HTMLElement);
                const docId = btn.dataset.docId;
                if (docId && confirm('Вы уверены, что хотите удалить этот документ?')) {
                    try {
                        await this.fetchData(`${this.apiUrl}/documents/${docId}`, {method: 'DELETE'});

                        const li = btn.closest('li');
                        li?.remove();

                        if (listElement.children.length === 0) {
                            listElement.innerHTML = '<li class="list-group-item text-muted">Документы не найдены.</li>';
                        }
                        this.showToast('Документ удален.', 'success');
                    } catch (error) {
                        this.showError(error, 'Не удалось удалить документ');
                    }
                }
            });
        });
    }

    private async getSubDivisionSelects(): Promise<void> {
        try {
            const subDivision: SubDivisionMachine[] = await this.fetchData(this.subDivisionApiUrl);
            const subDivisionSelect = document.getElementById('subDivision') as HTMLSelectElement;

            subDivisionSelect.innerHTML = '';

            subDivision.forEach(sub => {
                const option = new Option(sub.name, sub.id);
                subDivisionSelect.add(option);
            });

            if (this.choicesInstances['subDivision']) this.choicesInstances['subDivision'].destroy();
            const choicesConfig = {
                removeItemButton: true,
                shouldSort: false,
                placeholder: true,
                placeholderValue: 'Выберите из списка...',
                noChoicesText: 'Нет вариантов для выбора',
                itemSelectText: 'Нажмите, чтобы выбрать',
                searchPlaceholderValue: 'Начните ввод для поиска...',
                noResultsText: 'Ничего не найдено',
            };

            this.choicesInstances['subDivision'] = new Choices(subDivisionSelect, choicesConfig);
        } catch (error) {
            console.error('Failed to load subDivision:', error);
        }
    }

    private generateQrCode(id: number): void {
        const qrCodeCanvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
        const downLoadQrBtn = document.getElementById('download-qr-btn') as HTMLAnchorElement;

        if (!qrCodeCanvas || !downLoadQrBtn) {
            console.error('Элементы для QR-кода не найдены.');
            return;
        }

        const machineLink = `http://web.bormash.ru:2005/sub-division/${id}`;

        QRCode.toCanvas(qrCodeCanvas, machineLink, {width: 200, margin: 1}, (error: Error | null) => {
            if (error) {
                console.error('Ошибка при генерации QR-кода:', error);
            } else {
                downLoadQrBtn.href = qrCodeCanvas.toDataURL('image/png');
            }
        });
    }

    private showToast(message: string, type: 'success' | 'danger' = 'success'): void {
        const toastEl = document.getElementById('app-toast');
        if (!toastEl) {
            alert(message);
            return;
        }
        const bodyEl = document.getElementById('app-toast-body')!;

        toastEl.classList.remove('bg-success', 'bg-danger');
        toastEl.classList.add(type === 'success' ? 'bg-success' : 'bg-danger');
        bodyEl.textContent = message;

        const toast = (window as any).bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3000 });
        toast.show();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MachineManager();
});

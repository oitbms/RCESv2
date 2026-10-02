import {DocumentFile} from "./core/types";
import {describeError, fetchJson} from "./core/http";
import {initOtherSection, OtherFile} from "./core/other-section";
import {FilterableItem, initListFilter} from "./core/list-filter";
import {escapeHtml} from "./core/html";

interface Machine {
    name: string;
    number: number;
    description: string;
    subDivisionId?: number;
    subDivisionName: string;
    admittedEmployeesList?: EmployeeMachine[];
    responsibleEmployeesList?: EmployeeMachine[];
    pdfs?: DocumentFile[];
    passportId?: string;
    imageUrls?: any[];
    otherText?: string | null;
    otherPdfs?: OtherFile[];
}

interface EmployeeMachine {
    id: number;
    name: string;
    role: string;
}

interface DocumentFileMachine {
    id: string;
    baseFileName: string;
}

interface ImageFile {
    id: string;
    name: string;
    data: string;
}

interface SubDivisionMachine {
    id: string;
    name: string;
}

declare var Choices: any;
declare var QRCode: any;

class MachineManager {
    private readonly apiUrl = '/api/v1/machines';
    private readonly employeeApiUrl = '/api/employees?subdivision=2';
    private readonly subDivisionApiUrl = '/api/sub-divisions';
    private choicesInstances: { [key: string]: any } = {};
    private imageModalInstance: any = null;
    private readonly canEdit = document.body.dataset.canEdit === 'true';

    constructor() {
        this.init();
    }

    private init(): void {
        if (document.getElementById('machines-table-body')) {
            this.initListPage();
        } else if (document.getElementById('machine-form')) {
            this.initFormPage();
        } else if (document.getElementById('machine-content')) {
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
        const indicator = document.getElementById('machines-loading-indicator') ?? document.getElementById('loading-indicator');
        if (indicator) {
            indicator.style.display = show ? 'block' : 'none';
        }
    }

    private async initListPage(): Promise<void> {
        this.showLoading(true);
        try {
            const machines: Machine[] = await this.fetchData(this.apiUrl);

            const items: FilterableItem[] = machines.map(machine => {
                const name = escapeHtml(machine.name);
                const description = escapeHtml(machine.description);
                const subDivision = escapeHtml(machine.subDivisionName);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${name}</td>
                    <td class="tabular-nums">${machine.number}</td>
                    <td>${subDivision || '—'}</td>
                    <td class="description-cell">${description || '—'}</td>
                    <td>
                        <div class="d-flex justify-content-end gap-2">
                            <a href="/machines/${machine.number}" class="btn btn-sm btn-outline-secondary icon-text" title="Просмотр">
                                <i class="bi bi-eye"></i>
                            </a>
                            ${this.canEdit ? `<a href="/machines/${machine.number}/edit" class="btn btn-sm btn-outline-primary icon-text" title="Редактировать">
                                <i class="bi bi-pencil"></i>
                            </a>` : ''}
                        </div>
                    </td>
                `;

                const card = document.createElement('div');
                card.className = 'card mb-3';
                card.innerHTML = `
                        <div>
                            <h5 class="card-title mt-2 ms-2">${name}</h5>
                            <h6 class="card-subtitle mb-2 ms-2 text-muted">Инвентарный номер: ${machine.number}</h6>
                            <p class="card-text ms-2 mb-1">Цех: ${subDivision || 'не указан'}</p>
                            <p class="card-text ms-2">Описание: ${description || 'Описание отсутствует.'}</p>
                            <div class="d-flex justify-content-end gap-2 mt-3 mb-2 me-2">
                                <a href="/machines/${machine.number}" class="btn btn-sm btn-outline-secondary icon-text">
                                    <i class="bi bi-eye"></i>
                                    <span>Просмотр</span>
                                </a>
                                ${this.canEdit ? `<a href="/machines/${machine.number}/edit" class="btn btn-sm btn-outline-primary icon-text">
                                    <i class="bi bi-pencil"></i>
                                    <span>Редактировать</span>
                                </a>` : ''}
                            </div>
                        </div>
                `;

                return {
                    searchText: [machine.name, machine.number, machine.description, machine.subDivisionName].join(' '),
                    subDivisionName: machine.subDivisionName,
                    row,
                    card,
                };
            });

            initListFilter({
                items,
                tableBody: document.getElementById('machines-table-body')!,
                cardView: document.getElementById('machines-card-view')!,
                searchInput: document.getElementById('machines-search') as HTMLInputElement | null,
                subDivisionSelect: document.getElementById('machines-subdivision-filter') as HTMLSelectElement | null,
                emptyMessage: document.getElementById('machines-empty'),
            });
        } catch (error) {
            this.showError(error, 'Ошибка при загрузке станков');
        } finally {
            this.showLoading(false);
        }
    }

    private async initFormPage(): Promise<void> {
        const form = document.getElementById('machine-form') as HTMLFormElement;
        const formTitle = document.getElementById('form-title')!;
        const numberInput = document.getElementById('number') as HTMLInputElement;

        const pathParts = window.location.pathname.split('/');
        const machineNumber = pathParts[pathParts.length - 2];
        const isEditMode = pathParts[pathParts.length - 1] === 'edit' && machineNumber;

        await this.populateEmployeeSelects();
        await this.getSubDivisionSelects();

        if (isEditMode) {
            formTitle.textContent = 'Редактирование станка';
            // Редактирование отправляет только JSON — файлы отсюда не сохранились бы, поэтому поля скрываем
            form.querySelectorAll<HTMLElement>('[data-create-only]').forEach(el => el.classList.add('d-none'));
            form.querySelectorAll<HTMLElement>('[data-edit-only]').forEach(el => el.classList.remove('d-none'));
            this.showLoading(true);
            try {
                const machine: Machine = await this.fetchData(`${this.apiUrl}/${machineNumber}`);
                (document.getElementById('name') as HTMLInputElement).value = machine.name;
                numberInput.value = machine.number.toString();
                numberInput.readOnly = true;
                (document.getElementById('description') as HTMLTextAreaElement).value = machine.description || '';

                this.selectOptions('responsibleEmployees', machine.responsibleEmployeesList || []);
                this.selectOptions('admittedEmployees', machine.admittedEmployeesList || []);
                if (machine.subDivisionId != null) {
                    this.choicesInstances['subDivision']?.setChoiceByValue(String(machine.subDivisionId));
                }

            } catch (error) {
                this.showError(error, 'Не удалось загрузить данные станка');
            } finally {
                this.showLoading(false);
            }
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const url = isEditMode ? `${this.apiUrl}/${machineNumber}` : this.apiUrl;

            try {
                if (isEditMode) {
                    const responsibleEmployees = this.choicesInstances['responsibleEmployees']?.getValue(true) || [];
                    const admittedEmployees = this.choicesInstances['admittedEmployees']?.getValue(true) || [];

                    const machineData = {
                        name: (form.elements.namedItem('name') as HTMLInputElement).value,
                        number: Number((form.elements.namedItem('number') as HTMLInputElement).value),
                        description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
                        subDivisionId: Number((form.elements.namedItem('subDivisionId') as HTMLSelectElement).value) || null,
                        responsibleEmployeesList: responsibleEmployees.map((name: string) => ({name})),
                        admittedEmployeesList: admittedEmployees.map((name: string) => ({name})),
                    };
                    await this.fetchData(url, {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(machineData)
                    });

                } else {
                    const formData = new FormData(form);
                    const responsibleEmployees = this.choicesInstances['responsibleEmployees']?.getValue(true) || [];
                    const admittedEmployees = this.choicesInstances['admittedEmployees']?.getValue(true) || [];

                    formData.delete('responsibleEmployeesList');
                    formData.delete('admittedEmployeesList');
                    responsibleEmployees.forEach((name: string) => formData.append('responsibleEmployeesList', name));
                    admittedEmployees.forEach((name: string) => formData.append('admittedEmployeesList', name));

                    await this.fetchData(url, {
                        method: 'POST',
                        body: formData
                    });
                }

                this.showToast(`Станок успешно ${isEditMode ? 'обновлен' : 'создан'}!`, 'success')
                window.location.href = '/machines';
            } catch (error) {
                this.showError(error, 'Ошибка при сохранении станка');
            }
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

    private async populateEmployeeSelects(): Promise<void> {
        try {
            const employees: EmployeeMachine[] = await this.fetchData(this.employeeApiUrl);
            const responsibleSelect = document.getElementById('responsibleEmployees') as HTMLSelectElement;
            const admittedSelect = document.getElementById('admittedEmployees') as HTMLSelectElement;

            responsibleSelect.innerHTML = '';
            admittedSelect.innerHTML = '';

            employees.forEach(emp => {
                const option = new Option(emp.name, emp.name);
                if (emp.role.includes('MASTER')) {
                    responsibleSelect.add(option);
                } else {
                    admittedSelect.add(option);
                }
            });

            if (this.choicesInstances['responsibleEmployees']) this.choicesInstances['responsibleEmployees'].destroy();
            if (this.choicesInstances['admittedEmployees']) this.choicesInstances['admittedEmployees'].destroy();

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

            this.choicesInstances['responsibleEmployees'] = new Choices(responsibleSelect, choicesConfig);
            this.choicesInstances['admittedEmployees'] = new Choices(admittedSelect, choicesConfig);

        } catch (error) {
            this.showError(error, 'Ошибка при загрузке пользователей');
        }
    }

    private selectOptions(selectId: string, employeesToSelect: EmployeeMachine[]): void {
        const choiceInstance = this.choicesInstances[selectId];
        if (choiceInstance) {
            const employeeNames = employeesToSelect.map(e => e.name);
            setTimeout(() => {
                choiceInstance.setChoiceByValue(employeeNames);
            }, 150);
        }
    }

    private async initDetailsPage(): Promise<void> {
        const contentDiv = document.getElementById('machine-content')!;
        const pathParts = window.location.pathname.split('/');
        const machineNumber = pathParts[pathParts.length - 1];

        if (!machineNumber) return;

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
            const machine: Machine = await this.fetchData(`${this.apiUrl}/${machineNumber}`);

            document.getElementById('machine-name')!.textContent = machine.name;
            const editButton = document.getElementById('edit-button') as HTMLAnchorElement | null;
            if (editButton) editButton.href = `/machines/${machine.number}/edit`;
            document.getElementById('machine-subdivision-name')!.textContent = machine.subDivisionName || 'Цех не указан.';
            const passportLink = document.getElementById('machine-passport') as HTMLAnchorElement;
            if (machine.passportId) {
                passportLink.href = `/api/v1/machines/documents/${machine.passportId}`;
                passportLink.textContent = 'Открыть';
            } else {
                passportLink.removeAttribute('href');
                passportLink.textContent = 'Не загружен';
            }
            document.getElementById('machine-number')!.textContent = machine.number.toString();
            document.getElementById('machine-description')!.textContent = machine.description || 'Нет описания.';

            this.renderList('responsible-employees-list', machine.responsibleEmployeesList, 'Сотрудники не назначены.');
            this.renderList('admitted-employees-list', machine.admittedEmployeesList, 'Сотрудники не назначены.');
            this.renderDocumentList('documents-list', machine.pdfs, 'Документы не найдены.');
            this.renderPhotoGallery('photos-gallery', machine.imageUrls, 'Фотографии не найдены.');
            this.generateQrCode(machine.number);

            initOtherSection({
                apiBase: `${this.apiUrl}/${machine.number}`,
                filesUrl: `${this.apiUrl}/documents`,
                text: machine.otherText,
                files: machine.otherPdfs,
                canEdit: this.canEdit,
                reloadFiles: async () => (await this.fetchData(`${this.apiUrl}/${machine.number}`) as Machine).otherPdfs,
                notify: (message, type) => this.showToast(message, type),
            });

            document.getElementById('delete-button')?.addEventListener('click', async () => {
                if (confirm(`Вы уверены, что хотите удалить станок "${machine.name}"?`)) {
                    try {
                        await this.fetchData(`${this.apiUrl}/${machine.number}`, {method: 'DELETE'});
                        this.showToast('Станок успешно удален.', 'success')
                        window.location.href = '/machines';
                    } catch (error) {
                        this.showError(error, 'Не удалось удалить станок');
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
                        // Сервер отвечает 204 без тела, поэтому список документов перечитываем заново
                        await this.fetchData(`${this.apiUrl}/${machine.number}/documents`, {
                            method: 'POST',
                            body: formData
                        });

                        const updated: Machine = await this.fetchData(`${this.apiUrl}/${machine.number}`);
                        this.renderDocumentList('documents-list', updated.pdfs, 'Документы не найдены.');

                        const modalEl = document.getElementById('add-document-modal')!;
                        const modal = (window as any).bootstrap.Modal.getOrCreateInstance(modalEl);
                        modal.hide();
                        fileInput.value = '';

                        this.showToast('Документы успешно загружены.', 'success');
                    } catch (error) {
                        this.showError(error, 'Ошибка при загрузке документов');
                    }
                }
            });

            contentDiv.style.display = 'block';
        } catch (error) {
            contentDiv.innerHTML = '<div class="alert alert-danger">Не удалось загрузить данные станка.</div>';
            contentDiv.style.display = 'block';
        } finally {
            this.showLoading(false);
        }
    }

    private renderList(elementId: string, items: EmployeeMachine[] | undefined, emptyMessage: string): void {
        const listElement = document.getElementById(elementId)!;
        listElement.innerHTML = '';
        if (!items || items.length === 0) {
            listElement.innerHTML = `<li class="list-group-item text-muted">${emptyMessage}</li>`;
            return;
        }
        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item';

            const initials = item.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

            li.innerHTML = `
                <div class="employee-item">
                    <div class="avatar-placeholder">${initials}</div>
                    <span>${item.name}</span>
                </div>
            `;
            listElement.appendChild(li);
        });
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

    // private renderDocumentList(elementId: string, items: DocumentFileMachine[] | undefined, emptyMessage: string): void {
    //     const listElement = document.getElementById(elementId)!;
    //     listElement.innerHTML = '';
    //     if (!items || items.length === 0) {
    //         listElement.innerHTML = `<li class="list-group-item text-muted">${emptyMessage}</li>`;
    //         return;
    //     }
    //     items.forEach(item => {
    //         const li = document.createElement('li');
    //         li.className = 'list-group-item d-flex justify-content-between align-items-center';
    //         li.innerHTML = `
    //                         <div class="icon-text">
    //                             <i class="bi bi-file-earmark-pdf text-danger"></i>
    //                             <a href="/api/v1/machines/documents/${item.id}" target="_blank" rel="noopener noreferrer">${item.baseFileName}</a>
    //                         </div>
    //                         <button class="btn btn-sm btn-outline-danger delete-document-btn" data-doc-id="${item.id}" title="Удалить">
    //                             <i class="bi bi-trash"></i>
    //                         </button>
    //                     `;
    //         listElement.appendChild(li);
    //     });
    //
    //     listElement.querySelectorAll('.delete-document-btn').forEach(button => {
    //         button.addEventListener('click', async (e) => {
    //             const docId = (e.target as HTMLElement).dataset.docId;
    //             if (docId && confirm('Вы уверены, что хотите удалить этот документ?')) {
    //                 try {
    //                     await this.fetchData(`/api/v1/machines/documents/${docId}`, {method: 'DELETE'});
    //                     alert('Документ удален.');
    //                     location.reload();
    //                 } catch (error) {
    //                     console.error('Failed to delete document:', error);
    //                     alert('Не удалось удалить документ.');
    //                 }
    //             }
    //         });
    //     });
    //
    //     listElement.querySelectorAll('.delete-document-btn').forEach(button => {
    //         button.addEventListener('click', async (e) => {
    //             const btn = (e.currentTarget as HTMLElement);
    //             const docId = btn.dataset.docId;
    //             if (docId && confirm('Вы уверены, что хотите удалить этот документ?')) {
    //                 try {
    //                     await this.fetchData(`/api/v1/machines/documents/${docId}`, {method: 'DELETE'});
    //
    //                     const li = btn.closest('li');
    //                     li?.remove();
    //
    //                     if (listElement.children.length === 0) {
    //                         listElement.innerHTML = '<li class="list-group-item text-muted">Документы не найдены.</li>';
    //                     }
    //                 } catch (error) {
    //                     console.error('Failed to delete document:', error);
    //                     this.showToast('Ошибка при загрузке документов.', 'danger');
    //                 }
    //             }
    //         });
    //     });
    // }

    private renderDocumentList(elementId: string, items: DocumentFileMachine[] | undefined, emptyMessage: string): void {
        const listElement = document.getElementById(elementId)!;
        listElement.innerHTML = '';
        if (!items || items.length === 0) {
            listElement.innerHTML = `<li class="list-group-item text-muted">${emptyMessage}</li>`;
            return;
        }
        items.forEach(item => this.appendDocumentItem(listElement, item));
    }

    private appendDocumentItem(listElement: HTMLElement, item: DocumentFileMachine): void {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
        <div class="icon-text">
            <i class="bi bi-file-earmark-pdf text-danger"></i>
            <a href="/api/v1/machines/documents/${item.id}" target="_blank" rel="noopener noreferrer">${item.baseFileName}</a>
        </div>
        ${this.canEdit ? `<button class="btn btn-sm btn-outline-danger delete-document-btn" data-doc-id="${item.id}" title="Удалить">
            <i class="bi bi-trash"></i>
        </button>` : ''}
    `;
        listElement.appendChild(li);

        li.querySelector('.delete-document-btn')?.addEventListener('click', async (e) => {
            const btn = e.currentTarget as HTMLElement;
            const docId = btn.dataset.docId;
            if (docId && confirm('Вы уверены, что хотите удалить этот документ?')) {
                try {
                    await this.fetchData(`/api/v1/machines/documents/${docId}`, { method: 'DELETE' });

                    li.remove();
                    if (listElement.children.length === 0) {
                        listElement.innerHTML = '<li class="list-group-item text-muted">Документы не найдены.</li>';
                    }
                    this.showToast('Документ удален.', 'success');
                } catch (error) {
                    this.showError(error, 'Не удалось удалить документ');
                }
            }
        });
    }

    private generateQrCode(machineNumber: number): void {
        const qrCodeCanvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
        const downLoadQrBtn = document.getElementById('download-qr-btn') as HTMLAnchorElement;

        if (!qrCodeCanvas || !downLoadQrBtn) {
            console.error('Элементы для QR-кода не найдены.');
            return;
        }

        const machineLink = `http://web.bormash.ru:2005/machines/${machineNumber}`;

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

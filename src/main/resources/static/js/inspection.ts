// @ts-ignore
declare const $: any;

class Inspection extends Base {

    constructor(itemsPerPage = Infinity, visibleRow = Infinity) {
        super($(`.inspection-list`), itemsPerPage, visibleRow, () => {
            this.displayPage('/api/inspection/get-page-inspection', undefined).catch(console.error);
        });
        this.createHandler('click', '#create-button', () => this.dialog.open('create-dialog'), true);
        this.createHandler('click', '#createBtn', this.createInspection.bind(this), true);
        this.createHandler('click', '#createSecondaryBtn', this.createSecondaryInspection.bind(this), true);
        this.createHandler('click', '.view-btn', this.viewInspection.bind(this), true);
        this.createHandler('click', '#createViolation', this.createViolation.bind(this), true);
        this.createHandler('click', '.modal-input-change', this.changeSubDivision.bind(this), true);
        this.createHandler('click', '.delete-inspection', (event: Event) => {
            const id = $(event.target).closest('.table-card').attr('id');
            const inspection = this.localCache.get(Number(id)) as InspectionIn;
            if (inspection.haveSecondInspection) {
                this.createNotification("Нельзя удалять инспекцию с вторичной инспекцией", NotificationType.WARNING)
                return;
            }
            this.createConfirmationDialog('Подтвердите удаление инспекции').then((confirmed) => {
                // @ts-ignore
                if (confirmed) {
                    this.deleteEntity(`/api/inspection/delete-inspection/${id}`,).then(() => {
                        this.deleteRow(id);
                        this.createNotification('Инспекция успешно удалена', NotificationType.SUCCESS)
                        if (inspection.primaryInspectionId != null) {
                            const primaryInspection = this.localCache.get(inspection.primaryInspectionId) as InspectionIn;
                            primaryInspection.haveSecondInspection = false;
                        }
                    });
                }
            });
        });
    }

    public createRow(inspection: InspectionIn) {
        const card = `
            <div class="table-card" id="${inspection.id}" data-index="${inspection.id}">
               <div class="card-body">
                   <div class="card-title">
                       <h5>Инспекция №${inspection.id}</h5>
                   </div>
                       <p class="card-text">
                           Дата: ${this.formatDate(inspection.dateInspection)}<br>
                           Тип: ${inspection.type}<br>
                           Цех: <span data-inspection-id="${inspection.id}">${inspection.subDivision?.name}</span>          
                       </p>
                   <div class="buttons">
                       <button class="btn btn-outline-primary view-btn">Подробнее</button>
                       <button class="btn btn-warning" id="createSecondaryBtn">Создать повторную проверку</button>
                       <button class="btn btn-success">Отчеты</button>
                       <button class="btn btn-danger delete-inspection">Удалить</button>
                   </div>
               </div>     
            </div>`;
        return $(card);
    }

    public onScroll(): void {
    }

    private createInspection = async (event: Event) => {
        event.preventDefault();

        const button = $(event.target);
        const form = button.closest('form').get(0);
        const dialog = $('#create-dialog');

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        button.prop('disabled', true);

        const formData = {
            subDivision: dialog.find('select[name="subDivision"]').val()
        };

        try {
            const newInspection: any = await this.createEntity('/api/inspection/create-inspection', formData);
            this.saveMassive = {};
            this.localCache.set(newInspection.id, newInspection);
            this.dialog.close("create-dialog");
            const newRow = this.createRow(newInspection);
            $(`.inspection-list`).append(newRow);
            button.prop('disabled', false);
            this.createNotification('Инспекция успешно создана', NotificationType.SUCCESS);
        } catch (error) {
            this.saveMassive = {};
            form.reset();
            button.prop('disabled', false);
        }
    }

    private async createSecondaryInspection(event: Event) {
        const inspectionId = $(event.target).closest('.table-card').attr('id');
        const primaryInspection = this.localCache.get(Number(inspectionId)) as InspectionIn;
        const newInspection: any = await this.createEntity(`/api/inspection/create-secondary-inspection/${inspectionId}`);
        this.localCache.set(newInspection.id, newInspection);
        const newRow = this.createRow(newInspection);
        $(`.inspection-list`).append(newRow);
        primaryInspection.haveSecondInspection = true;
        this.localCache.set(primaryInspection.id, primaryInspection);
        this.createNotification('Вторичная инспекция успешно создана', NotificationType.SUCCESS);
    }

    private viewInspection = async (event: Event) => {
        event.preventDefault();

        const dialog = $('#viewInspectionDialog');
        const currentCard = $(event.currentTarget).closest('.table-card');
        const currentInspectionId = currentCard.attr('id');
        const inspection = this.localCache.get(Number(currentInspectionId)) as InspectionIn;

        if (!inspection.violation || inspection.violation.length === 0) {
            inspection.violation = await this.requestToApi(`/api/inspection/get-violation/${currentInspectionId}`, "GET");
            this.localCache.set(Number(currentInspectionId), inspection);
        }

        const violationsContainer = dialog.find('.violations-container');
        violationsContainer.empty();

        dialog.find('#closeBtn').off('click').on('click', () => {
            this.dialog.close('viewInspectionDialog');
        });

        dialog.find('#addViolationBtn').off('click').on('click', () => {
            this.openAddViolationDialog(currentInspectionId);
        });

        if (!inspection.violation || inspection.violation.length === 0) {
            violationsContainer.append(`
                <div class="no-violations">
                    Нарушений не найдено
                </div>
            `);
        } else {
            inspection.violation.forEach((violation: InspectionViolationIn) => {
                const violationCard = `
                    <div class="violation-card" id="${currentInspectionId}" data-violation-id="${violation.id}">
                        <div class="violation-card-header">
                            <div class="score">${violation.score}/5</div>
                            <div class="criteria">${violation.criteria}</div>
                        </div>
                        <div class="violation-card-body">
                            <div class="field-row">
                                <div class="label">Ответственный:</div>
                                <div class="value">${violation.subDivision?.name}</div>
                            </div>
                            <div class="field-row">
                                <div class="label">Дата обнаружения:</div>
                                <div class="value">${this.formatDate(violation.createdDate)}</div>
                            </div>
                            <div class="field-row">
                                <div class="label">Статус:</div>
                                <div class="value" name="status">${violation.status}</div>
                            </div>
                            <div class="field-row">
                                <div class="label">Описание:</div>
                                <div class="value">${violation.description}</div>
                            </div>
                            <div class="field-row">
                                <div class="label">Создал:</div>
                                <div class="value">${violation.createdBy?.name}</div>
                            </div>
                            <div class="field-row">
                                <div class="label">Фото:</div>
                                <div class="value"><i class="fas fa-image photo-icon"></i></div>
                            </div>
                        </div>
                        <div class="violation-card-footer">
                            <button class="btn btn-delete" data-violation-id="${violation.id}">
                                Удалить
                            </button>
                            <button class="btn btn-fixed" data-violation-id="${violation.id}">
                                Отметить как исправленное
                            </button>
                        </div>
                    </div>
                `;
                violationsContainer.append(violationCard);
            });
        }

        dialog.on('click', '.btn-delete', (event: Event) => {
            const button = $(event.currentTarget);
            const violationId = button.attr('data-violation-id');
            this.createConfirmationDialog("Подтвердите удаление нарушения").then((confirmed) => {
                // @ts-ignore
                if (confirmed) {
                    this.deleteEntity(`/api/inspection/delete-violation/${violationId}`).then(() => {
                        button.closest('.violation-card').remove();
                        inspection.violation = inspection.violation.filter((v: InspectionViolationIn) => v.id !== violationId);
                        this.localCache.set(inspection.id, inspection);
                        if (!inspection.violation || inspection.violation.length === 0) {
                            violationsContainer.append(`
                                <div class="no-violations">
                                    Нарушений не найдено
                                </div>
                            `);
                        }
                        this.createNotification('Нарушение успешно удалено', NotificationType.SUCCESS);
                    });
                }
            })

        })

        dialog.on('click', '.btn-fixed', (event: Event) => {
            const button = $(event.currentTarget);
            const violationId = button.attr('data-violation-id');
            const violation = inspection.violation.find((v: InspectionViolationIn) => v.id === violationId);
            this.requestToApi(`/api/inspection/change-status-violation/${violationId}`, "PATCH").then(() => {
                violation.status = violation.status === 'Не исправлено' ? 'Исправлено' : 'Не исправлено';
                inspection.violation = inspection.violation.map((v: InspectionViolationIn) => v.id === violationId ? violation : v);
                this.localCache.set(inspection.id, inspection);
                button.closest('.violation-card').find('[name="status"]').text(violation.status);
                this.createNotification('Статус изменен', NotificationType.SUCCESS);
            });
        })

        dialog.on('click', '.photo-icon', this.openImagesDialog.bind(this));

        this.dialog.open('viewInspectionDialog');
    };

    private openAddViolationDialog(inspectionId: number) {
        const addDialog = $('#addViolationDialog');
        const form = addDialog.find('#addViolationForm')[0] as HTMLFormElement;

        addDialog.data('inspection-id', inspectionId);

        form.reset();

        const criteriaSelect = addDialog.find('#criteriaSelect');
        const scoreInput = addDialog.find('#scoreInput');

        scoreInput.attr('max', 5);
        scoreInput.val(1);

        criteriaSelect.off('change').on('change', function () {
            const criteria = $(this).val() as string;
            let maxScore = 5;

            switch (criteria) {
                case 'Технологическая дисциплина':
                    maxScore = 3;
                    break;
                case 'Организация рабочих мест':
                    maxScore = 2;
                    break;
                case 'Документация':
                    maxScore = 3;
                    break;
                case 'Безопасность и охрана труда':
                    maxScore = 5;
                    break;
            }

            scoreInput.attr('max', maxScore);

            const currentScore = parseInt(scoreInput.val() as string);
            if (currentScore > maxScore) {
                scoreInput.val(maxScore);
            }
        });

        addDialog.find('#cancelAddBtn').off('click').on('click', () => {
            this.dialog.close('addViolationDialog');
        });

        form.onsubmit = (e) => {
            e.preventDefault();

        };

        this.dialog.open('addViolationDialog');
    }

    private async createViolation(event: Event) {
        event.preventDefault();

        const button = $(event.target);
        const form = button.closest('form').get(0);
        const dialog = $('#addViolationDialog');
        const currentInspectionId = dialog.data('inspection-id');

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        const inspection = this.localCache.get(Number(currentInspectionId)) as InspectionIn;
        button.prop('disabled', true);

        const formData = new FormData();
        const jsonData = {
            inspectionId: currentInspectionId,
            description: dialog.find('textarea[name="description"]').val(),
            criteria: dialog.find('select[name="criteria"]').val(),
            score: dialog.find('input[name="score"]').val(),
            subDivision: dialog.find('input[name="subDivision"]').val(),
        };
        const isDuplicate = inspection.violation.some(violation => violation.criteria === jsonData.criteria);

        if (isDuplicate) {
            this.saveMassive = {};
            form.reset();
            this.createNotification("У инспекции уже есть нарушение по данному критерию", NotificationType.WARNING);
            button.prop('disabled', false);
            return;
        }

        const jsonBlob = new Blob([JSON.stringify(jsonData)], {type: 'application/json'});
        formData.append('data', jsonBlob, 'data.json');
        const fileInput = dialog.find('input[name="additionalFiles"]')[0] as HTMLInputElement;
        if (fileInput?.files) {
            for (let i = 0; i < fileInput.files.length; i++) {
                formData.append('additionalFiles', fileInput.files[i]);
            }
        }

        try {
            const newViolation = (await this.createEntity('/api/inspection/create-violation', formData)) as InspectionViolationIn;
            this.saveMassive = {};
            const inspection = this.localCache.get(newViolation.inspectionId) as InspectionIn;
            inspection.violation.push(newViolation);
            this.localCache.set(inspection.id, inspection);
            this.dialog.close("addViolationDialog");

            const violationContainer = $("#viewInspectionDialog").find('.violations-container');
            violationContainer.find('.no-violations').remove();

            const violationCard = `
                <div class="violation-card" id="${inspection.id}" data-violation-id="${newViolation.id}">
                    <div class="violation-card-header">
                        <div class="score">${newViolation.score}/5</div>
                        <div class="criteria">${newViolation.criteria}</div>
                    </div>
                    <div class="violation-card-body">
                        <div class="field-row">
                            <div class="label">Ответственный:</div>
                            <div class="value">${newViolation.subDivision?.name}</div>
                        </div>
                        <div class="field-row">
                            <div class="label">Дата обнаружения:</div>
                            <div class="value">${this.formatDate(newViolation.createdDate)}</div>
                        </div>
                        <div class="field-row">
                            <div class="label">Статус:</div>
                            <div class="value">${newViolation.status}</div>
                        </div>
                        <div class="field-row">
                            <div class="label">Описание:</div>
                            <div class="value">${newViolation.description}</div>
                        </div>
                        <div class="field-row">
                            <div class="label">Создал:</div>
                            <div class="value">${newViolation.createdBy?.name}</div>
                        </div>
                        <div class="field-row">
                            <div class="label">Фото:</div>
                            <div class="value"><i class="fas fa-image photo-icon"></i></div>
                        </div>
                    </div>
                    <div class="violation-card-footer">
                        <button class="btn btn-delete" data-violation-id="${newViolation.id}">
                            Удалить
                        </button>
                        <button class="btn btn-fixed" data-violation-id="${newViolation.id}">
                            Отметить как исправленное
                        </button>
                    </div>
                </div>
                `;
            violationContainer.append(violationCard);

            button.prop('disabled', false);
            this.createNotification('Нарушение успешно создано', NotificationType.SUCCESS);
        } catch (error) {
            this.saveMassive = {};
            form.reset();
            button.prop('disabled', false);
        }
    }

    private async changeSubDivision(event: Event) {
        event.preventDefault();

        const modalDiv = $(event.currentTarget);
        const dialog = $('#subDivisionDialog');
        const rowContainer = dialog.find('.dialog-content-rows');
        const searchInput = dialog.find('.choice-field input');
        const changeButton = $('#changeSubDivision');
        const currentId = modalDiv.data('inspection-id');
        let selected: any;

        const data: any = await this.cache.get('subDivision');

        const renderRows = (items: any[]) => {
            rowContainer.empty();
            items.forEach(item => {
                rowContainer.append(`
                    <div class="dialog-content-rows-row" data-id="${item.id}">
                        <div class="content-row-column col-250">${item.name}</div>
                    </div>`
                );
            });
        };

        renderRows(data);

        searchInput.off('input').on('input', function () {
            const searchText = $(this).val().toString().toLowerCase().trim();
            const filtered = data.filter((e: any) => e.name.toLowerCase().includes(searchText));
            renderRows(filtered);
        });

        this.dialog.open("subDivisionDialog");

        rowContainer.off('click').on('click', '.dialog-content-rows-row', function () {
            const id = $(this).data('id');
            selected = data.find((e: any) => e.id === id);
            $('.dialog-content-rows-row').removeClass('selected');
            $(this).addClass('selected');
        });


        changeButton.off('click').on('click', () => {
            if (!selected) {
                this.createNotification(`Выберите подразделение из списка`, NotificationType.WARNING);
                return;
            }

            modalDiv.text(selected.name);
            modalDiv.val(selected.name);

            if (currentId) {
                this.saveMassive[currentId] = {
                    ...this.saveMassive[currentId],
                    ['subDivision']: selected
                };
            } else {
                this.saveMassive['subDivision'] = selected;
            }

            modalDiv.addClass('change-textarea');
            this.dialog.close('subDivisionDialog');
        });

        dialog.off('click', '.close').on('click', '.close', (event: Event) => {
            this.dialog.close('subDivisionDialog');
        });

        modalDiv.addClass('change');
    }

    private openImagesDialog = async (event: Event) => {
        event.preventDefault();

        const button = $(event.currentTarget);
        const violationId = button.closest('.violation-card').data('violation-id');

        const unlock = this.lockScreen();
        try {
            const images: Array<Image> = await this.requestToApi(`/api/inspection/get-images-inspection/${violationId}`, "GET");

            if (!images || images.length === 0) {
                this.createNotification('Фотографии не прикреплены', NotificationType.INFO);
                return;
            }

            const dialog = $('#photosDialog');
            const gallery = dialog.find('.photos-gallery');
            gallery.empty();

            images.forEach((image, index) => {
                gallery.append(`
                    <div class="photo-item ${index === 0 ? 'active' : ''}">
                        <img src="${image.data}" id="${image.id}" 
                             alt="${image.name || 'Фото нарушения'} ${index + 1}"
                             loading="lazy">
                    </div>
                `);
            });

            dialog.find('.current-photo').text('1');
            dialog.find('.total-photos').text(images.length);

            this.setupPhotoNavigation(dialog, images.length);

            this.dialog.open('photosDialog');
        } catch (error) {
            this.createNotification('Ошибка загрузки фотографий', NotificationType.ERROR);
            console.error(error);
        } finally {
            unlock()
        }
    }

    private setupPhotoNavigation(dialog: any, totalPhotos: number) {
        const gallery = dialog.find('.photos-gallery');
        const prevBtn = dialog.find('#prevPhotoBtn');
        const nextBtn = dialog.find('#nextPhotoBtn');
        const currentPhotoSpan = dialog.find('.current-photo');

        let currentIndex = 0;

        const updateNavigation = () => {
            gallery.find('.photo-item').removeClass('active').hide();
            gallery.find(`.photo-item:eq(${currentIndex})`).addClass('active').show();
            currentPhotoSpan.text(currentIndex + 1);

            prevBtn.prop('disabled', currentIndex === 0);
            nextBtn.prop('disabled', currentIndex === totalPhotos - 1);
        };

        prevBtn.off('click').on('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateNavigation();
            }
        });


        nextBtn.off('click').on('click', () => {
            if (currentIndex < totalPhotos - 1) {
                currentIndex++;
                updateNavigation();
            }
        });

        dialog.find('#closePhotosBtn').off('click').on('click', () => {
            this.dialog.close('photosDialog');
        });

        updateNavigation();

        dialog.on('dialog:open', () => {
            dialog.find('#closePhotosBtn').focus();
        });
    }
}

$(document).ready(() => {
    new Inspection();
});
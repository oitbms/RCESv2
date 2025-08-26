const itemsPerPage = 16; //Начальное кол-во строк на странице
const localCache = new Map();

//Обработчик работы с окном создания задачи
$(document).on('click', '#createSGI', async function (e) {
    e.preventDefault();

    const dialog = $('#create-dialog');
    dialog.find('[name]').val('');
    dialog.find('input[type="file"]').files = new DataTransfer();
    dialog.find('.file-list').empty();

    const field = dialog.find('[name="employee"]');
    field.find('option').not(':first').remove();
    const employeesData = await cache.get('employee');
    const filteredEmployees = employeesData.filter(employee =>
        ['EVENT', 'CONTROL'].includes(employee.role)
    );
    filteredEmployees.forEach(employee => {
        field.append($('<option>', {text: employee.name})
        );
    });
    //Клик вне диалога
    dialog.off('click').on('click', (e) => {
        if (e.target.nodeName === 'DIALOG') {
            localCache.delete('validFileMap');
            localCache.delete('imagesMap');
            e.target.close();
        }
    });
    //Клик по "Отменить"
    dialog.on('click', '#cancelButton', () => {
        localCache.delete('validFileMap');
        localCache.delete('imagesMap');
        dialog[0].close();
    });

    dialog[0].showModal();
});
//Обработчик открытия подзадач
$(document).on('click', '.hamburger', function (e) {
    if ($(e.target).is('input')) {
        return;
    }
    const $currentRow = $(this).closest('.row-items-row');
    const $innerRows = $currentRow.siblings('.row-items-inner-row');

    $innerRows.slideToggle(400);
});
//Обработчик работы с окном редактирования
$(document).on('click', '.editing-btn', async function (e) {
    const currentRow = e.target.closest('.row-items-row');
    const currentId = $(currentRow).data('id');
    const currentSGI = localCache.get(currentId);
    const dialog = $('#editing-dialog');

    for (const [key, value] of Object.entries(currentSGI)) {
        const field = dialog.find(`[data-field="${key}"]`);
        if (!field.length) continue;
        if (key === 'employee') {
            field.empty();
            const employeesData = await cache.get('employee');
            const filteredEmployees = employeesData.filter(employee =>
                ['EVENT', 'CONTROL'].includes(employee.role)
            );
            filteredEmployees.forEach(employee => {
                field.append(
                    $('<option>', {
                        text: employee.name
                    })
                );
            });
        }
        if (key === 'imagesSGI') continue;
        field.val(value || '');
    }
    if (!dialog.find('#createSubSGI').length) {
        dialog.find('.modal-footer').prepend(`<button class="btn btn-primary" id="createSubSGI">Создать подзадачу</button>`);
    }

    await renderImages(dialog, currentSGI.imagesSGI);
    dialog[0].showModal();

    $('#editing-dialog #saveBtn').off('click').on('click', function (e) {
        if (currentSGI.agree) {
            return alert("Нельзя редактировать выполненное мероприятие")
        }
        e.preventDefault;

        const formData = new FormData();
        formData.append('id', currentId);
        formData.append('factExecutionSGIBool', false)
        $(dialog).find('[data-field]').each((_, el) => {
            if (el.type !== 'file') {
                formData.append(el.dataset.field, el.value);
            } else {
                for (let file of el.files) {
                    formData.append(el.dataset.field, file);
                }
            }
        });
        $.ajax({
            url: 'sgi/save-change',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function () {
                $(dialog).find('[data-field]').each((_, el) => {
                    const fieldName = el.dataset.field;
                    const fieldValue = el.value;
                    const targetElement = $(currentRow).find(`[data-field="${fieldName}"]`);
                    if (el.tagName === 'SELECT') {
                        const selectedText = $(el).find('option:selected').text();
                        targetElement.text(selectedText);
                    } else if (fieldName === 'desiredDate') {
                        targetElement.text(formatDate(fieldValue));
                    } else if (fieldName === 'planDate') {
                        return true;
                    } else targetElement.text(fieldValue);
                    if (fieldName === 'imagesSGI') {

                    } else currentSGI[fieldName] = fieldValue;
                });
                localCache.set(currentId, currentSGI);
                localCache.delete('validFileMap');
                dialog[0].close();
            },
            error: function () {
                alert('Редактировать может только создатель задачи или такого пользователя нет');
                dialog[0].close();
            }
        });

    });
    $('#createSubSGI').off('click').on('click', async function (e) {
        if (currentSGI.agree) {
            return alert("Нельзя редактировать выполненное мероприятие")
        }
        dialog[0].close();
        const createDialog = $('#create-dialog');
        createDialog.find('[name="parentId"]').val(currentId);

        const field = createDialog.find('[name="employee"]');
        field.find('option').not(':first').remove();
        const employeesData = await cache.get('employee');
        const filteredEmployees = employeesData.filter(employee =>
            ['EVENT', 'CONTROL'].includes(employee.role)
        );
        filteredEmployees.forEach(employee => {
            field.append($('<option>', {text: employee.name})
            );
        });

        createDialog[0].showModal();
    });
    //Клик на крестик
    dialog.find('#cancelButton').off('click').on('click', (e) => {
        localCache.delete('validFileMap');
        localCache.delete('imagesMap');
        dialog[0].close();
    });
    //Клик вне диалога
    dialog.off('click').on('click', (e) => {
        if (e.target.nodeName === 'DIALOG') {
            localCache.delete('validFileMap');
            localCache.delete('imagesMap');
            e.target.close();
        }
    });
});
//Обработчик работы с окном факт выполнения
$(document).on('click', '.execution-btn', async function (e) {
    e.preventDefault;

    const currentRow = e.target.closest('.row-items-row');
    const currentId = $(currentRow).data('id');
    const currentSGI = localCache.get(currentId);
    const dialog = $('#execution-dialog');

    for (const [key, value] of Object.entries(currentSGI.factExecutionSGI)) {
        const field = dialog.find(`[data-field="${key}"]`);
        if (!field.length) continue;
        if (key === 'imagesFactSGI') continue;
        field.val(value || '');
    }

    $(document).on('click', '#execution-dialog #saveBtn', function (e) {
        if (currentSGI.agree) {
            return alert("Нельзя редактировать выполненное мероприятие")
        }
        if (dialog.find(`[data-field="executionDate"]`).val() === '') return alert("Не заполнена дата выполнения")
        const formData = new FormData();
        formData.append('id', currentId);
        formData.append('factExecutionSGIBool', true)
        $(dialog).find('[data-field]').each((_, el) => {
            if (el.type !== 'file') {
                formData.append(el.dataset.field, el.value);
            } else {
                for (let file of el.files) {
                    formData.append(el.dataset.field, file);
                }
            }
        });

        $.ajax({
            url: 'sgi/save-change',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function () {
                $(dialog).find('[data-field]').each((_, el) => {
                    const fieldName = el.dataset.field;
                    const fieldValue = el.value;
                    const targetElement = $(currentRow).find(`[data-field="${fieldName}"]`);
                    if (fieldName === 'executionDate') {
                        targetElement.text(formatDate(fieldValue));
                        currentSGI.planDate = fieldValue;
                    } else targetElement.text(fieldValue);
                    if (fieldName === 'imagesFactSGI') {

                    } else currentSGI.factExecutionSGI[fieldName] = fieldValue;
                });
                localCache.set(currentId, currentSGI);
                localCache.delete('validFileMap');
                dialog[0].close();
            },
            error: function () {
                alert('Редактировать может только создатель задачи или такого пользователя нет');
                dialog[0].close();
            }
        });
    });

    await renderImages(dialog, currentSGI.factExecutionSGI.imagesFactSGI);
    dialog[0].showModal();

    //Клик на крестик
    dialog.find('#cancelButton').off('click').on('click', (e) => {
        localCache.delete('validFileMap');
        localCache.delete('imagesMap');
        dialog[0].close();
    });
    //Клик вне диалога
    dialog.off('click').on('click', (e) => {
        if (e.target.nodeName === 'DIALOG') {
            localCache.delete('validFileMap');
            localCache.delete('imagesMap');
            e.target.close();
        }
    });
});
//Обработчик согласования
$(document).on('click', '#toggleAgreement', async function (event) {
    event.preventDefault();
    const isChecked = this.checked;
    const currentRow = $(this).closest('.row-items-row');
    const currentId = $(currentRow).data('id');
    const currentSGI = localCache.get(currentId);

    const formData = new FormData();
    formData.append("id", currentId);
    formData.append("agreed", isChecked);

    if (currentSGI.planDate === null || currentSGI.planDate === "") return alert("Не заполнено поле планируемый срок!");
    if (!currentSGI.executions) return alert("У мероприятия нет факта выполнения!");
    if (isChecked && currentSGI.subSGI && !currentSGI.subSGI?.every(sub => sub.agree)) return alert("Все подзадачи должны быть согласованы!");
    if (!isChecked && currentSGI?.parent && currentSGI.parent.agree) return alert("Нельзя отменить согласование подзадачи, если родительская задача согласована!");
    await $.ajax({
        url: '/sgi/agree',
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function () {
            currentSGI.agree = isChecked;
            localCache.set(currentId, currentSGI);
            if (isChecked) {
                currentRow.addClass('complete');
            } else {
                currentRow.removeClass('complete');
            }
            currentRow.find('#toggleAgreement').prop('checked', isChecked);
        },
        error: function () {
            alert('Вы не можете закрывать заявку');
        }
    });
});
//Обработчик фото добавление фото
$(document).on('click', '.file-upload', async function (event) {
    $(this).prop('disabled', true);
    const currentDialog = $(this).closest('dialog');
    const inputFiles = currentDialog.find('[name="additionalFiles"]');
    const imageContainer = currentDialog.find('.file-list');

    //Добавление фото в инпут
    inputFiles.off('change').on('change', async function (e) {
        e.preventDefault();

        const input = e.target;
        const files = input.files;
        input.files = new DataTransfer().files;

        if (!localCache.has('imagesMap')) {
            localCache.set('imagesMap', new Map);
        }
        for (let file of files) {
            if (!localCache.get('imagesMap').has(file.name)) {
                localCache.get('imagesMap').set(file.name, file);
            }
        }
        const dataTransfer = new DataTransfer();
        for (const [fileName, file] of localCache.get('imagesMap')) {
            if (file instanceof File) {
                dataTransfer.items.add(file)
                const imageUrl = URL.createObjectURL(file);
                const fileItem = `
                <div class="file-item">
                    <img src="${imageUrl}" alt="${file.name}">
                </div>`;
                imageContainer.append(fileItem);
                localCache.get('imagesMap').set(file.name, null);
            }
        }
        const validFileMap = localCache.has('validFileMap') ? localCache.get('validFileMap') : new Map();
        for (let file of dataTransfer.files) {
            validFileMap.set(file.name, file);
        }
        localCache.set('validFileMap', validFileMap);
        input.files = Array.from(validFileMap.values()).reduce((dt, file) => (dt.items.add(file), dt), new DataTransfer()).files;
    });
    inputFiles.click();
    $(document).on('click', () => $('.context-menu').remove());
    $(this).prop('disabled', false);
});
//Удаление фото ПКМ В диалоге
$(document).on('contextmenu', 'dialog img', e => {
    e.preventDefault();
    const currentDialog = $(e.target).closest('dialog');
    $('.context-menu').remove();
    let menu = $('<div class="context-menu"><button class="context-btn">Удалить</button></div>');
    $(currentDialog).append(menu);
    let dialogOffset = $(currentDialog).offset();
    menu.css({
        'position': 'absolute',
        'top': (e.pageY - dialogOffset.top) + 'px',
        'left': (e.pageX - dialogOffset.left) + 'px',
        'background': '#f8f9fa',
        'border': '1px solid #dee2e6',
        'padding': '8px',
        'border-radius': '4px',
        'box-shadow': '0 4px 12px rgba(0,0,0,0.15)'
    });
    menu.find('.context-btn').css({
        'background': '#dc3545',
        'color': 'white',
        'border': 'none',
        'padding': '6px 12px',
        'cursor': 'pointer',
        'border-radius': '3px',
        'font-size': '0.875rem'
    });

    menu.find('.context-btn').click(() => {
        const imgName = $(e.target).attr('alt');
        if (localCache.has('imagesMap')) {
            localCache.get('imagesMap').delete(imgName);
        }
        const validFileMap = localCache.get('validFileMap');
        validFileMap.delete(imgName)
        localCache.set('validFileMap', validFileMap)
        let input = currentDialog.find('input[type="file"]').clone()[0];
        input.files = Array.from(validFileMap.values()).reduce((dt, file) => (dt.items.add(file), dt), new DataTransfer()).files;
        currentDialog.find('input[type="file"]').replaceWith(input);
        $(e.target).remove();
        menu.remove();
    });
});

async function displayPage(page) {
    async function loadSGI(page = 16) {
        const response = await $.ajax({
            url: '/api/sgi/get-page-sgi',
            type: 'GET',
            data: {page: page, size: itemsPerPage},
            dataType: 'json'
        });
        const content = response.content;
        const totalPages = response.total;

        content.forEach(sgi => {
            localCache.set(sgi.id, sgi);
            sgi.subSGI.forEach(subSgi => localCache.set(subSgi.id, subSgi));
        })

        return {content: content, totalPages};
    }

    async function createRow(item) {
        const hamburger = `
                    <label class="hamburger">
                        <input type="checkbox">
                        <svg viewBox="0 0 32 32">
                            <path class="line line-top-bottom"
                            d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22">
                            </path>
                            <path class="line" d="M7 16 27 16"></path>
                        </svg>
                    </label>`
        const borderClass = item.color === 'RED'
            ? 'border-danger' :
            item.color === 'YELLOW'
                ? 'border-warning' :
                item.color === 'GREEN'
                    ? 'border-good' : '';
        const row = `
                <div class="row-items">
                    <div class="row-items-row ${item.color === 'GREY' ? 'complete' : ''}" data-id="${item.id}">
                        <div class="row-item  ${borderClass}" data-field="number" style="width: var(--no);">
                            ${item.subSGI && item.subSGI.length > 0 ? hamburger : ''}
                            ${item.number}
                        </div>
                        <div class="row-item" data-field="workcenter" style="width: var(--workcenter);">${item.workcenter}</div>
                        <div class="row-item" data-field="event" style="width: var(--event);">${item.event}</div>
                        <div class="row-item" data-field="actions" style="width: var(--action);">${item.actions}</div>
                        <div class="row-item" data-field="department"style="width: var(--department);">${item.departmentName}</div>
                        <div class="row-item" data-field="employee" style="width: var(--employee);">${item.employee}</div>
                        <div class="row-item" data-field="desiredDate" style="width: var(--desiredDate);">${formatDate(item.desiredDate)}</div>
                        <div class="row-item" data-field="note" style="width: var(--note);">${item.note}</div>
                        <div class="row-item ${borderClass}" data-field="executionDate" style="width: var(--planDate);">${formatDate(item.planDate)}</div>
                        <div class="row-item" data-field="comment" style="width: var(--comment);">${item.comment}</div>
                        <div class="row-item" style="width: var(--editing);">
                            <button type="button" class="btn btn-info btn-sm editing-btn">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                        </div>
                        <div class="row-item" style="width: var(--executions);">
                            <button type="button" class="btn btn-info btn-sm execution-btn">
                                ✔
                            </button>
                        </div>
                        <div class="row-item" style="width: var(--status);">
                            <div class="checkbox-wrapper-31">
                                <input type="checkbox" id="toggleAgreement" ${item.agree ? 'checked' : ''}>
                                <svg viewBox="0 0 35.6 35.6">
                                    <circle class="background" cx="17.8" cy="17.8" r="17.8"></circle>
                                    <circle class="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                                    <polyline class="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>
                    ${item.subSGI && item.subSGI.length > 0 ? `
                    <div class="row-items-inner-row">
                        ${item.subSGI.map((subItem) => `
                            <div class="row-items-row ${subItem.color === 'GREY' ? 'complete' : ''}" data-id="${subItem.id}" data-inner="true">
                                <div class="row-item  ${borderClass}" data-field="number" style="width: var(--no);"></div>
                                <div class="row-item" data-field="workcenter" style="width: var(--workcenter);">${subItem.workcenter}</div>
                                <div class="row-item" data-field="event" style="width: var(--event);">${subItem.event}</div>
                                <div class="row-item" data-field="actions" style="width: var(--action);">${subItem.actions}</div>
                                <div class="row-item" data-field="departament" style="width: var(--department);">${subItem.departmentName}</div>
                                <div class="row-item" data-field="employee" style="width: var(--employee);">${subItem.employee}</div>
                                <div class="row-item" data-field="desiredDate" style="width: var(--desiredDate);">${formatDate(subItem.desiredDate)}</div>
                                <div class="row-item" data-field="note" style="width: var(--note);">${subItem.note}</div>
                                <div class="row-item ${borderClass}" data-field="executionDate" style="width: var(--planDate);">${formatDate(subItem.planDate)}</div>
                                <div class="row-item" data-field="comment" style="width: var(--comment);">${subItem.comment}</div>
                                <div class="row-item" style="width: var(--editing);">
                                    <button type="button" class="btn btn-info btn-sm editing-btn">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                </div>
                                <div class="row-item" style="width: var(--executions);">
                                    <button type="button" class="btn btn-info btn-sm execution-btn">
                                        ✔
                                    </button>
                                </div>
                                <div class="row-item" style="width: var(--status);">
                                    <div class="checkbox-wrapper-31">
                                        <input type="checkbox" id="toggleAgreement" ${subItem.agree ? 'checked' : ''}>
                                        <svg viewBox="0 0 35.6 35.6">
                                            <circle class="background" cx="17.8" cy="17.8" r="17.8"></circle>
                                            <circle class="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                                            <polyline class="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>`
            : ''}
                </div>`;
        $('.table-content-rows').append(row);
    }

    const SGIPage = await loadSGI(1);

    for (sgi of SGIPage.content) {
        await createRow(sgi);
    }
}

async function renderImages(currentDialog, images) {
    // Конвертация base64 в File
    const base64ToFile = (base64, name) => {
        const arr = base64.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
        return new File([u8arr], name, {type: mime});
    };
    const imageContainer = currentDialog.find('.file-list');
    imageContainer.empty();
    const validFileMap = new Map();
    for (const image of images) {
        imageContainer.append(`
            <div class="file-item">
                <img src="${image.data}" alt="${image.name}">
            </div>`);
        localCache.set(image.name, null);
        validFileMap.set(image.name, base64ToFile(image.data, image.name));
    }
    localCache.set('validFileMap', validFileMap)
    let input = currentDialog.find('input[type="file"]').clone()[0];
    input.files = Array.from(validFileMap.values()).reduce((dt, file) => (dt.items.add(file), dt), new DataTransfer()).files;
    currentDialog.find('input[type="file"]').replaceWith(input);
}

$(document).ready(async function () {
    await displayPage(1);
});

//Форматирование дат
function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

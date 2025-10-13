let selectedRow = new Set();
let editMode = false;
const localCache = new Map();
let saveMassive = {};
let currentStatus = 'NONE';
let currentSubDivision = '';
let searchText = '';
//Блок параллельного выполнения
const lock = fn => async function () {
    if (this.loading) return;
    this.loading = true;
    try {
        await fn.apply(this, arguments);
    } finally {
        this.loading = false;
    }
};

//Сразу после загрузки страницы
$(document).on('DOMContentLoaded', async function () {
    await displayPage();
});
//Двойное нажатие ЛКМ на строку
$(document).on('dblclick', '.table-row', lock(async function () {
    const currentRow = $(this);
    const currentRowId = currentRow.attr('id');
    if (!selectedRow.has(currentRowId)) {
        selectedRow.add(currentRowId);
        currentRow.addClass('selected');
        if (editMode) {
            await enableEditMode(currentRow);
        }
    } else {
        selectedRow.delete(currentRowId);
        await disableEditMode(currentRow);
        currentRow.removeClass('selected');
    }
}));
//Клик на редактирование
$(document).on('click', '#edit-button', lock(async function () {
    if (!editMode) {
        editMode = true;
        await enableEditMode();
        return;
    }
    if (!saveMassive.size === 0) {
        return alert("Сохраните изменения");
    }
    if (editMode && Object.keys(saveMassive).length === 0) {
        editMode = false;
        await disableEditMode();
    }

}));
//Клик на сохранение
$(document).on('click', '#save-button', lock(async function () {
    if (Object.keys(saveMassive).length > 0) {
        await saveData(saveMassive, "update");
        saveMassive.clear();
    }
}));
//Обработчик изменения в textArea и input
$(document).on('input', '[data-name]', async function () {
    const currentElement = $(this);
    const currentId = currentElement.closest('.table-row').attr('id');
    const fieldName = currentElement.attr('data-name');
    const fieldValue = currentElement.is('div')
        ? currentElement.text().trim()
        : currentElement.val();
    saveMassive[currentId] = {
        ...saveMassive[currentId],
        [fieldName]: fieldValue
    };
    currentElement.addClass('change-textarea');
});
//Обработчик клика по .area-modal
$(document).on('click', '.area-modal', async function () {
    const modalDiv = $(this);
    const fieldName = modalDiv.attr('data-name');
    const currentId = modalDiv.closest('.table-row').attr('id');
    let selected;

    if (fieldName === 'subDivision') {
        const dialog = $('#subDivisionDialog');
        const rowContainer = dialog.find('.dialog-content-rows');
        const searchInput = dialog.find('.choice-field input');

        function renderSubDivision(subDivision) {
            rowContainer.empty();
            for (const e of subDivision) {
                rowContainer.append(`
                <div class="dialog-content-rows-row" data-id="${e.id}">
                    <div class="content-row-column col-250">${e.name}</div>
                </div>`
                );
            }
        }

        const subDivisions = await cache.get('subDivision');
        renderSubDivision(subDivisions);

        searchInput.off('input').on('input', function () {
            const searchText = $(this).val().toLowerCase().trim();
            const filteredSubDivision = subDivisions.filter(e => e.name.toLowerCase().includes(searchText));
            renderSubDivision(filteredSubDivision);
        });

        dialog[0].showModal();

        rowContainer.off('click').on('click', '.dialog-content-rows-row', function () {
            const subDivisionId = $(this).data('id');

            selected = subDivisions.find(e => e.id === subDivisionId);

            $('.dialog-content-rows-row').removeClass('selected');
            $(this).addClass('selected');
        });
        $('#changeSubDivision').off('click').on('click', async function () {
            if (!selected) {
                alert('Выберите подразделение из списка');
                return;
            }
            modalDiv.text(selected.name);

            if (currentId) {
                saveMassive[currentId] = {
                    ...saveMassive[currentId],
                    [fieldName]: selected
                };
            } else {
                saveMassive[fieldName] = selected;
            }


            modalDiv.addClass('change-textarea');

            dialog[0].close();
        });

    } else if (fieldName === 'employee') {
        const dialog = $('#employeeDialog');
        const rowContainer = dialog.find('.dialog-content-rows');
        const searchInput = dialog.find('.choice-field input');

        function renderEmployee(employees) {
            rowContainer.empty();
            for (const e of employees) {
                rowContainer.append(`
                <div class="dialog-content-rows-row" data-id="${e.id}">
                    <div class="content-row-column col-250">${e.name}</div>
                    <div class="content-row-column col-250">${e.mlmNode}</div>
                </div>`
                );
            }
        }

        const employees = await cache.get('employee');
        renderEmployee(employees);

        searchInput.off('input').on('input', function () {
            const searchText = $(this).val().toLowerCase().trim();
            const filteredEmployee = employees.filter(e => e.name.toLowerCase().includes(searchText));
            renderEmployee(filteredEmployee);
        });

        dialog[0].showModal();

        rowContainer.off('click').on('click', '.dialog-content-rows-row', function () {
            const employeeId = $(this).data('id');

            selected = employees.find(e => e.id === employeeId);

            $('.dialog-content-rows-row').removeClass('selected');
            $(this).addClass('selected');
        });
        $('#changeEmployee').off('click').on('click', async function () {
            if (!selected) {
                alert('Выберите сотрудника из списка');
                return;
            }
            modalDiv.text(selected.name);

            if (currentId) {
                saveMassive[currentId] = {
                    ...saveMassive[currentId],
                    [fieldName]: selected
                };
            } else {
                saveMassive[fieldName] = selected;
            }

            modalDiv.addClass('change-textarea');

            dialog[0].close();
        });
    }

    modalDiv.addClass('change-area');
});
//Обработчик клика по прикрепленному документу
$(document).on('click', '.document', lock(async function () {
    const dialog = $('#documentDialog');
    const currentRow = $(this).closest('.table-row');
    const currentSpeId = $(currentRow).attr('id');
    const spe = localCache.get(Number(currentSpeId));
    const rowContainer = dialog.find('.dialog-content-rows');

    rowContainer.empty();
    if (spe.documentId) {
        const document = await $.get('/api/document/get-document/' + spe.documentId);
        localCache.set('document', document);
        for (const file of document.files) {
            rowContainer.append(`
                  <div class="dialog-content-rows-row" id="${file.id}">
                    <div class="content-row-column col-450">${file.baseFileName}</div>
                    <div class="content-row-column col-100">${file.type}</div>
                    <div class="content-row-column col-100"><i style="float: right" class="download fas fa-download"></i></i></div>
                </div>`);
        }
        rowContainer.append(`
                  <div class="dialog-content-rows-row">
                    <div class="content-row-column col-450"></div>
                    <div class="content-row-column col-100"></div>
                    <div class="content-row-column col-100">
                        <i style="float: right" class="uploadIcon upload-file fas fa-file-upload" onclick="$('#fileInput').click()"></i>
                        <input type="file" id="fileInput" style="display: none;"/>
                    </div>
                  </div>`);
    } else {
        rowContainer.append(`
                  <div class="dialog-content-rows-row">
                    <div class="content-row-column col-450"></div>
                    <div class="content-row-column col-100"></div>
                   <div class="content-row-column col-100">
                        <i style="float: right" class="uploadIcon upload-file fas fa-file-upload" onclick="$('#fileInput').click()"></i>
                        <input type="file" id="fileInput" style="display: none;"/>
                    </div>
                  </div>`);
    }

    //Создание документа или добавления файла в него
    $(document).on('change', '#fileInput', function () {
        const formData = new FormData();

        $.each(this.files, function (i, file) {
            formData.append('files', file);
        });

        $.ajax({
            url: spe.documentId
                ? `/api/document/add-file-to-document/${spe.documentId}`
                : `/api/spe/create-document/${currentSpeId}`,
            type: spe.documentId ? 'PATCH' : 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log('Файлы загружены', response);
                alert('Документ добавлен');
            },
            error: function (xhr) {
                console.error('Ошибка загрузки', xhr);
            }
        });

        $(this).val('');
    });

    dialog[0].showModal();
}));
//Обработчик клика по иконке загрузки файла
$(document).on('click', '.download', lock(async function () {
    const fileId = $(this).closest('.dialog-content-rows-row').attr('id');
    const document = localCache.get('document');
    const file = document.files.find(file => file.id === fileId);
    await downloadFile(file.content, file.baseFileName);
}));
//Обработчик клика создать запись
$(document).on('click', '#create-button', lock(async function () {
    const dialog = $('#create-dialog');

    dialog[0].showModal();
}));
//Создание записи
$(document).on('click', '#createBtn', lock(async function (e) {
    e.preventDefault();

    const button = $(this);
    const form = button.closest('form').get(0);
    const dialog = $('#create-dialog');

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    button.disabled = true;

    const formData = {
        name: $('input[name="name"]').val(),
        type: $('textarea[name="type"]').val(),
        outNumber: $('textarea[name="outNumber"]').val(),
        accuracyClass: $('textarea[name="accuracyClass"]').val(),
        limitMeasurement: $('textarea[name="limitMeasurement"]').val(),
        subDivision: saveMassive['subDivision'],
        employee: saveMassive['employee'],
        periodicity: $('textarea[name="periodicity"]').val(),
        datePreparation: $('input[name="datePreparation"]').val(),
        dateVerification: $('input[name="dateVerification"]').val(),
        certificateNumber: $('textarea[name="certificateNumber"]').val()
    };

    try {
        const newSPE = await $.ajax({
            url: '/api/spe/create-spe',
            type: 'POST',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            dataType: 'json'
        });
        saveMassive = {};
        localCache.set(newSPE.id, newSPE);
        dialog[0].close();
        await createRow(newSPE, false);
        saveBtn.disabled = false;
    } catch (error) {
        saveMassive = {};
        console.error('Ошибка при создании SPE:', error);
        button.disabled = false;
    }
    applyFilters();
}));
//Фильтры
$(document).on('click', '.filter-status', lock(async function () {
    currentStatus = $(this).data('status');
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');
    applyFilters();
}));
$(document).on('click', '.subdivision-button', lock(async function () {
    const button = $(this);
    const dialog = $('#subDivisionDialog');
    const rowContainer = dialog.find('.dialog-content-rows');
    let selectedName = '';
    const cancelBtn = dialog.find('.close');
    const dialogName = dialog.find('.dialog-name');

    const subDivisions = await cache.get('subDivision');

    function render(list) {
        rowContainer.empty();
        list.forEach(e => rowContainer.append(`<div class="dialog-content-rows-row"><div class="content-row-column">${e.name}</div></div>`));
    }

    cancelBtn.text('Сбросить фильтры');
    dialogName.text('Фильтр по подразделению');
    render(subDivisions);

    dialog.find('.choice-field input').on('input', function () {
        const search = $(this).val().toLowerCase();
        render(subDivisions.filter(e => e.name.toLowerCase().includes(search)));
    });

    rowContainer.on('click', '.dialog-content-rows-row', function () {
        selectedName = $(this).find('.content-row-column').text().trim();
    });

    $('#changeSubDivision').on('click', () => {
        currentSubDivision = selectedName;
        applyFilters();
        button.css('border-color', 'red');
        dialog[0].close();
    });

    $('.close').on('click', () => {
        currentSubDivision = '';
        button.css('border-color', '#e2e8f0');
        applyFilters();
    });

    dialog.on('close', function() {
        cancelBtn.text('Отмена');
        dialogName.text('Окно выбора подразделения');
    });

    dialog[0].showModal();
}));
$(document).on('input', '#searchInput', lock(async function () {
    searchText = $(this).val().toLowerCase().trim();
    applyFilters();
}));
searchInput.off('input').on('input', function () {
});

async function displayPage() {
    const data = await getData();

    $('#total-units').append(data.totalCount);
    $('#written-off').append(data.writeOff);
    $('#verification-required').append(data.verificationRequired);
    $('#verification-period-has-expired').append(data.expired);
    $('#at-inspection').append(data.atInspection);

    for (spe of data.speDTOList) {
        await createRow(spe, false);
        localCache.set(spe.number, spe);
    }
}

async function getData() {
    return await $.get('/api/spe/get-page-spe');
}

async function createRow(spe, update) {
    const status = (() => {
        switch (spe.status) {
            case 'NONE':
                return 'Нет';
            case 'WRITE_OFF':
                return 'Списан';
            case 'VERIFICATION_REQUIRED':
                return 'Требуется поверка';
            case 'EXPIRED':
                return 'Срок поверки истек';
            case 'AT_INSPECTION':
                return 'На поверке';
        }
    })();
    const row = `
                <div class="table-row" id="${spe.number}">
                    <div class="table-cell" style="width: var(--equipment);">
                        <div class="equipment">
                            <div data-name="name" contenteditable="false">
                                ${spe.name}
                            </div>
                            <div class="equipments">
                                <div class="equipment-type">
                                    <div contenteditable="false" data-name="type">
                                        ${spe.type}
                                    </div>
                                </div>
                                <div class="equipment-number">
                                    <div contenteditable="false" data-name="outNumber">
                                        ${spe.outNumber}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--characteristics);">
                        <div class="characteristics">
                            <div contenteditable="false" data-name="accuracyClass">
                                ${spe.accuracyClass}
                            </div>
                            <div contenteditable="false" data-name="limitMeasurement">
                                ${spe.limitMeasurement}
                            </div>
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--subdivision);">
                        <div contenteditable="false" data-name="subDivision">
                            ${spe.subDivision.name}
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--responsible);">
                        <div contenteditable="false" class="responsible" data-name="employee">
                            ${spe.employee.name}
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--mark);">
                        <div contenteditable="false" data-name="mark">
                            ${spe.mark}
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--preparationDate);">
                        <div contenteditable="false" data-name="datePreparation">
                            ${formatDate(spe.datePreparation)}
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--verificationDate);">
                        <div contenteditable="false" data-name="dateVerification">
                            ${formatDate(spe.dateVerification)}
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--certificate);">
                        <div contenteditable="false" data-name="certificateNumber">
                            ${spe.certificateNumber}
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--periodicity);">
                        <div contenteditable="false" data-name="periodicity">
                            ${spe.periodicity}
                        </div> месяцев
                    </div>
                    <div class="table-cell" style="width: var(--file);">
                        <i class="document fa-solid fa-file"></i>
                    </div>
                    <div class="table-cell" style="width: var(--status);">
                        <span class="status-indicator status-good">
                           ${status}
                        </span>
                    </div>
                </div>`;
    if (!update) {
        $(`.table-body`).append(row);
    } else {
        $(`.table-row[id="${spe.id}"]`).replaceWith(row);
    }
}

async function deleteRow(rowId) {
    $(`.table-row[id="${rowId}"]`).remove();
}

async function enableEditMode(row) {
    let element;
    const dateTime = ['datePreparation', 'dateVerification'];
    const select = ['mark'];
    if (row) {
        $(row).find('div[contenteditable="false"]').each(function () {
            const $div = $(this);
            const text = $div.text().trim();
            const dataName = $div.attr('data-name');
            if (select.includes(dataName)) {
                element = $(`<select data-name="${dataName}"></select>`);
                element.append($(`<option selected>${text}</option>`));
                element.append($(`<option>${text === 'списан' ? 'на поверке' : 'списан'}</option>`));
            } else if (dateTime.includes(dataName)) {
                const rowId = Number($(row).attr('id'));
                const value = localCache.get(rowId)[dataName];
                element = $(`<input type="date" data-name="${dataName}">`).val(value);
            } else {
                element = $(this);
                element.attr('contenteditable', 'true');
            }

            if (dataName === 'employee' || dataName === 'subDivision') {
                element.addClass('area-modal').attr('contenteditable', 'false');
            }

            $div.replaceWith(element);
        });
        return;
    }
    for (const rowId of selectedRow) {
        const row = $(`.table-row[id="${rowId}"]`);
        row.find('div[contenteditable="false"]').each(function () {
            const $div = $(this);
            const text = $div.text().trim();
            const dataName = $div.attr('data-name');
            if (select.includes(dataName)) {
                element = $(`<select data-name="${dataName}"></select>`);
                element.append($(`<option selected>${text}</option>`));
                element.append($(`<option>${text === 'списан' ? 'на поверке' : 'списан'}</option>`));
            } else if (dateTime.includes(dataName)) {
                const rowId = Number($(row).attr('id'));
                const value = localCache.get(rowId)[dataName];
                element = $(`<input type="date" data-name="${dataName}">`).val(value);
            } else {
                element = $(this);
                element.attr('contenteditable', 'true');
            }

            if (dataName === 'employee' || dataName === 'subDivision') {
                element.addClass('area-modal').attr('contenteditable', 'false');
            }

            $div.replaceWith(element);
        });
    }
}

function applyFilters() {
    $('.table-row').each(function() {
        const row = $(this);
        const statusMatch = currentStatus === 'NONE' || row.find('.status-indicator').text().trim() === currentStatus;
        const subDivisionMatch = !currentSubDivision || row.find('[data-name="subDivision"]').text().trim() === currentSubDivision;
        const textMatch = searchText==='' || row.find('div[contenteditable="false"]').text().toLowerCase().includes(searchText.toLowerCase());
        row.toggle(statusMatch && subDivisionMatch && textMatch);
    });
}

async function disableEditMode(row) {
    const dateTime = ['datePreparation', 'dateVerification'];
    if (row) {
        $(row).find('div[contenteditable="true"], [data-name]').each(function () {
            const $field = $(this);
            const dataName = $field.attr("data-name");
            const value = !dateTime.includes(dataName)
                ? $field.is('select') ? $field.find('option:selected').text() : $field.text()
                : formatDate($field.val());
            $field.replaceWith(`<div data-name="${dataName}" contentEditable="false">${value}</div>`)
        });
        return;
    }
    for (rowId of selectedRow) {
        const row = $(`.table-row[id="${rowId}"]`);
        row.find('div[contenteditable="true"], [data-name]').each(function () {
            const $field = $(this);
            const dataName = $field.attr("data-name");
            const value = !dateTime.includes(dataName)
                ? $field.is('select') ? $field.find('option:selected').text() : $field.text()
                : formatDate($field.val());
            $field.replaceWith(`<div data-name="${dataName}" contentEditable="false">${value}</div>`)
        });
    }
}

async function saveData(spe, type) {
    async function createSpe(spe) {
        const newSpe = await $.ajax({
            url: '/api/spe/create-spe',
            type: 'GET',
            data: JSON.stringify(spe),
            contentType: 'application/json',
            dataType: 'json'
        });
        localCache.set(newSpe.number, newSpe);
        await createRow(newSpe, null);
    }

    async function updateSpe(spe) {
        const updatePromises = Object.entries(spe).map(async ([number, speData]) => {
            const version = localCache.get(Number(number)).version;
            const updateSpe = await $.ajax({
                url: `/api/spe/update/${number}?version=${version}`,
                type: 'PATCH',
                contentType: 'application/json',
                data: JSON.stringify(speData)
            });

            localCache.set(number, updateSpe);
            await createRow(updateSpe, true);
            return updateSpe;
        });

        return await Promise.all(updatePromises);
    }

    async function deleteSpe(spe) {
        return $.ajax({
            url: '/api/spe/delete',
            type: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify(spe),
            success: async function () {
                localCache.delete(spe.number);
                await deleteRow(spe.number);
            },
            error: function (xhr, status, error) {
                console.error('Ошибка при удалении SPE:', error);
                throw error;
            }
        });
    }

    if (type === 'create') {
        await createSpe(spe);
        applyFilters();
    } else if (type === 'update') {
        await updateSpe(spe);
        applyFilters();
    } else if (type === 'delete') {
        await deleteSpe(spe);
        applyFilters();
    } else console.error("Неподдерживаемый тип запроса")
}

async function downloadFile(byteArray, fileName) {
    try {
        const binaryString = atob(byteArray);
        const uint8Array = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([uint8Array]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(url), 100);

    } catch (error) {
        console.error('Download error:', error);
        alert('Ошибка скачивания: ' + error.message);
    }
}

function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

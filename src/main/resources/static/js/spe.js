let selectedRow = new Set();
let editMode = false;
const localCache = new Map();
let saveMassive = {};

//Сразу после загрузки страницы
$(document).on('DOMContentLoaded', async function () {
    await displayPage();
});
//Двойное нажатие ЛКМ на строку
$(document).on('dblclick', '.table-row', async function () {
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
});
//Клик на редактирование
$(document).on('click', '#edit-button', async function () {
    if (!editMode) {
        editMode = true;
        await enableEditMode();
        return;
    }
    if (!saveMassive.size === 0) {
        return alert("Сохраните изменения");
    }
    if (editMode && saveMassive.size === 0) {
        editMode = false;
        await disableEditMode();
    }

});
//Клик на сохранение
$(document).on('click', '#save-button', async function () {
    if (Object.keys(saveMassive).length > 0) {
        await saveData(saveMassive, "update");
        saveMassive.clear();
    }
});
//Обработчик изменения в textArea и input
$(document).on('input', '[data-name]', async function () {
    const currentTextArea = $(this);
    const currentId = currentTextArea.closest('.table-row').attr('id');
    const fieldName = currentTextArea.attr('data-name');
    const fieldValue = currentTextArea.val();
    saveMassive[currentId] = {
        ...saveMassive[currentId],
        [fieldName]: fieldValue
    };
    currentTextArea.addClass('change-textarea');
});
//Обработчик клика по .area-modal
$(document).on('click', '.area-modal', async function () {
    const currentArea = $(this);
    const fieldName = currentArea.attr('data-name');
    const currentId = currentArea.closest('.table-row').attr('id');
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
            currentArea.val(selected.name);

            saveMassive[currentId] = {
                ...saveMassive[currentId],
                [fieldName]: selected
            };

            currentArea.addClass('change-textarea');

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
            currentArea.val(selected.name);

            saveMassive[currentId] = {
                ...saveMassive[currentId],
                [fieldName]: selected
            };

            currentArea.addClass('change-textarea');

            dialog[0].close();
        });
    }

    currentArea.addClass('change-area');
});
//Обработчик клика по прикрепленному документу
$(document).on('click', '.document', async function () {
    const dialog = $('#documentDialog');
    const currentRow = $(this).closest('.table-row');
    const currentSpeId = $(currentRow).attr('id');
    const spe = localCache.get(Number(currentSpeId));
    const rowContainer = dialog.find('.dialog-content-rows');
    let document;

    rowContainer.empty();
    if (spe.documentId) {
        document = await $.get('/api/document/get-document/' + spe.documentId);
        for (const file of document) {
            rowContainer.append(`
                  <div class="dialog-content-rows-row" id="${file.id}">
                    <div class="content-row-column col-250">${file.baseFileName}</div>
                    <div class="content-row-column col-250">${file.type}</div>
                    <div class="content-row-column col-250"><i class="download fas fa-download"></i></i></div>
                </div>`);
        }
        rowContainer.append(`
                  <div class="dialog-content-rows-row">
                    <div class="content-row-column col-250"></div>
                    <div class="content-row-column col-250"></div>
                    <div class="content-row-column col-250">
                        <i class="uploadIcon upload-file fas fa-file-upload" onclick="$('#fileInput').click()"></i>
                        <input type="file" id="fileInput" style="display: none;"/>
                    </div>
                  </div>`);
    } else {
        rowContainer.append(`
                  <div class="dialog-content-rows-row">
                    <div class="content-row-column col-250"></div>
                    <div class="content-row-column col-250"></div>
                   <div class="content-row-column col-250">
                        <i class="uploadIcon upload-file fas fa-file-upload" onclick="$('#fileInput').click()"></i>
                        <input type="file" id="fileInput" style="display: none;"/>
                    </div>
                  </div>`);
    }

    //Создание документа или добавления файла в него
    $(document).on('change', '#fileInput', function() {
        const formData = new FormData();

        $.each(this.files, function(i, file) {
            formData.append('files', file);
        });

        $.ajax({
            url: spe.documentId
                ? `/api/document/add-file-to-document/${spe.documentId}`
                : `/spe/create-document/${currentSpeId}`,
            type: spe.documentId ? 'PATCH' : 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log('Файлы загружены', response);
            },
            error: function(xhr) {
                console.error('Ошибка загрузки', xhr);
            }
        });

        $(this).val('');
    });

    $(document).on('click', '.download', async function () {
        const fileId = $(this).closest('.dialog-content-rows-row').attr('id');
        const file = document.files.find(file => file.id === fileId);
        await downloadFile(file.file, file.baseFileName);
    });

    dialog[0].showModal();
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
    const row = `
                <div class="table-row" id="${spe.number}">
                    <div class="table-cell" style="width: var(--equipment);">
                        <div class="equipment">
                            <p data-name="name">${spe.name}</p>
                            <div class="equipments">
                                <div class="equipment-type"><p data-name="type">${spe.type}</p></div>
                                <div class="equipment-number"><p data-name="outNumber">${spe.outNumber}</p></div>
                            </div>
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--characteristics);">
                        <div class="characteristics">
                            <p data-name="accuracyClass">${spe.accuracyClass}</p>
                            <p data-name="limitMeasurement">${spe.limitMeasurement}</p>
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--subdivision);">
                        <p data-name="subDivision">${spe.subDivision.name}</p>
                    </div>
                    <div class="table-cell" style="width: var(--responsible);">
                        <div class="responsible">
                            <p data-name="employee">${spe.employee.name}</p>
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--mark);">
                        <p data-name="mark">${spe.mark}</p>
                    </div>
                    <div class="table-cell" style="width: var(--preparationDate);">
                        <p data-name="datePreparation">${formatDate(spe.datePreparation)}</p>
                    </div>
                    <div class="table-cell" style="width: var(--verificationDate);">
                        <p data-name="dateVerification">${formatDate(spe.dateVerification)}</p>
                    </div>
                    <div class="table-cell" style="width: var(--certificate);">
                        <p data-name="certificateNumber">${spe.certificateNumber}</p>
                    </div>
                    <div class="table-cell" style="width: var(--periodicity);">
                        <p data-name="periodicity">${spe.periodicity}</p> месяцев
                    </div>
                    <div class="table-cell" style="width: var(--file);">
                        <i class="document fa-solid fa-file"></i>
                    </div>
                    <div class="table-cell" style="width: var(--status);">
                        <span class="status-indicator status-good">
                           ${spe.status}
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
        $(row).find('p').each(async function () {
            const $p = $(this);
            const text = $p.text();
            const dataName = $p.attr('data-name');
            if (select.includes(dataName)) {
                element = $(`<select data-name="${dataName}"></select>`);
                element.append($(`<option selected>${text}</option>`));
                element.append($(`<option>${text === 'списан' ? 'на поверке' : 'списан'}</option>`));
            } else if (dateTime.includes(dataName)) {
                const rowId = Number($(row).attr('id'));
                const value = localCache.get(rowId)[dataName];
                element = $(`<input type="date" data-name="${dataName}">`).val(value);
            } else element = $(`<textarea data-name="${dataName}" rows="2">`).val(text);

            if (dataName === 'employee' || dataName === 'subDivision') {
                element.addClass('area-modal').attr('readonly', 'readonly');
            }

            $p.replaceWith(element);
        });
        return;
    }
    for (const rowId of selectedRow) {
        const row = $(`.table-row[id="${rowId}"]`);
        row.find('p').each(function () {
            const $p = $(this);
            const text = $p.text();
            const dataName = $p.attr('data-name');
            if (select.includes(dataName)) {
                element = $(`<select data-name="${dataName}"></select>`);
                element.append($(`<option selected>${text}</option>`));
                element.append($(`<option>${text === 'списан' ? 'на поверке' : 'списан'}</option>`));
            } else if (dateTime.includes(dataName)) {
                const value = localCache.get(Number(rowId))[dataName];
                element = $(`<input type="date" data-name="${dataName}">`).val(value);
            } else element = $(`<textarea data-name="${dataName}" rows="2">`).val(text);

            $p.replaceWith(element);
        });
    }
}

async function disableEditMode(row) {
    if (row) {
        $(row).find('textarea').each(function () {
            const $textarea = $(this);
            const text = $textarea.val();
            const dataName = $textarea.attr('data-name');
            const p = $(`<p data-name="${dataName}">`).text(text);
            $textarea.replaceWith(p);
        });
        return;
    }
    for (rowId of selectedRow) {
        const row = $(`.table-row[id="${rowId}"]`);
        row.find('textarea').each(function () {
            const $textarea = $(this);
            const text = $textarea.val();
            const dataName = $textarea.attr('data-name');
            const p = $(`<p data-name="${dataName}">`).text(text);
            $textarea.replaceWith(p);
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
            url: '/spe/delete',
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
    } else if (type === 'update') {
        await updateSpe(spe);
    } else if (type === 'delete') {
        await deleteSpe(spe);
    } else console.error("Неподдерживаемый тип запроса")
}

async function downloadFile(byteArray, fileName) {
    const getMimeType = (filename) => {
        const extension = filename.split('.').pop().toLowerCase();
        const mimeTypes = {
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'xml': 'application/xml',
            'txt': 'text/plain',
            'json': 'application/json'
        };
        return mimeTypes[extension] || 'application/octet-stream';
    };

    const mimeType = getMimeType(fileName);
    const blob = new Blob([byteArray], { type: mimeType });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => window.URL.revokeObjectURL(url), 100);
}

function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

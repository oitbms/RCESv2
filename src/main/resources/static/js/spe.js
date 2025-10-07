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
    }
});
//Обработчик изменения в textArea
$(document).on('input', 'textarea', async function () {
    const currentTextArea = $(this);
    const currentId = currentTextArea.closest('.table-row').attr('id');
    const fieldName = currentTextArea.attr('data-name');
    const fieldValue = currentTextArea.val();
    saveMassive[currentId] = { [fieldName]: fieldValue };
    currentTextArea.addClass('change-textarea');
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
                        <p data-name="subDivision">${spe.subDivision}</p>
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
                        файл
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
    if (row) {
        $(row).find('p').each(function () {
            const $p = $(this);
            const text = $p.text();
            const dataName = $p.attr('data-name');
            const textarea = $(`<textarea data-name="${dataName}" rows="2">`).val(text);
            $p.replaceWith(textarea);
        });
        return;
    }
    for (rowId of selectedRow) {
        const row = $(`.table-row[id="${rowId}"]`);
        row.find('p').each(function () {
            const $p = $(this);
            const text = $p.text();
            const dataName = $p.attr('data-name');
            const textarea = $(`<textarea data-name="${dataName}" rows="2">`).val(text);
            $p.replaceWith(textarea);
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
            const version = localCache.get(number).version;
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
            error: function(xhr, status, error) {
                console.error('Ошибка при удалении SPE:', error);
                throw error;
            }
        });
    }

    if (type === 'create') {
        await createSpe(spe);
    }
    else if (type === 'update') {
        await updateSpe(spe);
    }
    else if (type === 'delete') {
        await deleteSpe(spe);
    } else console.error("Неподдерживаемый тип запроса")
}

function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

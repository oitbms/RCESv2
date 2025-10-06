let selectedRow = new Set();
let editMode = false;
let saveMap = new Map();

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
        currentRow.removeClass('selected');
    }
});
//Клик на редактирование
$(document).on('click', '#edit-button', async function () {
    if (!editMode) {
        editMode = true;
        await enableEditMode();
    } else {
        editMode = false;
        await disableEditMode();
    }

});
//Обработчик изменения в textArea
$(document).on('input', 'textarea', async function () {

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
                            <div>
                                <p data-name="accuracyClass">${spe.accuracyClass}</p>
                            </div>
                            <div>
                                <p data-name="limitMeasurement">${spe.limitMeasurement}</p>
                            </div>
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--subdivision);">
                        <p data-name="accuracyClass">Склад (ОФ)</p>
                    </div>
                    <div class="table-cell" style="width: var(--responsible);">
                        <div class="responsible">
                            <p data-name="accuracyClass">${spe.employee.name}</p>
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--mark);">
                        <p data-name="accuracyClass">${spe.mark}</p>
                    </div>
                    <div class="table-cell" style="width: var(--preparationDate);">
                        <p data-name="accuracyClass">${formatDate(spe.datePreparation)}</p>
                    </div>
                    <div class="table-cell" style="width: var(--verificationDate);">
                        <p data-name="accuracyClass">${formatDate(spe.dateVerification)}</p>
                    </div>
                    <div class="table-cell" style="width: var(--certificate);">
                        <p data-name="accuracyClass">${spe.certificateNumber}</p>
                    </div>
                    <div class="table-cell" style="width: var(--periodicity);">
                        <p data-name="accuracyClass">${spe.periodicity + ' месяцев'}</p>
                    </div>
                    <div class="table-cell" style="width: var(--file);">
                        файл
                    </div>
                    <div class="table-cell" style="width: var(--status);">
                        <span class="status-indicator status-good">
                            <p data-name="accuracyClass">${spe.status}</p>
                        </span>
                    </div>
                </div>`;
    if (!update) {
        $(`.table-body`).append(row);
    } else {
        $(`.table-row[id="${spe.id}"]`).replaceWith(row);
    }
}

async function enableEditMode(row) {
    if (row) {
        const row = row.attr('id');
        row.find('p').each(function() {
            const $p = $(this);
            const text = $p.text();
            const textarea = $('<textarea rows="3">').val(text);
            $p.replaceWith(textarea);
        });
        return;
    }
    for (rowId of selectedRow) {
        const row = $(`.table-row[id="${rowId}"]`);
        row.find('p').each(function() {
            const $p = $(this);
            const text = $p.text();
            const textarea = $('<textarea rows="3">').val(text);
            $p.replaceWith(textarea);
        });
    }
}
async function desableEditMode() {
    for (rowId of selectedRow) {
        const row = $(`.table-row[id="${rowId}"]`);
        row.find('p').each(function() {
            const $p = $(this);
            const text = $p.text();
            const textarea = $('<textarea rows="3">').val(text);
            $p.replaceWith(textarea);
        });

    }
}

function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

//Сразу после загрузки
$(document).on('DOMContentLoaded', async function () {
    await displayPage();
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
                            ${spe.name}
                            <div class="equipments">
                                <div class="equipment-type">${spe.type}</div>
                                <div class="equipment-number">${spe.outNumber}</div>
                            </div>
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--characteristics);">
                        <div class="characteristics">
                            <div>
                                ${spe.accuracyClass}
                            </div>
                            <div>
                                ${spe.limitMeasurement}
                            </div>
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--subdivision);">Склад (ОФ)</div>
                    <div class="table-cell" style="width: var(--responsible);">
                        <div class="responsible">
                            ${spe.employee.name}
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--mark);">
                        ${spe.mark}
                    </div>
                    <div class="table-cell" style="width: var(--preparationDate);">
                        ${formatDate(spe.datePreparation)}
                    </div>
                    <div class="table-cell" style="width: var(--verificationDate);">
                        ${formatDate(spe.dateVerification)}
                    </div>
                    <div class="table-cell" style="width: var(--certificate);">
                        ${spe.certificateNumber}
                    </div>
                    <div class="table-cell" style="width: var(--periodicity);">
                        ${spe.periodicity + ' месяцев'}
                    </div>
                    <div class="table-cell" style="width: var(--file);">
                        файл
                    </div>
                    <div class="table-cell" style="width: var(--status);">
                        <span class="status-indicator status-good">${spe.status}</span>
                    </div>
                </div>`;
    if (!update) {
        $(`.table-body`).append(row);
    } else {
        $(`.table-row[id="${spe.id}"]`).replaceWith(row);
    }
}

function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}
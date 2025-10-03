$(document).on('ready', function () {

});

async function displayPage() {
    const data = await getData();
    for (spe of data) {
        await createRow(spe, false);
    }
}

async function getData() {
    return await $.get('/api/spe/get-page-spe');
}

async function createRow(spe, update) {
    const row = `
                <div class="table-row" id="${spe.id}">
                    <div class="table-cell" style="width: var(--equipment);">
                        <div class="equipment">
                            ${spe.name}
                            <div class="equipments">
                                <div class="equipment-type">${spe.type}</div>
                                <div class="equipment-number">${spe.number}</div>
                            </div>
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--characteristics);">
                        <div class="characteristics">
                            <div>
                                ${spe.accuracy}
                            </div>
                            <div>
                                ${spe.measurement}
                            </div>
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--subdivision);">Склад (ОФ)</div>
                    <div class="table-cell" style="width: var(--responsible);">
                        <div class="responsible">
                            ${spe.employee}
                        </div>
                    </div>
                    <div class="table-cell" style="width: var(--mark);">
                        ${spe.mark}
                    </div>
                    <div class="table-cell" style="width: var(--preparationDate);">
                        ${spe.preparationDate}
                    </div>
                    <div class="table-cell" style="width: var(--verificationDate);">
                        ${spe.verificationDate}
                    </div>
                    <div class="table-cell" style="width: var(--certificate);">
                        ${spe.certificate}
                    </div>
                    <div class="table-cell" style="width: var(--periodicity);">
                        ${spe.periodicity}
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
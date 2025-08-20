const itemsPerPage = 16; //Начальное кол-во строк на странице
const localCache = new Map();

//Обработчик открытия подзадач
$(document).on('click', '.hamburger', function (e) {
    if ($(e.target).is('input')) {
        return;
    }
    const $currentRow = $(this).closest('.row-items-row');
    const $innerRows = $currentRow.siblings('.row-items-inner-row');

    $innerRows.slideToggle(400);
});
//Обработчик открытия окна редактирования
$(document).on('click', '.editing-btn', async function (e) {
    const currentRow = e.target.closest('.row-items-row');
    const currentId = $(currentRow).data('id');
    const currentSGI = localCache.get(currentId);
    const dialog = $('#editing-dialog');

    for (const [key, value] of Object.entries(currentSGI)) {
        const field = dialog.find(`[data-field="${key}"]`);
        if (key === 'employee') {
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
        field.val(value || '');
    }

    dialog.show();
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
        const row = `
                <div class="row-items">
                    <div class="row-items-row" data-id="${item.id}">
                        <div class="row-item no" style="width: var(--no);">
                            ${item.subSGI && item.subSGI.length > 0 ? hamburger : ''}
                            ${item.number}
                        </div>
                        <div class="row-item" style="width: var(--workcenter);">${item.workcenter}</div>
                        <div class="row-item" style="width: var(--event);">${item.event}</div>
                        <div class="row-item" style="width: var(--action);">${item.actions}</div>
                        <div class="row-item" style="width: var(--department);">${item.departmentName}</div>
                        <div class="row-item" style="width: var(--employee);">${item.employee}</div>
                        <div class="row-item" style="width: var(--desiredDate);">${formatDate(item.desiredDate)}</div>
                        <div class="row-item" style="width: var(--note);">${item.note}</div>
                        <div class="row-item" style="width: var(--planDate);">${formatDate(item.planDate)}</div>
                        <div class="row-item" style="width: var(--comment);">${item.comment}</div>
                        <div class="row-item" style="width: var(--editing);">
                            <button type="button" class="btn btn-info btn-sm editing-btn">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                        </div>
                        <div class="row-item" style="width: var(--executions);">
                            <button type="button" class="btn btn-info btn-sm">
                                ✔
                            </button>
                        </div>
                        <div class="row-item" style="width: var(--status);">
                            <div class="checkbox-wrapper-31">
                                <input type="checkbox" ${item.agree ? 'checked' : ''}>
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
                            <div class="row-items-row" data-id="${subItem.id}">
                                <div class="row-item no" style="width: var(--no);"></div>
                                <div class="row-item" style="width: var(--workcenter);">${subItem.workcenter}</div>
                                <div class="row-item" style="width: var(--event);">${subItem.event}</div>
                                <div class="row-item" style="width: var(--action);">${subItem.actions}</div>
                                <div class="row-item" style="width: var(--department);">${subItem.departmentName}</div>
                                <div class="row-item" style="width: var(--employee);">${subItem.employee}</div>
                                <div class="row-item" style="width: var(--desiredDate);">${formatDate(subItem.desiredDate)}</div>
                                <div class="row-item" style="width: var(--note);">${subItem.note}</div>
                                <div class="row-item" style="width: var(--planDate);">${formatDate(subItem.planDate)}</div>
                                <div class="row-item" style="width: var(--comment);">${subItem.comment}</div>
                                <div class="row-item" style="width: var(--editing);">
                                    <button type="button" class="btn btn-info btn-sm editing-btn">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                </div>
                                <div class="row-item" style="width: var(--executions);">
                                    <button type="button" class="btn btn-info btn-sm">
                                        ✔
                                    </button>
                                </div>
                                <div class="row-item" style="width: var(--status);">
                                    <div class="checkbox-wrapper-31">
                                        <input type="checkbox" ${subItem.agree ? 'checked' : ''}>
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

$(document).ready(async function () {
    await displayPage(1);
});

//Форматирование дат
function formatDate(dateString) {
    if (!dateString) return "&nbsp;";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

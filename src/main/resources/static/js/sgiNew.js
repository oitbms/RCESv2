const itemsPerPage = 16; //Начальное кол-во строк на странице

//Обработчик открытия подзадач
$(document).on('click', '.hamburger', function (e) {
    if ($(e.target).is('input')) {
        return;
    }
    const $currentRow = $(this).closest('.row-items-row');
    const $innerRows = $currentRow.siblings('.row-items-inner-row');

    $innerRows.slideToggle(400);
});

//Обработчик редактирования
$(document).on('click', '#editing', function (e) {
    const row = e.target.closest('.row-items-row');
    const sgiId = row.dataset.id;
});

async function displayPage(page) {
    async function loadSGI(page = 16) {
        const response = await $.ajax({
            url: '/api/getPageSGI',
            type: 'GET',
            data: {page: page, size: itemsPerPage},
            dataType: 'json'
        });
        const content = response.content;      // Массив элементов SGI
        const totalPages = response.total;        // Всего страниц

        return {content: content, totalPages};
    }

    const SGIPage = await loadSGI(1);
    const asas = "3131";
}

$(document).ready(async function () {
    await displayPage(1);
});

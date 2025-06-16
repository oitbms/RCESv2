
// История изменений
$('.history-icon').off("click").on("click", async function () {
    const modal = $('#viewRequestLogs');
    const body = $('#logsBody');

    body.empty();

    const data = await $.get('/api/logs', {id: $(this).data('id')});
    if(data.length === 0) {
        body.append(`
        <div id="logsEmpty" class="text-center py-5">
            <div class="mb-3">
                <svg class="bi bi-clock-history text-muted" width="48" height="48" fill="currentColor">
                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                </svg>
            </div>
            <p class="text-muted mb-0">Нет данных об изменениях</p>
        </div>`)
        modal.modal('show');
        return;
    }

    data.forEach(log => {
        const changes = Object.entries(log.metadata).map(([key, value]) => `
            <div class="d-flex align-items-baseline gap-2">
                <span class="badge bg-primary bg-opacity-10 text-primary fs-9">${key}</span>
                <span class="text-muted fs-8">${value}</span>
            </div>
        `).join('');

        const formatDateTime = (dateString) => {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
        };

        const item = `
            <div class="row gx-4 py-3 align-items-center border-bottom">
                <div class="col-3">
                    <div class="d-flex flex-column">
                        <span class="text-dark fs-8">${formatDateTime(log.date)}</span>
                    </div>
                </div>
                <div class="col-3">
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar avatar-xs">
                            <span class="avatar-initials bg-primary text-white">${log.userName[0]}</span>
                        </div>
                        <span class="text-dark fs-8">${log.userName}</span>
                    </div>
                </div>
                <div class="col-6">
                    <div class="d-flex flex-column gap-2">
                        ${changes}
                    </div>
                </div>
            </div>
        `;
        body.append(item);
    });

    modal.modal('show');
});

$(document).ready(function () {
    const requestType = "${type?lower_case}";
    let selectedRequestNumber;
    const rowsPerPage = 15;
    let filteredRows = [];

    // Контекстное меню
    $('.clickable-row').on('contextmenu', function (event) {
        event.preventDefault();
        selectedRequestNumber = $(this).data('request-number');
        $('#contextMenu').css({
            display: 'block',
            left: event.pageX,
            top: event.pageY
        });
    });

    $(document).on('click', function () {
        $('#contextMenu').hide();
    });

    $('#editRequest').on('click', function () {
        $('#contextMenu').hide();
        window.location.href = '/view/' + selectedRequestNumber;
    });

    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            $('#contextMenu').hide();
        }
    });

    $('#viewRequestModal').on('hidden.bs.modal', function () {
        location.reload();
    });

    // Фильтрация и пагинация
    const filterData = () => {
        filteredRows = $('#requestTable tbody tr').filter((index, row) => {
            return checkRowFilters(row);
        });
        showPage(1);
    };

    const checkRowFilters = (row) => {

        const createBy = $(row).find('td:nth-child(1)').text().toLowerCase();
        const employeeBy = $(row).find('td:nth-child(2)').text().toLowerCase();
        const item = $(row).find('td:nth-child(3)').text().toLowerCase();
        const requestNumber = $(row).find('td:nth-child(4)').text().toLowerCase();
        const customerOrder = $(row).find('td:nth-child(5)').text().toLowerCase();
        const workShop = $(row).find('td:nth-child(6)').text().toLowerCase();
        const reason = $(row).find('td:nth-child(7)').text().toLowerCase();
        const status = $(row).find('td:nth-child(8)').text().toLowerCase();
        const date = $(row).find('td:nth-child(9)').text().toLowerCase();
        const dateCreate = $(row).find('td:nth-child(10)').text().toLowerCase();
        const changedBy = $(row).find('td:nth-child(11)').text().toLowerCase();
        // Проверка наличия поля "Тип контроля" и его значения
        let controlMatch = true;
        const controlInput = $('#control');
        if (controlInput.length > 0) {
            const control = $(row).find('td:nth-child(12)').text().toLowerCase();
            controlMatch = control.includes(controlInput.val().toLowerCase());
        }


        return (
            createBy.includes($('#createBy').val().toLowerCase()) &&
            employeeBy.includes($('#employeeBy').val().toLowerCase()) &&
            item.includes($('#item').val().toLowerCase()) &&
            requestNumber.includes($('#requestNumber').val().toLowerCase()) &&
            customerOrder.includes($('#customerOrder').val().toLowerCase()) &&
            workShop.includes($('#workShop').val().toLowerCase()) &&
            reason.includes($('#reason').val().toLowerCase()) &&
            status.includes($('#status').val().toLowerCase()) &&
            date.includes($('#date').val().toLowerCase()) &&
            dateCreate.includes($('#dateCreate').val().toLowerCase()) &&
            changedBy.includes($('#changedBy').val().toLowerCase()) &&
            controlMatch
        );
    };

    const showPage = (page) => {
        $('#requestTable tbody tr').hide();
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        filteredRows.slice(start, end).show();
        renderPagination(page);
    };

    const renderPagination = (currentPage) => {
        $('#pagination').empty();
        const totalFilteredRows = filteredRows.length;
        const totalFilteredPages = Math.ceil(totalFilteredRows / rowsPerPage);
        for (let i = 1; i <= totalFilteredPages; i++) {
            const pageLink = $('<button>')
                .text(i)
                .addClass('btn btn-secondary mx-1')
                .click(() => showPage(i));
            if (i === currentPage) pageLink.addClass('active');
            $('#pagination').append(pageLink);
        }
    };

    // Инициализация слушателей событий для фильтров
    $('#createBy, #employeeBy, #item, #requestNumber, #customerOrder, #workShop, #reason, #status, #date, #dateCreate, #changedBy').on('keyup change', filterData);

    // Добавляем слушатель для поля "Тип контроля" только если оно существует
    const controlInput = $('#control');
    if (controlInput.length > 0) {
        controlInput.on('keyup change', filterData);
    }

    filterData();

    $('.toggleInput').on('click', function () {
        $(this).next('.inputContainer').toggle();
    });
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.inputContainer').length && !$(e.target).closest('.toggleInput').length) {
            $('.inputContainer').hide();
        }
    });
});
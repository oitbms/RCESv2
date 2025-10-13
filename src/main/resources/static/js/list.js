$(document).on('click', '.history-icon', async function () {
    const modal = $('#viewRequestLogs');
    const body = $('#logsBody');
    const requestId = $(this).data('id');

    body.empty();
    body.append(`
        <div class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Загрузка...</span>
            </div>
            <p class="mt-2 text-muted">Загрузка истории...</p>
        </div>
    `);

    try {
        const historyResponse = await fetch(`/api/request/${requestId}/history`);

        if (!historyResponse.ok) {
            throw new Error('Ошибка загрузки истории');
        }

        const historyData = await historyResponse.json();

        const hasUndefinedData = checkForUndefinedData(historyData);

        if (hasUndefinedData || historyData.length === 0) {
            await loadRequestLogs(requestId, modal, body, historyData);
            return;
        }

        displayDetailedHistory(historyData, body);
        modal.modal('show');

    } catch (error) {
        console.error('Error loading history:', error);

        try {
            await loadRequestLogs(requestId, modal, body);
        } catch (fallbackError) {
            showError(body, error);
            modal.modal('show');
        }
    }
});

function checkForUndefinedData(data) {
    if (!data || !Array.isArray(data)) return true;

    for (const item of data) {
        if (item.revisionDate === undefined ||
            item.revisionType === undefined ||
            item.changedBy === undefined ||
            item.revisionNumber === undefined ||
            !item.requestData) {
            return true;
        }

        const requestData = item.requestData;
        if (requestData.status === undefined ||
            requestData.typeRequest === undefined ||
            requestData.comment === undefined ||
            requestData.reason === undefined ||
            requestData.description === undefined ||
            requestData.qty === undefined ||
            requestData.inconsistencies === undefined) {
            return true;
        }
    }

    return false;
}

async function loadRequestLogs(requestId, modal, body, historyData) {
    try {
        $('#viewRequestLogs .container-fluid .row').html(`
            <div class="col-4 text-center">Дата</div>
            <div class="col-4 text-center">Пользователь</div>
            <div class="col-4 text-center">Изменения</div>
        `);

        body.empty();
        body.append(`
            <div class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Загрузка...</span>
                </div>
                <p class="mt-2 text-muted">Загрузка логов...</p>
            </div>
        `);

        // Используем переданные данные
        const logsData = historyData;

        body.empty();

        if (logsData.length === 0) {
            body.append(`
                <div class="text-center py-5">
                    <div class="mb-3">
                        <svg class="bi bi-clock-history text-muted" width="48" height="48" fill="currentColor">
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                        </svg>
                    </div>
                    <p class="text-muted mb-0">Нет данных об изменениях</p>
                </div>
            `);
            modal.modal('show');
            return;
        }

        logsData.forEach(log => {
            const changes = Object.entries(log.metadata).map(([key, value]) => `
                <div class="d-flex align-items-baseline gap-2">
                    <span class="badge bg-white bg-opacity-10 text-primary fs-9">${key}</span>
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
                    <div class="col-4"> <!-- Изменил с col-3 на col-4 -->
                        <div class="d-flex flex-column">
                            <span class="text-dark fs-8">${formatDateTime(log.date)}</span>
                        </div>
                    </div>
                    <div class="col-4"> <!-- Изменил с col-3 на col-4 -->
                        <div class="d-flex align-items-center gap-2">
                            <div class="avatar avatar-xs">
                                <span class="avatar-initials btn-primary text-white">${log.userName ? log.userName[0] : 'С'}</span>
                            </div>
                            <span class="text-dark fs-8">${log.userName || 'Система'}</span>
                        </div>
                    </div>
                    <div class="col-4"> <!-- Изменил с col-6 на col-4 -->
                        <div class="d-flex flex-column gap-2">
                            ${changes}
                        </div>
                    </div>
                </div>
            `;
            body.append(item);
        });

        modal.modal('show'); // Убрал лишнюю строку "modal."

    } catch (error) {
        console.error('Error loading logs:', error);
        showError(body, error);
        modal.modal('show');
    }
}
function displayDetailedHistory(data, body) {

    restoreOriginalHeaders();

    body.empty();

    data.sort((a, b) => new Date(b.revisionDate) - new Date(a.revisionDate));

    data.forEach(log => {
        const changes = getChangesDescription(log.requestData, log.revisionType);

        const formatDateTime = (dateString) => {
            if (!dateString) return 'неизвестно';
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${day}.${month}.${year}<br>${hours}:${minutes}`;
        };

        const getBadgeClass = (revisionType) => {
            switch (revisionType) {
                case 'ADD':
                    return 'bg-success text-white';
                case 'MOD':
                    return 'bg-warning text-dark';
                case 'DEL':
                    return 'bg-danger text-white';
                default:
                    return 'bg-secondary text-white';
            }
        };

        const getOperationText = (revisionType) => {
            switch (revisionType) {
                case 'ADD':
                    return 'Создание';
                case 'MOD':
                    return 'Изменение';
                case 'DEL':
                    return 'Удаление';
                default:
                    return revisionType;
            }
        };

        const item = `
            <div class="row gx-3 py-3 align-items-start border-bottom hover-bg">
                <!-- Дата -->
                <div class="col-2">
                    <div class="text-center">
                        <span class="text-dark small">${formatDateTime(log.revisionDate)}</span>
                    </div>
                </div>

                <div class="col-1">
                    <div class="text-center">
                        <span class="badge ${getBadgeClass(log.revisionType)} small">
                            ${getOperationText(log.revisionType)}
                        </span>
                    </div>
                </div>

                <div class="col-2">
                    <div class="d-flex flex-column align-items-center text-center">
                        <div class="avatar avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center mb-1" style="width: 28px; height: 28px;">
                            <span class="text-white small fw-bold">${log.changedBy ? log.changedBy[0] : 'С'}</span>
                        </div>
                        <span class="text-dark small">${log.changedBy || 'Система'}</span>
                    </div>
                </div>

                <div class="col-1">
                    <div class="text-center">
                        <span class="badge bg-light text-dark border small">${log.revisionNumber}</span>
                    </div>
                </div>

                <div class="col-6">
                    <div class="ps-2 border-start">
                        ${changes}
                    </div>
                </div>
            </div>
        `;
        body.append(item);
    });
}

function showError(body, error) {
    body.empty();
    body.append(`
        <div class="text-center py-5">
            <div class="mb-3">
                <svg class="bi bi-exclamation-triangle text-danger" width="48" height="48" fill="currentColor">
                    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                </svg>
            </div>
            <p class="text-danger mb-0">Ошибка загрузки истории</p>
            <p class="text-muted small mt-1">${error.message}</p>
        </div>
    `);
}

function getChangesDescription(requestData, revisionType) {
    if (!requestData) return '<span class="text-muted small">Нет данных</span>';

    const changes = [];
    const data = requestData;

    if (revisionType === 'ADD') {
        return `
            <div class="changes-grid">
                <div class="change-item">
                    <span class="change-label">Действие:</span>
                    <span class="change-value">Создана новая заявка</span>
                </div>
                <div class="change-item">
                    <span class="change-label">Тип:</span>
                    <span class="change-value">${data.typeRequest || 'не указан'}</span>
                </div>
                <div class="change-item">
                    <span class="change-label">Статус:</span>
                    <span class="change-value">${data.status || 'не указан'}</span>
                </div>
            </div>
        `;
    }

    if (data.status) {
        changes.push(`
            <div class="change-item">
                <span class="change-label">Статус:</span>
                <span class="change-value">${data.status}</span>
            </div>
        `);
    }

    if (data.comment) {
        changes.push(`
            <div class="change-item">
                <span class="change-label">Комментарий:</span>
                <span class="change-value">${data.comment}</span>
            </div>
        `);
    }

    if (data.typeRequest) {
        changes.push(`
            <div class="change-item">
                <span class="change-label">Тип заявки:</span>
                <span class="change-value">${data.typeRequest}</span>
            </div>
        `);
    }

    if (data.reason) {
        changes.push(`
            <div class="change-item">
                <span class="change-label">Причина:</span>
                <span class="change-value">${data.reason}</span>
            </div>
        `);
    }

    if (data.description !== null && data.description !== undefined && data.description !== '') {
        changes.push(`
            <div class="change-item">
                <span class="change-label">Описание:</span>
                <span class="change-value text-break">${data.description}</span>
            </div>
        `);
    }

    if (data.qty !== undefined && data.qty !== null) {
        changes.push(`
            <div class="change-item">
                <span class="change-label">Количество:</span>
                <span class="change-value">${data.qty}</span>
            </div>
        `);
    }

    if (data.inconsistencies && data.inconsistencies.length > 0) {
        const inconsistenciesStr = Array.isArray(data.inconsistencies)
            ? data.inconsistencies.join(', ')
            : data.inconsistencies;
        changes.push(`
            <div class="change-item">
                <span class="change-label">Несоответствия:</span>
                <span class="change-value">${inconsistenciesStr}</span>
            </div>
        `);
    }

    if (changes.length === 0) {
        return '<span class="text-muted small">Изменения не зафиксированы</span>';
    }

    return `<div class="changes-grid">${changes.join('')}</div>`;
}

const style = document.createElement('style');
style.textContent = `
    .changes-grid {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .change-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
    }
    .change-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: #6c757d;
        min-width: 120px;
        flex-shrink: 0;
    }
    .change-value {
        font-size: 0.8rem;
        color: #212529;
        word-break: break-word;
        flex: 1;
    }
    .hover-bg:hover {
        background-color: #f8f9fa;
    }
    .border-start {
        border-left: 2px solid #e9ecef !important;
    }
`;
document.head.appendChild(style);

function restoreOriginalHeaders() {
    $('#viewRequestLogs .container-fluid .row').html(`
        <div class="col-2 text-center">Дата</div>
        <div class="col-1 text-center">Действие</div>
        <div class="col-2 text-center">Пользователь</div>
        <div class="col-1 text-center">Версия</div>
        <div class="col-6 text-center">Изменения</div>
    `);
}

$(document).ready(function () {
    const rowsPerPage = 15;
    let filteredRows = [];

    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            $('#contextMenu').hide();
        }
    });

    $('#viewRequestModal').on('hidden.bs.modal', function () {
        location.reload();
    });

    const filterData = () => {
        filteredRows = $('#requestTable tbody tr').filter((index, row) => {
            return checkRowFilters(row);
        });
        showPage(1);
    };

    const checkRowFilters = (row) => {
        const requestNumber = $(row).find('td:nth-child(1)').text().toLowerCase();
        const createBy = $(row).find('td:nth-child(2)').text().toLowerCase();
        const employeeBy = $(row).find('td:nth-child(3)').text().toLowerCase();

        return (
            requestNumber.includes($('#requestNumber').val().toLowerCase()) &&
            createBy.includes($('#createBy').val().toLowerCase()) &&
            employeeBy.includes($('#employeeBy').val().toLowerCase())
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

    $('#requestNumber,#createBy, #employeeBy').on('keyup change', filterData);

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

$(function () {
    $('#table tbody tr').each(function () {
        const $qtyCell = $(this).find('td').eq(12);
        const value = $qtyCell.text().trim();
        const qty = parseInt(value) || 0;

        if (qty > 0) {
            $qtyCell.html('<span style="background-color: #ee0000; padding: 5px 10px; border-radius: 3px; display: inline-block; width: 100%; text-align: center; color: #ffffff;">' + value + '</span>');
        }
    });

    $('#table').bootstrapTable({
        locale: 'ru-RU',
        iconsPrefix: 'bi',
        icons: {
            exportTypes: ['json', 'excel']
        }
    });
});

document.getElementById('closeId').addEventListener('click', () => {
    $("#viewRequestLogs").modal('hide');
});
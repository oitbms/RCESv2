let currentRow;
let entityId;

$('#addSubTaskId').on('submit', function (e) {
    e.preventDefault();
    const form = this;
    const formData = new FormData(this);
    formData.append("id", entityId);
    formData.append("executionDate", document.getElementById("executionDate").value);
    formData.append("images", document.getElementById("images").value);
    $.ajax({
        url: '/sgi/create/execution',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            $(form).trigger('reset');
            $(form).find('input[type="file"]').val('');
            $('#exampleModalToggle2').modal('hide');
            openFactExecutionModal(entityId);
        }
    });
});

async function openFactExecutionModal(rowId) {
    entityId = rowId;
    const data = await $.ajax({
        url: '/api/executions',
        method: 'GET',
        data: {param: rowId}
    })
    const tbody = $('#fackModal tbody');
    tbody.empty();
    if (!data) {
        tbody.append('<tr><td colspan="3">Нет данных</td></tr>');
        return;
    }

    const row = data.map(item =>
        `<tr data-id="${item.id}">
            <td>${(item.executionDate)}</td>
            <td>${(item.report)}</td>
            <td>
                <div class="modal-footer">
                    <button class="btn btn-primary" data-id="${item.id}" data-bs-target="#photoModal" data-bs-toggle="modal">фото</button>
                   <button class="btn btn-primary btn-delete" data-id="${item.id}">удалить</button>
                </div>
            </td>
        </tr>`).join('');

    tbody.append(row);

    $('#fackModal').modal('show');


    tbody.off('click', '.btn-delete').on('click', '.btn-delete', function () {
        const id = $(this).data('id');
        deleteFactSgi(id, $(this).closest('tr'));
    });

    function deleteFactSgi(id, rowElement) {
        if (!confirm('Вы уверены, что хотите удалить запись?')) return;

        $.ajax({
            url: '/sgi/delete-fact',
            type: 'DELETE',
            data: {id: id},
            success: function () {
                rowElement.remove();
                if ($('#fackModal tbody tr').length === 0) {
                    $('#fackModal tbody').html('<tr><td colspan="3">Нет данных</td></tr>');
                }
            }
        });
    }
}

document.getElementById("photoModal").addEventListener('show.bs.modal', async function (event) {
    const button = event.relatedTarget;
    const factId = button.dataset.id
    const data = await $.ajax({
        url: 'api/images',
        method: 'GET',
        data: {param: factId}
    });
    const container = $('#photoModal div.modal-body');
    container.empty();
    if (!data || data.length === 0) {
        container.append(`<li class="list-group-item">Нет фото</li>
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button class="btn btn-primary" onclick="addPhoto('${factId}')" type="button">Добавить фото</button>
                <input type="file" id="photoInput" accept="image/*" style="display: none;">
            </div>`);
        return;
    }
    data.forEach((imgData, index) => {
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'photo-wrapper';
        const isString = typeof imgData === 'string';
        const imageUrl = isString ? imgData : imgData.data;

        imgWrapper.innerHTML = `
            <img src="${imageUrl}" id="fullPhoto" class="attached-photo">
            <button class="delete-photo-btn" data-index="${index}">Удалить</button>
        `;

        // Обработчик удаления
        imgWrapper.querySelector('.delete-photo-btn').addEventListener('click', function () {
            deletePhoto(imgData.id, index);
        });
        container.append(imgWrapper);
    });
    container.append(`
    <button class="btn btn-primary" onclick="addPhoto('${factId}')" type="button">Добавить фото</button>
    <input type="file" id="photoInput" accept="image/*" style="display: none;">`)

});

async function addPhoto(factId) {
    const input = document.getElementById('photoInput');
    input.click();
    input.addEventListener('change', async function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const tempPreview = document.createElement('div');
        tempPreview.className = 'photo-wrapper temporary';
        tempPreview.innerHTML = `
            <img src="" class="attached-photo loading">
            <button class="delete-photo-btn" disabled>Удалить</button>`;
        document.getElementById('photoContainer').prepend(tempPreview);

        const reader = new FileReader();
        reader.onload = async function (e) {
            const img = tempPreview.querySelector('img');
            img.src = e.target.result;

            const formData = new FormData();
            formData.append('id', factId);
            formData.append('additionalFiles', file);

            tempPreview.querySelector('img').classList.remove('loading');
            tempPreview.querySelector('.delete-photo-btn').disabled = false;

            await $.ajax({
                url: 'sgi/add-photo',
                method: 'POST',
                data: formData,
                contentType: false,
                processData: false
            });
        };

        reader.onerror = function () {
            alert('Ошибка при чтении файла');
            tempPreview.remove();
        };

        reader.readAsDataURL(file);
    }, {once: true});
    document.getElementById("photoInput").value = '';
}

async function deletePhoto(imageId, index) {
    const formData = new FormData();
    formData.append('id', imageId);
    $.ajax({
        url: "sgi/delete-photo",
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false
    });
    const photoWrappers = document.querySelectorAll('.photo-wrapper');
    photoWrappers[index].remove();
}


$(document).ready(function () {
    const rowsPerPage = 16;
    let filteredRows = [];
    let currentRowId = null;

    const filterData = () => {
        filteredRows = $('#sgiTable tbody tr').filter((index, row) => {
            return checkRowFilters(row);
        });
        showPage(1);
    };

    const checkRowFilters = (row) => {
        const number = $(row).find('td:nth-child(1)').text().toLowerCase();
        const workshop = $(row).find('td:nth-child(2)').text().toLowerCase();
        const events = $(row).find('td:nth-child(3)').text().toLowerCase();
        const actions = $(row).find('td:nth-child(4)').text().toLowerCase();
        const department = $(row).find('td:nth-child(5)').text().toLowerCase();
        const emploes = $(row).find('td:nth-child(6)').text().toLowerCase();
        const desiredDate = $(row).find('td:nth-child(7)').text().toLowerCase();
        const planDate = $(row).find('td:nth-child(8)').text().toLowerCase();

        return (
            number.includes($('#number').val().toLowerCase()) &&
            workshop.includes($('#workshop').val().toLowerCase()) &&
            events.includes($('#event').val().toLowerCase()) &&
            actions.includes($('#actions').val().toLowerCase()) &&
            department.includes($('#department').val().toLowerCase()) &&
            emploes.includes($('#emploes').val().toLowerCase()) &&
            desiredDate.includes($('#desiredDate').val().toLowerCase()) &&
            planDate.includes($('#planDate').val().toLowerCase())
        );
    };

    const showPage = (page) => {
        $('#sgiTable tbody tr').hide();
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

    $('#number,#workshop,#events,#actions,#department,#emploes,#desiredDate,#planDate').on('keyup change', filterData);

    filterData();

    $('.toggleInput').on('click', function () {
        $(this).next('.inputContainer').toggle();
    });

    $('#sgiTable tbody').on('contextmenu', 'tr', function (e) {
        e.preventDefault();
        currentRow = $(this);
        $('#customContextMenu').css({
            top: e.pageY + 'px',
            left: e.pageX + 'px',
            display: 'block'
        });
    });

    $('#deleteRowBtn').on('click', function () {
        if (currentRow) {
            const rowId = currentRow.attr('id');
            deleteSgi(rowId);
            $('#customContextMenu').hide();
        }
    });

    function deleteSgi(rowId) {
        $.ajax({
            url: '/sgi/delete',
            type: 'DELETE',
            data: {id: rowId},
            success: function () {
                currentRow.remove();
            },
            error: function () {
                alert('Ошибка при удалении');
            }
        });
    }

    $(document).on('click', function () {
        $('#customContextMenu').hide();
    });

    $('#executionsList').on('contextmenu', 'li', function (e) {
        e.preventDefault();
        currentRow = $(this);
        $('#customContextMenu').css({
            top: e.pageY + 'px',
            left: e.pageX + 'px',
            display: 'block'
        });
    });

    $('#deleteRowBtn').on('click', () => {
        if (currentRow) {
            currentRow.remove();
            $('#customContextMenu').hide();
        }
    });
});
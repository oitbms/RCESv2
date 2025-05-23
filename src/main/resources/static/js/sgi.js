let currentRow;
let entityId;
let filterData;

function reload() {
    return window.location.href = window.location.href;
}

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
        success: function () {
            $(form).trigger('reset');
            $(form).find('input[type="file"]').val('');
            $('#exampleModalToggle2').modal('hide');
            openFactExecutionModal(entityId);
            reload();
        },
        error: function () {
            $(form).trigger('reset');
            $(form).find('input[type="file"]').val('');
            $('#exampleModalToggle2').modal('hide');
            alert('Вы не ответственный за мероприятие сотрудник')
        }
    });
});

async function loadEmployeeFields(number) {
    if ($('#employeeSelect').children().length > 1) return;
    const data = await $.ajax({
        url: '/api/employees',
        method: 'GET',
        data: {param: "EVENT"}
    });
    const select = $('#employeeSelect' + number);
    select.empty();
    select.append('<option selected disabled>Выберите сотрудника</option>');
    data.forEach(employee => {
        select.append(`<option value="${employee.name}">${employee.name}</option>`);
    });
}

async function toggleAgreement(sgiId, button) {
    const icon = $(button).find('i');
    const isAgreed = !(icon.hasClass('bi-check-circle-fill'));
    const formData = new FormData();

    formData.append("id", sgiId);
    formData.append("agreed", isAgreed);

    const data = await $.get('api/sgi', {id: sgiId});
    if (data.planDate === null) return alert("Не заполнено поле планируемый срок");
    if (!data.executions) return alert("У мероприятия нет факта выполнения");

    await $.ajax({
        url: '/sgi/agree',
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function () {
            icon.toggleClass('bi-check-circle-fill text-success');
            icon.toggleClass('bi-circle');
            reload();
        }
    });
}

async function change(rowId) {
    const container = $('#planContainer');
    container.empty();

    const data = await $.get('api/sgi', {id: rowId});
    if (data.agree) return alert('Нельзя редактировать завершенную заявку');

    container.append(`
    <div class="row mb-3 g-2 align-items-center" data-id="${rowId}">
        <div class="col-md-4">
            <select class="form-select text-truncate" id="employeeSelect" name="employee" 
                    aria-label="Выбор сотрудника" onfocus="loadEmployeeFields()"
                    style="max-width: 100%; min-width: 100%">
                <option value="${data.employee}">${data.employee}</option>
            </select>
        </div>
        <div class="col-md-3">
            <input type="date" class="form-control form-control-sm" name="planDate" 
                   value="${data.planDate ? data.planDate : ''}">
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control form-control-sm" name="comment" 
                   value="${data.comment || ''}">
        </div>
    </div>`);

    // Обработчик сохранения
    $('#planModal .modal-footer .saveChangesBtn').off('click').on('click', async function () {
        const row = $('#planContainer > .row');
        const rowId = row.data('id');
        const employeeVal = row.find('[name="employee"]').val();
        const planDateVal = row.find('[name="planDate"]').val();
        const commentVal = row.find('[name="comment"]').val();

        await saveChange(rowId, employeeVal, planDateVal, commentVal);
        $('#planModal').modal('hide');
    });

    $('#planModal').modal('show');

    async function saveChange(rowId, employee, planDate, comment) {
        const formData = new FormData();
        formData.append('id', rowId);
        formData.append('employee', employee)
        formData.append('planDate', planDate);
        formData.append('comment', comment);

        $.ajax({
            url: 'sgi/save-change',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function () {
                reload();
            },
            error: function () {
                alert('Редактировать может только создатель задачи или такого пользователя нет');
                $('#planModal').modal('hide');
            }
        });
    }
}

async function openFactExecutionModal(rowId) {
    entityId = rowId;

    const data = await $.get('/api/executions', {param: rowId});
    const {planDate} = await $.get('/api/sgi', {id: rowId});

    if (planDate === null) return alert("Не заполнено поле планируемый срок");

    const headContainer = $('#factHeadContainer');
    const dataContainer = $('#factDataContainer');
    const footerContainer = $('#factModal .modal-footer');

    headContainer.empty();
    dataContainer.empty();
    footerContainer.empty();

    if (!data || data.length === 0) {
        dataContainer.append(`
            <div class="row g-0 align-items-center justify-content-center py-5">
              <div class="col-auto">
                <button class="btn btn-primary px-5" 
                        data-bs-target="#exampleModalToggle2" 
                        data-bs-toggle="modal">
                  Отметить факт выполнения
                </button>
              </div>
            </div>`);
        $('#factModal').modal('show');
        return;
    }

    // Заголовки
    headContainer.append(`
  <div class="row g-0 border-bottom">
      <div class="col">Дата выполнения</div>
      <div class="col">Отчет</div>
      <div class="col"></div>
  </div>`);

    data.forEach(item => {
        dataContainer.append(`
            <div class="row g-0 border-bottom" data-id="${item.id}">
                <div class="col">${item.executionDate}</div>
                <div class="col">${item.report || '-'}</div>
                <div class="col">
                    <div class="d-flex justify-content-center">
                        <button class="btn btn-info btn-sm" 
                            data-id="${item.id}" 
                            data-bs-target="#photoModal" 
                            data-bs-toggle="modal">
                              Прикрепленные фото
                        </button>
                    </div>
                </div>
            </div>`);
    });

    footerContainer.append(`
        <button class="btn btn-danger btn-sm btn-delete" data-id="${data[0].id}">
            Удалить факт
        </button>`);

    $('#factModal').modal('show');

    footerContainer.off('click', '.btn-delete').on('click', '.btn-delete', function () {
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
                $('#factModal').modal('hide');
                headContainer.empty();
                dataContainer.html('<tr><td colspan="3">Нет данных</td></tr>');
                footerContainer.empty();
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
    let filterAgreed = '';
    $('#statusBtn').on('click', function () {
        const btn = $(this);
        const icon = btn.find('i');
        let state = btn.data('state');

        if (state === 'done') {
            btn.data('state', 'not_done');
            icon.removeClass().addClass('bi bi-x-circle-fill').css('color', 'red');
        } else if (state === 'not_done') {
            btn.data('state', 'none');
            icon.removeClass().addClass('bi bi-dash-circle').css('color', 'gray');
        } else {
            btn.data('state', 'done');
            icon.removeClass().addClass('bi bi-check-circle-fill').css('color', 'green');
        }

        filterData();
    });

      filterData = () => {
        const state = $('#statusBtn').data('state');
        let agreedFilter = '';

        if (state === 'done') {
            agreedFilter = 'выполнено';
        } else if (state === 'not_done') {
            agreedFilter = 'не выполнено';
        } else {
            agreedFilter = '';
        }

        // Получаем значения других фильтров
        const filters = {
            number: $('#number').val().toLowerCase(),
            workshop: $('#workshop').val().toLowerCase(),
            events: $('#events').val().toLowerCase(),
            actions: $('#actions').val().toLowerCase(),
            department: $('#department').val().toLowerCase(),
            emploes: $('#emploes').val().toLowerCase(),
            desiredDate: $('#desiredDate').val().toLowerCase(),
            note: $('#note').val().toLowerCase(),
            planDate: $('#planDate').val().toLowerCase(),
            comment: $('#comment').val().toLowerCase()
        };

        // Фильтруем строки таблицы
        filteredRows = $('#sgiTable tbody tr').filter((index, row) => {
            return checkRowFilters(row, filters, agreedFilter);
        });

        showPage(1);
    };

    const checkRowFilters = (row, filters, agreedFilter) => {
        const number = $(row).find('td:nth-child(1)').text().toLowerCase();
        const workshop = $(row).find('td:nth-child(2)').text().toLowerCase();
        const events = $(row).find('td:nth-child(3)').text().toLowerCase();
        const actions = $(row).find('td:nth-child(4)').text().toLowerCase();
        const department = $(row).find('td:nth-child(5)').text().toLowerCase();
        const emploes = $(row).find('td:nth-child(6)').text().toLowerCase();
        const desiredDate = $(row).find('td:nth-child(7)').text().toLowerCase();
        const note = $(row).find('td:nth-child(8)').text().toLowerCase();
        const planDate = $(row).find('td:nth-child(9)').text().toLowerCase();
        const comment = $(row).find('td:nth-child(10)').text().toLowerCase();
        const agreedData = $(row).find('button.toggle-agree').data('agreed') ? 'выполнено' : 'не выполнено';

        return (
            number.includes(filters.number) &&
            workshop.includes(filters.workshop) &&
            events.includes(filters.events) &&
            actions.includes(filters.actions) &&
            department.includes(filters.department) &&
            emploes.includes(filters.emploes) &&
            desiredDate.includes(filters.desiredDate) &&
            note.includes(filters.note) &&
            planDate.includes(filters.planDate) &&
            comment.includes(filters.comment) &&
            (agreedFilter === '' || agreedData === agreedFilter)
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

    $('#number,#workshop,#events,#actions,#department,#emploes,#desiredDate,#note,#planDate,#comment').on('keyup change', filterData);
    $('svg').on('click', function () {
        filterData();
    });
    $('button[name="clearButton"]').on('click', () => {
        $('#workshop, #number, #events, #actions, #department, #emploes, #desiredDate, #note, #planDate, #comment')
            .val('');
        $('#statusBtn').data('state', 'none');
        $('#statusBtn').find('i').removeClass().addClass('bi bi-dash-circle').css('color', 'gray');
        filterData();
        if ($('#mobileFilterModal').is(':visible')) {
            $('#mobileFilterModal').modal('hide');
        }
    });
    filterData();

    $(document).ready(function () {
        $('.toggleInput').on('click', function () {
            $(this).next('.inputContainer').toggle();
        });
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

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.inputContainer').length && !$(e.target).closest('.toggleInput').length) {
            $('.inputContainer').hide();
        }
    });
});

$('#calculateColor').on('click', function () {
    $.post("sgi/calculate-color", function () {
        return alert("Цвета пересчитаны");
    });
});

// Применения фильтров для мобильных устройств
function applyFilters() {
    document.getElementById("number").value = document.getElementById('filterNumber').value;
    document.getElementById("workshop").value = document.getElementById('filterWorkshop').value;
    document.getElementById("department").value = document.getElementById('filterDepartment').value;
    document.getElementById("emploes").value = document.getElementById('employeeSelect2').value;

    const filterDate = document.getElementById('filterPlanDate').value;
    if (filterDate) {
        const [year, month, day] = filterDate.split('-');
        const formattedDate = `${day}.${month}.${year}`;
        document.getElementById("planDate").value = formattedDate;
    } else {
        document.getElementById("planDate").value = '';
    }
    const agreedData = document.getElementById('filterCompleted').value;

    filterData();
    $('#mobileFilterModal').modal('hide');
}

document.querySelectorAll('.sgiNumber').forEach(function(td) {
    let timerId = null;
    let isLongPress = false;

    function handleDelete() {
        const rowId = td.closest('tr').dataset.id;
        if (confirm('Удалить эту строку?')) {
            fetch('/sgi/delete?id=' + encodeURIComponent(rowId), {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        td.closest('tr').remove();
                    } else {
                        alert('Ошибка при удалении');
                    }
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                    alert('Ошибка при удалении');
                });
        }
    }

    function startHold(e) {
        isLongPress = false;
        timerId = setTimeout(function() {
            isLongPress = true;
            handleDelete();
        }, 1000);
    }

    function cancelHold(e) {
        clearTimeout(timerId);
    }


    td.addEventListener('touchstart', startHold);
    td.addEventListener('touchend', function(e) {
        clearTimeout(timerId);
        if (!isLongPress) {

        }
    });
    td.addEventListener('touchcancel', cancelHold);
    td.addEventListener('touchmove', cancelHold);

    td.addEventListener('mousedown', startHold);
    td.addEventListener('mouseup', cancelHold);
    td.addEventListener('mouseleave', cancelHold);
});
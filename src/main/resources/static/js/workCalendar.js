$(document).ready(function () {
    let shiftsList = [];
    let currentUserShiftsId = null;

    function loadShifts() {
        $.ajax({
            url: '/api/shifts',
            method: 'GET',
            success: function (data) {
                shiftsList = data;
                populateShiftSelect(data);
            },
            error: function (xhr, status, error) {
                console.error('Ошибка загрузки смен:', error);
                showError('Не удалось загрузить список смен');
            }
        });
    }

    function populateShiftSelect(shifts) {
        const select = $('#shiftSelect');
        select.empty();
        select.append('<option value="">-- Выберите смену --</option>');

        shifts.forEach(function (shift) {
            select.append(`<option value="${shift.id}">${shift.name}(${shift.startTime} - ${shift.endTime})</option>`);
        });
    }

    $(document).on('click', '.assign-shift-btn', function () {
        const employeeId = $(this).data('employee-id');
        const employeeName = $(this).data('employee-name');
        const employeeDepartment = $(this).data('employee-department');
        currentUserShiftsId = $(this).data('user-shifts-id');

        $('#modalEmployeeId').text(employeeId);
        $('#modalEmployeeName').text(employeeName);
        $('#modalEmployeeDepartment').text(employeeDepartment);

        $('#shiftSelect').val('');
        $('#startDate').val('');
        $('#endDate').val('');
        $('#assignShiftForm').removeClass('was-validated');

        $('#assignShiftModal').modal('show');
    });

    $('#saveShiftBtn').click(function () {
        const form = $('#assignShiftForm')[0];

        let url = '/api/user-shifts';
        let method = 'POST';

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const employeeId = $('#modalEmployeeId').text();
        const employeeName = $('#modalEmployeeName').text();
        const shiftId = $('#shiftSelect').val();
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val() || null;

        if (currentUserShiftsId && currentUserShiftsId !== 'undefined' && currentUserShiftsId !== 'null') {
            url = '/api/user-shifts/' + currentUserShiftsId;
            method = 'PUT';
        }

        if (!shiftId) {
            showError('Пожалуйста, выберите смену');
            return;
        }

        if (!startDate) {
            showError('Пожалуйста, укажите дату начала');
            return;
        }

        const requestData = {
            employeeId: employeeId,
            shiftId: parseInt(shiftId),
            startDate: startDate,
            endDate: endDate,
            id: currentUserShiftsId
        };

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function (response) {
                $('#assignShiftModal').modal('hide');
                showSuccess(`Смена ` + response.employeeName + ` успешно назначена сотруднику!`);
                updateShiftInTable(employeeId, response);
            },
            error: function (xhr, status, error) {
                let errorMsg = 'Ошибка при назначении смены';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMsg = xhr.responseJSON.message;
                } else if (xhr.responseText) {
                    errorMsg = xhr.responseText;
                }
                showError(errorMsg);
            }
        });
    });

    function updateShiftInTable(employeeId, shiftResponse) {
        const rows = $('#table tbody tr');
        let targetRow = null;

        rows.each(function () {
            const idCell = $(this).find('.employee-id');
            if (idCell.text() == employeeId) {
                targetRow = $(this);
                return false;
            }
        });

        if (targetRow) {
            const shiftName = shiftResponse.shiftName || shiftResponse.name || 'Смена назначена';
            targetRow.find('.shift-name').text(shiftName);
        }
    }

    function showSuccess(message) {
        $('#successMessage').text(message);
        $('#successModal').modal('show');
    }

    function showError(message) {
        $('#errorMessage').text(message);
        $('#errorModal').modal('show');
    }

    loadShifts();

    $('#endDate').change(function () {
        const startDate = $('#startDate').val();
        const endDate = $(this).val();

        if (startDate && endDate && endDate < startDate) {
            $(this).addClass('is-invalid');
            showError('Дата окончания не может быть раньше даты начала');
            $(this).val('');
        } else {
            $(this).removeClass('is-invalid');
        }
    });

    $('#startDate').change(function () {
        const endDate = $('#endDate').val();
        const startDate = $(this).val();

        if (endDate && startDate && endDate < startDate) {
            $('#endDate').addClass('is-invalid');
            showError('Дата окончания не может быть раньше даты начала');
            $('#endDate').val('');
        } else {
            $('#endDate').removeClass('is-invalid');
        }
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
            },
            columns: [{
                field: 'requestNumber',
                title: '№',
                sortable: true,
                sorter: function (a, b) {
                    function cleanNumber(str) {
                        if (!str) return 0;
                        str = String(str);
                        str = str.replace(/&nbsp;/g, ' ').replace(/\s/g, '');
                        str = str.replace(/&[^;]+;/g, '');
                        str = str.replace(/\D/g, '');
                        return parseInt(str, 10) || 0;
                    }

                    var numA = cleanNumber(a);
                    var numB = cleanNumber(b);
                    return numA - numB;
                }
            }]
        });
    });
});


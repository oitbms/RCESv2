document.addEventListener('DOMContentLoaded', function () {

    loadSubDivisions();
    generateClassColorStatusButton()
    document.getElementById('saveId').addEventListener('click', () => {
        createAuthorDivision();
    });

    document.getElementById('deleteButtonId').addEventListener('click', () => {
        deleteAuthorControl();
    });

    document.getElementById('exportWordBtn').addEventListener('click', () => {
        printReport();
    })
});

function savePeriodRemoval(deviationId) {
    const dateInput = document.getElementById(`date_${deviationId}`);
    const commentInput = document.getElementById(`comment_${deviationId}`);

    if (!dateInput) {
        console.error('Date input not found for deviation:', deviationId);
        return;
    }

    const periodRemoval = dateInput.value;
    const comment = commentInput ? commentInput.value : '';

    if (!periodRemoval) {
        alert('Пожалуйста, выберите срок устранения');
        return;
    }

    const requestData = {
        id: deviationId,
        periodRemoval: periodRemoval,
        description: comment
    };

    fetch(`/api/author-control/deviation/${deviationId}/update-date`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(data => {
            const modalElement = document.getElementById(`editTargetDateModal_${deviationId}`);
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            }
            location.reload();
        })
        .catch(error => {
            alert('Ошибка: ' + error.message);
        });
}

function updateDeviation(authorDeviation) {
    const id = authorDeviation;
    const itemBom = document.getElementById('updateItemId_'+id).value;
    const updateInconsistency = document.getElementById('updateInconsistencyId_'+id).value;
    const updatePeriodRemoval = document.getElementById('updatePeriodRemovalId_'+id).value;
    const successCheck = document.getElementById('successCheck_'+id).checked;

    const requestData = {
        id: id,
        itemName: itemBom,
        inconsistency: updateInconsistency,
        periodRemoval: updatePeriodRemoval,
        success: successCheck
    };

    fetch(`/api/author-control/deviation`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    }).then(data => {
            const modalElement = document.getElementById('editModal_' + id);
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            }
            location.reload();
        })
}

function saveDate(deviationId) {
    const dateInput = document.getElementById(`fixDate_${deviationId}`);
    if (!dateInput) {
        console.error('Date input not found for deviation:', deviationId);
        return;
    }

    const periodRemoval = dateInput.value;
    if (!periodRemoval) {
        alert('Пожалуйста, выберите дату устранения');
        return;
    }

    const requestData = {
        id: deviationId,
        dateRemoval: periodRemoval
    };

    const button = document.querySelector(`button[onclick="saveDate(${deviationId})"]`);
    if (button) {
        button.disabled = true;
        button.textContent = 'Сохранение...';
    }

    fetch(`/api/author-control/deviation/${deviationId}/update-date`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(data => {
            const modalElement = document.getElementById(`editDateModal_${deviationId}`);
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            }
            location.reload();
        })
        .finally(() => {
            if (button) {
                button.disabled = false;
                button.textContent = 'Сохранить';
            }
        });
}

function createAuthorDivision() {
    const authorControl = {
        id: document.getElementById('authorControlId').value
    };

    const createDate = {
        itemName: document.getElementById('itemBomId').value,
        inconsistency: document.getElementById('inconsistenciesId').value,
        subDivisionDto: JSON.parse(document.getElementById('subDivisionId').value),
        periodRemoval: document.getElementById('dateId').value,
        success: document.getElementById('successCheck').checked,
        authorControl: authorControl
    };

    const fileInput = document.getElementById('additionalFilesId');
    const files = fileInput.files;

    const formData = new FormData();

    formData.append('deviationDto', new Blob([JSON.stringify(createDate)], {
        type: 'application/json'
    }));

    for (let i = 0; i < files.length; i++) {
        formData.append('additionalFiles', files[i]);
    }

    fetch('/api/author-control/deviation', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) throw new Error('Не удалось сохранить данные');
            return response.json();
        })
        .then(data => {
            location.reload();
        })
        .catch(error => {
            alert('Ошибка: ' + error.message);
        })
}

function saveDeviationImages(deviationId) {
    const fileInput = document.getElementById(`additionalDeviationFilesId_${deviationId}`);
    if (!fileInput) {
        console.error('File input not found for deviation:', deviationId);
        return;
    }

    const files = fileInput.files;
    if (!files || files.length === 0) {
        alert('Пожалуйста, выберите файлы для загрузки');
        return;
    }

    const formData = new FormData();
    formData.append('deviationDto', new Blob([JSON.stringify({id: deviationId})], {
        type: 'application/json'
    }));

    for (let i = 0; i < files.length; i++) {
        formData.append('additionalFilesCorrections', files[i]);
    }

    const button = document.querySelector(`button[onclick="saveDeviationImages(${deviationId})"]`);
    if (button) {
        button.disabled = true;
        button.textContent = 'Загрузка...';
    }

    fetch('/api/author-control/deviation/add-images', {
        method: 'POST',
        body: formData
    })
        .then(data => {
            const modalElement = document.getElementById(`uploadFixImageModal_${deviationId}`);
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            }
            location.reload();
        })
        .finally(() => {
            if (button) {
                button.disabled = false;
                button.textContent = 'Загрузить';
            }
        });
}


function printReport() {
    const authorControlId = document.getElementById('exportWordBtn').value;
    const url = `/api/report/print/author-control?format=DOCX&id=${authorControlId}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return response.blob().then(blob => ({blob, response}));
        })
        .then(({blob, response}) => {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);

            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'report.docx';
            if (contentDisposition) {
                const match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/);
                if (match) {
                    filename = decodeURIComponent(match[1]);
                }
            }

            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => {
                window.URL.revokeObjectURL(link.href);
            }, 100);
        })
        .catch(error => {
            console.error('Ошибка скачивания:', error);
            alert('Не удалось скачать отчёт. Пожалуйста, попробуйте снова.');
        });
}

let targetStatus = '';

function checkStatusBeforeUpdate(newStatus) {
    const currentStatus = "Новый";

    const needToken = (
        (["На согласовании", "Согласовано", "Не согласовано"].includes(currentStatus) &&
            ["Новый"].includes(newStatus))
    ) || (
        currentStatus === "Согласовано" && newStatus === "На согласовании"
    );

    if (needToken) {
        targetStatus = newStatus;

        const currentModal = bootstrap.Modal.getInstance(document.querySelector('.modal.show'));
        if (currentModal) {
            currentModal.hide();
        }

        const modalKey = new bootstrap.Modal(document.getElementById('exampleModalKey2'));
        modalKey.show();
        return false;
    }

    return true;
}

function checkTokenAndApprove2() {
    const input = document.getElementById("userToken2").value;
    const modalKey = bootstrap.Modal.getInstance(document.getElementById('exampleModalKey2'));

    if (input === VALID_TOKEN2) {
        document.getElementById("userToken2").value = "";
        modalKey.hide();

        ["exampleModalNew", "exampleModalAwaits", "exampleModalToBeAgreed"].forEach(id => {
            const instance = bootstrap.Modal.getInstance(document.getElementById(id));
            if (instance) instance.hide();
        });

        if (targetStatus === 'Новый') {
            const modalNew = new bootstrap.Modal(document.getElementById('exampleModalNew'));
            modalNew.show();
        } else if (targetStatus === 'Ожидает устранения') {
            const modalAwaits = new bootstrap.Modal(document.getElementById('exampleModalAwaits'));
            modalAwaits.show();
        } else if (targetStatus === 'На согласовании') {
            const modalToBeAgreed = new bootstrap.Modal(document.getElementById('exampleModalToBeAgreed'));
            modalToBeAgreed.show();
        } else {
            updateStatus(targetStatus);
        }
    } else {
        alert("Неверный токен");
        document.getElementById("userToken2").value = "";
    }
    return false;
}

function updateStatus(status, authorId) {
    fetch('/api/v1/author-control/update', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: authorId, statusAuthor: status})
    }).then(response => {
        if (response.ok) {
            location.reload();
        } else {
            alert("Ошибка обновления статуса");
        }
    }).catch(error => console.error('Ошибка:', error));
}

document.getElementById('exampleModalKey2').addEventListener('hidden.bs.modal', function () {
    document.getElementById("userToken2").value = "";

    ["exampleModalNew", "exampleModalAwaits", "exampleModalToBeAgreed"].forEach(id => {
        const instance = bootstrap.Modal.getInstance(document.getElementById(id));
        if (instance) instance.hide();
    });
});

window.addEventListener('load', function () {
    ["exampleModalNew", "exampleModalAwaits", "exampleModalToBeAgreed"].forEach(id => {
        const modal = bootstrap.Modal.getInstance(document.getElementById(id));
        if (modal) modal.hide();
    });
});

function deleteAuthorControlDeviation(deviationId) {
    if (!confirm('Вы уверены, что хотите удалить это отклонение?')) {
        return false;
    }

    fetch(`/api/author-control/deviation/${deviationId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                location.reload();
            } else {
                return response.text().then(text => {
                    alert('Ошибка при удалении: ' + text);
                });
            }
        })
        .catch(error => {
            alert('Ошибка: ' + error.message);
        });

    return false;
}

function deleteAuthorControl() {
    const authorControlId = document.getElementById('deleteButtonId').value;

    fetch(`/api/v1/author-control/${authorControlId}`, {
        method: 'DELETE'
    }).then(data => {
        location.replace('/view/author-control');
    })
}

async function loadSubDivisions() {
    try {
        const response = await fetch('/api/sub-divisions');
        if (!response.ok) throw new Error('Не удалось загрузить данные цехов!');

        const subDivision = await response.json();

        let selectElement = document.getElementById('subDivisionId');

        selectElement.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Выберите виновника';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        subDivision.forEach(subDiv => {
            const option = document.createElement('option');
            option.value = JSON.stringify(subDiv);
            option.textContent = subDiv.name;
            option.dataset.id = subDiv.id;
            selectElement.appendChild(option);
        });
        return subDivision;
    } catch (error) {
        console.error('Ошибка загрузки цехов:', error);
    }
}

function generateClassColorStatusButton() {
    const btnNew = document.getElementById('btn_new');
    const btnWaiting = document.getElementById('btn_waiting');
    const btnAgreement = document.getElementById('btn_agreement');
    const btnNotApproved = document.getElementById('btn_not_agreed');
    const btnAgreed = document.getElementById('btn_agreed');

    if (btnNew.value === "Новый") {
        btnNew.classList.remove('btn-outline-secondary');
        btnNew.classList.add('btn-secondary');
        btnNew.classList.add('text-white');
    }

    if (btnWaiting.value === "Ожидает устранения") {
        btnWaiting.classList.remove('btn-outline-warning');
        btnWaiting.classList.add('btn-warning');
        btnWaiting.classList.add('text-white');
    }

    if (btnAgreement.value === "На согласовании") {
        btnAgreement.classList.remove('btn-outline-info');
        btnAgreement.classList.add('btn-info');
        btnAgreement.classList.add('text-white');
    }

    if (btnNotApproved.value === "Не согласовано") {
        btnNotApproved.classList.remove('btn-outline-danger');
        btnNotApproved.classList.add('btn-danger');
        btnNotApproved.classList.add('text-white');
    }

    if (btnAgreed.value === "Согласовано") {
        btnAgreed.classList.remove('btn-outline-success');
        btnAgreed.classList.add('btn-success');
        btnAgreed.classList.add('text-white');
    }
}
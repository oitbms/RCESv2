const entityId = document.getElementById('id');  // Id сущности
let timeout; // Таймаут

// Функция для получения данных по API
async function fetchData(endpoint, param) {
    const url = new URL(/api/ + endpoint, window.location.origin);
    url.searchParams.append('param', param != null ? param : bidType);
    const response = await fetch(url.toString());
    return response.json();
}

// Обновление полей
async function saveData(images, customerOrder) {
    let formData = new FormData(document.getElementById('viewRequestForm'));
    let data = Object.fromEntries(formData.entries());
    if (images!=null) {
        data["images"] = images;
    }
    if (customerOrder!=null) {
        data["customerOrder"] = customerOrder;
    }

    const url = new URL('/api/update', window.location.origin);
    url.searchParams.append('bidType', bidType);
    url.searchParams.append("id", entityId.value);
    url.searchParams.append("sendMessage", data.sendToTelegram);
    delete data.sendToTelegram;

    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Class-Name': bidType,
            'X-Entity-Id': entityId.value
        },
        body: JSON.stringify(data),
    }).then(r => {
        notification('Запись сохранена', 3000, 'success');
        if (images != null) {
            renderPhotos(images);
        }
    });
}

// Модальные окна
document.querySelectorAll('.openModal').forEach(button => {
    button.addEventListener('click', async () => {
        const {endpoint, param, modalId, inputId, hiddenEntity} = button.dataset;
        const modalWindow = document.getElementById(modalId);
        const list = modalWindow.querySelector('.modal-list');
        const data = await fetchData(endpoint, param);

        list.innerHTML = data.map(item =>
            `<li class="selectable" data-entity="${encodeURIComponent(JSON.stringify(item))}">
                ${item.name}
            </li>`
        ).join('');

        modalWindow.querySelectorAll('.selectable').forEach(li => {
            li.addEventListener('click', () => {
                const update = document.getElementById(inputId).value!==li.textContent.trim();
                const entity = JSON.parse(decodeURIComponent(li.dataset.entity));
                document.getElementById(inputId).value = li.textContent.trim();
                document.getElementById(hiddenEntity).value = JSON.stringify(entity);
                if (viewForm && update) saveData();
                closeModal(modalId);
            });
        });
        modalWindow.classList.add('open')
    });
});

document.querySelector('form').addEventListener('submit', function(event) {
    const requiredFields = document.querySelectorAll('[data-required]');
    let valid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            valid = false
            field.classList.add('error-field');
        } else {
            field.classList.remove('error-field');
        }
    })
    if (!valid) {
        event.preventDefault();
        notification("Заполните обязательные поля", 3000, 'error')
    }
});

if (viewForm) {
    // Обработка ввода комментария с задержкой
    document.getElementById('comment').addEventListener('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            saveData();
        }, 3000);
    });
// Обработка ввода описания решения с задержкой
        document.getElementById('description').addEventListener('input', function () {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                saveData();
            }, 3000);
        });
// Обработка ввода Заказа клиента с задержкой
    document.getElementById('customerOrderString').addEventListener('input', function () {
        clearTimeout(timeout);
        const customerOrderString = this.value;
        timeout = setTimeout(function () {
            saveData(null, customerOrderString);
        }, 3000);
    });
    // Обработчик для кнопки "Прикрепленные фото"
    document.getElementById('openPhotoModal').addEventListener('click', async function () {
        const images = await fetchData("images", entityId.value); // Получаем список фото
        renderPhotos(images);
        document.getElementById('photoModal').classList.add('open'); // Открываем модальное окно
    });
}

function renderPhotos(images) {
    const container = document.getElementById('photoContainer');
    container.innerHTML = '';

    if (!images || images.length === 0) {
        container.innerHTML = '<div class="no-photos">Нет прикрепленных фото</div>';
        return;
    }

    images.forEach((imgData, index) => {
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'photo-wrapper';
        const isString = typeof imgData === 'string';
        const imageUrl = isString ? imgData : imgData.data;

        imgWrapper.innerHTML = `
            <img src="${imageUrl}" class="attached-photo">
            <button class="delete-photo-btn" data-index="${index}">Удалить</button>
        `;

        // Обработчик удаления
        imgWrapper.querySelector('.delete-photo-btn').addEventListener('click', function() {
            deletePhoto(index);
        });

        // Обработчик просмотра
        imgWrapper.querySelector('img').addEventListener('click', function() {
            const fullPhotoModal = document.getElementById('fullPhotoModal');
            const fullPhoto = document.getElementById('fullPhoto');
            fullPhoto.src = this.src;
            fullPhotoModal.classList.add('open');
        });

        container.appendChild(imgWrapper);
    });
}

async function deletePhoto(index) {
    const id = document.getElementById('id').value;
    let images = await fetchData("images", id);
    images.splice(index, 1);
    await saveData(images);
}

// Закрытие модального окна при клике на крестик или вне изображения
document.getElementById('fullPhotoModal').addEventListener('click', function (event) {
    if (event.target === this || event.target.classList.contains('close')) {
        this.classList.remove('open');
    }
});


document.getElementById('addPhotoBtn').addEventListener('click', function () {
    document.getElementById('photoInput').click();
});

document.getElementById('photoInput').addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Временное превью
    const tempPreview = document.createElement('div');
    tempPreview.className = 'photo-wrapper temporary';
    tempPreview.innerHTML = `
        <img src="" class="attached-photo loading">
        <button class="delete-photo-btn" disabled>Удалить</button>
    `;
    document.getElementById('photoContainer').prepend(tempPreview);

    const reader = new FileReader();
    reader.onload = async function(e) {
        tempPreview.querySelector('img').src = e.target.result;
        tempPreview.querySelector('img').classList.remove('loading');
        const id = document.getElementById('id').value;
        let images = await fetchData("images", id) || [];
        images.unshift(e.target.result);
        await saveData(images);
        renderPhotos(images);
    };

    reader.onerror = function() {
        tempPreview.innerHTML = '<div class="error">Ошибка загрузки</div>';
    };

    reader.readAsDataURL(file);
});

// Закрытие модальных окон
function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('open');
}

// Уведомления
function notification(message, duration = 3000, type = 'info') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');

    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, duration);
}

document.querySelectorAll('.openModal[data-multiple="true"]').forEach(button => {
    button.addEventListener('click', () => {
        const {modalId, inputId, hiddenEntity} = button.dataset;
        const modal = document.getElementById(modalId);

        const input = document.getElementById(inputId);
        const hidden = document.getElementById(hiddenEntity);

        let selected = new Map();
        try {
            JSON.parse(hidden.value || "[]").forEach(e => selected.set(e.name, e));
        } catch {}

        const updateUI = () => {
            const arr = Array.from(selected.values());
            input.value = arr.map(e => e.name).join(', ');
            hidden.value = JSON.stringify(arr);
        };

        const handleSaveAndClose = () => {
            updateUI();
            saveData();
        };

        const closeBtn = modal.querySelector('.x');
        const closeBtnClone = closeBtn.cloneNode(true);
        closeBtn.replaceWith(closeBtnClone);
        closeBtnClone.addEventListener('click', handleSaveAndClose);

        const onClickOutside = (e) => {
            if (modal.classList.contains('open') && !modal.querySelector('.modal-content').contains(e.target)) {
                modal.classList.remove('open');
                handleSaveAndClose();
                document.removeEventListener('click', onClickOutside);
            }
        };
        document.addEventListener('click', onClickOutside);

        const interval = setInterval(() => {
            const selectables = modal.querySelectorAll('.selectable');
            if (selectables.length > 0) {
                clearInterval(interval);
                selectables.forEach(li => {
                    const clone = li.cloneNode(true);
                    li.replaceWith(clone);
                    const entity = JSON.parse(decodeURIComponent(clone.dataset.entity));
                    if (selected.has(entity.name)) clone.classList.add('selected');

                    clone.addEventListener('click', () => {
                        if (selected.has(entity.name)) {
                            selected.delete(entity.name);
                            clone.classList.remove('selected');
                        } else {
                            selected.set(entity.name, entity);
                            clone.classList.add('selected');
                        }
                        updateUI();
                    });
                });
            }
        }, 50);
    });
});

document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    let type = urlParams.get('type');
    if (viewForm) {
        type = await fetchData("typeRequest", entityId.value);
    }
    if (type === 'constructor') {
        if (viewForm) {
            document.getElementById("inconsistencyViewField").classList.add('hidden')
            document.getElementById("qtyViewField").classList.add('hidden')
        } else {
            document.getElementById('reasonCreateField').classList.add('hidden');
            document.getElementById("reasonsName").removeAttribute("data-required")
            document.getElementById("qtyCreateField").classList.add('hidden')
            document.getElementById("qty").removeAttribute("data-required")
        }
    }
    if (type === 'otk') {
        if (viewForm) {
            document.getElementById('mlmNodeViewField').classList.add('hidden');
            document.getElementById("descriptionViewField").classList.add('hidden');
            document.getElementById("reasonCreateField").removeAttribute("data-required")
        } else {
            document.getElementById('mlmNodeCreateField').classList.add('hidden');
            document.getElementById('mlmNodeName').removeAttribute('data-required');
        }
    }
    if (type === 'technologist') {
        if (viewForm) {
            document.getElementById("inconsistencyViewField").classList.add('hidden')
            document.getElementById("qtyViewField").classList.add('hidden')
            document.getElementById("qty").removeAttribute("data-required")
        } else {
            document.getElementById("qtyCreateField").classList.add('hidden')
        }
    }
});
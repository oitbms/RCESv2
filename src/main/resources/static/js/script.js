// ==============================
// 1. Переменные и DOM-элементы
// ==============================
const entityId = document.getElementById('id');
let timeout;
const photoModalInstance = new bootstrap.Modal(document.getElementById('photoModal'));

// ==============================
// 2. Утилиты
// ==============================

// Получение данных с сервера
async function fetchData(endpoint, param) {
    const url = new URL('/api/' + endpoint, window.location.origin);
    url.searchParams.append('param', param != null ? param : bidType);
    const response = await fetch(url.toString());
    return response.json();
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

// ==============================
// 3. Сохранение данных
// ==============================
async function saveData(images, customerOrder) {
    const formData = new FormData(document.getElementById('viewRequestForm'));
    const data = Object.fromEntries(formData.entries());

    if (images) data["images"] = images;
    if (customerOrder) data["customerOrder"] = customerOrder;

    const url = new URL('/api/update', window.location.origin);
    url.searchParams.append('bidType', bidType);
    url.searchParams.append("id", entityId.value);
    url.searchParams.append("sendMessage", data.sendToTelegram);
    delete data.sendToTelegram;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Class-Name': bidType,
            'X-Entity-Id': entityId.value
        },
        body: JSON.stringify(data),
    });

    if (response.status === 403) {
        window.location.href = `/error?message=Нет доступа к закрытию или редактированию заявки`;
        return;
    }

    notification('Запись сохранена', 3000, 'success');
    if (images) renderPhotos(images);
}

// ==============================
// 4. Работа с фото
// ==============================

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
        const imageUrl = typeof imgData === 'string' ? imgData : imgData.data;

        imgWrapper.innerHTML = `
            <img src="${imageUrl}" class="attached-photo">
            <button class="btn btn-danger delete-photo-btn" data-index="${index}">Удалить</button>
        `;

        // Обработчики
        imgWrapper.querySelector('.delete-photo-btn').addEventListener('click', () => deletePhoto(index));
        const imgElem = imgWrapper.querySelector('img');
        imgElem.addEventListener('click', () => {
            document.getElementById('fullPhoto').src = imageUrl;
            photoModalInstance.show();
        });

        container.appendChild(imgWrapper);
    });
}

async function deletePhoto(index) {
    const id = entityId.value;
    let images = await fetchData("images", id);
    images.splice(index, 1);
    await saveData(images);
}

// ==============================
// 5. Обработка ввода (с задержкой)
// ==============================
if (document.title.includes("Заявка на вызов") && viewForm) {
    const delayedSave = (callback) => {
        clearTimeout(timeout);
        timeout = setTimeout(callback, 3000);
    };

    document.getElementById('comment')?.addEventListener('input', () => delayedSave(() => saveData()));
    document.getElementById('commentAgreed')?.addEventListener('input', () => delayedSave(() => saveData()));

    document.getElementById('customerOrderString')?.addEventListener('input', function () {
        const customerOrderString = this.value;
        delayedSave(() => saveData(null, customerOrderString));
    });

    // Загрузка фото
    document.getElementById('openPhotoModal')?.addEventListener('click', async () => {
        const images = await fetchData("images", entityId.value);
        renderPhotos(images);
        document.getElementById('photoModal').classList.add('open');
    });

    document.getElementById('addPhotoBtn')?.addEventListener('click', () => {
        document.getElementById('photoInput').click();
    });

    document.getElementById('photoInput')?.addEventListener('change', async function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const tempPreview = document.createElement('div');
        tempPreview.className = 'photo-wrapper temporary';
        tempPreview.innerHTML = `
            <img src="" class="attached-photo loading">
            <button class="delete-photo-btn" disabled>Удалить</button>
        `;
        document.getElementById('photoContainer').prepend(tempPreview);

        const reader = new FileReader();
        reader.onload = async function (e) {
            tempPreview.querySelector('img').src = e.target.result;
            tempPreview.querySelector('img').classList.remove('loading');
            let images = await fetchData("images", entityId.value) || [];
            images.unshift(e.target.result);
            await saveData(images);
            renderPhotos(images);
        };
        reader.onerror = () => {
            tempPreview.innerHTML = '<div class="error">Ошибка загрузки</div>';
        };
        reader.readAsDataURL(file);
    });

    // Закрытие модального окна просмотра фото
    document.getElementById('fullPhotoModal')?.addEventListener('click', function (event) {
        if (event.target === this || event.target.classList.contains('close')) {
            this.classList.remove('open');
        }
    });
}

// ==============================
// 6. Валидация формы
// ==============================
document.querySelector('form')?.addEventListener('submit', function (event) {
    const requiredFields = document.querySelectorAll('[data-required]');
    let valid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            valid = false;
            field.classList.add('error-field');
        } else {
            field.classList.remove('error-field');
        }
    });

    if (!valid) {
        event.preventDefault();
        notification("Заполните обязательные поля", 3000, 'error');
    }
});

// ==============================
// 7. Логика отображения полей по типу заявки
// ==============================
if (document.title.includes("Заявка на вызов")) {
    document.addEventListener('DOMContentLoaded', async function () {
        const urlParams = new URLSearchParams(window.location.search);
        let type = urlParams.get('type');
        if (viewForm) {
            type = await fetchData("typeRequest", entityId.value);
        }

        if (type === 'constructor') {
            if (viewForm) {
                document.getElementById("inconsistencyViewField")?.classList.add('hidden');
                document.getElementById("qtyViewField")?.classList.add('hidden');
            } else {
                document.getElementById("qtyCreateField")?.classList.add('hidden');
                document.getElementById("qty")?.removeAttribute("data-required");
            }
        }

        if (type === 'otk') {
            if (viewForm) {
                document.getElementById('mlmNodeViewField')?.classList.add('hidden');
                document.getElementById("reasonCreateField")?.removeAttribute("data-required");
            }
        }

        if (type === 'technologist') {
            if (viewForm) {
                document.getElementById("inconsistencyViewField")?.classList.add('hidden');
                document.getElementById("qtyViewField")?.classList.add('hidden');
                document.getElementById("qty")?.removeAttribute("data-required");
            } else {
                document.getElementById("qtyCreateField")?.classList.add('hidden');
                document.getElementById("qty")?.removeAttribute("data-required");
            }
        }
    });
}

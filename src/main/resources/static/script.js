const entityName = document.getElementById('entityName').innerText;  // Название сущности\4
const entityId = document.getElementById('id');  // Id сущности
let timeout; // Таймаут

// Функция для получения данных по API
async function fetchData(endpoint, param) {
    const url = new URL(/api/ + endpoint, window.location.origin);
    url.searchParams.append('param', param != null ? param : entityName);
    const response = await fetch(url.toString());
    return await response.json();
}

// Обновление полей
async function saveData(images) {
    let formData = new FormData(document.getElementById('viewRequestForm'));
    let data = Object.fromEntries(formData.entries());
    data["image"] = images; // Обновляем список фото

    const url = new URL('/api/update', window.location.origin);
    url.searchParams.append('entityName', entityName);
    url.searchParams.append("entityId", entityId.value);
    url.searchParams.append("sendMessage", data.sendToTelegram);
    delete data.sendToTelegram;

    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Class-Name': entityName,
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
                const entity = JSON.parse(decodeURIComponent(li.dataset.entity));
                document.getElementById(inputId).value = li.textContent.trim();
                document.getElementById(hiddenEntity).value = JSON.stringify(entity);
                if (viewForm) saveData();
                closeModal(modalId);
            });
        });
        modalWindow.classList.add('open')
    });
});

// Обработка ввода комментария с задержкой
document.getElementById('comment').addEventListener('input', function () {
    clearTimeout(timeout); // Очистка предыдущего таймера
    timeout = setTimeout(function () {
        saveData();
    }, 3000);
});

// Обработчик для кнопки "Прикрепленные фото"
document.getElementById('openPhotoModal').addEventListener('click', async function () {
    const images = await fetchData("images", entityId.value); // Получаем список фото
    renderPhotos(images);
    document.getElementById('photoModal').classList.add('open'); // Открываем модальное окно
});


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
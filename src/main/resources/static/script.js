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

        // Загрузка данных
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

    images.forEach(image => {
        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add('photo-wrapper');
        imgWrapper.innerHTML = `
            <img src="${image.data}" class="attached-photo">
            <button class="delete-photo-btn" data-image='${JSON.stringify(image)}'>Удалить</button>
        `;
        container.appendChild(imgWrapper);

        // Для открытия увеличенного фото
        imgWrapper.querySelector('.attached-photo').addEventListener('click', function(event) {
            console.log("Клик по изображению:", event.target.src);
            const fullPhotoModal = document.getElementById('fullPhotoModal');
            const fullPhoto = document.getElementById('fullPhoto');
            fullPhoto.src = event.target.src;
            fullPhotoModal.classList.add('open');
        });
    });

    document.querySelectorAll('.delete-photo-btn').forEach(button => {
        button.addEventListener('click', function() {
            const imageObj = JSON.parse(this.dataset.image);
            deletePhoto(imageObj);
        });
    });
}

// Закрытие модального окна при клике на крестик или вне изображения
document.getElementById('fullPhotoModal').addEventListener('click', function (event) {
    if (event.target === this || event.target.classList.contains('close')) {
        this.classList.remove('open');
    }
});


async function deletePhoto(imageToDelete) {
    const id = document.getElementById('id').value;
    let images = await fetchData("images", id);
    images = images.filter(image => image.id !== imageToDelete.id);
    await saveData(images);
}

document.getElementById('addPhotoBtn').addEventListener('click', function () {
    document.getElementById('photoInput').click();
});

document.getElementById('photoInput').addEventListener('change', async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const id = document.getElementById('id').value;
    let images = await fetchData("images", id);

    const reader = new FileReader();
    reader.onload = async function (e) {
        images.push(e.target.result); // Добавляем новое фото
        await saveData(images);
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
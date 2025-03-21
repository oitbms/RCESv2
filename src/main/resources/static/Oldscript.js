// Функция для получения данных по API
async function fetchData(endpoint, param) {
    try {
        const url = new URL(/api/ + endpoint, window.location.origin);
        url.searchParams.append('param', param);
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        notification('Ошибка загрузки данных', 5000, 'error');
        return [];
    }
}

// Функция для обновления сущности по API
async function saveData(className) {
    try {
        const entityId = document.getElementsByName('id');
        const formData = new FormData(document.getElementById('viewRequestForm'));
        const data = Object.fromEntries(formData.entries());

        const url = new URL('/api/update', window.location.origin);
        url.searchParams.append('className', className);
        url.searchParams.append("id", entityId[0].value);

        if (data.sendToTelegram === 'on') {
            url.searchParams.append("sendMessage", "true");
            delete data.sendToTelegram;
        } else {
            url.searchParams.append("sendMessage", "false");
        }

        // Функция для чтения файла как base64
        const readFileAsBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(file);
            });
        };

        // Добавляем фото в data, если оно есть
        const imageInput = document.getElementById('uploadPhoto');
        if (imageInput && imageInput.files.length > 0) {
            const file = imageInput.files[0];
            data.image = await readFileAsBase64(file);
        }

        // Отправляем данные на сервер
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Class-Name': className,
                'X-Entity-Id': entityId
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

        notification('Запись сохранена', 3000, 'success');
        return true;
    } catch (error) {
        console.error('Save error:', error);
        notification('Ошибка при сохранении', 5000, 'error');
        return false;
    }
}

// Модальные окна
document.querySelectorAll('.openModal').forEach(button => {
    button.addEventListener('click', async () => {
        const {endpoint, param, displayField, inputId, hiddenId, modalId, save} = button.dataset;
        const modal = document.getElementById(modalId);
        const list = modal.querySelector('.modal-list');

        try {
            list.innerHTML = '<li>Загрузка...</li>';
            const data = await fetchData(endpoint, save != null ? save : param);

            list.innerHTML = data.length > 0
                ? data.map(item => `
                    <li class="selectable" data-id="${item.id}">
                        ${String(item[displayField]).trim()} <!-- Обрезка на этапе рендеринга -->
                    </li>
                `).join('')
                : '<li>Нет данных</li>';

            modal.querySelectorAll('.selectable').forEach(li => {
                li.addEventListener('click', () => {
                    document.getElementById(inputId).value = li.textContent.trim(); // Добавляем trim()
                    document.getElementById(hiddenId).value = li.dataset.id;
                    if (save) saveData(save);
                    closeModal(modalId);
                });
            });

            modal.classList.add('open')

        } catch (error) {
            list.innerHTML = '<li>Ошибка загрузки</li>';
        }
    });
});
// Управление модальными окнами
function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('open');
}

window.addEventListener('click', event => {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
});

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

// Управление таблицами
function showTable(tableId) {
    document.querySelectorAll('.request-table').forEach(table => {
        table.style.display = table.id === `${tableId}Table` ? 'table' : 'none';
    });
}

// Инициализация при полной загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    showTable('inWork');
});

let timeout;

document.getElementById('comment').addEventListener('input', function () {
    clearTimeout(timeout); // Очистка предыдущего таймера
    timeout = setTimeout(function () {
        const save = document.getElementById('comment').dataset.save;
        saveData(save);
    }, 3000);
});

// Обработчик для кнопки "Прикрепленные фото"
document.getElementById('openPhotoModal').addEventListener('click', () => {
    const modal = document.getElementById('photoModal');
    modal.classList.add('open');
});

// Обработчик для кнопки "Добавить фото"
document.getElementById('addPhoto').addEventListener('click', () => {
    document.getElementById('uploadPhoto').click();
});

// Обработчик для кнопок "Удалить"
document.querySelectorAll('.btn-delete-photo').forEach(button => {
    button.addEventListener('click', async () => {
        const photo = button.dataset; // Получаем ID фото из data-id
        const save = document.getElementById('photoModal').dataset.save;
        const entityId = document.getElementsByName('id')[0].value; // Получаем ID сущности
        try {
            // Отправляем запрос на удаление фото из БД
            const response = await saveData(save);

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }

            // Уведомляем пользователя об успешном удалении
            notification('Фото удалено', 3000, 'success');

            // Обновляем список фото в модальном окне
            const modal = document.getElementById('photoModal');
            const attachedPhotos = modal.querySelector('.attached-photos');
            attachedPhotos.innerHTML = '<li>Загрузка...</li>';

            // Получаем обновленный список фото
            const data = await fetchData('images', entityId);
            renderPhotos(data);
        } catch (error) {
            console.error('Ошибка при удалении фото:', error);
            notification('Ошибка при удалении фото', 5000, 'error');
        }
    });
});


// Обработчик для выбора файла
document.getElementById('uploadPhoto').addEventListener('change', async (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        const formData = new FormData();

        // Добавляем выбранные файлы в FormData
        for (let i = 0; i < files.length; i++) {
            formData.append('additionalFiles', files[i]);
        }
        const save = document.getElementById('photoModal').dataset.save;
        const entityId = document.getElementsByName('id');

        // Вызываем saveData для отправки файлов на сервер
        const success = await saveData(save);

        if (success) {
            notification('Фото успешно добавлены', 3000, 'success');
            // Обновляем список фото в модальном окне
            const modal = document.getElementById('photoModal');
            const attachedPhotos = modal.querySelector('.attached-photos');
            attachedPhotos.innerHTML = '<li>Загрузка...</li>';
            const data = await fetchData('images', entityId);
            renderPhotos(data);
        } else {
            notification('Ошибка при добавлении фото', 5000, 'error');
        }
    }
});

// Функция для отрисовки фото в модальном окне
function renderPhotos(data) {
    const attachedPhotos = document.querySelector('.attached-photos');
    attachedPhotos.innerHTML = data.length > 0
        ? data.map(img => `
            <div class="photo-container">
                <img src="${img.base64Data}" alt="Фото" class="attached-photo">
                <button class="btn-delete-photo" data-id="${img.id}">Удалить</button>
            </div>
        `).join('')
        : '<li>Нет данных</li>';
}

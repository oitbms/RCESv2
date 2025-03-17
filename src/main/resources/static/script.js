// Функция для получения данных по url api
//          Param: endpoint - url api
//                 param - необязательный
async function fetchData(endpoint, param) {
    const url = new URL(/api/ + endpoint, window.location.origin);
    url.searchParams.append('param', param);
    const response = await fetch(url.toString());
    return await response.json();
}

//Функция для обновления существующей сущности
//          Param: entity - имя сущности
async function saveData(className) {
    const entityId = document.getElementsByName('id'); //Id сущности в детальной карточке для сохранения
    const formData = new FormData(document.getElementById('viewRequestForm'));
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    const url = new URL('/api/update', window.location.origin);
    url.searchParams.append('className', className)
    url.searchParams.append("id", entityId[0].value)
    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Отправляем данные в формате JSON
    });
    notification("Запись сохранена", 3000)
}

// Обработчик для кнопок открытия модальных окон
document.querySelectorAll('.openModal').forEach(button => {
    button.onclick = async function () {
        const endpoint = button.getAttribute('data-endpoint');
        const param = button.getAttribute('data-param');
        const displayField = button.getAttribute('data-display-field');
        const inputId = button.getAttribute('data-input-id');
        const hiddenId = button.getAttribute('data-hidden-id');
        const modalId = button.getAttribute('data-modal-id'); // Получаем ID модального окна
        const save = button.getAttribute('data-save'); //Если не пусто - нужно сохранять после изменения

        // Получаем модальное окно и список
        const modal = document.getElementById(modalId);
        const list = document.getElementById(`${endpoint}List`);

        const data = await fetchData(endpoint, param);
        list.innerHTML = '';

        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item[displayField];
            li.onclick = () => {
                document.getElementById(inputId).value = item[displayField];
                document.getElementById(hiddenId).value = item.id;
                if (save != null) saveData(save);
                closeModal(modalId);
            };
            list.appendChild(li);
        });

        modal.style.display = 'block'; // Открываем модальное окно

    };
});

//Для загрузки Фото
$(document).ready(
    function () {
        $('#infoModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var imgSrc = button.data('img-src');

            var modal = $(this);
            if (imgSrc) {
                modal.find('#modalImage').attr('src', imgSrc).show();
                modal.find('#imageMessage').hide();
            } else {
                modal.find('#modalImage').attr('src', '').hide();
                modal.find('#modalDescription').text('Изображение отсутствует.');
                modal.find('#imageMessage').show();
            }
        });
    }
);

// Функция закрытия модального окна
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

// Закрытие при клике на крестик
document.querySelectorAll('.close').forEach(btn => {
    btn.onclick = function () {
        closeModal(this.closest('.modal').id);
    };
});

//Уведомление
function notification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Добавляем уведомление в контейнер
    const container = document.getElementById('notification-container');
    container.appendChild(notification);

    // Показываем уведомление
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Убираем уведомление через указанное время
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            container.removeChild(notification);
        }, 500);
    }, duration);
}

// Закрытие при клике вне окна
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }

    //Скрытие ненужных заявок
    function showTable(tableId) {
        // Скрываем все таблицы
        document.getElementById('inWorkTable').style.display = 'none';
        document.getElementById('canceledTable').style.display = 'none';
        document.getElementById('closedTable').style.display = 'none';

        // Показываем выбранную таблицу
        document.getElementById(tableId + 'Table').style.display = 'table';
    }

    // По умолчанию показываем таблицу "Заявки в работе"
    showTable('inWork');

};
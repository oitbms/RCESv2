const entityName = document.getElementById('entityName').innerText;  // Название сущности
const entityId = document.getElementById('id');  // Id сущности

// Функция для получения данных по API
async function fetchData(endpoint, param) {
    const url = new URL(/api/ + endpoint, window.location.origin);
    url.searchParams.append('param', param != null ? param : entityName);
    const response = await fetch(url.toString());
    return await response.json();
}

async function saveData() {
    let formData = new FormData(document.getElementById('viewRequestForm'));
    let data = Object.fromEntries(formData.entries());


    const url = new URL('/api/update', window.location.origin);
    url.searchParams.append('className', entityName);
    url.searchParams.append("id", entityId.value);
    url.searchParams.append("sendMessage", data.sendToTelegram);

    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Class-Name': entityName,
            'X-Entity-Id': entityId.value
        },
        body: JSON.stringify(data),
    }).then(r => notification('Запись сохранена', 3000, 'success'));
}


document.querySelectorAll('.openModal').forEach(button => {
    button.addEventListener('click', async () => {
        const {endpoint, param, modalId, inputId, hiddenEntity} = button.dataset;

        const modalWindow = document.getElementById(modalId);
        const list = modalWindow.querySelector('.modal-list');
        const isViewForm = "${viewForm}"

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
                if (isViewForm)saveData();
                closeModal(modalId);
            });
        });
        // Для css
        modalWindow.classList.add('open')
    });
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

function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('open');
}
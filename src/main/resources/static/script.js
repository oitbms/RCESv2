// Функция для получения данных по url api
//          Param: endpoint - url api
//                 param - необязательный
async function fetchData(endpoint, param) {
    const url = new URL(/api/ + endpoint, window.location.origin);
    url.searchParams.append('param', param);
    const response = await fetch(url.toString());
    return await response.json();
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
                closeModal(modalId);
            };
            list.appendChild(li);
        });

        modal.style.display = 'block'; // Открываем модальное окно

    };
});

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

// Закрытие при клике вне окна
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
};
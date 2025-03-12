// Функция для получения данных по url api
//          Param: endpoint - url api
//                 param - необязательный
async function fetchData(endpoint, param) {
    const url = new URL(/api/ + endpoint, window.location.origin);
    url.searchParams.append('param', param);
    const response = await fetch(url.toString());
    return await response.json();
}

// Универсальная функция для заполнения списка
//          Param: endpoint - url api,
//                 param - необязательный параметр,
//                 listId - id тега ul,
//                 displayField - имя выводимого поля из листа,
//                 inputId - id тега input
async function populateList(endpoint, param, listId, displayField, inputId) {
    const data = await fetchData(endpoint, param);
    const list = document.getElementById(listId);
    list.innerHTML = ''; // Очищаем список перед заполнением

    data.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item[displayField]; // Используем поле для отображения
        li.onclick = function () {
            document.getElementById(inputId).value = item[displayField]; // Заполняем поле ввода
            closeModal();
        };
        list.appendChild(li);
    });
}


// Обработчик для всех кнопок с классом openModal
document.querySelectorAll('.openModal').forEach(button => {
    button.onclick = async function () {

        //Извлечение параметров для глобального использования
        const endpoint = button.getAttribute('data-endpoint');
        const param = button.getAttribute('data-param');
        const displayField = button.getAttribute('data-display-field');
        const inputId = button.getAttribute('data-input-id');

        await populateList(endpoint, param,'employeeList', displayField, inputId);
        document.getElementById('myModal').style.display = 'block';
    };
});

// Закрытие модального окна
document.querySelector('.close').onclick = function () {
    closeModal();
};

window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        closeModal();
    }
};

function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}
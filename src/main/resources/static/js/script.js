const modalElement = document.getElementById('universalModal');
const modal = new bootstrap.Modal(modalElement);
const listElement = document.getElementById('modalItemList');
const searchInput = document.getElementById('modalSearchInput');
const loadingIndicator = document.getElementById('modalLoading');
const errorBlock = document.getElementById('modalError');
const saveBtn = document.getElementById('modalSaveBtn');
const footer = document.getElementById('modalFooter');
const button = document.getElementById('commentOtkId');
const openBtn = document.getElementById('openOtkId');
const textarea = document.getElementById('commentOtk');
const qtyField = document.getElementById('qtyCreateField');
const controlField = document.getElementById('divControlId');
const reasonField = document.getElementById('divReasonsId');
const commentField = document.getElementById('divCommentId');
const customerField = document.getElementById('divCustomerId');
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
    const url = new URL('/api/request/' + endpoint, window.location.origin);
    url.searchParams.append('param', param != null ? param : bidType);
    const response = await fetch(url.toString());
    console.log(param);
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

    const url = new URL('/api/request/update', window.location.origin);
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

    document.getElementById('photoContainer').addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG') {
            const src = e.target.src;
            const fullPhoto = document.getElementById('fullPhoto');
            fullPhoto.src = src;
            fullPhoto.style.display = 'block';
        }
    });

    document.getElementById('fullPhoto').addEventListener('click', function() {
        this.style.display = 'none';
    });

    images.forEach((imgData, index) => {
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'photo-wrapper';
        const imageUrl = typeof imgData === 'string' ? imgData : imgData.data;

        imgWrapper.innerHTML = `
        <img src="${imageUrl}" class="attached-photo">
        <button class="delete-photo-btn" data-index="${index}">Удалить</button>
    `;

        const deleteBtn = imgWrapper.querySelector('.delete-photo-btn');
        deleteBtn.addEventListener('click', () => {
            deletePhoto(index);
        });

        const imgElem = imgWrapper.querySelector('img');
        imgElem.addEventListener('click', () => {
            document.getElementById('fullPhoto').src = imageUrl;
            photoModalInstance.show();
        });

        container.appendChild(imgWrapper);
    });
}

async function deletePhoto(index) {
    const id = entityId.value; // Предполагается, что entityId — это элемент или переменная с нужным идентификатором
    let images = await fetchData("images", id); // Получаем текущие изображения
    const imageToDelete = images[index]; // Изображение, которое нужно удалить
    const reqId = imageToDelete.mainlink;
    const  imageId = imageToDelete.id


    const response = await fetch('/api/request/delete-images', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: imageId ,reqId:reqId })
    });

    if (!response.ok) {
        alert("Ошибка: Удалить фото может только Ответственный за заявку!");
        return;
    }

    images.splice(index, 1);

    // Сохраняем обновленный массив изображений
    // await saveData(images);

    // Обновляем отображение, если удаляемое фото отображается в полноэкранном режиме
    const fullPhoto = document.getElementById('fullPhoto');
    const currentSrc = fullPhoto.src;
    const deletedSrc = typeof imageToDelete === 'string' ? imageToDelete : imageToDelete.data;
    if (currentSrc === deletedSrc) {
        fullPhoto.style.display = 'none';
        fullPhoto.src = '';
    }

    // Перерисовываем фотографии
    renderPhotos(images);
}

// ==============================
// 5. Обработка ввода (с задержкой)
// ==============================
if (document.title.includes("Заявка на вызов") && viewForm) {
    const delayedSave = (callback) => {
        clearTimeout(timeout);
        timeout = setTimeout(callback, 1500);
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

    document.getElementById('photoInput').addEventListener('change', async function (event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;
        let images = await fetchData("images", entityId.value) || [];

        for (const file of files) {
            const tempPreview = document.createElement('div');
            tempPreview.className = 'photo-wrapper temporary';
            tempPreview.innerHTML = `
            <img src="" class="attached-photo loading">
            <button class="delete-photo-btn" disabled>Удалить</button>
        `;
            document.getElementById('photoContainer').prepend(tempPreview);

            const reader = new FileReader();

            await new Promise((resolve, reject) => {
                reader.onload = async (e) => {
                    try {
                        tempPreview.querySelector('img').src = e.target.result;
                        tempPreview.querySelector('img').classList.remove('loading');
                        images.push(e.target.result);
                        await saveData(images);
                        renderPhotos(images);
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                };
                reader.onerror = () => {
                    tempPreview.innerHTML = '<div class="error">Ошибка загрузки</div>';
                    reject(new Error('Ошибка чтения файла'));
                };
                reader.readAsDataURL(file);
            });
        }
        event.target.value = '';
    });

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
//ДОБАВЛЕНИЕ СКРИПТОВ ИЗ ШАБЛОНА (ДА ДА УЖЕ ПОРА )

document.addEventListener('DOMContentLoaded', () => {
    const actionButtons = document.querySelectorAll('button.work[data-param]');
    let description;

    const handleClick = async (button) => {

        const param = button.dataset.param;
        const status = button.dataset.status;

        if (bidType === 'otk') {
            description = document.getElementById('description2')?.value || '';
        } else {
            description = document.getElementById('description')?.value || '';
        }


        const formData = new URLSearchParams();
        formData.append('param', param);
        formData.append('description', description);
        if (status !== undefined && status !== null) {
            formData.append('status', status);
        }

        console.log('param:', param);
        console.log('description:', description);

        const response = await fetch('/api/request/in-work', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });

        if (!response.ok) throw new Error('Ошибка сервера: ' + response.status);

        location.reload();
    };

    actionButtons.forEach(button => {
        button.addEventListener('click', () => handleClick(button));
    });
});
//КНОПКА inWork работает !

//ДОБАВЛЕНИЕ СКРИТА ДЛЯ УНИВЕРСАЛЬНОГО МОДАЛЬНОГО ОКНА
document.addEventListener('DOMContentLoaded', () => {
    (function () {

        let multiple = false;
        let selected = new Map();
        let originalData = [];
        let inputId, hiddenId;

        searchInput.classList.remove('visible');

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            renderList(originalData.filter(item => item.name.toLowerCase().includes(query)));
        });

        function renderList(data) {
            listElement.innerHTML = '';

            data.forEach(item => {
                const li = document.createElement('li');
                li.className = 'list-group-item list-group-item-action selectable';
                li.textContent = item.name;
                li.dataset.entity = encodeURIComponent(JSON.stringify(item));

                if (multiple && selected.has(item.name)) {
                    li.classList.add('active');
                }

                li.addEventListener('click', () => {
                    if (multiple) {
                        if (selected.has(item.name)) {
                            selected.delete(item.name);
                            li.classList.remove('active');
                        } else {
                            selected.set(item.name, item);
                            li.classList.add('active');
                        }
                        const arr = Array.from(selected.values());
                        document.getElementById(inputId).value = arr.map(e => e.name).join(', ');
                        document.getElementById(hiddenId).value = JSON.stringify(arr);
                    } else {
                        console.log(item);
                        handleItemSelection(item);
                        document.getElementById(inputId).value = item.name;
                        document.getElementById(hiddenId).value = JSON.stringify(item);
                        modal.hide();
                        if (typeof saveData === 'function') saveData();
                        toggleCommentField?.();
                        toggleDescriptionField?.();
                    }
                });

                listElement.appendChild(li);
            });
        }

        window.openUniversalModal = async function ({
                                                        endpoint, param, inputFieldId, hiddenFieldId,
                                                        isMultiple = false, title = 'Выберите элемент'
                                                    }) {
            inputId = inputFieldId;
            hiddenId = hiddenFieldId;
            multiple = isMultiple;
            selected = new Map();
            originalData = [];
            modalElement.querySelector('.modal-title').textContent = title;
            searchInput.value = '';
            listElement.innerHTML = '';
            errorBlock.classList.add('d-none');
            loadingIndicator.classList.remove('d-none');
            footer.classList.toggle('d-none', !multiple);

            if (multiple) {
                try {
                    const raw = document.getElementById(hiddenId).value;
                    const parsed = JSON.parse(raw || '[]');
                    parsed.forEach(e => e?.name && selected.set(e.name, e));
                } catch (e) {
                    console.warn('Ошибка парсинга выбранных значений:', e);
                }
            }

            try {
                const url = new URL('/api/' + endpoint, window.location.origin);
                url.searchParams.append('param', param || '');
                const response = await fetch(url);
                const data = await response.json();
                originalData = Array.isArray(data) ? data : [];

                if (originalData.length > 5) {
                    searchInput.classList.add('visible');
                } else {
                    searchInput.classList.remove('visible');
                }

                renderList(originalData);
            } catch (e) {
                console.error('Ошибка загрузки данных:', e);
                errorBlock.classList.remove('d-none');
            } finally {
                loadingIndicator.classList.add('d-none');
                modal.show();
            }
        };

        saveBtn.addEventListener('click', () => {
            const arr = Array.from(selected.values());
            document.getElementById(inputId).value = arr.map(e => e.name).join(', ');
            document.getElementById(hiddenId).value = JSON.stringify(arr);
            modal.hide();
            if (typeof saveData === 'function') saveData();
        });
    })();
});
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.openModal').forEach(button => {
        button.addEventListener('click', () => {
            const endpoint = button.dataset.endpoint;
            const inputId = button.dataset.inputId;
            const hiddenId = button.dataset.hiddenEntity;
            const param = button.dataset.param || '';
            const isMultiple = button.dataset.multiple === 'true';
            const title = button.dataset.title || 'Выберите элемент';

            openUniversalModal({
                endpoint,
                param,
                inputFieldId: inputId,
                hiddenFieldId: hiddenId,
                isMultiple,
                title
            });
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    if (button) {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-param');
            const comment = document.getElementById('commentOtk').value;

            fetch('/api/request/comment-bid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'id': id,
                    'comment': comment
                })
            })
                .then(response => {
                    if (response.ok) {
                    } else {
                    }
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                    alert('Ошибка при отправке запроса');
                });
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    if (openBtn && textarea && saveBtn) {
        openBtn.addEventListener('click', function() {
            if (textarea.style.display === 'none' || textarea.style.display === '') {
                textarea.style.display = 'block';
                saveBtn.style.display = 'inline-block';
            } else {
                textarea.style.display = 'none';
                saveBtn.style.display = 'none';
            }
        });
    }
});
function handleItemSelection(selectedItem) {
    const itemName = selectedItem.name || selectedItem;
    if (itemName === 'Карта раскроя') {
        if (qtyField) qtyField.style.display = 'none';
        if (controlField) controlField.style.display = 'none';
        if (reasonField) reasonField.style.display = 'none';
        if (commentField) commentField.style.display = 'none';
        if (customerField) customerField.style.display = 'none';
    } else {
        if (qtyField) qtyField.style.display = 'block';
        if (controlField) controlField.style.display = 'block';
        if (reasonField) reasonField.style.display = 'block';
        if (commentField) commentField.style.display = 'block';
        if (customerField) customerField.style.display = 'block';
    }
}

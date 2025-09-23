// ==============================
// 1. DOM Elements
// ==============================
const modalElement = document.getElementById('universalModal');
const modal = new bootstrap.Modal(modalElement);
const listElement = document.getElementById('modalItemList');
const searchInput = document.getElementById('modalSearchInput');
const loadingIndicator = document.getElementById('modalLoading');
const errorBlock = document.getElementById('modalError');
const saveBtn = document.getElementById('modalSaveBtn');
const footer = document.getElementById('modalFooter');
const saveCommentId = document.getElementById('commentOtkId');
const openBtn = document.getElementById('openOtkId');
const textarea = document.getElementById('commentOtk');
const qtyField = document.getElementById('qtyCreateField');
const controlField = document.getElementById('divControlId');
const reasonField = document.getElementById('divReasonsId');
const commentField = document.getElementById('divCommentId');
const customerField = document.getElementById('divCustomerId');
const entityId = document.getElementById('id');
const photoModalInstance = new bootstrap.Modal(document.getElementById('photoModal'));

// ==============================
// 2. Utilities
// ==============================
let timeout;

/**
 * Fetch data from server
 */
async function fetchData(endpoint, param) {
    const url = new URL('/api/request/' + endpoint, window.location.origin);
    url.searchParams.append('param', param != null ? param : bidType);
    const response = await fetch(url.toString());
    return response.json();
}

/**
 * Show notification
 */
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
// 3. Data Saving
// ==============================
async function saveData(images, customerOrder) {
    const viewRequestForm = document.getElementById('viewRequestForm');
    if (!viewRequestForm) return;

    const formData = new FormData(viewRequestForm);
    const data = Object.fromEntries(formData.entries());

    if (images) data.images = images;
    if (customerOrder) data.customerOrder = customerOrder;

    const url = new URL('/api/request/update', window.location.origin);
    url.searchParams.append('bidType', bidType);
    url.searchParams.append('id', entityId.value);
    url.searchParams.append('sendMessage', data.sendToTelegram);

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
// 4. Photo Management
// ==============================
function renderPhotos(images) {
    const container = document.getElementById('photoContainer');
    container.innerHTML = '';

    if (!images || images.length === 0) {
        container.innerHTML = '<div class="no-photos">Нет прикрепленных фото</div>';
        return;
    }

    // Photo click handler
    container.addEventListener('click', function (e) {
        if (e.target.tagName === 'IMG') {
            const src = e.target.src;
            const fullPhoto = document.getElementById('fullPhoto');
            fullPhoto.src = src;
            fullPhoto.style.display = 'block';
        }
    });

    // Full photo close handler
    document.getElementById('fullPhoto').addEventListener('click', function () {
        this.style.display = 'none';
    });

    // Render each photo
    images.forEach((imgData, index) => {
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'photo-wrapper';
        const imageUrl = typeof imgData === 'string' ? imgData : imgData.data;

        imgWrapper.innerHTML = `
            <img src="${imageUrl}" class="attached-photo">
            <button class="delete-photo-btn" data-index="${index}">Удалить</button>
        `;

        const deleteBtn = imgWrapper.querySelector('.delete-photo-btn');
        deleteBtn.addEventListener('click', () => deletePhoto(index));

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
    let images = await fetchData('images', id);
    const imageToDelete = images[index];
    const reqId = imageToDelete.mainlink;
    const imageId = imageToDelete.id;

    const response = await fetch('/api/request/delete-images', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: imageId, reqId: reqId})
    }).then(response => {
        if (response.ok) {
            return response.json().then(data => {
                Swal.fire({
                    icon: 'success',
                    title: 'Успех!',
                    text: 'Данные успешно удалены!',
                    timer: 1000,
                    showConfirmButton: false
                });
            });
        } else {
            return response.text().then(errorText => {
                throw new Error(errorText);
            });
        }
    }).catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Ошибка!',
            text: error.message || 'Произошла ошибка при удалении данных',
            timer: 5000
        });
    });

    images.splice(index, 1);

    // Update full photo display if deleted photo is currently shown
    const fullPhoto = document.getElementById('fullPhoto');
    const currentSrc = fullPhoto.src;
    const deletedSrc = typeof imageToDelete === 'string' ? imageToDelete : imageToDelete.data;

    if (currentSrc === deletedSrc) {
        fullPhoto.style.display = 'none';
        fullPhoto.src = '';
    }

    renderPhotos(images);
}

// ==============================
// 5. Input Handling with Debounce
// ==============================
if (document.title.includes('Заявка на вызов') && viewForm) {
    const delayedSave = (callback) => {
        clearTimeout(timeout);
        timeout = setTimeout(callback, 1500);
    };

    // Event listeners for input fields
    document.getElementById('comment')?.addEventListener('input', () => delayedSave(() => saveData()));
    document.getElementById('commentAgreed')?.addEventListener('input', () => delayedSave(() => saveData()));

    document.getElementById('customerOrderString')?.addEventListener('input', function () {
        const customerOrderString = this.value;
        delayedSave(() => saveData(null, customerOrderString));
    });

    // Photo modal handling
    document.getElementById('openPhotoModal')?.addEventListener('click', async () => {
        const images = await fetchData('images', entityId.value);
        renderPhotos(images);
        document.getElementById('photoModal').classList.add('open');
    });

    document.getElementById('addPhotoBtn')?.addEventListener('click', () => {
        document.getElementById('photoInput').click();
    });

    document.getElementById('photoInput').addEventListener('change', async function (event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        let images = await fetchData('images', entityId.value) || [];

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
// 6. Form Validation
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
        notification('Заполните обязательные поля', 3000, 'error');
    }
});

// ==============================
// 7. Field Visibility Logic by Request Type
// ==============================
if (document.title.includes('Заявка на вызов')) {
    document.addEventListener('DOMContentLoaded', async function () {
        const urlParams = new URLSearchParams(window.location.search);
        let type = urlParams.get('type');

        if (viewForm) {
            type = await fetchData('type-request', entityId.value);
        }

        const typeHandlers = {
            constructor: () => {
                if (viewForm) {
                    document.getElementById('inconsistencyViewField')?.classList.add('hidden');
                    document.getElementById('qtyViewField')?.classList.add('hidden');
                } else {
                    document.getElementById('qtyCreateField')?.classList.add('hidden');
                    document.getElementById('qty')?.removeAttribute('data-required');
                }
            },

            otk: () => {
                if (viewForm) {
                    document.getElementById('mlmNodeViewField')?.classList.add('hidden');
                    document.getElementById('reasonCreateField')?.removeAttribute('data-required');
                }
            },

            technologist: () => {
                if (viewForm) {
                    document.getElementById('inconsistencyViewField')?.classList.add('hidden');
                    document.getElementById('qtyViewField')?.classList.add('hidden');
                    document.getElementById('qty')?.removeAttribute('data-required');
                } else {
                    document.getElementById('qtyCreateField')?.classList.add('hidden');
                    document.getElementById('qty')?.removeAttribute('data-required');
                }
            }
        };

        if (typeHandlers[type]) {
            typeHandlers[type]();
        }
    });
}

// ==============================
// 8. Action Buttons Handler
// ==============================
document.addEventListener('DOMContentLoaded', () => {
    const actionButtons = document.querySelectorAll('button.work[data-param]');

    const handleClick = async (button) => {
        const param = button.dataset.param;
        const status = button.dataset.status;

        const inconsistencyInput = document.getElementById('inconsistencyJson1');
        const inconsistencyData = inconsistencyInput?.value || '';

        if (bidType === 'otk') {
            description = document.getElementById('description2')?.value || '';
            if (description === '') {
                description = document.getElementById('description1')?.value || '';
            }
        } else {
            description = document.getElementById('description')?.value || '';
        }

        let qty = document.getElementById('qtyCompleted')?.value || '';

        const formData = new URLSearchParams();
        formData.append('param', param);
        formData.append('description', description);

        if (status !== undefined && status !== null) {
            formData.append('status', status);
        }

        formData.append('qtyCompleted', qty);
        formData.append('inconsistencyData', inconsistencyData);

        const response = await fetch('/api/request/in-work', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        }).then(response => {
            if (response.ok) {
                return response.json().then(data => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Успех!',
                        text: 'Данные успешно сохранены!',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                });
            } else {
                return response.text().then(errorText => {
                    throw new Error(errorText);
                });
            }
        }).catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Ошибка!',
                text: error.message || 'Произошла ошибка при сохранении данных',
                timer: 5000
            });
        });
    };

    actionButtons.forEach(button => {
        button.addEventListener('click', () => handleClick(button));
    });
});

// ==============================
// 9. Universal Modal Logic
// ==============================
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
                        handleItemSelection(item);
                        document.getElementById(inputId).value = item.name;
                        document.getElementById(hiddenId).value = JSON.stringify(item);
                        modal.hide();

                        if (typeof saveData === 'function') saveData();
                    }
                });

                listElement.appendChild(li);
            });
        }

        window.openUniversalModal = async function ({
                                                        endpoint,
                                                        param,
                                                        inputFieldId,
                                                        hiddenFieldId,
                                                        isMultiple = false,
                                                        title = 'Выберите элемент'
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

// ==============================
// 10. Modal Openers
// ==============================
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

// ==============================
// 11. Comment Saving
// ==============================
document.addEventListener('DOMContentLoaded', () => {
    if (saveCommentId) {
        saveCommentId.addEventListener('click', () => {
            const id = saveCommentId.getAttribute('data-param');
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
            }).then(response => {
                if (response.ok) {
                    // Success handling
                } else {
                    // Error handling
                }
            }).catch(error => {
                alert('Ошибка при отправке запроса');
            });
        });
    }
});

// ==============================
// 12. Inconsistencies Form
// ==============================
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('inconsistenciesForm');
    const modalElement = document.getElementById('addInconsistenciesModal');
    const mainModalElement = document.getElementById('exampleModalOtk');
    let modal = null;

    function getModalInstance() {
        if (!modal) {
            modal = new bootstrap.Modal(modalElement);
        }
        return modal;
    }

    // Обработчик для основного модального окна
    if (mainModalElement) {
        mainModalElement.addEventListener('hidden.bs.modal', function () {
            // Удаляем backdrop при закрытии основного окна
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());

            // Восстанавливаем возможность прокрутки
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        });

        mainModalElement.addEventListener('hide.bs.modal', function () {
            // Удаляем лишние backdrop'ы при скрытии
            const backdrops = document.querySelectorAll('.modal-backdrop');
            if (backdrops.length > 1) {
                backdrops[backdrops.length - 1].remove();
            }
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then(response => {
            if (response.ok) {
                return response.json().then(data => {
                    getModalInstance().hide();
                    form.reset();

                    Swal.fire({
                        icon: 'success',
                        title: 'Успех!',
                        text: 'Данные успешно сохранены!',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                });
            } else {
                return response.text().then(errorText => {
                    throw new Error(errorText);
                });
            }
        }).catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Ошибка!',
                text: error.message || 'Произошла ошибка при сохранении данных',
                timer: 5000
            });
        });
    });

    const openModalBtn = document.getElementById('openModalBtn');
    if (openModalBtn != null) {
        openModalBtn.addEventListener('click', function () {
            // Получаем экземпляр первого модального окна
            const firstModalElement = document.getElementById('exampleModalOtk');
            const firstModal = bootstrap.Modal.getInstance(firstModalElement);

            if (firstModal) {
                // Скрываем первое окно
                firstModal.hide();

                // После скрытия первого окна показываем второе
                firstModalElement.addEventListener('hidden.bs.modal', function () {
                    setTimeout(() => {
                        getModalInstance().show();
                    }, 300);
                }, {once: true});
            } else {
                // Если первого окна нет, просто показываем второе
                getModalInstance().show();
            }

            form.reset();
        });
    }

    // При закрытии второго окна возвращаемся к первому
    modalElement.addEventListener('hidden.bs.modal', function () {
        const firstModalElement = document.getElementById('exampleModalOtk');
        if (firstModalElement) {
            const firstModal = new bootstrap.Modal(firstModalElement);
            firstModal.show();
        }

        form.reset();
    });

    // Очистка при полном закрытии второго окна
    modalElement.addEventListener('hide.bs.modal', function () {
        // Удаляем лишние backdrop'ы если они есть
        const backdrops = document.querySelectorAll('.modal-backdrop');
        if (backdrops.length > 1) {
            backdrops[backdrops.length - 1].remove();
        }
    });

    // Глобальный фикс для всех модальных окон
    function fixModalBackdrops() {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        if (backdrops.length > 1) {
            // Оставляем только первый backdrop
            for (let i = 1; i < backdrops.length; i++) {
                backdrops[i].remove();
            }
        }
    }

    // Периодическая проверка и очистка backdrop'ов
    setInterval(fixModalBackdrops, 100);

    // Также чистим при клике по backdrop'у
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('modal-backdrop')) {
            fixModalBackdrops();
        }
    });
});

// ==============================
// 13. Comment Toggle
// ==============================
document.addEventListener('DOMContentLoaded', function () {
    if (openBtn && textarea && saveCommentId) {
        openBtn.addEventListener('click', function () {
            if (textarea.style.display === 'none' || textarea.style.display === '') {
                textarea.style.display = 'block';
                saveCommentId.style.display = 'inline-block';
            } else {
                textarea.style.display = 'none';
                saveCommentId.style.display = 'none';
            }
        });
    }
});

// ==============================
// 14. Item Selection Handler
// ==============================
function handleItemSelection(selectedItem) {
    const itemName = selectedItem.name || selectedItem;
    const fieldsToToggle = [qtyField, controlField, reasonField, commentField, customerField];

    if (itemName === 'Карта раскроя') {
        fieldsToToggle.forEach(field => {
            if (field) field.style.display = 'none';
        });
    } else {
        fieldsToToggle.forEach(field => {
            if (field) field.style.display = 'block';
        });
    }
}


// ==============================
// 15. Completed Field Editing
// ==============================
if (viewForm) {
    document.addEventListener('DOMContentLoaded', function() {
        const successQtyInput = document.getElementById('qtyCompleted');
        const rejectedBlock = document.getElementById('rejectedBidOtk');

        if (bidQty > 0) {
            successQtyInput.addEventListener('input', function() {
                const enteredValue = parseInt(successQtyInput.value, 10);
                if (!isNaN(enteredValue) && enteredValue < bidQty) {
                    rejectedBlock.classList.remove('d-none');
                } else {
                    rejectedBlock.classList.add('d-none');
                }
            });
        }
    });

    document.getElementById('successId').addEventListener('click', function(e) {
        const form = document.querySelector('.modal-content');
        const qtyInput = document.getElementById('qtyCompleted');

        if (!qtyInput.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
            form.classList.add('was-validated');
            qtyInput.focus();
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        const qtyCompletedInput = document.getElementById('qtyCompleted');
        const movedQuantitySpan = document.getElementById('movedQuantity');
        const maxQty = bidQty;

        function updateMovedQuantity() {
            let completedQty = parseInt(qtyCompletedInput.value);


            if (isNaN(completedQty) || completedQty < 0) {
                completedQty = 0;
            } else if (completedQty > maxQty) {
                completedQty = maxQty;
                qtyCompletedInput.value = maxQty;
            }

            const movedQty = maxQty - completedQty;
            movedQuantitySpan.textContent = movedQty;

            if (movedQty > 0) {
                movedQuantitySpan.style.color = 'red';
            } else {
                movedQuantitySpan.style.color = 'green';
            }
        }

        qtyCompletedInput.addEventListener('input', updateMovedQuantity);
        qtyCompletedInput.addEventListener('change', updateMovedQuantity);

        // Инициализация
        updateMovedQuantity();
    });
}
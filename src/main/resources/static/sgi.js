import { fetchData, closeModal} from './script.js';
window.closeModal = closeModal;

// Открытие квадрата факта выполнения
Array.from(document.getElementsByName('square')).forEach(button => {
    button.addEventListener('click', async () => {
        const modalWindow = document.getElementById("executionsModal");

        const list = modalWindow.querySelector('.modal-list-custom');
        const data = await fetchData("executions", button.dataset.param);

        // Формируем строки таблицы с добавлением двух input после заполненных строк
        const tableRows = data.map(item => `
            <tr id="${item.id}">
              <td class="selectable">${item.executionDate}</td>
              <td class="selectable">${item.report}</td>
              <td>
                <button class="attached-photo-btn" data-id="${item.id}">Прикрепленные фото</button>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <input type="datetime-local" name="executionDate" class="input-selectable" style="flex: 1; margin-right: 8px;">
                  <input type="text" name="report" class="input-selectable" style="flex: 1; margin-right: 8px;">
                  <button class="attached-photo-btn" style="white-space: nowrap;">Прикрепленные фото</button>
                </div>
              </td>
            </tr>
        `).join('');

        if (data.length > 0) {
            list.innerHTML = `
            <div class="modal-header">
              <h3 class="modal-title">Список фактов</h3>
            </div>
            <table class="info-table">
              <thead>
                <tr>
                  <th>Дата выполнения</th>
                  <th>Отчет</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
            <button class="create-btn" onclick="saveData()">Добавить запись</button>
          `;
        } else {
            list.innerHTML = `
            <div class="modal-header">
              <h3 class="modal-title">Список фактов</h3>
            </div>
            <button class="create-btn" onclick="saveData()">Добавить запись</button>`;
        }

        // Обработка кнопок "Прикрепленные фото"
        setTimeout(() => {
            document.querySelectorAll('.attached-photo-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const itemId = btn.dataset.id;
                    // Ваш код для открытия фото или обработки
                    openPhotosModal(itemId);
                });
            });
        }, 0);

        modalWindow.classList.add('open');
    });
});
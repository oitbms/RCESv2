export function confirmDialogTemplate() {
    return `
    <dialog id="confirmDialog" class="confirm-dialog">
        <div class="confirm-content">
            <div class="confirm-message" id="confirmMessage"></div>
            <div class="confirm-buttons">
                <button class="confirm-btn confirm-cancel" id="confirmCancel">Отмена</button>
                <button class="confirm-btn confirm-ok" id="confirmOk">Подтвердить</button>
            </div>
        </div>
    </dialog>
    `;
}
export function printDialogTemplate(reports) {
    const options = (reports || [])
        .map(r => `<option value="${r.api}">${r.name}</option>`)
        .join('');
    return `
    <dialog id="printDialog" class="print-dialog">
        <div class="print-content">
            <h3>Выберите отчёт и формат</h3>
            <select id="reportSelect" class="print-select">
                ${options}
            </select>
            <div class="format-block">
                <div class="format-toggle">
                    <button type="button" class="format-btn active" data-format="PDF">PDF</button>
                    <button type="button" class="format-btn" data-format="XLSX">XLSX</button>
                </div>
            </div>
            <div class="print-buttons">
                <button id="printCancel">Отмена</button>
                <button id="printOk">Печать</button>
            </div>
        </div>
    </dialog>
    `;
}
//# sourceMappingURL=dialogTemplates.js.map
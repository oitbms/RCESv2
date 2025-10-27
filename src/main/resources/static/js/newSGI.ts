// @ts-ignore
declare const $: any;

class Sgi extends Base {
    constructor(itemsPerPage = 16) {
        super(itemsPerPage, () => {
            this.displayPage('/api/sgi/get-page-sgi', 'GET', undefined).catch(console.error);
        });
        this.createHandler('click', '#createSGI', this.createSgi.bind(this), false);
    }

    public createRow(sgi: SgiIn) {
        const borderClass = sgi.color === 'RED' ? 'border-danger' : sgi.color === 'YELLOW' ? 'border-warning' : sgi.color === 'GREEN' ? 'border-good' : '';
        const row = `
            <div class="row-items-row ${sgi.color === 'GREY' ? 'complete' : ''}" data-id="${sgi.id}" data-inner="true">
                <div class="row-item" data-field="number" style="width: var(--no);">
                    <span class="${borderClass}"></span>
                </div>
                <div class="row-item" data-field="workcenter" style="width: var(--workcenter);">${sgi.workcenter}</div>
                <div class="row-item" data-field="event" style="width: var(--event);">${sgi.event}</div>
                <div class="row-item" data-field="actions" style="width: var(--action);">${sgi.actions}</div>
                <div class="row-item" data-field="departament" style="width: var(--department);">${sgi.departmentName}</div>
                <div class="row-item" data-field="employee" style="width: var(--employee);">${sgi.employee.name}</div>
                <div class="row-item" data-field="desiredDate" style="width: var(--desiredDate);">${this.formatDate(sgi.desiredDate)}</div>
                <div class="row-item" data-field="note" style="width: var(--note);">${sgi.note}</div>
                <div class="row-item ${borderClass}" data-field="planDate" style="width: var(--planDate);">
                   <span class="${borderClass}">${this.formatDate(sgi.planDate)}</span>
                </div>
                <div class="row-item" data-field="comment" style="width: var(--comment);">${sgi.comment}</div>
                <div class="row-item" style="width: var(--editing);">
                    <button type="button" class="btn btn-info btn-sm editing-btn">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                </div>
                <div class="row-item" style="width: var(--executions);">
                    <button type="button" class="btn btn-info btn-sm execution-btn">
                        ✔
                    </button>
                </div>
                <div class="row-item" style="width: var(--status);">
                    <div class="checkbox-wrapper-31">
                        <input type="checkbox" id="toggleAgreement" ${sgi.agree ? 'checked' : ''}>
                        <svg viewBox="0 0 35.6 35.6">
                            <circle class="background" cx="17.8" cy="17.8" r="17.8"></circle>
                            <circle class="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                            <polyline class="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
                        </svg>
                    </div>
                </div>
            </div>`

        $('.table-content-rows').append(row);

        return row;
    }

    public createSgi(event: Event) {
        const createDialogName = 'create-dialog';

        this.dialog.open(createDialogName);

    }


}
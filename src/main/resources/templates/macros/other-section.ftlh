<#-- Блок «Прочее» в карточке станка/здания: текст + PDF. Заполняется из core/other-section.ts -->
<div class="card mt-4" id="other-section">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0"><i class="bi bi-three-dots me-2"></i>Прочее</h5>
        <#if canEdit>
        <div class="d-flex gap-2">
            <button type="button" id="other-edit-button" class="btn btn-sm btn-primary icon-text">
                <i class="bi bi-pencil-square"></i>
                <span>Редактировать текст</span>
            </button>
            <label for="other-files-input" class="btn btn-sm btn-success icon-text mb-0">
                <i class="bi bi-plus-circle"></i>
                <span>Добавить PDF</span>
            </label>
            <input type="file" id="other-files-input" accept="application/pdf" multiple hidden>
        </div>
        </#if>
    </div>
    <div class="card-body">
        <p id="other-text" class="mb-0 text-pre-wrap"></p>
        <#if canEdit>
        <div id="other-text-editor" class="d-none">
            <textarea id="other-text-input" class="form-control mb-2" rows="5" maxlength="10000"></textarea>
            <div class="d-flex justify-content-end gap-2">
                <button type="button" id="other-cancel-button" class="btn btn-sm btn-secondary">Отмена</button>
                <button type="button" id="other-save-button" class="btn btn-sm btn-primary">Сохранить</button>
            </div>
        </div>
        </#if>
    </div>
    <ul class="list-group list-group-flush" id="other-documents-list"></ul>
</div>

let filtersOpen = false;

function toggleFilters() {
    const section = document.getElementById('filterSection');
    const icon = document.getElementById('filterIcon');
    if (filtersOpen) {
        section.classList.remove('open');
        icon.style.transform = 'rotate(0deg)';
    } else {
        section.classList.add('open');
        icon.style.transform = 'rotate(180deg)';
    }
    filtersOpen = !filtersOpen;
    sessionStorage.setItem('filtersOpen', filtersOpen);
}

function updateFilterButtons() {
    const inputs = document.querySelectorAll('#filterForm [data-filter-input]');
    const applyBtn = document.getElementById('applyFilterBtn');
    const clearBtn = document.getElementById('clearFilterBtn');

    const hasValue = Array.from(inputs).some(input => input.value.trim() !== '');

    if (applyBtn) applyBtn.disabled = !hasValue;
    if (clearBtn) clearBtn.disabled = !hasValue;
}

document.addEventListener('DOMContentLoaded', function () {
    const url = new URL(window.location.href);
    const hasFilters = ['filterNumber', 'filterCreator', 'filterEmployee', 'filterOrder', 'filterDivision', 'filterReason', 'filterItem', 'filterStatus', 'filterDefectCount', 'filterCreateDate', 'filterUpdateDate'].some(p => url.searchParams.has(p) && url.searchParams.get(p) !== '');

    const stored = sessionStorage.getItem('filtersOpen');
    let shouldOpen = false;

    if (stored !== null) {
        shouldOpen = stored === 'true';
    } else if (hasFilters) {
        shouldOpen = true;
    }

    if (shouldOpen) {
        const section = document.getElementById('filterSection');
        const icon = document.getElementById('filterIcon');
        section.classList.add('open');
        icon.style.transform = 'rotate(180deg)';
        filtersOpen = true;
    }

    if (hasFilters) {
        const badge = document.getElementById('filterBadge');
        badge?.classList.remove('hidden');
    }

    const filterInputs = document.querySelectorAll('#filterForm [data-filter-input]');
    filterInputs.forEach(input => {
        input.addEventListener('input', updateFilterButtons);
    });
    updateFilterButtons();
});

function goToPage(page) {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    window.location.href = url.toString();
}

function changePageSize(size) {
    const url = new URL(window.location.href);
    url.searchParams.set('page', 0);
    url.searchParams.set('size', size);
    window.location.href = url.toString();
}

function clearFilters() {
    const url = new URL(window.location.href);
    ['filterNumber', 'filterCreator', 'filterEmployee', 'filterOrder', 'filterDivision', 'filterReason', 'filterItem', 'filterStatus', 'filterDefectCount', 'filterCreateDate', 'filterUpdateDate'].forEach(p => url.searchParams.delete(p));
    url.searchParams.set('page', 0);
    window.location.href = url.toString();
}
window.addEventListener('load', function () {
    setTimeout(function () {
        document.getElementById('preloader').classList.add('hidden');
    }, 300);
});

function openHistoryModal(requestId) {
    const modal = document.getElementById('historyModal');
    const loader = document.getElementById('historyLoader');
    const list = document.getElementById('historyList');
    const numberLabel = document.getElementById('modalRequestNumber');

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    loader.classList.remove('hidden');
    list.classList.add('hidden');
    list.innerHTML = '';
    numberLabel.textContent = 'Загрузка...';

    fetch(`/api/request/${requestId}/history`)
        .then(response => {
            if (!response.ok) throw new Error('Не удалось загрузить историю');
            return response.json();
        })
        .then(data => {
            loader.classList.add('hidden');
            list.classList.remove('hidden');
            renderHistory(data, list);
            if (data.length > 0 && data[0].requestData) {
                numberLabel.textContent = `Заявка №${data[0].requestData.requestNumber || ''}`;
            } else {
                numberLabel.textContent = 'Нет данных';
            }
        })
        .catch(error => {
            loader.classList.add('hidden');
            list.classList.remove('hidden');
            list.innerHTML = `
                <div class="text-center py-8">
                    <svg class="mx-auto h-10 w-10 text-red-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <p class="text-sm text-slate-500">${error.message}</p>
                </div>
            `;
        });
}

function closeHistoryModal() {
    const modal = document.getElementById('historyModal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function renderHistory(historyData, container) {
    if (!historyData || historyData.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-slate-500 text-sm">
                История изменений отсутствует
            </div>
        `;
        return;
    }

    container.innerHTML = historyData.map((entry, index) => {
        const isFirst = index === 0;
        const revisionType = entry.revisionType || 'Изменение';
        const revisionDate = entry.revisionDate
            ? new Date(entry.revisionDate).toLocaleString('ru-RU', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            })
            : '—';

        let statusClass = 'bg-slate-100 text-slate-700 ring-slate-500/20';
        let lineColor = 'border-slate-300';
        let dotColor = 'bg-slate-300';

        if (entry.requestData?.status === 'Закрыт') {
            statusClass = 'bg-green-100 text-green-800 ring-green-600/20';
            lineColor = 'border-green-500';
            dotColor = 'bg-green-500';
        } else if (entry.requestData?.status === 'В работе') {
            statusClass = 'bg-orange-100 text-orange-800 ring-orange-600/20';
            lineColor = 'border-orange-500';
            dotColor = 'bg-orange-500';
        } else if (entry.requestData?.status === 'Забракована') {
            statusClass = 'bg-red-100 text-red-800 ring-red-600/20';
            lineColor = 'border-red-500';
            dotColor = 'bg-red-500';
        } else if (entry.requestData?.status === 'Новый') {
            statusClass = 'bg-slate-100 text-slate-800 ring-slate-600/20';
            lineColor = 'border-slate-400';
            dotColor = 'bg-slate-400';
        }

        return `
            <div class="relative pl-6 pb-4 border-l-2 ${lineColor}">
                <div class="absolute -left-[6px] bottom-0 w-3 h-3 rounded-full ${dotColor} ring-2 ring-white shadow-sm"></div>

                <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                    <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">${revisionType}</span>
                    <span class="text-xs text-slate-400">${revisionDate}</span>
                    ${entry.changedBy ? `<span class="text-xs text-slate-500">— ${entry.changedBy}</span>` : ''}
                </div>

                <div class="bg-slate-50 rounded-xl p-3 space-y-2">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="text-xs font-medium text-slate-500">Статус:</span>
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ring-1 ${statusClass}">
                            ${entry.requestData?.status || '—'}
                        </span>
                    </div>
                    
                    ${entry.requestData?.qty != null ? `
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-medium text-slate-500">Кол-во:</span>
                            <span class="text-sm text-slate-700 font-medium">${entry.requestData.qty}</span>
                        </div>
                    ` : ''}
                    
                    ${entry.requestData?.description ? `
                        <div class="flex items-start gap-2">
                            <span class="text-xs font-medium text-slate-500 mt-0.5">Описание:</span>
                            <span class="text-sm text-slate-700">${entry.requestData.description}</span>
                        </div>
                    ` : ''}
                    
                    ${entry.requestData?.inconsistencies?.length ? `
                        <div class="flex flex-wrap items-center gap-1.5">
                            <span class="text-xs font-medium text-slate-500">Несоответствия:</span>
                            ${entry.requestData.inconsistencies.map(inc => `
                                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">${inc}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    ${entry.requestData?.images?.length ? `
                        <div class="pt-1">
                            <span class="text-xs font-medium text-slate-500">Изображения:</span>
                            <div class="flex flex-wrap gap-2 mt-1.5">
                                ${entry.requestData.images.map(img => `
                                    <img src="${img.imageUrl || img}" class="w-16 h-16 object-cover rounded-lg border border-slate-200 hover:scale-110 transition-transform cursor-pointer" alt="">
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeHistoryModal();
});



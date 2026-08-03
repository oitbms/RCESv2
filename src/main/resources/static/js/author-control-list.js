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
    loadEmployee();
    loadSubDivisions();
    loadSite();

    document.getElementById('saveId').addEventListener('click', () => {
        createAuthorControl();
    });
});


function clearFilters() {
    const url = new URL(window.location.href);
    ['filterNumber', 'filterCreator', 'filterEmployee', 'filterOrder', 'filterDivision', 'filterReason', 'filterItem', 'filterStatus', 'filterDefectCount', 'filterCreateDate', 'filterUpdateDate'].forEach(p => url.searchParams.delete(p));
    url.searchParams.set('page', 0);
    window.location.href = url.toString();
}


function closeModal(modalName) {
    const modal = document.getElementById(`${modalName}`);
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

async function loadEmployee() {
    try {
        const response = await fetch('/api/employees?param=constructor')
        if (!response.ok) throw new Error('Не удалось загрузить данные пользователей!');

        const employeeJson = await response.json();

        const selectElement = document.getElementById('employeeSelectId');

        selectElement.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Выберите пользователя';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        employeeJson.forEach(emp => {
            const option = document.createElement('option');
            option.value = JSON.stringify(emp);
            option.textContent = emp.name;
            option.dataset = emp.id;

            selectElement.appendChild(option);
        });
        return employeeJson;
    } catch (error) {
        console.error('Ошибка загрузки пользователей', error)
    }
}


async function loadSubDivisions() {
    try {
        const response = await fetch('/api/sub-divisions');
        if (!response.ok) throw new Error('Не удалось загрузить данные цехов!');

        const subDivision = await response.json();

        const selectElement = document.getElementById('subDivisionSelectId');

        selectElement.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Выберите цех';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        subDivision.forEach(subDiv => {
            const option = document.createElement('option');
            option.value = JSON.stringify(subDiv);
            option.textContent = subDiv.name;
            option.dataset.id = subDiv.id;
            selectElement.appendChild(option);
        });
        return subDivision;
    } catch (error) {
        console.error('Ошибка загрузки цехов:', error);
    }
}

async function loadSite() {
    try {

        const response = await fetch('/api/site')
        if (!response.ok) throw new Error("Не удалось загрузить список площадок");

        const siteJson = await response.json();

        const selectElement = document.getElementById('siteSelect');

        selectElement.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Выберите площадку';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        siteJson.forEach(siteEl => {
            const option = document.createElement('option');
            option.value = JSON.stringify(siteEl);
            option.textContent = siteEl.name;
            option.dataset.id = siteEl.id;
            selectElement.appendChild(option);
        });

        return siteJson;

    } catch (error) {
        console.error("Не удалось загрузить площадки", error)
    }
}

function createAuthorControl() {
    const subDivisionValue = document.getElementById('subDivisionSelectId').value;
    let subDivision;

    if (subDivisionValue && subDivisionValue !== 'null' && subDivisionValue !== 'undefined') {
        subDivision = JSON.parse(subDivisionValue);
    } else {
        subDivision = null;
    }


    const createDate = {
        site: JSON.parse(document.getElementById('siteSelect').value),
        inconsistency: document.getElementById('inconsistencySelect').value,
        customerOrderStrCode: document.getElementById('customerOrderStrCodeId').value,
        siteCode: document.getElementById('siteCodeId').value,
        employee: JSON.parse(document.getElementById('employeeSelectId').value),
        subDivision: subDivision,
        typeAuthor: document.getElementById('typeAuthor').value,
        statusAuthor: document.getElementById('statusId').value
    };

    fetch('/api/v1/author-control', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createDate)
    })
        .then(response => {
            if (!response.ok) throw new Error('Не удалось сохранить данные');
            return response.json();
        })
        .then(data => {
            location.reload();
        })
        .catch(error => {
            alert('Ошибка: ' + error.message);
        })
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal('authorControlModal');
});

function updateFilterButtons() {
    const inputs = document.querySelectorAll('#filterForm [data-filter-input]');
    const applyBtn = document.getElementById('applyFilterBtn');
    const clearBtn = document.getElementById('clearFilterBtn');

    const hasValue = Array.from(inputs).some(input => {
        if (input.tagName === 'SELECT') {
            return input.value !== '';
        }
        return input.value.trim() !== '';
    });

    if (applyBtn) applyBtn.disabled = !hasValue;
    if (clearBtn) clearBtn.disabled = !hasValue;
}

function resetFilters() {
    const form = document.getElementById('filterForm');
    const inputs = form.querySelectorAll('input, select');

    inputs.forEach(input => {
        if (input.tagName === 'INPUT') {
            if (input.type === 'text' || input.type === 'date') {
                input.value = '';
            }
        } else if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
        }
    });

    form.submit();
}

document.addEventListener('DOMContentLoaded', function () {
    const url = new URL(window.location.href);
    const filterParams = ['filterNumber', 'filterEmployee', 'filterOrder',
        'filterSubDivision', 'filterSubDivisionSite', 'filterStatus',
        'filterCreateDateFrom', 'filterCreateDateTo',
        'filterUpdateDateFrom', 'filterUpdateDateTo'];

    const hasFilters = filterParams.some(p => url.searchParams.has(p) && url.searchParams.get(p) !== '');

    const stored = sessionStorage.getItem('filtersOpen');
    let shouldOpen = false;

    if (stored !== null) {
        shouldOpen = stored === 'true';
    } else if (hasFilters) {
        shouldOpen = true;
    }

    if (shouldOpen) {
        const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasMenu'));
        offcanvas.show();
    }

    if (hasFilters) {
        const badge = document.getElementById('filterBadge');
        if (badge) {
            badge.classList.remove('hidden');
            const count = filterParams.filter(p => url.searchParams.has(p) && url.searchParams.get(p) !== '').length;
            badge.textContent = count;
        }
    }

    const filterInputs = document.querySelectorAll('#filterForm [data-filter-input]');
    filterInputs.forEach(input => {
        input.addEventListener('input', updateFilterButtons);
        input.addEventListener('change', updateFilterButtons);
    });

    updateFilterButtons();
});

document.addEventListener('shown.bs.offcanvas', function (event) {
    if (event.target.id === 'offcanvasMenu') {
        sessionStorage.setItem('filtersOpen', 'true');
    }
});

document.addEventListener('hidden.bs.offcanvas', function (event) {
    if (event.target.id === 'offcanvasMenu') {
        sessionStorage.setItem('filtersOpen', 'false');
    }
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
// Переключение вкладок «Оборудование» / «Здания» на странице списка без перезагрузки.
// Обе таблицы загружаются сразу (machines.ts и sub-division.ts), вкладка только показывает нужную.

type EquipmentTab = 'machines' | 'buildings';

const TAB_PATHS: Record<EquipmentTab, string> = {
    machines: '/machines',
    buildings: '/sub-division',
};

const TAB_TITLES: Record<EquipmentTab, string> = {
    machines: 'Управление станками',
    buildings: 'Управление зданиями',
};

function tabFromPath(pathname: string): EquipmentTab | null {
    const entry = (Object.keys(TAB_PATHS) as EquipmentTab[])
        .find(tab => TAB_PATHS[tab] === pathname.replace(/\/$/, ''));
    return entry ?? null;
}

function showTab(tab: EquipmentTab): void {
    document.querySelectorAll<HTMLElement>('[data-tab]').forEach(link => {
        const isActive = link.dataset.tab === tab;
        link.classList.toggle('active', isActive);
        link.setAttribute('aria-selected', String(isActive));
    });

    document.querySelectorAll<HTMLElement>('[data-tab-only]').forEach(el => {
        el.classList.toggle('d-none', el.dataset.tabOnly !== tab);
    });

    const title = document.getElementById('equipment-title');
    if (title) title.textContent = TAB_TITLES[tab];
    document.title = TAB_TITLES[tab];
    document.body.dataset.activeTab = tab;
}

document.addEventListener('DOMContentLoaded', () => {
    if (!document.body.dataset.activeTab) return;

    document.querySelectorAll<HTMLAnchorElement>('[data-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
            // Ctrl/Shift/средняя кнопка — пусть браузер откроет в новой вкладке как обычно
            if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
            e.preventDefault();

            const tab = link.dataset.tab as EquipmentTab;
            if (document.body.dataset.activeTab === tab) return;

            showTab(tab);
            history.pushState({tab}, '', TAB_PATHS[tab]);
        });
    });

    window.addEventListener('popstate', () => {
        const tab = tabFromPath(window.location.pathname);
        if (tab) showTab(tab);
    });
});

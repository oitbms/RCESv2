(() => {
  // src/main/resources/static/js/equipment-tabs.ts
  var TAB_PATHS = {
    machines: "/machines",
    buildings: "/sub-division"
  };
  var TAB_TITLES = {
    machines: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u0442\u0430\u043D\u043A\u0430\u043C\u0438",
    buildings: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0437\u0434\u0430\u043D\u0438\u044F\u043C\u0438"
  };
  function tabFromPath(pathname) {
    const entry = Object.keys(TAB_PATHS).find((tab) => TAB_PATHS[tab] === pathname.replace(/\/$/, ""));
    return entry != null ? entry : null;
  }
  function showTab(tab) {
    document.querySelectorAll("[data-tab]").forEach((link) => {
      const isActive = link.dataset.tab === tab;
      link.classList.toggle("active", isActive);
      link.setAttribute("aria-selected", String(isActive));
    });
    document.querySelectorAll("[data-tab-only]").forEach((el) => {
      el.classList.toggle("d-none", el.dataset.tabOnly !== tab);
    });
    const title = document.getElementById("equipment-title");
    if (title)
      title.textContent = TAB_TITLES[tab];
    document.title = TAB_TITLES[tab];
    document.body.dataset.activeTab = tab;
  }
  document.addEventListener("DOMContentLoaded", () => {
    if (!document.body.dataset.activeTab)
      return;
    document.querySelectorAll("[data-tab]").forEach((link) => {
      link.addEventListener("click", (e) => {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0)
          return;
        e.preventDefault();
        const tab = link.dataset.tab;
        if (document.body.dataset.activeTab === tab)
          return;
        showTab(tab);
        history.pushState({ tab }, "", TAB_PATHS[tab]);
      });
    });
    window.addEventListener("popstate", () => {
      const tab = tabFromPath(window.location.pathname);
      if (tab)
        showTab(tab);
    });
  });
})();
//# sourceMappingURL=equipment-tabs.js.map

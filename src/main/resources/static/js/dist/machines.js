(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

  // src/main/resources/static/js/core/http.ts
  var HttpError = class extends Error {
    constructor(status, serverMessage) {
      super(serverMessage != null ? serverMessage : `HTTP ${status}`);
      this.status = status;
      this.serverMessage = serverMessage;
    }
  };
  var NetworkError = class extends Error {
  };
  var STATUS_REASONS = {
    400: "\u043D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435",
    401: "\u043D\u0443\u0436\u043D\u043E \u0432\u043E\u0439\u0442\u0438 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0443",
    403: "\u043D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u043F\u0440\u0430\u0432",
    404: "\u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E",
    409: "\u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442 \u0434\u0430\u043D\u043D\u044B\u0445",
    413: "\u0444\u0430\u0439\u043B \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0439"
  };
  async function fetchJson(url, options = {}) {
    let response;
    try {
      response = await fetch(url, options);
    } catch (e) {
      throw new NetworkError(String(e));
    }
    if (response.redirected && new URL(response.url).pathname === "/login") {
      throw new HttpError(401, null);
    }
    if (!response.ok) {
      throw new HttpError(response.status, await readServerMessage(response));
    }
    if (response.status === 204) {
      return null;
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }
  async function readServerMessage(response) {
    var _a;
    const text = await response.text().catch(() => "");
    if (!text)
      return null;
    try {
      const body = JSON.parse(text);
      return ((_a = body.message) == null ? void 0 : _a.trim()) || null;
    } catch (e) {
      return null;
    }
  }
  function describeError(error, action) {
    var _a, _b;
    if (error instanceof HttpError) {
      const reason = (_b = (_a = error.serverMessage) != null ? _a : STATUS_REASONS[error.status]) != null ? _b : error.status >= 500 ? "\u0432\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u044F\u044F \u043E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430" : `\u043A\u043E\u0434 ${error.status}`;
      return `${action}: ${reason}`;
    }
    if (error instanceof NetworkError) {
      return `${action}: \u043D\u0435\u0442 \u0441\u0432\u044F\u0437\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043E\u043C`;
    }
    return `${action}.`;
  }

  // src/main/resources/static/js/core/other-section.ts
  function initOtherSection(options) {
    var _a;
    const textEl = document.getElementById("other-text");
    const listEl = document.getElementById("other-documents-list");
    if (!textEl || !listEl)
      return;
    let currentText = (_a = options.text) != null ? _a : "";
    const renderText = () => {
      textEl.textContent = currentText || "\u0422\u0435\u043A\u0441\u0442 \u043D\u0435 \u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D.";
      textEl.classList.toggle("text-muted", !currentText);
    };
    const renderFiles = (files) => {
      listEl.innerHTML = "";
      if (!files || files.length === 0) {
        const empty = document.createElement("li");
        empty.className = "list-group-item text-muted";
        empty.textContent = "PDF-\u0444\u0430\u0439\u043B\u044B \u043D\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u044B.";
        listEl.appendChild(empty);
        return;
      }
      files.forEach((file) => listEl.appendChild(createFileItem(file)));
    };
    const createFileItem = (file) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      const link = document.createElement("a");
      link.href = `${options.filesUrl}/${file.id}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = file.baseFileName;
      const name = document.createElement("div");
      name.className = "icon-text";
      name.innerHTML = '<i class="bi bi-file-earmark-pdf text-danger"></i>';
      name.appendChild(link);
      li.appendChild(name);
      if (options.canEdit) {
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn btn-sm btn-outline-danger";
        deleteButton.title = "\u0423\u0434\u0430\u043B\u0438\u0442\u044C";
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        deleteButton.addEventListener("click", async () => {
          if (!confirm(`\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0444\u0430\u0439\u043B \xAB${file.baseFileName}\xBB?`))
            return;
          try {
            await fetchJson(`${options.filesUrl}/${file.id}`, { method: "DELETE" });
            li.remove();
            if (listEl.children.length === 0)
              renderFiles([]);
            options.notify("\u0424\u0430\u0439\u043B \u0443\u0434\u0430\u043B\u0435\u043D.", "success");
          } catch (error) {
            console.error(error);
            options.notify(describeError(error, "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0444\u0430\u0439\u043B"), "danger");
          }
        });
        li.appendChild(deleteButton);
      }
      return li;
    };
    renderText();
    renderFiles(options.files);
    if (!options.canEdit)
      return;
    const editButton = document.getElementById("other-edit-button");
    const editor = document.getElementById("other-text-editor");
    const input = document.getElementById("other-text-input");
    const saveButton = document.getElementById("other-save-button");
    const cancelButton = document.getElementById("other-cancel-button");
    const filesInput = document.getElementById("other-files-input");
    const setEditing = (editing) => {
      editor == null ? void 0 : editor.classList.toggle("d-none", !editing);
      textEl.classList.toggle("d-none", editing);
      editButton == null ? void 0 : editButton.classList.toggle("d-none", editing);
    };
    editButton == null ? void 0 : editButton.addEventListener("click", () => {
      if (input)
        input.value = currentText;
      setEditing(true);
      input == null ? void 0 : input.focus();
    });
    cancelButton == null ? void 0 : cancelButton.addEventListener("click", () => setEditing(false));
    saveButton == null ? void 0 : saveButton.addEventListener("click", async () => {
      if (!input)
        return;
      saveButton.disabled = true;
      try {
        await fetchJson(`${options.apiBase}/other`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: input.value })
        });
        currentText = input.value.trim();
        renderText();
        setEditing(false);
        options.notify("\u0422\u0435\u043A\u0441\u0442 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D.", "success");
      } catch (error) {
        console.error(error);
        options.notify(describeError(error, "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0442\u0435\u043A\u0441\u0442"), "danger");
      } finally {
        saveButton.disabled = false;
      }
    });
    filesInput == null ? void 0 : filesInput.addEventListener("change", async () => {
      if (!filesInput.files || filesInput.files.length === 0)
        return;
      const formData = new FormData();
      Array.from(filesInput.files).forEach((file) => formData.append("files", file));
      try {
        await fetchJson(`${options.apiBase}/other/documents`, { method: "POST", body: formData });
        renderFiles(await options.reloadFiles());
        options.notify("\u0424\u0430\u0439\u043B\u044B \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u044B.", "success");
      } catch (error) {
        console.error(error);
        options.notify(describeError(error, "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0444\u0430\u0439\u043B\u044B"), "danger");
      } finally {
        filesInput.value = "";
      }
    });
  }

  // src/main/resources/static/js/core/list-scroll.ts
  var LIST_SCROLL_FROM = 10;
  function toggleListScroll(itemCount, tableBody, cardView) {
    var _a;
    const scroll = itemCount >= LIST_SCROLL_FROM;
    (_a = tableBody.closest(".table-responsive")) == null ? void 0 : _a.classList.toggle("list-scroll", scroll);
    cardView.classList.toggle("list-scroll", scroll);
  }

  // src/main/resources/static/js/core/list-filter.ts
  var normalize = (text) => text.toLowerCase().replace(/ё/g, "\u0435").trim();
  function initListFilter(options) {
    var _a;
    const { items, tableBody, cardView, searchInput, subDivisionSelect, emptyMessage } = options;
    const prepared = items.map((item) => __spreadProps(__spreadValues({}, item), { normalized: normalize(item.searchText) }));
    if (subDivisionSelect) {
      const names = [...new Set(items.map((i) => i.subDivisionName).filter((n) => !!n))].sort((a, b) => a.localeCompare(b, "ru"));
      subDivisionSelect.replaceChildren(new Option((_a = options.allLabel) != null ? _a : "\u0412\u0441\u0435 \u0446\u0435\u0445\u0430", ""), ...names.map((name) => new Option(name, name)));
    }
    const apply = () => {
      var _a2, _b;
      const words = normalize((_a2 = searchInput == null ? void 0 : searchInput.value) != null ? _a2 : "").split(/\s+/).filter(Boolean);
      const subDivision = (_b = subDivisionSelect == null ? void 0 : subDivisionSelect.value) != null ? _b : "";
      const visible = prepared.filter((item) => (!subDivision || item.subDivisionName === subDivision) && words.every((word) => item.normalized.includes(word)));
      tableBody.replaceChildren(...visible.map((item) => item.row));
      cardView.replaceChildren(...visible.map((item) => item.card));
      if (emptyMessage) {
        emptyMessage.textContent = items.length === 0 ? "\u0421\u043F\u0438\u0441\u043E\u043A \u043F\u0443\u0441\u0442." : "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E.";
        emptyMessage.classList.toggle("d-none", visible.length > 0);
      }
      toggleListScroll(visible.length, tableBody, cardView);
    };
    searchInput == null ? void 0 : searchInput.addEventListener("input", apply);
    subDivisionSelect == null ? void 0 : subDivisionSelect.addEventListener("change", apply);
    apply();
  }

  // src/main/resources/static/js/core/html.ts
  function escapeHtml(unsafe) {
    if (unsafe == null)
      return "";
    return String(unsafe).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  // src/main/resources/static/js/machines.ts
  var MachineManager = class {
    constructor() {
      this.apiUrl = "/api/v1/machines";
      this.employeeApiUrl = "/api/employees?subdivision=2";
      this.subDivisionApiUrl = "/api/sub-divisions";
      this.choicesInstances = {};
      this.imageModalInstance = null;
      this.canEdit = document.body.dataset.canEdit === "true";
      this.init();
    }
    init() {
      if (document.getElementById("machines-table-body")) {
        this.initListPage();
      } else if (document.getElementById("machine-form")) {
        this.initFormPage();
      } else if (document.getElementById("machine-content")) {
        this.initDetailsPage();
      }
    }
    async fetchData(url, options = {}) {
      return fetchJson(url, options);
    }
    showError(error, action) {
      console.error(action, error);
      this.showToast(describeError(error, action), "danger");
    }
    showLoading(show) {
      var _a;
      const indicator = (_a = document.getElementById("machines-loading-indicator")) != null ? _a : document.getElementById("loading-indicator");
      if (indicator) {
        indicator.style.display = show ? "block" : "none";
      }
    }
    async initListPage() {
      this.showLoading(true);
      try {
        const machines = await this.fetchData(this.apiUrl);
        const items = machines.map((machine) => {
          const name = escapeHtml(machine.name);
          const description = escapeHtml(machine.description);
          const subDivision = escapeHtml(machine.subDivisionName);
          const row = document.createElement("tr");
          row.innerHTML = `
                    <td>${name}</td>
                    <td class="tabular-nums">${machine.number}</td>
                    <td>${subDivision || "\u2014"}</td>
                    <td class="description-cell">${description || "\u2014"}</td>
                    <td>
                        <div class="d-flex justify-content-end gap-2">
                            <a href="/machines/${machine.number}" class="btn btn-sm btn-outline-secondary icon-text" title="\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440">
                                <i class="bi bi-eye"></i>
                            </a>
                            ${this.canEdit ? `<a href="/machines/${machine.number}/edit" class="btn btn-sm btn-outline-primary icon-text" title="\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C">
                                <i class="bi bi-pencil"></i>
                            </a>` : ""}
                        </div>
                    </td>
                `;
          const card = document.createElement("div");
          card.className = "card mb-3";
          card.innerHTML = `
                        <div>
                            <h5 class="card-title mt-2 ms-2">${name}</h5>
                            <h6 class="card-subtitle mb-2 ms-2 text-muted">\u0418\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u043D\u044B\u0439 \u043D\u043E\u043C\u0435\u0440: ${machine.number}</h6>
                            <p class="card-text ms-2 mb-1">\u0426\u0435\u0445: ${subDivision || "\u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D"}</p>
                            <p class="card-text ms-2">\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435: ${description || "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442."}</p>
                            <div class="d-flex justify-content-end gap-2 mt-3 mb-2 me-2">
                                <a href="/machines/${machine.number}" class="btn btn-sm btn-outline-secondary icon-text">
                                    <i class="bi bi-eye"></i>
                                    <span>\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440</span>
                                </a>
                                ${this.canEdit ? `<a href="/machines/${machine.number}/edit" class="btn btn-sm btn-outline-primary icon-text">
                                    <i class="bi bi-pencil"></i>
                                    <span>\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C</span>
                                </a>` : ""}
                            </div>
                        </div>
                `;
          return {
            searchText: [machine.name, machine.number, machine.description, machine.subDivisionName].join(" "),
            subDivisionName: machine.subDivisionName,
            row,
            card
          };
        });
        initListFilter({
          items,
          tableBody: document.getElementById("machines-table-body"),
          cardView: document.getElementById("machines-card-view"),
          searchInput: document.getElementById("machines-search"),
          subDivisionSelect: document.getElementById("machines-subdivision-filter"),
          emptyMessage: document.getElementById("machines-empty")
        });
      } catch (error) {
        this.showError(error, "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0441\u0442\u0430\u043D\u043A\u043E\u0432");
      } finally {
        this.showLoading(false);
      }
    }
    async initFormPage() {
      var _a;
      const form = document.getElementById("machine-form");
      const formTitle = document.getElementById("form-title");
      const numberInput = document.getElementById("number");
      const pathParts = window.location.pathname.split("/");
      const machineNumber = pathParts[pathParts.length - 2];
      const isEditMode = pathParts[pathParts.length - 1] === "edit" && machineNumber;
      await this.populateEmployeeSelects();
      await this.getSubDivisionSelects();
      if (isEditMode) {
        formTitle.textContent = "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0441\u0442\u0430\u043D\u043A\u0430";
        form.querySelectorAll("[data-create-only]").forEach((el) => el.classList.add("d-none"));
        form.querySelectorAll("[data-edit-only]").forEach((el) => el.classList.remove("d-none"));
        this.showLoading(true);
        try {
          const machine = await this.fetchData(`${this.apiUrl}/${machineNumber}`);
          document.getElementById("name").value = machine.name;
          numberInput.value = machine.number.toString();
          numberInput.readOnly = true;
          document.getElementById("description").value = machine.description || "";
          this.selectOptions("responsibleEmployees", machine.responsibleEmployeesList || []);
          this.selectOptions("admittedEmployees", machine.admittedEmployeesList || []);
          if (machine.subDivisionId != null) {
            (_a = this.choicesInstances["subDivision"]) == null ? void 0 : _a.setChoiceByValue(String(machine.subDivisionId));
          }
        } catch (error) {
          this.showError(error, "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u0441\u0442\u0430\u043D\u043A\u0430");
        } finally {
          this.showLoading(false);
        }
      }
      form.addEventListener("submit", async (e) => {
        var _a2, _b, _c, _d;
        e.preventDefault();
        const url = isEditMode ? `${this.apiUrl}/${machineNumber}` : this.apiUrl;
        try {
          if (isEditMode) {
            const responsibleEmployees = ((_a2 = this.choicesInstances["responsibleEmployees"]) == null ? void 0 : _a2.getValue(true)) || [];
            const admittedEmployees = ((_b = this.choicesInstances["admittedEmployees"]) == null ? void 0 : _b.getValue(true)) || [];
            const machineData = {
              name: form.elements.namedItem("name").value,
              number: Number(form.elements.namedItem("number").value),
              description: form.elements.namedItem("description").value,
              subDivisionId: Number(form.elements.namedItem("subDivisionId").value) || null,
              responsibleEmployeesList: responsibleEmployees.map((name) => ({ name })),
              admittedEmployeesList: admittedEmployees.map((name) => ({ name }))
            };
            await this.fetchData(url, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(machineData)
            });
          } else {
            const formData = new FormData(form);
            const responsibleEmployees = ((_c = this.choicesInstances["responsibleEmployees"]) == null ? void 0 : _c.getValue(true)) || [];
            const admittedEmployees = ((_d = this.choicesInstances["admittedEmployees"]) == null ? void 0 : _d.getValue(true)) || [];
            formData.delete("responsibleEmployeesList");
            formData.delete("admittedEmployeesList");
            responsibleEmployees.forEach((name) => formData.append("responsibleEmployeesList", name));
            admittedEmployees.forEach((name) => formData.append("admittedEmployeesList", name));
            await this.fetchData(url, {
              method: "POST",
              body: formData
            });
          }
          this.showToast(`\u0421\u0442\u0430\u043D\u043E\u043A \u0443\u0441\u043F\u0435\u0448\u043D\u043E ${isEditMode ? "\u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D" : "\u0441\u043E\u0437\u0434\u0430\u043D"}!`, "success");
          window.location.href = "/machines";
        } catch (error) {
          this.showError(error, "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0438 \u0441\u0442\u0430\u043D\u043A\u0430");
        }
      });
    }
    async getSubDivisionSelects() {
      try {
        const subDivision = await this.fetchData(this.subDivisionApiUrl);
        const subDivisionSelect = document.getElementById("subDivision");
        subDivisionSelect.innerHTML = "";
        subDivision.forEach((sub) => {
          const option = new Option(sub.name, sub.id);
          subDivisionSelect.add(option);
        });
        if (this.choicesInstances["subDivision"])
          this.choicesInstances["subDivision"].destroy();
        const choicesConfig = {
          removeItemButton: true,
          shouldSort: false,
          placeholder: true,
          placeholderValue: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430...",
          noChoicesText: "\u041D\u0435\u0442 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u043E\u0432 \u0434\u043B\u044F \u0432\u044B\u0431\u043E\u0440\u0430",
          itemSelectText: "\u041D\u0430\u0436\u043C\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u0432\u044B\u0431\u0440\u0430\u0442\u044C",
          searchPlaceholderValue: "\u041D\u0430\u0447\u043D\u0438\u0442\u0435 \u0432\u0432\u043E\u0434 \u0434\u043B\u044F \u043F\u043E\u0438\u0441\u043A\u0430...",
          noResultsText: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E"
        };
        this.choicesInstances["subDivision"] = new Choices(subDivisionSelect, choicesConfig);
      } catch (error) {
        console.error("Failed to load subDivision:", error);
      }
    }
    async populateEmployeeSelects() {
      try {
        const employees = await this.fetchData(this.employeeApiUrl);
        const responsibleSelect = document.getElementById("responsibleEmployees");
        const admittedSelect = document.getElementById("admittedEmployees");
        responsibleSelect.innerHTML = "";
        admittedSelect.innerHTML = "";
        employees.forEach((emp) => {
          const option = new Option(emp.name, emp.name);
          if (emp.role.includes("MASTER")) {
            responsibleSelect.add(option);
          } else {
            admittedSelect.add(option);
          }
        });
        if (this.choicesInstances["responsibleEmployees"])
          this.choicesInstances["responsibleEmployees"].destroy();
        if (this.choicesInstances["admittedEmployees"])
          this.choicesInstances["admittedEmployees"].destroy();
        const choicesConfig = {
          removeItemButton: true,
          shouldSort: false,
          placeholder: true,
          placeholderValue: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430...",
          noChoicesText: "\u041D\u0435\u0442 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u043E\u0432 \u0434\u043B\u044F \u0432\u044B\u0431\u043E\u0440\u0430",
          itemSelectText: "\u041D\u0430\u0436\u043C\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u0432\u044B\u0431\u0440\u0430\u0442\u044C",
          searchPlaceholderValue: "\u041D\u0430\u0447\u043D\u0438\u0442\u0435 \u0432\u0432\u043E\u0434 \u0434\u043B\u044F \u043F\u043E\u0438\u0441\u043A\u0430...",
          noResultsText: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E"
        };
        this.choicesInstances["responsibleEmployees"] = new Choices(responsibleSelect, choicesConfig);
        this.choicesInstances["admittedEmployees"] = new Choices(admittedSelect, choicesConfig);
      } catch (error) {
        this.showError(error, "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439");
      }
    }
    selectOptions(selectId, employeesToSelect) {
      const choiceInstance = this.choicesInstances[selectId];
      if (choiceInstance) {
        const employeeNames = employeesToSelect.map((e) => e.name);
        setTimeout(() => {
          choiceInstance.setChoiceByValue(employeeNames);
        }, 150);
      }
    }
    async initDetailsPage() {
      var _a, _b;
      const contentDiv = document.getElementById("machine-content");
      const pathParts = window.location.pathname.split("/");
      const machineNumber = pathParts[pathParts.length - 1];
      if (!machineNumber)
        return;
      const imageModalEl = document.getElementById("imageViewerModal");
      if (imageModalEl) {
        const modal = window.bootstrap.Modal.getOrCreateInstance(imageModalEl);
        this.imageModalInstance = modal;
        const closeButton = imageModalEl.querySelector(".btn-close");
        if (closeButton) {
          closeButton.addEventListener("click", () => {
            modal.hide();
          });
        }
        imageModalEl.addEventListener("click", (e) => {
          if (e.target === imageModalEl) {
            modal.hide();
          }
        });
      }
      this.showLoading(true);
      try {
        const machine = await this.fetchData(`${this.apiUrl}/${machineNumber}`);
        document.getElementById("machine-name").textContent = machine.name;
        const editButton = document.getElementById("edit-button");
        if (editButton)
          editButton.href = `/machines/${machine.number}/edit`;
        document.getElementById("machine-subdivision-name").textContent = machine.subDivisionName || "\u0426\u0435\u0445 \u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D.";
        const passportLink = document.getElementById("machine-passport");
        if (machine.passportId) {
          passportLink.href = `/api/v1/machines/documents/${machine.passportId}`;
          passportLink.textContent = "\u041E\u0442\u043A\u0440\u044B\u0442\u044C";
        } else {
          passportLink.removeAttribute("href");
          passportLink.textContent = "\u041D\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D";
        }
        document.getElementById("machine-number").textContent = machine.number.toString();
        document.getElementById("machine-description").textContent = machine.description || "\u041D\u0435\u0442 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u044F.";
        this.renderList("responsible-employees-list", machine.responsibleEmployeesList, "\u0421\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0438 \u043D\u0435 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u044B.");
        this.renderList("admitted-employees-list", machine.admittedEmployeesList, "\u0421\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0438 \u043D\u0435 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u044B.");
        this.renderDocumentList("documents-list", machine.pdfs, "\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u044B \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B.");
        this.renderPhotoGallery("photos-gallery", machine.imageUrls, "\u0424\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B.");
        this.generateQrCode(machine.number);
        initOtherSection({
          apiBase: `${this.apiUrl}/${machine.number}`,
          filesUrl: `${this.apiUrl}/documents`,
          text: machine.otherText,
          files: machine.otherPdfs,
          canEdit: this.canEdit,
          reloadFiles: async () => (await this.fetchData(`${this.apiUrl}/${machine.number}`)).otherPdfs,
          notify: (message, type) => this.showToast(message, type)
        });
        (_a = document.getElementById("delete-button")) == null ? void 0 : _a.addEventListener("click", async () => {
          if (confirm(`\u0412\u044B \u0443\u0432\u0435\u0440\u0435\u043D\u044B, \u0447\u0442\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0441\u0442\u0430\u043D\u043E\u043A "${machine.name}"?`)) {
            try {
              await this.fetchData(`${this.apiUrl}/${machine.number}`, { method: "DELETE" });
              this.showToast("\u0421\u0442\u0430\u043D\u043E\u043A \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0434\u0430\u043B\u0435\u043D.", "success");
              window.location.href = "/machines";
            } catch (error) {
              this.showError(error, "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0441\u0442\u0430\u043D\u043E\u043A");
            }
          }
        });
        (_b = document.getElementById("upload-documents-button")) == null ? void 0 : _b.addEventListener("click", async () => {
          const fileInput = document.getElementById("new-documents");
          if (fileInput.files && fileInput.files.length > 0) {
            const formData = new FormData();
            for (const file of Array.from(fileInput.files)) {
              formData.append("files", file);
            }
            try {
              await this.fetchData(`${this.apiUrl}/${machine.number}/documents`, {
                method: "POST",
                body: formData
              });
              const updated = await this.fetchData(`${this.apiUrl}/${machine.number}`);
              this.renderDocumentList("documents-list", updated.pdfs, "\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u044B \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B.");
              const modalEl = document.getElementById("add-document-modal");
              const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
              modal.hide();
              fileInput.value = "";
              this.showToast("\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u044B \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u044B.", "success");
            } catch (error) {
              this.showError(error, "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u043E\u0432");
            }
          }
        });
        contentDiv.style.display = "block";
      } catch (error) {
        contentDiv.innerHTML = '<div class="alert alert-danger">\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u0441\u0442\u0430\u043D\u043A\u0430.</div>';
        contentDiv.style.display = "block";
      } finally {
        this.showLoading(false);
      }
    }
    renderList(elementId, items, emptyMessage) {
      const listElement = document.getElementById(elementId);
      listElement.innerHTML = "";
      if (!items || items.length === 0) {
        listElement.innerHTML = `<li class="list-group-item text-muted">${emptyMessage}</li>`;
        return;
      }
      items.forEach((item) => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        const initials = item.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
        li.innerHTML = `
                <div class="employee-item">
                    <div class="avatar-placeholder">${initials}</div>
                    <span>${item.name}</span>
                </div>
            `;
        listElement.appendChild(li);
      });
    }
    renderPhotoGallery(elementId, items, emptyMessage) {
      const galleryElement = document.getElementById(elementId);
      galleryElement.innerHTML = "";
      if (!items || items.length === 0) {
        galleryElement.innerHTML = `<div class="col"><p class="text-muted">${emptyMessage}</p></div>`;
        return;
      }
      const modalImageEl = document.getElementById("modalImage");
      items.forEach((item) => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-3";
        col.innerHTML = `
                    <div class="card">
                        <img src="${item.data}" class="img-fluid img-thumbnail" alt="${item.name}" style="height: 200px; object-fit: cover;">
                    </div>
                `;
        col.addEventListener("click", () => {
          if (modalImageEl && this.imageModalInstance) {
            modalImageEl.src = item.data;
            this.imageModalInstance.show();
          }
        });
        galleryElement.appendChild(col);
      });
    }
    // private renderDocumentList(elementId: string, items: DocumentFileMachine[] | undefined, emptyMessage: string): void {
    //     const listElement = document.getElementById(elementId)!;
    //     listElement.innerHTML = '';
    //     if (!items || items.length === 0) {
    //         listElement.innerHTML = `<li class="list-group-item text-muted">${emptyMessage}</li>`;
    //         return;
    //     }
    //     items.forEach(item => {
    //         const li = document.createElement('li');
    //         li.className = 'list-group-item d-flex justify-content-between align-items-center';
    //         li.innerHTML = `
    //                         <div class="icon-text">
    //                             <i class="bi bi-file-earmark-pdf text-danger"></i>
    //                             <a href="/api/v1/machines/documents/${item.id}" target="_blank" rel="noopener noreferrer">${item.baseFileName}</a>
    //                         </div>
    //                         <button class="btn btn-sm btn-outline-danger delete-document-btn" data-doc-id="${item.id}" title="Удалить">
    //                             <i class="bi bi-trash"></i>
    //                         </button>
    //                     `;
    //         listElement.appendChild(li);
    //     });
    //
    //     listElement.querySelectorAll('.delete-document-btn').forEach(button => {
    //         button.addEventListener('click', async (e) => {
    //             const docId = (e.target as HTMLElement).dataset.docId;
    //             if (docId && confirm('Вы уверены, что хотите удалить этот документ?')) {
    //                 try {
    //                     await this.fetchData(`/api/v1/machines/documents/${docId}`, {method: 'DELETE'});
    //                     alert('Документ удален.');
    //                     location.reload();
    //                 } catch (error) {
    //                     console.error('Failed to delete document:', error);
    //                     alert('Не удалось удалить документ.');
    //                 }
    //             }
    //         });
    //     });
    //
    //     listElement.querySelectorAll('.delete-document-btn').forEach(button => {
    //         button.addEventListener('click', async (e) => {
    //             const btn = (e.currentTarget as HTMLElement);
    //             const docId = btn.dataset.docId;
    //             if (docId && confirm('Вы уверены, что хотите удалить этот документ?')) {
    //                 try {
    //                     await this.fetchData(`/api/v1/machines/documents/${docId}`, {method: 'DELETE'});
    //
    //                     const li = btn.closest('li');
    //                     li?.remove();
    //
    //                     if (listElement.children.length === 0) {
    //                         listElement.innerHTML = '<li class="list-group-item text-muted">Документы не найдены.</li>';
    //                     }
    //                 } catch (error) {
    //                     console.error('Failed to delete document:', error);
    //                     this.showToast('Ошибка при загрузке документов.', 'danger');
    //                 }
    //             }
    //         });
    //     });
    // }
    renderDocumentList(elementId, items, emptyMessage) {
      const listElement = document.getElementById(elementId);
      listElement.innerHTML = "";
      if (!items || items.length === 0) {
        listElement.innerHTML = `<li class="list-group-item text-muted">${emptyMessage}</li>`;
        return;
      }
      items.forEach((item) => this.appendDocumentItem(listElement, item));
    }
    appendDocumentItem(listElement, item) {
      var _a;
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <div class="icon-text">
            <i class="bi bi-file-earmark-pdf text-danger"></i>
            <a href="/api/v1/machines/documents/${item.id}" target="_blank" rel="noopener noreferrer">${item.baseFileName}</a>
        </div>
        ${this.canEdit ? `<button class="btn btn-sm btn-outline-danger delete-document-btn" data-doc-id="${item.id}" title="\u0423\u0434\u0430\u043B\u0438\u0442\u044C">
            <i class="bi bi-trash"></i>
        </button>` : ""}
    `;
      listElement.appendChild(li);
      (_a = li.querySelector(".delete-document-btn")) == null ? void 0 : _a.addEventListener("click", async (e) => {
        const btn = e.currentTarget;
        const docId = btn.dataset.docId;
        if (docId && confirm("\u0412\u044B \u0443\u0432\u0435\u0440\u0435\u043D\u044B, \u0447\u0442\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u043E\u0442 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442?")) {
          try {
            await this.fetchData(`/api/v1/machines/documents/${docId}`, { method: "DELETE" });
            li.remove();
            if (listElement.children.length === 0) {
              listElement.innerHTML = '<li class="list-group-item text-muted">\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u044B \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B.</li>';
            }
            this.showToast("\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442 \u0443\u0434\u0430\u043B\u0435\u043D.", "success");
          } catch (error) {
            this.showError(error, "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442");
          }
        }
      });
    }
    generateQrCode(machineNumber) {
      const qrCodeCanvas = document.getElementById("qr-code-canvas");
      const downLoadQrBtn = document.getElementById("download-qr-btn");
      if (!qrCodeCanvas || !downLoadQrBtn) {
        console.error("\u042D\u043B\u0435\u043C\u0435\u043D\u0442\u044B \u0434\u043B\u044F QR-\u043A\u043E\u0434\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B.");
        return;
      }
      const machineLink = `http://web.bormash.ru:2005/machines/${machineNumber}`;
      QRCode.toCanvas(qrCodeCanvas, machineLink, { width: 200, margin: 1 }, (error) => {
        if (error) {
          console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0438 QR-\u043A\u043E\u0434\u0430:", error);
        } else {
          downLoadQrBtn.href = qrCodeCanvas.toDataURL("image/png");
        }
      });
    }
    showToast(message, type = "success") {
      const toastEl = document.getElementById("app-toast");
      if (!toastEl) {
        alert(message);
        return;
      }
      const bodyEl = document.getElementById("app-toast-body");
      toastEl.classList.remove("bg-success", "bg-danger");
      toastEl.classList.add(type === "success" ? "bg-success" : "bg-danger");
      bodyEl.textContent = message;
      const toast = window.bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3e3 });
      toast.show();
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    new MachineManager();
  });
})();
//# sourceMappingURL=machines.js.map

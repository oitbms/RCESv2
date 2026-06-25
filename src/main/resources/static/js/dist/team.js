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

  // src/main/resources/static/js/core/notifications.ts
  var CONTAINER_ID = "notifications-container";
  function ensureNotificationContainer() {
    let container = document.getElementById(CONTAINER_ID);
    if (!container) {
      container = document.createElement("div");
      container.id = CONTAINER_ID;
      container.setAttribute("popover", "manual");
      document.body.appendChild(container);
    }
    return container;
  }
  function showNotification(message, type, params, error) {
    try {
      const text = params ? message.replace(/{(\w+)}/g, (_, key) => {
        var _a;
        return (_a = params[key]) != null ? _a : "";
      }) : message;
      const container = ensureNotificationContainer();
      if (!container)
        return;
      const notification = document.createElement("div");
      notification.className = `notification ${type}`;
      notification.innerHTML = `<div class="msg">${text}</div>`;
      container.appendChild(notification);
      if (!container.matches(":popover-open")) {
        container.showPopover();
      }
      if (error)
        console.error(error);
      setTimeout(() => notification.classList.add("show"), 10);
      setTimeout(() => {
        notification.classList.remove("show");
        notification.classList.add("hiding");
        setTimeout(() => {
          notification.remove();
          if (container.children.length === 0) {
            container.hidePopover();
          }
        }, 350);
      }, 3e3);
    } catch (e) {
      console.error(e);
    }
  }

  // src/main/resources/static/js/core/api.ts
  async function requestToApi(url, method, body) {
    return $.ajax({
      url,
      method,
      contentType: body instanceof FormData ? false : "application/json",
      processData: !(body instanceof FormData),
      data: body instanceof FormData ? body : JSON.stringify(body)
    }).catch((xhr) => {
      var _a, _b, _c;
      const errorResponse = xhr.responseJSON;
      const message = (_b = (_a = errorResponse == null ? void 0 : errorResponse.message) != null ? _a : xhr.statusText) != null ? _b : "\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u043F\u0440\u043E\u0441\u0430";
      const notificationType = (_c = errorResponse == null ? void 0 : errorResponse.notificationType) != null ? _c : "error" /* ERROR */;
      showNotification(message, notificationType);
      throw xhr;
    });
  }

  // src/main/resources/static/js/core/files.ts
  function appendQueryParams(url, params) {
    if (!params)
      return url;
    if (typeof params === "string") {
      return url + (params.startsWith("?") ? params : `?${params}`);
    }
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        value.forEach((v) => search.append(key, String(v)));
      } else if (value != null) {
        search.append(key, String(value));
      }
    }
    return `${url}?${search.toString()}`;
  }
  async function downloadFilesFromDto(response) {
    const files = Array.isArray(response) ? response : [response];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const binaryString = atob(file.data);
      const uint8Array = new Uint8Array(binaryString.length);
      for (let j = 0; j < binaryString.length; j++) {
        uint8Array[j] = binaryString.charCodeAt(j);
      }
      const blob = new Blob([uint8Array]);
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 250);
      if (i < files.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1250));
      }
    }
  }

  // src/main/resources/static/js/core/html.ts
  function escapeHtml(unsafe) {
    if (unsafe == null)
      return "";
    return String(unsafe).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  // src/main/resources/static/js/core/lock.ts
  function createAsyncLock() {
    const locks = /* @__PURE__ */ new Map();
    return (fn) => {
      const wrapped = async (...args) => {
        const key = fn.name || "anonymous";
        if (locks.get(key))
          return;
        locks.set(key, true);
        try {
          return await fn(...args);
        } finally {
          locks.set(key, false);
        }
      };
      return wrapped;
    };
  }

  // src/main/resources/static/js/base/cache.ts
  var CacheBormashImpl = class {
    constructor() {
      this.endpoints = {
        employee: "/api/employees",
        subDivision: "/api/sub-divisions",
        team: "/api/team/get-page"
      };
    }
    async get(key) {
      const cached = sessionStorage.getItem(key);
      if (cached) {
        return JSON.parse(cached);
      }
      const endpoint = this.endpoints[key];
      if (!endpoint) {
        throw new Error(`\u0422\u0430\u043A\u043E\u0433\u043E api \u043D\u0435\u0442: ${key}`);
      }
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`\u0412\u043E\u0437\u043D\u0438\u043A\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430: ${response.status}`);
      }
      const data = await response.json();
      this.set(key, data);
      return data;
    }
    set(key, data) {
      sessionStorage.setItem(key, JSON.stringify(data));
      return this;
    }
  };

  // src/main/resources/static/js/base/dialog.ts
  var DialogImpl = class {
    constructor() {
      this.activeDialogs = /* @__PURE__ */ new Map();
      this.BASE_Z_INDEX = 999;
      this.BACKDROP_Z_INDEX = 998;
      const rootStyle = getComputedStyle(document.documentElement);
      const cssZIndex = rootStyle.getPropertyValue("--dialog-z-index");
      this.currentZIndex = cssZIndex ? parseInt(cssZIndex) : this.BASE_Z_INDEX;
    }
    open(dialogId, options = {}) {
      const dialogElement = document.getElementById(dialogId);
      if (!dialogElement) {
        console.error(`\u0414\u0438\u0430\u043B\u043E\u0433 \u0441 id ${dialogId} \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D`);
        return;
      }
      if (this.isOpen(dialogId)) {
        return;
      }
      if (options.clearFields !== false) {
        this.clearDialog(dialogId);
      }
      dialogElement.style.zIndex = this.currentZIndex.toString();
      if (this.activeDialogs.size === 0) {
        document.body.classList.add("no-scroll");
        this.addBackdrop();
      } else {
        this.activeDialogs.forEach((_, id) => {
          const el = document.getElementById(id);
          if (el)
            el.style.display = "none";
        });
      }
      dialogElement.show();
      this.activeDialogs.set(dialogId, this.currentZIndex);
      this.currentZIndex++;
      document.documentElement.style.setProperty("--dialog-z-index", this.currentZIndex.toString());
      this.setupCloseHandlers(dialogId, options.onClose);
      if (options.onOpen) {
        options.onOpen();
      }
    }
    close(dialogId) {
      var _a;
      const dialogElement = document.getElementById(dialogId);
      if (!dialogElement)
        return;
      (_a = dialogElement.close) == null ? void 0 : _a.call(dialogElement);
      dialogElement.style.display = "";
      this.activeDialogs.delete(dialogId);
      if (this.activeDialogs.size === 0) {
        document.body.classList.remove("no-scroll");
        this.removeBackdrop();
        const rootStyle = getComputedStyle(document.documentElement);
        const cssZIndex = rootStyle.getPropertyValue("--dialog-z-index");
        this.currentZIndex = cssZIndex ? parseInt(cssZIndex) : this.BASE_Z_INDEX;
      } else {
        const maxZIndex = Math.max(...Array.from(this.activeDialogs.values()));
        this.currentZIndex = maxZIndex + 1;
        document.documentElement.style.setProperty("--dialog-z-index", this.currentZIndex.toString());
        let topDialogId = "";
        this.activeDialogs.forEach((zIndex, id) => {
          if (zIndex === maxZIndex)
            topDialogId = id;
        });
        if (topDialogId) {
          const topDialog = document.getElementById(topDialogId);
          if (topDialog) {
            topDialog.style.removeProperty("display");
          }
        }
      }
    }
    clearDialog(dialogId) {
      const dialog = document.getElementById(dialogId);
      if (!dialog)
        return;
      const inputs = dialog.querySelectorAll("input[name], textarea[name], select[name]");
      inputs.forEach((input) => {
        var _a;
        const htmlInput = input;
        if (htmlInput.type === "file") {
          const newInput = htmlInput.cloneNode(false);
          (_a = htmlInput.parentNode) == null ? void 0 : _a.replaceChild(newInput, htmlInput);
        } else {
          htmlInput.value = "";
        }
      });
      const fileList = dialog.querySelector(".file-list");
      if (fileList) {
        fileList.innerHTML = "";
      }
      const localCache = window.localCache;
      if (localCache) {
        localCache.delete("validFileMap");
        localCache.delete("imagesMap");
      }
    }
    setupCloseHandlers(dialogId, onCloseCallback) {
      const dialogElement = document.getElementById(dialogId);
      if (!dialogElement)
        return;
      const handleBackdropClick = (e) => {
        const rect = dialogElement.getBoundingClientRect();
        const isInDialog = rect.top <= e.clientY && e.clientY <= rect.top + rect.height && rect.left <= e.clientX && e.clientX <= rect.left + rect.width;
        if (!isInDialog) {
          this.close(dialogId);
          if (onCloseCallback)
            onCloseCallback();
        }
      };
      const handleKeyDown = (e) => {
        if (e.key === "Escape" && this.isOpen(dialogId)) {
          const maxZIndex = Math.max(...Array.from(this.activeDialogs.values()));
          const currentZIndex = this.activeDialogs.get(dialogId);
          if (currentZIndex === maxZIndex) {
            e.preventDefault();
            this.close(dialogId);
            if (onCloseCallback)
              onCloseCallback();
          }
        }
      };
      const el = dialogElement;
      if (el._dialogBackdropClick)
        dialogElement.removeEventListener("click", el._dialogBackdropClick);
      if (el._dialogKeyDown)
        document.removeEventListener("keydown", el._dialogKeyDown);
      dialogElement.addEventListener("click", handleBackdropClick);
      document.addEventListener("keydown", handleKeyDown);
      el._dialogBackdropClick = handleBackdropClick;
      el._dialogKeyDown = handleKeyDown;
      const cancelBtn = dialogElement.querySelector('[name="closeDialog"], #cancelButton');
      if (cancelBtn) {
        const btn = cancelBtn;
        if (btn._dialogCancelClick)
          cancelBtn.removeEventListener("click", btn._dialogCancelClick);
        const handleCancel = () => {
          this.close(dialogId);
          if (onCloseCallback)
            onCloseCallback();
        };
        cancelBtn.addEventListener("click", handleCancel);
        btn._dialogCancelClick = handleCancel;
      }
    }
    addBackdrop() {
      if (!document.querySelector(".backdrop")) {
        const backdrop = document.createElement("div");
        backdrop.className = "backdrop";
        backdrop.style.zIndex = this.BACKDROP_Z_INDEX.toString();
        document.body.appendChild(backdrop);
      }
    }
    removeBackdrop() {
      const backdrop = document.querySelector(".backdrop");
      if (backdrop) {
        backdrop.remove();
      }
    }
    isOpen(dialogId) {
      const dialogElement = document.getElementById(dialogId);
      if (!dialogElement)
        return false;
      return this.activeDialogs.has(dialogId);
    }
    closeAll() {
      const dialogIds = Array.from(this.activeDialogs.keys());
      dialogIds.forEach((dialogId) => {
        var _a;
        const dialogElement = document.getElementById(dialogId);
        if (dialogElement) {
          (_a = dialogElement.close) == null ? void 0 : _a.call(dialogElement);
          dialogElement.style.display = "";
        }
      });
      this.activeDialogs.clear();
      document.body.classList.remove("no-scroll");
      this.removeBackdrop();
      const rootStyle = getComputedStyle(document.documentElement);
      const cssZIndex = rootStyle.getPropertyValue("--dialog-z-index");
      this.currentZIndex = cssZIndex ? parseInt(cssZIndex) : this.BASE_Z_INDEX;
    }
  };

  // src/main/resources/static/js/base/dialogTemplates.ts
  function confirmDialogTemplate() {
    return `
    <dialog id="confirmDialog" class="confirm-dialog">
        <div class="confirm-content">
            <div class="confirm-message" id="confirmMessage"></div>
            <div class="confirm-buttons">
                <button class="confirm-btn confirm-cancel" id="confirmCancel">\u041E\u0442\u043C\u0435\u043D\u0430</button>
                <button class="confirm-btn confirm-ok" id="confirmOk">\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C</button>
            </div>
        </div>
    </dialog>
    `;
  }
  function printDialogTemplate(reports) {
    const options = (reports || []).map((r) => `<option value="${r.api}">${r.name}</option>`).join("");
    return `
    <dialog id="printDialog" class="print-dialog">
        <div class="print-content">
            <h3>\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043E\u0442\u0447\u0451\u0442 \u0438 \u0444\u043E\u0440\u043C\u0430\u0442</h3>
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
                <button id="printCancel">\u041E\u0442\u043C\u0435\u043D\u0430</button>
                <button id="printOk">\u041F\u0435\u0447\u0430\u0442\u044C</button>
            </div>
        </div>
    </dialog>
    `;
  }

  // src/main/resources/static/js/base/base.ts
  var Base = class {
    constructor(rowContainer, itemsPerPage = Infinity, visibleRow = Infinity, ...initCallbacks) {
      this.asyncLock = createAsyncLock();
      this.handlers = [];
      this.selectedRows = /* @__PURE__ */ new Set();
      this.localCache = /* @__PURE__ */ new Map();
      this.currentPage = 1;
      this.saveMassive = {};
      this.reports = [];
      this.searchText = "";
      this.editMode = false;
      this.cache = new CacheBormashImpl();
      this.dialog = new DialogImpl();
      this.lock = (fn) => this.asyncLock(fn);
      this.createHandler = (event, selector, handler, locked = false) => {
        this.handlers.push({
          event,
          selector,
          handler: locked ? this.lock(handler) : handler
        });
      };
      this.createNotificationContainer = () => {
        ensureNotificationContainer();
      };
      this.updateRow = (item, rowIndex) => {
        const $oldRow = $(`[data-index="${rowIndex}"]`);
        const $newRow = this.createRow(item).hide();
        $oldRow.fadeOut(100, () => {
          $oldRow.replaceWith($newRow);
          $newRow.fadeIn(280);
          this.localCache.set(item.id, item);
        });
      };
      this.switchVisibilityRow = (rowIndex, hide) => {
        $(`[data-index="${rowIndex}"]`)[hide ? "fadeOut" : "fadeIn"](300);
      };
      this.save = async (url, ...items) => {
        const results = await Promise.all(items.map((item) => {
          const id = item.id;
          const version = item.version;
          const changes = item.changes;
          return this.requestToApi(`${url}/${id}${version != null ? `?version=${version}` : ""}`, "PATCH", changes);
        }));
        results.forEach((item) => {
          this.updateRow(item, item.id);
          delete this.saveMassive[item.id];
        });
        this.createNotification("\u0423\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E", "success" /* SUCCESS */);
        return results;
      };
      this.requestToApi = requestToApi;
      this.escapeHtml = escapeHtml;
      this.downloadFile = async (url, params) => {
        try {
          const response = await this.requestToApi(appendQueryParams(url, params), "GET");
          await downloadFilesFromDto(response);
        } catch (error) {
          this.createNotification("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0438 \u0444\u0430\u0439\u043B\u0430", "error" /* ERROR */);
          console.error(error);
        }
      };
      this.downloadReportFile = async (url, format, idList) => {
        try {
          const response = await this.requestToApi(url, "POST", { format, idList });
          await downloadFilesFromDto(response);
        } catch (error) {
          this.createNotification("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0438 \u0444\u0430\u0439\u043B\u0430", "error" /* ERROR */);
          console.error(error);
        }
      };
      this.downloadIdListFile = async (url, idList) => {
        try {
          const response = await this.requestToApi(url, "POST", { idList });
          await downloadFilesFromDto(response);
        } catch (error) {
          this.createNotification("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0438 \u0444\u0430\u0439\u043B\u0430", "error" /* ERROR */);
          console.error(error);
        }
      };
      this.createEntity = (url, dto) => {
        return this.requestToApi(url, "POST", dto);
      };
      this.deleteEntity = async (url) => {
        await this.requestToApi(`${url}`, "DELETE");
      };
      this.createNotification = (message, type, params, error) => showNotification(message, type, params, error);
      //Диалог с подтверждением действия
      this.createConfirmationDialog = this.lock((message, params) => {
        return new Promise((resolve) => {
          const text = params ? message.replace(/{(\w+)}/g, (m, k) => params[k]) : message;
          let $dialog = $("#confirmDialog");
          if ($dialog.length === 0) {
            $("body").append($(confirmDialogTemplate()));
            $dialog = $("#confirmDialog");
          }
          $("#confirmMessage").text(text);
          const cleanup = () => {
            $("#confirmCancel").off("click");
            $("#confirmOk").off("click");
            this.dialog.close("confirmDialog");
          };
          $("#confirmCancel").on("click", () => {
            cleanup();
            resolve(false);
          });
          $("#confirmOk").on("click", () => {
            cleanup();
            resolve(true);
          });
          this.dialog.open("confirmDialog", {
            clearFields: false,
            onClose: () => {
              cleanup();
              resolve(false);
            }
          });
        });
      });
      //Контекстное меню
      this.createContextMenu = (items, x, y) => {
        $("#context-menu").remove();
        const menu = $('<div id="context-menu" popover="manual"></div>');
        items.forEach((item) => {
          const $item = $(`<div id="${item.idAction}">${item.label}</div>`);
          $item.on("click", () => {
            item.action();
            menu[0].hidePopover();
          });
          menu.append($item);
        });
        $("body").append(menu.css({
          left: x + "px",
          top: y + "px"
        }));
        menu[0].showPopover();
        $(document).one("click", (e) => {
          if (!$(e.target).closest("#context-menu").length) {
            menu[0].hidePopover();
          }
        });
      };
      this.showToolTip = (event) => {
        const element = event.currentTarget;
        const tooltipTimeout = setTimeout(() => {
          const description = element.getAttribute("data-description");
          if (!description)
            return;
          const tooltip = document.createElement("div");
          tooltip.className = "custom-tooltip";
          tooltip.textContent = description;
          tooltip.style.visibility = "hidden";
          document.body.appendChild(tooltip);
          const rect = element.getBoundingClientRect();
          const tooltipRect = tooltip.getBoundingClientRect();
          const gap = 6;
          let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          let top = rect.bottom + gap;
          left = Math.min(Math.max(gap, left), window.innerWidth - tooltipRect.width - gap);
          if (top + tooltipRect.height > window.innerHeight - gap) {
            top = rect.top - tooltipRect.height - gap;
          }
          top = Math.max(gap, top);
          tooltip.style.position = "fixed";
          tooltip.style.left = `${left}px`;
          tooltip.style.top = `${top}px`;
          tooltip.style.visibility = "visible";
          element._currentTooltip = tooltip;
        }, 450);
        element._tooltipTimeout = tooltipTimeout;
        const hideHandler = () => {
          clearTimeout(tooltipTimeout);
          if (element._currentTooltip) {
            element._currentTooltip.remove();
            element._currentTooltip = null;
          }
          element.removeEventListener("mouseleave", hideHandler);
        };
        element.addEventListener("mouseleave", hideHandler);
      };
      this.formatDate = (dateString) => {
        if (!dateString)
          return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("ru-RU");
      };
      this.formatDateTime = (dateString) => {
        if (!dateString)
          return "";
        const date = new Date(dateString);
        return date.toLocaleString("ru-RU", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      };
      this.calculateColor = (color) => {
        switch (color) {
          case "NONE" /* NONE */:
            return "var(--default-color, #f1f1f1)";
          case "RED" /* RED */:
            return "var(--critical-color, #ef4444)";
          case "GREEN" /* GREEN */:
            return "var(--success-color, #10b981)";
          case "YELLOW" /* YELLOW */:
            return "var(--warning-color, #f59e0b)";
          case "BLUE" /* BLUE */:
            return "var(--info-color, #3b82f6)";
          case "GREY" /* GREY */:
            return "var(--grey-color, #9ca3af)";
        }
      };
      this.lockScreen = (message = "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...") => {
        const overlay = $(`<div class="lock-overlay">${message}</div>`);
        $(document.body).addClass("locked").append(overlay);
        return () => {
          overlay.remove();
          $(document.body).removeClass("locked");
        };
      };
      this.bindSearchInput = (selector, onSearch) => {
        this.createHandler("input", selector, (event) => {
          this.searchText = $(event.target).val().toString().toLowerCase().trim();
          if (onSearch) {
            onSearch(this.searchText);
          } else {
            this.applyFilters();
          }
        }, true);
      };
      /**
       * Включает режим редактирования для выбранных строк или конкретной строки.
       * @param dateTimeFields — массив имён полей, которые должны стать <input type="date">
       * @param row — конкретная строка (jQuery-объект), если null — все выбранные строки
       * @param specialFields — объекты {name: string, transform: ($div: any) => any} для кастомных полей
       */
      this.enableEditMode = (dateTimeFields = [], row, specialFields = []) => {
        const processElement = ($div) => {
          var _a;
          const dataName = $div.attr("data-name");
          const special = specialFields.find((f) => f.name === dataName);
          if (special) {
            $div.replaceWith(special.transform($div));
            return;
          }
          if (dateTimeFields.indexOf(dataName) !== -1) {
            const rowId = row ? row.attr("id") : $div.closest(".table-row").attr("id");
            const cacheKey = rowId && rowId.indexOf(".") !== -1 ? rowId : Number(rowId);
            const value = (_a = this.localCache.get(cacheKey)) == null ? void 0 : _a[dataName];
            const element = $(`<input type="date" data-name="${dataName}">`).val(value);
            $div.replaceWith(element);
          } else {
            $div.attr("contenteditable", "true");
          }
        };
        if (row) {
          row.find('div[contenteditable="false"]').each(function() {
            processElement($(this));
          });
          this.editMode = true;
          return;
        }
        for (const rowId of this.selectedRows) {
          const $row = $(`.table-row[id="${rowId}"]`);
          $row.find('div[contenteditable="false"]').each(function() {
            processElement($(this));
          });
        }
        this.editMode = true;
      };
      /**
       * Выключает режим редактирования.
       * @param dateTimeFields — массив имён полей с датами
       * @param protectedFields — поля, которые не трогаем (document, references и т.п.)
       * @param row — конкретная строка, если null — все выбранные
       * @param extraCenterFields — поля, которые должны быть с классом center
       */
      this.disableEditMode = (dateTimeFields = [], protectedFields = [], row, extraCenterFields = []) => {
        if (this.editMode && Object.keys(this.saveMassive).length > 0 && (row && row.find(".change").length > 0 || !row && $(".table-row .change").length > 0)) {
          this.createNotification("\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F", "warning" /* WARNING */);
          return;
        }
        const centerFields = /* @__PURE__ */ new Set([...dateTimeFields, ...extraCenterFields]);
        const processElement = ($field) => {
          const dataName = $field.attr("data-name");
          if (protectedFields.indexOf(dataName) !== -1)
            return;
          let value;
          if (dateTimeFields.indexOf(dataName) !== -1) {
            value = this.formatDate($field.val());
          } else {
            value = $field.is("select") ? $field.find("option:selected").text() : $field.text();
          }
          const centerClass = centerFields.has(dataName) ? " center" : "";
          $field.replaceWith(`<div class="field-container${centerClass}" data-name="${dataName}" contenteditable="false">${value}</div>`);
        };
        if (row) {
          row.find('div[contenteditable="true"], select[data-name], input[data-name]').each(function() {
            processElement($(this));
          });
          return;
        }
        for (const rowId of this.selectedRows) {
          const $row = $(`.table-row[id="${rowId}"]`);
          $row.find('div[contenteditable="true"], select[data-name], input[data-name]').each(function() {
            processElement($(this));
          });
        }
        this.editMode = false;
      };
      /**
       * Универсальный toggle выбора строки (для circle-row клика).
       * @param event — событие клика
       * @param checkEditChanges — проверять несохранённые изменения перед снятием выделения
       */
      this.toggleRowSelection = (event, checkEditChanges = true) => {
        const circle = $(event.currentTarget);
        const currentRow = circle.closest(".table-row, .row-items-row");
        const currentRowId = currentRow.attr("id");
        const changes = checkEditChanges ? currentRow.find(".change").length : 0;
        if (this.editMode && changes > 0) {
          this.createNotification("\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F", "warning" /* WARNING */);
          return;
        }
        if (!this.selectedRows.has(currentRowId)) {
          this.selectedRows.add(currentRowId);
          currentRow.addClass("selected");
          circle.addClass("active-critical");
        } else {
          this.selectedRows.delete(currentRowId);
          currentRow.removeClass("selected");
          circle.removeClass("active-critical");
          if (this.selectedRows.size === 0) {
            $(".circle-header").removeClass("active");
          }
        }
      };
      /**
       * Выбрать/снять все видимые строки (для circle-header).
       * @param event — событие
       * @param rowSelector — селектор строки (по умолчанию '.table-row')
       * @param circleRowSelector — селектор кружка в строке
       */
      this.toggleAllRowsSelection = (event, rowSelector = ".table-row", circleRowSelector = ".circle-row") => {
        const circle = $(event.currentTarget);
        const allRows = $(`${rowSelector}:visible`);
        if (this.editMode) {
          this.createNotification("\u0412\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u0440\u0435\u0436\u0438\u043C \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F", "info" /* INFO */);
          return;
        }
        if (circle.hasClass("active")) {
          this.selectedRows.clear();
          allRows.removeClass("selected");
          allRows.each((_, row) => {
            $(row).find(circleRowSelector).removeClass("active-critical");
          });
          circle.removeClass("active");
        } else {
          this.selectedRows.clear();
          allRows.each((_, row) => {
            const $row = $(row);
            const rowId = $row.attr("id");
            this.selectedRows.add(rowId);
            $row.addClass("selected");
            $row.find(circleRowSelector).addClass("active-critical");
          });
          circle.addClass("active");
        }
      };
      /**
       * Привязывает обработчик input для отслеживания изменений в полях строки.
       * Автоматически сохраняет в saveMassive[id][name] = value.
       */
      this.bindFieldChanges = (fieldSelector = "[data-name]", rowSelector = ".table-row") => {
        this.createHandler("input", fieldSelector, (event) => {
          const $el = $(event.target);
          const id = $el.closest(rowSelector).attr("id");
          const name = $el.attr("data-name");
          const value = $el.is("div") ? $el.text().trim() : $el.val();
          this.saveMassive[id] = __spreadProps(__spreadValues({}, this.saveMassive[id]), { [name]: value });
          $el.addClass("change");
        }, true);
      };
      /**
       * Универсальный диалог выбора элемента из списка с поиском.
       * @param fieldName — имя поля ('employee' / 'subDivision')
       * @param dialogId — ID диалога
       * @param modalDiv — jQuery-элемент, куда вставить результат
       * @param currentId — ID текущей строки (для saveMassive)
       * @param dataFilter — опциональный фильтр данных
       * @param columns — колонки для рендера [{key, label}]
       */
      this.openSelectionDialog = async (fieldName, dialogId, modalDiv, currentId, rawData, dataFilter, columns = [{
        key: "name",
        label: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435",
        width: "250"
      }], multiSelect = false) => {
        const dialog = $(`#${dialogId}`);
        const rowContainer = dialog.find(".dialog-content-rows");
        const searchInput = dialog.find(".choice-field input");
        const changeButton = dialog.find('[id^="change"]').first();
        let selected;
        const raw = rawData ? rawData : await this.cache.get(fieldName);
        const data = dataFilter ? dataFilter(raw) : raw || [];
        const getValue = (item, col) => {
          if (col.renderer)
            return col.renderer(item);
          if (col.key && col.key.indexOf(".") !== -1) {
            return col.key.split(".").reduce((acc, p) => acc ? acc[p] : "", item) || "";
          }
          return col.key ? item[col.key] || item[col.key + "Name"] || "" : "";
        };
        const renderRows = (items) => {
          rowContainer.empty();
          items.forEach((item) => {
            let colsHtml = columns.map(
              (col) => `<div class="content-row-column col-${col.width || "250"}">${this.escapeHtml(String(getValue(item, col) || ""))}</div>`
            ).join("");
            if (multiSelect) {
              colsHtml = `<div class="content-row-column col-40"><input type="checkbox" class="selection-checkbox" data-id="${item.id}"></div>` + colsHtml;
            }
            rowContainer.append(`<div class="dialog-content-rows-row" data-id="${item.id}">${colsHtml}</div>`);
          });
        };
        renderRows(data);
        searchInput.off("input").on("input", function() {
          const searchText = $(this).val().toString().toLowerCase().trim();
          const filtered = data.filter(
            (e) => columns.some((col) => (getValue(e, col) || "").toString().toLowerCase().includes(searchText))
          );
          renderRows(filtered);
        });
        this.dialog.open(dialogId);
        if (!multiSelect) {
          rowContainer.off("click").on(
            "click",
            ".dialog-content-rows-row",
            function() {
              const id = $(this).data("id");
              selected = data.find((e) => e.id === id);
              $(".dialog-content-rows-row").removeClass("selected");
              $(this).addClass("selected");
            }
          );
        } else {
          rowContainer.off("change", ".selection-checkbox").on("change", ".selection-checkbox", function() {
            const id = $(this).data("id");
            if (!Array.isArray(selected))
              selected = [];
            const idx = selected.findIndex((s) => s.id == id);
            if (this.checked) {
              if (idx === -1)
                selected.push(data.find((e) => e.id == id));
            } else {
              if (idx !== -1)
                selected.splice(idx, 1);
            }
          });
        }
        changeButton.off("click").on("click", () => {
          if (!selected || Array.isArray(selected) && selected.length === 0) {
            const label = fieldName === "employee" ? "\u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0430" : "\u044D\u043B\u0435\u043C\u0435\u043D\u0442";
            this.createNotification(`\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 ${label} \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430`, "warning" /* WARNING */);
            return;
          }
          if (!multiSelect) {
            modalDiv.text(selected.name);
            modalDiv.val(selected.name);
          } else {
            const selectedItems = Array.isArray(selected) ? selected : [];
            const names = selectedItems.map((s) => s.name).join(", ");
            modalDiv.val(names);
            modalDiv.text(names);
          }
          if (currentId) {
            this.saveMassive[currentId] = __spreadProps(__spreadValues({}, this.saveMassive[currentId]), { [fieldName]: selected });
          } else {
            this.saveMassive[fieldName] = selected;
          }
          try {
            const form = modalDiv.closest("form");
            if (form.length) {
              const hidden = form.find(`input[name="hidden${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}"]`);
              if (hidden.length)
                hidden.val(JSON.stringify(selected));
            }
          } catch (e) {
          }
          modalDiv.addClass("change-textarea");
          this.dialog.close(dialogId);
        });
        modalDiv.addClass("change");
      };
      /**
       * Универсальный диалог просмотра/загрузки файлов документа.
       * @param event — событие клика на иконку документа
       * @param documentId — ID документа (или поле в кэше)
       * @param getDocumentUrl — URL для получения документа
       * @param uploadUrlBase — базовый URL для загрузки (с условием PATCH/POST)
       * @param deleteUrlBase — базовый URL для удаления
       * @param onFileAdded — колбэк после добавления файла
       */
      this.openDocumentDialog = async (event, documentId, getDocumentUrl, uploadUrlBase, deleteUrlBase, onFileAdded) => {
        var _a;
        const dialog = $("#documentDialog");
        const currentRow = $(event.currentTarget).closest(".table-row, .table-card, .row-items-row");
        const rowId = currentRow.attr("id");
        const rowContainer = dialog.find(".dialog-content-rows");
        rowContainer.empty();
        if (documentId !== null) {
          const document2 = await this.requestToApi(getDocumentUrl, "GET");
          this.localCache.set("document", document2);
          (_a = document2.files) == null ? void 0 : _a.forEach((file) => {
            this.createDocumentFileRow(file, rowContainer, deleteUrlBase);
          });
        }
        rowContainer.append(
          `
            <div class="dialog-content-rows-row" id="newFileRow" style="height: 50px">
                <div class="content-row-column col-450" style="border: none;"></div>
                <div class="content-row-column col-100"></div>
                <div class="content-row-column col-100 center" style="padding: 0;border-bottom: 1px solid var(--border-color);">
                    <i style="float: right" class="uploadIcon upload-file fas fa-file-upload tooltip-trigger" data-description="\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044E" onclick="$('#fileInput').click()"></i>
                    <input type="file" id="fileInput" style="display: none;"/>
                </div>
            </div>`
        );
        dialog.off("change", "#fileInput").on("change", "#fileInput", (e) => {
          const input = e.target;
          if (input.files && input.files.length > 0) {
            Array.from(input.files).forEach((file) => {
              const fileName = file.name;
              if (rowContainer.find(`.col-450:contains("${fileName}")`).length > 0) {
                this.createNotification(`\u0424\u0430\u0439\u043B "${fileName}" \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442`, "warning" /* WARNING */);
                return;
              }
              this.uploadDocumentFile(e, rowId, documentId, uploadUrlBase, (files) => {
                rowContainer.find("#newFileRow").remove();
                const fileList = files.files || files;
                for (const f of fileList) {
                  this.createDocumentFileRow(f, rowContainer, deleteUrlBase);
                }
                if (onFileAdded)
                  onFileAdded(files);
              });
            });
          }
        });
        dialog.off("contextmenu", ".dialog-content-rows-row").on("contextmenu", ".dialog-content-rows-row", (ev) => {
          const $row = $(ev.currentTarget);
          const fileId = $row.attr("id");
          if (!fileId || fileId === "newFileRow")
            return;
          ev.preventDefault();
          const mouseEv = ev;
          this.createContextMenu([
            {
              label: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0444\u0430\u0439\u043B",
              idAction: "deleteFileButton",
              action: () => {
                this.deleteEntity(`${deleteUrlBase}/${fileId}`).then(() => {
                  this.createNotification("\u0424\u0430\u0439\u043B \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0434\u0430\u043B\u0435\u043D", "success" /* SUCCESS */);
                  this.deleteRow(fileId);
                });
              }
            }
          ], mouseEv.clientX, mouseEv.clientY);
        });
        this.dialog.open("documentDialog");
      };
      /**
       * Создаёт строку файла в диалоге документов.
       */
      this.createDocumentFileRow = (file, rowContainer, deleteUrlBase) => {
        const rowHtml = `
            <div class="dialog-content-rows-row" id="${file.id}">
                <div class="content-row-column col-450">${file.baseFileName}</div>
                <div class="content-row-column col-100 center">${file.type}</div>
                <div class="content-row-column col-100 file-items">
                    <i class="fas fa-arrows-rotate reload-icon tooltip-trigger" data-description="\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044E" data-file-id="${file.id}" onclick="$('#reloadFileInput').click()"></i>
                    <input type="file" id="reloadFileInput" class="reload-file-input" style="display: none;"/>
                    <i style="float: right" class="download fas fa-download tooltip-trigger" data-description="\u0421\u043A\u0430\u0447\u0430\u0442\u044C \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044E" data-file-id="${file.id}"></i>
                </div>
            </div>`;
        rowContainer.append(rowHtml);
      };
      /**
       * Загрузка файла в документ.
       */
      this.uploadDocumentFile = async (event, rowId, documentId, uploadUrlBase, onSuccess) => {
        const formData = new FormData();
        const currentInput = event.currentTarget;
        if (currentInput.files) {
          Array.from(currentInput.files).forEach((file) => formData.append("files", file));
        }
        const url = documentId ? `${uploadUrlBase}/${documentId}` : uploadUrlBase;
        const requestType = documentId ? "PATCH" : "POST";
        const unlock = this.lockScreen();
        this.requestToApi(url, requestType, formData).then(onSuccess).catch(console.error).then(() => unlock());
        currentInput.value = "";
      };
      /**
       * Обработчик клика на иконку скачивания в диалоге.
       * @param event — событие
       * @param baseUrl — базовый URL для скачивания (без ID файла)
       */
      this.handleDownloadFileFromDialog = (event, baseUrl) => {
        const fileId = $(event.target).closest(".dialog-content-rows-row").attr("id");
        if (fileId) {
          this.downloadFile(`${baseUrl}/${fileId}`).catch(console.error);
        } else {
          this.createNotification("\u0424\u0430\u0439\u043B \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D", "info" /* INFO */);
        }
      };
      /**
       * Создаёт контекстное меню с пунктом «Удалить» для строки.
       * @param event — событие contextmenu
       * @param deleteUrl — URL удаления (с ID строки)
       * @param entityName — название сущности для сообщения
       * @param nameSelector — селектор для получения имени (по умолчанию '[data-name="name"]')
       * @param onAfterDelete — колбэк после удаления
       */
      this.createRowDeleteContextMenu = (event, deleteUrl, entityName = "\u0437\u0430\u043F\u0438\u0441\u044C", nameSelector = '[data-name="name"]', onAfterDelete) => {
        if ($(event.target).is('div[contenteditable="true"]') || $(event.target).closest('div[contenteditable="true"]').length > 0) {
          return;
        }
        event.preventDefault();
        const mouseEvent = event;
        const $row = $(event.currentTarget);
        const rowName = $row.find(nameSelector).text().trim();
        const rowId = $row.attr("id");
        this.createContextMenu([
          {
            label: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
            idAction: "deleteEntityButton",
            action: () => {
              this.createConfirmationDialog(`\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435 ${entityName}: {name}`, { name: rowName }).then((confirmed) => {
                if (confirmed) {
                  this.deleteEntity(`${deleteUrl}/${rowId}`).then(() => {
                    this.deleteRow(rowId);
                    this.createNotification(`${entityName} \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0434\u0430\u043B\u0451\u043D(\u0430)`, "success" /* SUCCESS */);
                    if (onAfterDelete)
                      onAfterDelete();
                  }).catch(() => {
                    this.createNotification(`\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438 ${entityName}`, "error" /* ERROR */);
                  });
                }
              });
            }
          }
        ], mouseEvent.clientX, mouseEvent.clientY);
      };
      /**
       * Универсальный обработчик формы создания сущности.
       * @param event — событие
       * @param url — URL для POST
       * @param dialogId — ID диалога с формой
       * @param extractData — функция извлечения данных из формы {fieldName: $dialog => value}
       * @param onSuccess — колбэк (newItem) => void
       * @param useFormData — использовать FormData (true) или JSON (false)
       */
      this.handleCreateForm = async (event, url, dialogId, extractData, onSuccess, useFormData = false) => {
        var _a;
        event.preventDefault();
        const button = $(event.target);
        const dialog = $(`#${dialogId}`);
        const form = button.closest("form").get(0);
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        button.prop("disabled", true);
        let payload;
        if (useFormData) {
          payload = new FormData(form);
        } else {
          const data = extractData(dialog);
          payload = data instanceof FormData ? data : JSON.stringify(data);
        }
        try {
          const newItem = await this.createEntity(url, payload);
          this.saveMassive = {};
          this.localCache.set(newItem.id, newItem);
          this.dialog.close(dialogId);
          onSuccess(newItem);
          this.createNotification("\u0423\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0437\u0434\u0430\u043D\u043E", "success" /* SUCCESS */);
        } catch (error) {
          this.saveMassive = {};
          (_a = form == null ? void 0 : form.reset) == null ? void 0 : _a.call(form);
          this.createNotification("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0438", "error" /* ERROR */);
        } finally {
          button.prop("disabled", false);
        }
      };
      /**
       * Универсальное сохранение изменений из saveMassive.
       * @param updateUrl — URL обновления
       * @param getItemVersionAndChanges — функция для маппинга из кэша
       */
      this.saveMassiveChanges = async (updateUrl, getItemVersionAndChanges) => {
        if (Object.keys(this.saveMassive).length === 0)
          return;
        const itemsArray = Object.keys(this.saveMassive).map((id) => {
          var _a;
          const cacheData = (_a = this.localCache.get(id)) != null ? _a : this.localCache.get(Number(id));
          return getItemVersionAndChanges(id, cacheData, this.saveMassive[id]);
        });
        await this.save(updateUrl, ...itemsArray);
        this.selectedRows.forEach((id) => this.selectedRows.delete(id));
      };
      this.rowContainer = rowContainer;
      this.itemsPerPage = itemsPerPage;
      this.visibleRow = visibleRow;
      this.init(...initCallbacks);
    }
    init(...callbacks) {
      $(() => {
        this.createHandler("mouseenter", ".tooltip-trigger", this.showToolTip.bind(this), true);
        this.createHandler("click", '[name="closeDialog"]', (e) => {
          const dialogId = $(e.currentTarget).closest("dialog").attr("id");
          this.dialog.close(dialogId);
        });
        $(this.rowContainer).on("scroll", this.onScroll.bind(this));
        this.createNotificationContainer();
        this.initializeHandlers();
        callbacks.forEach((callback) => callback());
      });
    }
    initializeHandlers() {
      this.handlers.forEach(({ event, selector, handler }) => {
        $(document).on(event, selector, handler);
      });
    }
    deleteRow(rowIndex) {
      const $row = $(`#${rowIndex}`);
      $row.fadeOut(300, () => {
        $row.remove();
        this.localCache.delete(rowIndex);
      });
    }
    async displayPage(url, param, ...callbacks) {
      if (this.currentPage > 1) {
        param = __spreadProps(__spreadValues({}, param), { page: this.currentPage });
      }
      const request = await this.requestToApi(url, "GET", param);
      const visibleItems = request.data.slice(0, this.visibleRow);
      const hiddenItems = request.data.slice(this.visibleRow);
      visibleItems.forEach((item) => {
        this.localCache.set(item.id, item);
        const row = this.createRow(item);
        this.rowContainer.append(row);
      });
      hiddenItems.forEach((item) => {
        this.localCache.set(item.id, item);
        const row = this.createRow(item).hide();
        this.rowContainer.append(row);
      });
      callbacks.forEach((callback) => callback == null ? void 0 : callback(request.data, request.count));
    }
    async print(param) {
      if (!this.reports.length)
        return this.createNotification("\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0445 \u0434\u043B\u044F \u043F\u0435\u0447\u0430\u0442\u0438 \u043E\u0442\u0447\u0435\u0442\u043E\u0432", "info" /* INFO */);
      const dialogId = "printDialog";
      let $dialog = $(`#${dialogId}`);
      if ($dialog.length)
        $dialog.remove();
      $("body").append($(printDialogTemplate(this.reports)));
      $dialog = $(`#${dialogId}`);
      let format = "PDF";
      $dialog.find(".format-btn").off("click").on("click", function() {
        $dialog.find(".format-btn").removeClass("active");
        $(this).addClass("active");
        format = $(this).data("format");
      });
      this.dialog.open(dialogId);
      return new Promise((resolve) => {
        $("#printCancel").on("click", () => {
          this.dialog.close(dialogId);
          $dialog.remove();
          resolve();
        });
        $("#printOk").on("click", async () => {
          const api = $("#reportSelect").val();
          const report = this.reports.find((r) => r.api === api);
          if (!report) {
            resolve();
            return;
          }
          this.dialog.close(dialogId);
          $dialog.remove();
          const unlock = this.lockScreen("\u0424\u043E\u0440\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043E\u0442\u0447\u0435\u0442\u0430");
          try {
            if (report.function) {
              await report.function(format);
              resolve();
              return;
            }
            const params = `?format=${format}` + (report.params ? `&${new URLSearchParams(report.params).toString()}` : "");
            await this.downloadFile(report.api, params);
          } catch (e) {
            this.createNotification("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u0435\u0447\u0430\u0442\u0438", "error" /* ERROR */);
          } finally {
            unlock();
            resolve();
          }
        });
      });
    }
    parseInteger(value) {
      if (value === null || value === void 0 || value === "") {
        return null;
      }
      const normalized = String(value).trim();
      if (!/^-?\d+$/.test(normalized)) {
        return null;
      }
      return Number(normalized);
    }
    validateIntegerFields(fields) {
      const result = {};
      for (const field of fields) {
        const rawValue = field.value === "" || field.value === null || field.value === void 0 ? field.defaultValue : field.value;
        const parsedValue = this.parseInteger(rawValue);
        if (parsedValue === null || parsedValue < field.min) {
          this.createNotification(
            `${field.label} \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u0446\u0435\u043B\u044B\u043C \u0447\u0438\u0441\u043B\u043E\u043C \u043D\u0435 \u043C\u0435\u043D\u044C\u0448\u0435 ${field.min}`,
            "warning" /* WARNING */
          );
          return null;
        }
        result[field.key] = parsedValue;
      }
      return result;
    }
    /** DRY: заголовок таблицы — выделить все строки; circle-row — в подклассах через selectRow */
    bindTableSelection(withHeader = true) {
      if (withHeader) {
        this.createHandler("click", ".circle-header", this.toggleAllRowsSelection.bind(this), true);
      }
    }
    /** DRY: edit/save toolbar for registry pages */
    bindRegistryToolbar(options) {
      var _a;
      const editOpts = (_a = options.edit) != null ? _a : {};
      this.createHandler("click", "#edit-button", () => {
        var _a2, _b, _c, _d;
        if (!this.editMode) {
          this.enableEditMode(
            (_a2 = editOpts.dateFields) != null ? _a2 : [],
            void 0,
            (_b = editOpts.specialFields) != null ? _b : []
          );
          $("#edit-button").addClass("active");
        } else {
          this.disableEditMode(
            (_c = editOpts.dateFields) != null ? _c : [],
            (_d = editOpts.disableFields) != null ? _d : [],
            void 0,
            editOpts.readOnlyFields
          );
          if (!this.editMode)
            $("#edit-button").removeClass("active");
        }
      }, true);
      this.createHandler("click", "#save-button", options.onSave, true);
      if (options.searchSelector) {
        this.bindSearchInput(options.searchSelector);
      }
    }
    applyFilters() {
    }
  };

  // src/main/resources/static/js/team.ts
  var Team = class extends Base {
    constructor(itemsPerPage = Infinity, visibleRow = Infinity) {
      super($(`.table-body`), itemsPerPage, visibleRow, () => {
        this.displayPage("/api/team/get-page", void 0).catch(console.error);
      });
      this.createTeam = async (event) => {
        event.preventDefault();
        const button = $(event.target);
        const form = button.closest("form").get(0);
        const dialog = $("#create-dialog");
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        button.prop("disabled", true);
        const hiddenEmployees = dialog.find('input[name="hiddenEmployees"]').val();
        const employeeIds = hiddenEmployees ? JSON.parse(hiddenEmployees) : [];
        const formData = {
          name: dialog.find('input[name="name"]').val(),
          employeeIds
        };
        try {
          const newTeam = await this.createEntity("/api/team/create", formData);
          this.saveMassive = {};
          this.localCache.set(newTeam.id, newTeam);
          this.dialog.close("create-dialog");
          $(`.table-body`).append(this.createRow(newTeam));
        } catch (e) {
          this.saveMassive = {};
          form.reset();
          this.createNotification("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0438 \u0431\u0440\u0438\u0433\u0430\u0434\u044B", "error" /* ERROR */);
        } finally {
          button.prop("disabled", false);
        }
      };
      this.workWithModal = async (event) => {
        const modalDiv = $(event.currentTarget);
        const fieldName = modalDiv.attr("data-field");
        if (fieldName === "employees") {
          await this.openEmployeeSelectionDialog(modalDiv);
        }
        modalDiv.addClass("change");
      };
      this.openEmployeeSelectionDialog = async (modalDiv) => {
        await this.openSelectionDialog(
          "employee",
          "employeeDialog",
          modalDiv,
          void 0,
          void 0,
          void 0,
          [
            { key: "name", label: "\u0418\u043C\u044F", width: "250" },
            { label: "\u041F\u043E\u0434\u0440\u0430\u0437\u0434\u0435\u043B\u0435\u043D\u0438\u0435", width: "250", renderer: (e) => {
              var _a;
              return ((_a = e.subDivision) == null ? void 0 : _a.name) || "";
            } }
          ],
          true
        );
      };
      this.selectRow = async (event) => {
        const wasSelected = this.selectedRows.has($(event.currentTarget).closest(".table-row").attr("id"));
        this.toggleRowSelection(event, true);
        const circle = $(event.currentTarget);
        const currentRow = circle.closest(".table-row");
        const rowId = currentRow.attr("id");
        if (!rowId)
          return;
        if (this.selectedRows.has(rowId) && !wasSelected && this.editMode) {
          this.enableEditMode([], currentRow);
        } else if (!this.selectedRows.has(rowId)) {
          this.disableEditMode();
          if (!this.editMode)
            $("#edit-button").removeClass("active");
        }
      };
      this.showRowContextMenu = (event) => {
        event.preventDefault();
        const $row = $(event.currentTarget);
        const rowId = $row.attr("id");
        if (!rowId)
          return;
        const mouseEvent = event;
        this.createContextMenu([
          {
            label: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0431\u0440\u0438\u0433\u0430\u0434\u0443",
            idAction: "deleteTeam",
            action: () => {
              this.deleteTeamHandler(Number(rowId));
            }
          }
        ], mouseEvent.clientX, mouseEvent.clientY);
      };
      this.deleteTeamHandler = async (id) => {
        try {
          this.createConfirmationDialog("\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u043C\u0435\u0440\u043E\u043F\u0440\u0438\u044F\u0442\u0438\u044F").then((confirmed) => {
            if (confirmed) {
              this.deleteEntity(`/api/team/delete/${id}`).then(() => {
                this.createNotification("\u0411\u0440\u0438\u0433\u0430\u0434\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0434\u0430\u043B\u0435\u043D\u0430", "success" /* SUCCESS */);
                this.deleteRow(id);
                this.selectedRows.delete(id);
              });
            }
          });
        } catch (e) {
          this.createNotification("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438 \u0431\u0440\u0438\u0433\u0430\u0434\u044B", "error" /* ERROR */);
        }
      };
      this.createHandler("click", "#create-button", () => this.dialog.open("create-dialog"), true);
      this.createHandler("click", "#createBtn", this.createTeam, true);
      this.createHandler("click", ".area-modal", this.workWithModal.bind(this), true);
      this.bindTableSelection();
      this.createHandler("click", ".circle-row", this.selectRow.bind(this), true);
      this.bindRegistryToolbar({ onSave: () => this.saveTeam(), searchSelector: "#searchInput" });
      this.bindFieldChanges();
      this.createHandler("contextmenu", ".table-row.selected", this.showRowContextMenu.bind(this), true);
    }
    createRow(team) {
      var _a;
      const employeesText = ((_a = team.employees) == null ? void 0 : _a.map((e) => e.name).join(", ")) || "";
      const row = `
            <div class="table-row" id="${team.id}" data-index="${team.id}">
                <div class="table-cell" style="width: var(--no); position: relative">
                    <div class="circle circle-row tooltip-trigger" data-description="\u0412\u044B\u0434\u0435\u043B\u0438\u0442\u044C \u0441\u0442\u0440\u043E\u043A\u0443"></div>
                    <div class="field-container center" data-name="id" contenteditable="false">
                        ${team.id}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--name);">
                    <div class="field-container center" data-name="name" contenteditable="false">
                        ${this.escapeHtml(team.name)}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--employees);">
                    <div class="field-container" data-name="employees" contenteditable="false">
                        ${this.escapeHtml(employeesText)}
                    </div>
                </div>
            </div>`;
      return $(row);
    }
    onScroll() {
    }
    saveTeam() {
      this.saveMassiveChanges("/api/team/update", (id, cacheData, changes) => ({
        id,
        version: cacheData == null ? void 0 : cacheData.version,
        changes
      })).then(() => {
        this.disableEditMode();
        $("#edit-button").removeClass("active");
      }).catch(console.error);
    }
    applyFilters() {
      if (!this.searchText) {
        $(".table-row").show();
        return;
      }
      $(".table-row").each((_, row) => {
        const $row = $(row);
        const text = $row.text().toLowerCase();
        $row.toggle(text.includes(this.searchText));
      });
    }
  };
  $(document).ready(() => {
    new Team();
  });
})();
//# sourceMappingURL=team.js.map

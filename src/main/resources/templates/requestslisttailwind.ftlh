<!doctype html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Список заявок</title>
    <link href="/css/tailwind-output.css" rel="stylesheet">
    <link rel="stylesheet" href="/css/requestslist.css">
</head>
<body class="bg-slate-50 text-slate-800 h-screen flex flex-col overflow-hidden">
<!-- Прелоадер -->
<div id="preloader">
    <div class="loader-ring mb-4"></div>
    <div class="text-slate-600 text-sm font-medium loader-pulse">Загрузка...</div>
</div>

<!-- Верхний тулбар -->
<header class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-5 shadow-lg z-20">
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-4">
            <div class="bg-white/15 backdrop-blur-sm p-3 rounded-2xl border border-white/25 shadow-inner">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                </svg>
            </div>
            <div>
                <h1 class="text-2xl font-bold text-white tracking-tight drop-shadow-sm">Список заявок для ОТК</h1>
                <p class="text-blue-100 text-sm font-medium mt-0.5">Управление и контроль качества</p>
            </div>
        </div>
        <div class="flex gap-2 sm:gap-3 items-center">
            <button onclick="toggleFilters()" id="filterBtn"
                    class="group flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/15 backdrop-blur-sm text-white text-sm font-semibold border border-white/25 hover:bg-white/25 hover:border-white/40 transition-all shadow-md hover:shadow-lg">
                <svg id="filterIcon"
                     class="w-4 h-4 text-blue-100 group-hover:text-white transition-all duration-300" fill="none"
                     stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                </svg>
                <span class="hidden sm:inline">Фильтры</span>
                <span id="filterBadge"
                      class="hidden bg-amber-400 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">!</span>
            </button>
            <a href="/menu"
               class="group inline-flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white text-blue-700 text-sm font-bold hover:bg-blue-50 transition-all shadow-md hover:shadow-lg border border-white/30">
                <svg class="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" fill="none"
                     stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span class="hidden sm:inline">Меню</span>
            </a>
        </div>
    </div>
</header>

<!-- Фильтры -->
<div id="filterSection" class="filter-panel px-6 bg-white border-b border-slate-200">
    <form method="get" id="filterForm" class="py-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div>
                <label class="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Номер</label>
                <input type="text" name="filterNumber" data-filter-input value="${(filterNumber)!''}" placeholder="#"
                       onkeydown="if(event.key==='Enter') document.getElementById('filterForm').submit()"
                       class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow">
            </div>
            <div class="hidden md:block">
                <label class="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Создал</label>
                <input type="text" name="filterCreator" data-filter-input value="${(filterCreator)!''}" placeholder="Создатель"
                       onkeydown="if(event.key==='Enter') document.getElementById('filterForm').submit()"
                       class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow">
            </div>
            <div>
                <label class="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Ответственный</label>
                <input type="text" name="filterEmployee" data-filter-input value="${(filterEmployee)!''}" placeholder="Сотрудник"
                       onkeydown="if(event.key==='Enter') document.getElementById('filterForm').submit()"
                       class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow">
            </div>
            <div class="hidden md:block">
                <label class="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Заказ
                    клиента</label>
                <input type="text" name="filterOrder" data-filter-input value="${(filterOrder)!''}" placeholder="Заказ"
                       onkeydown="if(event.key==='Enter') document.getElementById('filterForm').submit()"
                       class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow">
            </div>
            <div class="hidden md:block">
                <label class="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Цех</label>
                <input type="text" name="filterDivision" data-filter-input value="${(filterDivision)!''}" placeholder="Цех"
                       onkeydown="if(event.key==='Enter') document.getElementById('filterForm').submit()"
                       class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow">
            </div>
            <div class="hidden md:block">
                <label class="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Причина</label>
                <input type="text" name="filterReason" data-filter-input value="${(filterReason)!''}" placeholder="Причина"
                       onkeydown="if(event.key==='Enter') document.getElementById('filterForm').submit()"
                       class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow">
            </div>
            <div class="hidden md:block">
                <label class="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Тип
                    детали</label>
                <input type="text" name="filterItem" data-filter-input value="${(filterItem)!''}" placeholder="Деталь"
                       onkeydown="if(event.key==='Enter') document.getElementById('filterForm').submit()"
                       class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow">
            </div>
            <div class="hidden md:block">
                <label class="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Дата создания</label>
                <input type="datetime-local" name="filterCreateDate" data-filter-input value="${(filterCreateDate)!''}" placeholder="Деталь"
                       onkeydown="if(event.key==='Enter') document.getElementById('filterForm').submit()"
                       class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow">
            </div>
            <div class="hidden md:block">
                <label class="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Дата изменения</label>
                <input type="datetime-local" name="filterUpdateDate" data-filter-input value="${(filterUpdateDate)!''}" placeholder="Деталь"
                       onkeydown="if(event.key==='Enter') document.getElementById('filterForm').submit()"
                       class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow">
            </div>
            <div>
                <label class="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Статус</label>
                <select name="filterStatus" onchange="document.getElementById('filterForm').submit()"
                        class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow cursor-pointer">
                    <option value="" <#if !(filterStatus??) || filterStatus == "">selected</#if>>Все статусы</option>
                    <option value="Closed" <#if (filterStatus!) == "Closed">selected</#if>>Закрыт</option>
                    <option value="InWork" <#if (filterStatus!) == "InWork">selected</#if>>В работе</option>
                    <option value="Rejected" <#if (filterStatus!) == "Rejected">selected</#if>>Забракована</option>
                    <option value="New" <#if (filterStatus!) == "New">selected</#if>>Новый</option>
                </select>
            </div>
            <div class="hidden md:block">
                <label class="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Кол-во
                    брака</label>
                <input type="text" name="filterDefectCount" data-filter-input value="${(filterDefectCount)!''}" placeholder="Количество"
                       onkeydown="if(event.key==='Enter') document.getElementById('filterForm').submit()"
                       class="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow">
            </div>
            <div class="flex items-end gap-2">
                <button type="submit" id="applyFilterBtn"
                        class="flex-1 px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-all shadow-sm hover:shadow">
                    Применить
                </button>
                <button type="button" id="clearFilterBtn" onclick="clearFilters()"
                        class="px-4 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 font-medium transition-all">
                    ✕
                </button>
            </div>
        </div>
    </form>
</div>

<!-- Таблица -->
<div class="flex-1 overflow-hidden flex flex-col">
    <div class="flex-1 overflow-auto table-scroll">
        <div class="inline-block min-w-full align-middle">
            <table class="min-w-full border-collapse">
                <thead class="bg-slate-50 sticky top-0 z-10">
                <tr>
                    <th class="border border-slate-200 px-2 sm:px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-16 sm:w-20">
                        #
                    </th>
                    <th class="border border-slate-200 hidden md:table-cell px-2 sm:px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                        Создал
                    </th>
                    <th class="border border-slate-200 px-2 sm:px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                        Ответственный
                    </th>
                    <th class="border border-slate-200 hidden lg:table-cell px-2 sm:px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                        Заказ клиента
                    </th>
                    <th class="border border-slate-200 hidden sm:table-cell px-2 sm:px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-20 sm:w-24 text-center">
                        Цех
                    </th>
                    <th class="border border-slate-200 hidden xl:table-cell px-2 sm:px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                        Причина
                    </th>
                    <th class="border border-slate-200 hidden lg:table-cell px-2 sm:px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                        Тип детали
                    </th>
                    <th class="border border-slate-200 px-2 sm:px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-24 sm:w-28 text-center">
                        Статус
                    </th>
                    <th class="border border-slate-200 hidden sm:table-cell px-2 sm:px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-20 sm:w-24 text-center">
                        Брак
                    </th>
                    <th class="border border-slate-200 hidden md:table-cell px-2 sm:px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                        Изменил
                    </th>
                    <th class="border border-slate-200 hidden md:table-cell px-2 sm:px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                        Тип контроля
                    </th>
                    <th class="border border-slate-200 hidden md:table-cell px-2 sm:px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-20 sm:w-24 text-center">
                        Дата созд.
                    </th>
                    <th class="border border-slate-200 hidden md:table-cell px-2 sm:px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-20 sm:w-24 text-center">
                        Дата изм.
                    </th>
                    <th class="border border-slate-200 px-2 sm:px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-24 sm:w-28">
                        Действия
                    </th>
                </tr>
                </thead>
                <tbody class="bg-white">
                <#list requestsList as request>
                    <tr class="hover:brightness-[0.98] transition-all
                                <#if request.getStatus().getName() == 'Закрыт'>border-green-500 bg-green-100
                                <#elseif request.getStatus().getName() == 'В работе'>border-orange-500 bg-orange-100
                                <#elseif request.getStatus().getName() == 'Забракована'>border-red-500 bg-red-100
                                <#elseif request.getStatus().getName() == 'Новый'>border-slate-400 bg-slate-100
                                </#if>">
                        <td class="border text-center border-slate-200 px-2 sm:px-4 py-3 text-sm text-slate-900 font-medium whitespace-nowrap">${request.getRequestNumber()}</td>
                        <td class="border text-center border-slate-200 hidden md:table-cell px-2 sm:px-4 py-3 text-sm text-slate-700 whitespace-nowrap truncate max-w-[100px] sm:max-w-[150px]">${request.getCreatedBy().getName()}</td>
                        <td class="border text-center border-slate-200 px-2 sm:px-4 py-3 text-sm text-slate-700 whitespace-nowrap truncate max-w-[150px]">${request.getEmployee().getName()}</td>
                        <td class="border text-center border-slate-200 hidden lg:table-cell px-2 sm:px-4 py-3 text-sm text-slate-700 whitespace-nowrap truncate max-w-[150px]">${(request.getCustomerOrder().getName())!"—"}</td>
                        <td class="border text-center border-slate-200 hidden sm:table-cell px-2 sm:px-4 py-3 text-sm text-slate-700 whitespace-nowrap">${request.getSubDivision().getName()}</td>
                        <td class="border text-center border-slate-200 hidden xl:table-cell px-2 sm:px-4 py-3 text-sm text-slate-700 whitespace-nowrap truncate max-w-[180px]">${(request.getReason_wr())!"—"}</td>
                        <td class="border text-center border-slate-200 hidden lg:table-cell px-2 sm:px-4 py-3 text-sm text-slate-700 whitespace-nowrap truncate max-w-[150px]">${(request.getItem().getName())!"—"}</td>
                        <td class="border text-center border-slate-200 px-2 sm:px-4 py-3 text-center whitespace-nowrap">
                                    <span class="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold
                                        <#if request.getStatus().getName() == 'Закрыт'>bg-green-600 text-white ring-1 ring-green-600/20
                                        <#elseif request.getStatus().getName() == 'В работе'>bg-orange-600 text-white ring-1 ring-orange-600/20
                                        <#elseif request.getStatus().getName() == 'Забракована'>bg-red-600 text-white ring-1 ring-red-600/20
                                        <#elseif request.getStatus().getName() == 'Новый'>bg-slate-600 text-white ring-1 ring-slate-600/20
                                        <#else>bg-slate-100 text-slate-700 ring-1 ring-slate-500/20</#if>">
                                        ${request.getStatus().getName()}
                                    </span>
                        </td>
                        <#if request.getQtyRejected()?? && request.getQtyRejected()?number gt 0>
                            <td class="border border-slate-200 hidden sm:table-cell px-2 sm:px-4 py-3 text-sm text-slate-700 text-center whitespace-nowrap">
                                <span class="bg-red-600 text-white ring-1 ring-red-600/20 rounded-full px-2 sm:px-3 py-1 inline-block text-xs">
                                    ${(request.qtyRejected)!"—"}
                                </span>
                            </td>
                        <#else>
                            <td class="border border-slate-200 hidden sm:table-cell px-2 sm:px-4 py-3 text-sm text-slate-700 text-center whitespace-nowrap">${(request.qtyRejected)!"—"}</td>
                        </#if>
                        <td class="border border-slate-200 hidden sm:table-cell px-2 sm:px-4 py-3 text-sm text-slate-700 text-center whitespace-nowrap">${(request.getUpdatedBy().getName())!"-"}</td>
                        <td class="border border-slate-200 hidden sm:table-cell px-2 sm:px-4 py-3 text-sm text-slate-700 text-center whitespace-nowrap">${(request.getControl())!"-"}</td>
                        <td class="border border-slate-200 hidden md:table-cell px-2 sm:px-4 py-3 text-sm text-slate-700 text-center whitespace-nowrap">${(request.getFormattedCreatedDate())!"-"}</td>
                        <td class="border border-slate-200 hidden md:table-cell px-2 sm:px-4 py-3 text-sm text-slate-700 text-center whitespace-nowrap">${(request.getFormattedUpdatedDate())!"-"}</td>
                        <td class="border border-slate-200 px-2 sm:px-4 py-3 text-center whitespace-nowrap">
                            <div class="flex flex-col justify-center gap-1.5 sm:gap-2">
                                <a href="/view/${request.getRequestNumber()?c}"
                                   class="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm hover:shadow">
                                    <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                    </svg>
                                    <span class="hidden sm:inline">Редактировать</span>
                                    <span class="sm:hidden">Ред.</span>
                                </a>
                                <button onclick="openHistoryModal('${request.getId()}')"
                                        class="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium rounded-lg bg-slate-600 text-white hover:bg-slate-700 transition-all shadow-sm hover:shadow">
                                    <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <span class="hidden sm:inline">История</span>
                                    <span class="sm:hidden">Ист.</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                </#list>
                <#if requestsList?size == 0>
                    <tr>
                        <td colspan="10" class="px-4 py-12 text-center text-slate-500">
                            <svg class="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                            <p class="text-sm">Заявок не найдено</p>
                        </td>
                    </tr>
                </#if>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Пагинация -->
<footer class="bg-white border-t border-slate-200 px-3 sm:px-6 py-2 sm:py-3 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 shadow-sm z-20 sticky bottom-0">
    <div class="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
        <span class="text-slate-600 font-medium hidden sm:inline">Показывать:</span>
        <select onchange="changePageSize(this.value)"
                class="bg-white border border-slate-300 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm">
            <option value="10" <#if pageSize == 10>selected</#if>>10</option>
            <option value="25" <#if pageSize == 25>selected</#if>>25</option>
            <option value="50" <#if pageSize == 50>selected</#if>>50</option>
        </select>
        <span class="text-slate-500">Всего: <span class="font-semibold text-slate-700">${totalElements}</span></span>
    </div>
    <div class="flex items-center gap-0.5 sm:gap-1">
        <button onclick="goToPage(0)"
                class="px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all <#if currentPage == 0>opacity-50 cursor-not-allowed</#if>"
                <#if currentPage == 0>disabled</#if>>
            <span class="hidden sm:inline">←←</span>
            <span class="sm:hidden">⟪</span>
        </button>
        <button onclick="goToPage(${currentPage - 1})"
                class="px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all <#if currentPage == 0>opacity-50 cursor-not-allowed</#if>"
                <#if currentPage == 0>disabled</#if>>
            <span class="hidden sm:inline">←</span>
            <span class="sm:hidden">⟨</span>
        </button>
        <#list 0..<totalPages as pageNum>
            <#if pageNum == currentPage>
                <button class="px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white shadow-sm">${pageNum + 1}</button>
            <#elseif (pageNum >= currentPage - 2) && (pageNum <= currentPage + 2)>
                <button onclick="goToPage(${pageNum})"
                        class="px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all">${pageNum + 1}</button>
            <#elseif pageNum == 0 || pageNum == totalPages - 1>
                <button onclick="goToPage(${pageNum})"
                        class="px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all">${pageNum + 1}</button>
            <#elseif pageNum == currentPage - 3 || pageNum == currentPage + 3>
                <span class="px-2 py-2 text-sm text-slate-400">…</span>
            </#if>
        </#list>
        <button onclick="goToPage(${currentPage + 1})"
                class="px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all <#if currentPage == totalPages - 1>opacity-50 cursor-not-allowed</#if>"
                <#if currentPage == totalPages - 1>disabled</#if>>
            <span class="hidden sm:inline">→</span>
            <span class="sm:hidden">⟩</span>
        </button>
        <button onclick="goToPage(${totalPages - 1})"
                class="px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all <#if currentPage == totalPages - 1>opacity-50 cursor-not-allowed</#if>"
                <#if currentPage == totalPages - 1>disabled</#if>>
            <span class="hidden sm:inline">→→</span>
            <span class="sm:hidden">⟫</span>
        </button>
    </div>
</footer>

<!-- Модальное окно истории -->
<div id="historyModal" class="fixed inset-0 z-50 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Бэкдроп -->
    <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onclick="closeHistoryModal()"></div>

    <!-- Модалка -->
    <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
            <!-- Заголовок -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <div class="flex items-center gap-3">
                    <div class="bg-blue-100 p-2 rounded-lg">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-slate-800">История заявки</h3>
                        <p id="modalRequestNumber" class="text-xs text-slate-500">Загрузка...</p>
                    </div>
                </div>
                <button onclick="closeHistoryModal()" class="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <!-- Контент (скроллируемый) -->
            <div id="historyContent" class="flex-1 overflow-y-auto px-6 py-4">
                <!-- Лоадер -->
                <div id="historyLoader" class="flex flex-col items-center justify-center py-12">
                    <div class="w-10 h-10 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p class="text-slate-500 text-sm mt-3">Загрузка истории...</p>
                </div>
                <!-- Список истории (будет заполнен JS) -->
                <div id="historyList" class="hidden space-y-3"></div>
            </div>
        </div>
    </div>
</div>

<script src="/js/requestslist.js"></script>
</body>
</html>


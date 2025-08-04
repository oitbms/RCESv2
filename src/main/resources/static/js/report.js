// map с открытыми узлами
let depthMap = null;
$(document).ready(function () {
    sessionStorage.setItem('depth', '-1');
    sessionStorage.removeItem('depthMap');

    depthMap = (() => {
        const map = new Map(JSON.parse(sessionStorage.getItem('depthMap') || '[]'));
        const save = () => sessionStorage.setItem('depthMap', JSON.stringify([...map]));
        const findGlobalMax = () => {
            let maxDepth = -1;
            let idMaxDepth = null;

            map.forEach((value, id) => {
                if (value > maxDepth) {
                    maxDepth = value;
                    idMaxDepth = id;
                }
            });

            return {maxDepth, idMaxDepth};
        };

        let {maxDepth, idMaxDepth} = findGlobalMax();

        return {
            every: (callback) => Array.from(map.values()).every(callback), // проверки на есть удовлетворение условию всех элементов
            add: (id, depth) => {
                map.set(id, depth);
                save();

                if (depth > maxDepth) {
                    maxDepth = depth;
                    idMaxDepth = id;
                }

            },
            del: (id) => {
                const wasMaxId = id === idMaxDepth;

                map.delete(id);
                save();

                // Если удалили элемент с globalMax — пересчитываем
                if (wasMaxId) {
                    ({maxDepth, idMaxDepth} = findGlobalMax());
                }
            },
            get: (id) => map.get(id),
            globalMax: () => ({maxDepth, idMaxDepth}),
        };
    })();
});

$(document).on('click', '.hamburger', async function (e) {
    if ($(e.target).is('input')) {
        return;
    }

    async function calculate(rows, mainCheckboxChecked) {
        for (row of rows) {
            const rowId = $(row).data('id');
            const rowDepth = $(row).data('level');
            const parentId = $(row).data('parent-id');
            const parentRow = $(`div[data-id="${parentId}"]`).first();
            const innerRows = $(row).closest('.table-rows-items').children('.inner-rows')
                .children('.table-rows-items').children('.row');
            const currentCheckBoxIsChecked = $(row).find('input[type="checkbox"]').prop('checked');

            if (currentCheckBoxIsChecked) {
                // если открываем узел тогда +1rem за каждый открытый узел иначе -1rem
                currentExtraWidth = currentExtraWidth + 1;
                depthMap.add(rowId, rowDepth)

            } else {
                depthMap.del(rowId);
            }
        }
    }

    const $checkbox = $(this).find('input[type="checkbox"]');
    const $currentRow = $(this).closest('.row');
    const $innerRows = $currentRow.closest('.table-rows-items').children('.inner-rows')
        .children('.table-rows-items').children('.row');

    const currentLevel = $currentRow.data('level');
    const currentId = $currentRow.data('id');
    const currentParentId = $currentRow.data('parent-id');
    let currentExtraWidth = parseFloat($(':root').css('--extra-width'));

    const {maxDepth: maxDepth, idMaxDepth: currentIdMaxDepth} = depthMap.globalMax();

    if ($innerRows.length === 0 || $innerRows.html().trim() === '') {
        $checkbox.prop('checked', !$checkbox.prop('checked'))
        return;
    }

    if (!depthMap.get(currentId)) {
        if (currentLevel > maxDepth) {
            currentExtraWidth += +1
        }
        depthMap.add(currentId, currentLevel);
    } else {
        $('.row[data-id="' + currentParentId + '"]').find('.row').map((i, e) => $(e).data('id')).get()
            .forEach(id => depthMap.del(id));
        const currentMaxIsMax = $currentRow.find(`.row[data-id="${currentIdMaxDepth}"]`).length > 0 &&
            depthMap.every(value => value < currentParentId);
        const {maxDepth: newMaxDepth, idMaxDepth: newIdMaxDepth} = depthMap.globalMax();
        if (currentLevel > newMaxDepth || currentMaxIsMax) {
            currentExtraWidth -= 1;
        }
    }


    $innerRows.closest('.table-rows-items').closest('.inner-rows').slideToggle(1000);


    if ($checkbox.prop('checked')) {
        await calculate($innerRows);
    }

    setTimeout(function () {
        $(':root').css('--extra-width', currentExtraWidth + 'rem');
    }, 100);
});


// $(document).on('click', '.hamburger', async function () {
//     const checkbox = this.querySelector('.checkbox');
//     const $row = $(this).closest('.row');
//     const $nestedRow = $row.children('.nested-rows');
//     const $nestedRows = $row.find('.row');
//     const rowDepth = $nestedRow.children('.row').data('depth'); // Глубина вложенной строки
//     const rowId = $nestedRow.children('.row').data('id');
//     const parentId = $row.data('id');
//     const {maxDepth: maxDepth, idMaxDepth: currentIdMaxDepth} = depthMap.globalMax();
//     let currentExtraWidth = parseFloat($(':root').css('--extra-width'));
//     if ($nestedRow.length === 0 || $nestedRow.html().trim() === '') {
//         checkbox.checked = !checkbox.checked;
//         return;
//     }
//
//     // Расчет надо ли уменьшать отступ за текущую строку
//     if (!depthMap.get(rowId)) { // если в map нет такого ключа => checked иначе !checked
//         if (rowDepth > maxDepth) {
//             currentExtraWidth += +1
//         }
//         depthMap.add(rowId, rowDepth);
//     } else {
//         $('.row[data-id="' + parentId + '"]').find('.row').map((i, e) => $(e).data('id')).get()
//             .forEach(id => depthMap.del(id)); // Удаление всех потомков
//         const currentMaxIsMax = $row.find(`.row[data-id="${currentIdMaxDepth}"]`).length > 0 &&
//             depthMap.every(value => value < rowDepth);
//         const {maxDepth: newMaxDepth, idMaxDepth: newIdMaxDepth} = depthMap.globalMax();
//         if (rowDepth > newMaxDepth || currentMaxIsMax) {
//             currentExtraWidth -= 1;
//         }
//     }
//
//     // Обработка вложенных строки
//     $nestedRows.each(function () {
//         if ($(this).children('.hamburger').find('.checkbox').prop('checked')) {
//             // если открываем узел тогда +1rem за каждый открытый узел иначе -1rem
//             if (checkbox.checked) {
//                 currentExtraWidth = currentExtraWidth + 1;
//
//                 depthMap.add($(this).data('id'), $(this).data('depth'))
//             } else {
//                 currentExtraWidth = currentExtraWidth - 1;
//             }
//             //Если у строки нет вложенных строк и у текущей строки checked и у родителя тоже checked
//         } else if (checkbox.checked &&
//             ($(this).children('.nested-rows').length === 0 || $(this).children('.nested-rows').html().trim() === '')
//             &&  $(this).parent('.nested-rows').parent('.row').find('> .hamburger').children('.checkbox').prop('checked')) {
//             depthMap.add($(this).data('id'), $(this).data('depth'))
//         }
//     });
//
//     setTimeout(function () {
//         $(':root').css('--extra-width', currentExtraWidth + 'rem');
//     }, 100);
//
//     $nestedRow.slideToggle();
// });
// //Тестовые данные
// document.addEventListener('DOMContentLoaded', async function () {
//     const primaryDemands = await $.get('/spm-api/getPrimaryDemandForCustomerOrderId', {customerOrderId: '7886928'})
//     let depth = 0;
//
//     async function makeChild(parentId) {
//         const childJobComponent = await $.get('spm-api/getChildJobComponentForJobcomponentId', {jobComponentId: parentId});
//         for (const jc of childJobComponent) {
//             await createRow(jc, 'jc', parentId, await $.get('spm-api/getJobStepsForJobComponentId', {jobComponentId: parentId}).length > 0);
//             depth++;
//             // await makeChild(jc.id, depth + 1);
//         }
//         const jobSteps = await $.get('spm-api/getJobStepsForJobComponentId', {jobComponentId: parentId});
//         // for (const js of jobSteps) {
//         //     await createRow(js, 'js', parentId);
//         // }
//     }
//
//     for (pd of primaryDemands) {
//         await createRow(pd, 'pd', 0, await $.get('spm-api/getChildJobComponentForJobcomponentId', {jobComponentId: pd.jobComponent.id}).length > 0);
//         await makeChild(pd.jobComponent.id);
//     }
//     // for (let i = 0; i < depth; i++) {
//     //     $(':root').css('--cell-width', (i, val) => parseFloat(val) + 0.5 + 'rem');
//     // }
// });


function formatDate(dateString) {
    if (!dateString) return "&nbsp;";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}


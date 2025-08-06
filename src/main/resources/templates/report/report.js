//Раскрытие вложенных строк
$(document).on('click', '.hamburger', async function (e) {
    if ($(e.target).is('input')) {
        return;
    }

    const $checkbox = $(this).find('input[type="checkbox"]');
    const $currentRow = $(this).closest('.row');
    const $lineContainer = $currentRow.find('.line-container');
    const $thirdLine = $lineContainer.children('.third-line');
    const $innerRows = $currentRow.closest('.table-rows-items').children('.inner-rows')
        .children('.table-rows-items').children('.row');
    if ($innerRows.length === 0 || $innerRows.html().trim() === '') {
        $checkbox.prop('checked', !$checkbox.prop('checked'))
        return;
    }
    if ($currentRow.data('level')===0) {
        $lineContainer.slideToggle(500);
    }
    $thirdLine.slideToggle(1200);
    $innerRows.closest('.table-rows-items').closest('.inner-rows').slideToggle(1000);
});

//Ресайз колонок
$('.table-header-resizer').on('mousedown', function(e) {
    e.preventDefault();

    const $resizer = $(this);
    const $parentHeader = $resizer.closest('[data-name]');
    const dataName = $parentHeader.data('name');
    const startX = e.clientX;
    const startWidth = parseFloat($parentHeader.css('width'));

    const minWidthValue = getComputedStyle(document.documentElement)
      .getPropertyValue(`--${dataName}`)
      .trim();
    
    const minWidth = parseFloat(minWidthValue) * 16; 

    const $allElementsWithSameName = $(`[data-name="${dataName}"]`);

    function doResize(e) {
      let newWidth = startWidth + (e.clientX - startX);
      newWidth = Math.max(minWidth, newWidth);
      
      $allElementsWithSameName.css('width', newWidth + 'px');
    }

    function stopResize() {
      $(window).off('mousemove', doResize)
               .off('mouseup', stopResize);
    }

    $(window).on('mousemove', doResize)
             .on('mouseup', stopResize);
  });

function formatDate(dateString) {
    if (!dateString) return "&nbsp;";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}


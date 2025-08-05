$(document).on('click', '.hamburger', async function (e) {
    if ($(e.target).is('input')) {
        return;
    }

    const $checkbox = $(this).find('input[type="checkbox"]');
    const $currentRow = $(this).closest('.row');
    const $innerRows = $currentRow.closest('.table-rows-items').children('.inner-rows')
        .children('.table-rows-items').children('.row');
    if ($innerRows.length === 0 || $innerRows.html().trim() === '') {
        $checkbox.prop('checked', !$checkbox.prop('checked'))
        return;
    }
    $innerRows.closest('.table-rows-items').closest('.inner-rows').slideToggle(1000);
});

$('.table-header-resizer').on('mousedown', function(e) {
    e.preventDefault();
    
    const $resizer = $(this);
    const $parentHeader = $resizer.closest('[data-name]');
    const dataName = $parentHeader.data('name');
    const startX = e.clientX;
    const startWidth = parseFloat($parentHeader.css('width'));
    const minWidth = startWidth; // Минимальная ширина
    
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
  
  // Восстановление сохраненных ширины (опционально)
  $('[data-name]').each(function() {
    const dataName = $(this).data('name');
    const savedWidth = localStorage.getItem(`col-width-${dataName}`);
    if(savedWidth) {
      $(`[data-name="${dataName}"]`).css('width', savedWidth);
    }
  });


function formatDate(dateString) {
    if (!dateString) return "&nbsp;";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}


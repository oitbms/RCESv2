// Debug script to check checkbox handlers
// Add this right after renderEmployeeListForCreate is called

console.log('=== Debug: Employee Checkbox Handlers ===');

// Check if createSelectedEmployeeIds is accessible
console.log('createSelectedEmployeeIds:', this.createSelectedEmployeeIds);

// Test: manually select a checkbox and see what happens
dialog.find('#createEmployeeRows').on('change', '.employee-checkbox', function() {
    const empId = parseInt($(this).data('id'));
    console.log('Checkbox changed! empId:', empId);
    console.log('$(this).data("id"):', $(this).data('id'));
    console.log('$(this).prop("checked"):', $(this).prop('checked'));
    console.log('this (should be PdItem instance):', this);
    console.log('type of this:', typeof this);
});

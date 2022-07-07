toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "7000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

function ShowInfo(content) {
    toastr.info(content, 'TCDD');
}
function ShowError(content) {
    toastr.error(content, 'TCDD');
}
function ShowSuccess(content) {
    toastr.success(content, 'TCDD');
}
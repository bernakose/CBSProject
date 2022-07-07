var globalReportingInterval = null;
var globalReportingFromDbCity = null;
var globalReportingIsRegionLoad = false;
var globalReportingFromDbInterval = null;
var globalReportingIsNewCreated = false;
var globalReportingFromDbCityComponent = null;
var globalReportingFromDbCapacityComponent = null;
var globalReportingFromDbTypeComponent = null;
var globalReportingIsRegionLoadComponent = false;
var globalReportingIsComponentTypeLoadComponent = false;
var globalReportingFromDbIntervalComponent = null;
var globalReportingIsNewCreatedComponent = false;
var reportingTopMenu =
    '<div class="card borderless-card">'
    + '    <div class="card-block primary-breadcrumb" style="padding: 0.2rem !important;">'
    + '        <div class="breadcrumb-header">'
    + '            <div class="btn-group " role="group">'
    + '            <button type="button" id="btnHome" class="btn btn-primary btn-sm waves-effect waves-light"><i class="icofont icofont-home"></i>Home</button>'
    + '            <button type="button" id="btnDashboard"  class="btn btn-primary btn-sm waves-effect waves-light"><i class="icofont icofont-dashboard"></i>Dashboard</button>'
    + '            <button type="button" id="btnReporting"  class="btn btn-primary btn-sm waves-effect waves-light"><i class="icofont icofont-chart-bar-graph"></i>Reporting</button>'
    + '            </div>'
    + '        </div>'
    + '</div>';

var globalReportingAjaxRequestArr =
    [
        { Key: 'Regions', State: false },
        { Key: 'FiberReportAttributes', State: false },
        { Key: 'UserFiberLenReports', State: false }
    ];
$(document).ready(function () {
    ShowLoading();
    CheckSession();
    setInterval(function () { CheckSession(); }, 5000);
    globalReportingInterval = setInterval(function () { SetLoadingToHide(); }, 100);

    var selectText = 'Select';
    $('#exportBottom').hide();
    $('.menuBaseLayerList').remove();
    $('#btnShowProfileInfo').parent().hide();
    $('#btnSaveWorkpsace').parent().hide();
    $('.displayChatbox').hide();
    $('.pcoded-inner-navbar').html(reportingTopMenu);
    $('#btnSaveReport').attr('disabled', 'disabled');
    $('#fiberReportCity').attr('disabled', 'disabled');
    $("#myReports").attr('disabled', 'disabled');
    $('#exportButtons').hide();


    $('#startDateComponent').attr('disabled', 'disabled');
    $('#endDateComponent').attr('disabled', 'disabled');
    $('#typeOfComponent').attr('disabled', 'disabled');
    $('#capacityComponent').attr('disabled', 'disabled');
    $('#exportBottomComponent').hide();
    $('#btnSaveReportComponent').attr('disabled', 'disabled');
    $('#fiberReportCityComponent').attr('disabled', 'disabled');
    $("#myReportsComponent").attr('disabled', 'disabled');
    $('#exportButtonsComponent').hide();
    ShowHideBottomButtons(false);
    ShowHideBottomButtonsComponent(false);
    $('#groupByReport').select2({
        data: [
            { id: '-1', text: selectText },
            { id: 'Region', text: 'Region' },
            { id: 'City', text: 'City' },
            { id: 'Date', text: 'Date' },
            { id: 'Cable Type', text: 'Cable Type' },
            { id: 'Fiber Type', text: 'Fiber Type' },
            { id: 'Purpose Of Use', text: 'Purpose Of Use' },
            { id: 'Location', text: 'Location' },
            { id: 'Owner', text: 'Owner' },
            { id: 'Tenant', text: 'Tenant' }
        ]
    }).trigger('change');
    $('#componentType').select2({
        data: [
            { id: '-1', text: selectText },
            { id: 'POP', text: 'POP' },
            { id: 'OLT', text: 'OLT' },
            { id: 'Splitter', text: 'Splitter' },
            { id: 'Splice Box', text: 'Splice Box' }
        ]
    }).trigger('change');
    $('#groupByReportComponent').select2({
        data: [
            { id: '-1', text: selectText },
            { id: 'Region', text: 'Region' },
            { id: 'City', text: 'City' },
            { id: 'Date', text: 'Date' },
            { id: 'Type', text: 'Type' },
            { id: 'Capacity', text: 'Capacity' }
        ]
    }).trigger('change');
    $('#resultByReport').select2({
        data: [
            { id: '-1', text: selectText },
            { id: 'Sum', text: 'Sum (Length)' },
            { id: 'Count', text: 'Count' }
        ]
    }).trigger('change');
    $('#resultByReportComponent').select2({
        data: [
            { id: '-1', text: selectText },
            { id: 'Count', text: 'Count' }
        ]
    }).trigger('change');
    $('#chartType, #chartTypeComponent').select2({
        data: [
            { id: '-1', text: selectText },
            { id: 'bar', text: 'Bar' },
            { id: 'pie', text: 'Pie' },
            { id: 'spline', text: 'Line' }
        ]
    }).trigger('change');
    $('#palette, #paletteComponent').select2({
        data: [
            { id: '-1', text: selectText },
            { id: 'Material', text: 'Material' },
            { id: 'Soft Pastel', text: 'Soft Pastel' },
            { id: 'Harmony Light', text: 'Harmony Light' },
            { id: 'Pastel', text: 'Pastel' },
            { id: 'Bright', text: 'Bright' },
            { id: 'Soft', text: 'Soft' },
            { id: 'Ocean', text: 'Ocean' },
            { id: 'Office', text: 'Office' },
            { id: 'Vintage', text: 'Vintage' },
            { id: 'Violet', text: 'Violet' },
            { id: 'Carmine', text: 'Carmine' },
            { id: 'Dark Moon', text: 'Dark Moon' },
            { id: 'Soft Blue', text: 'Soft Blue' },
            { id: 'Dark Violet', text: 'Dark Violet' },
            { id: 'Green Mist', text: 'Green Mist' }
        ]
    }).trigger('change');
    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover'
    });
    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/Reporting/Regions",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var arrRes = [];
            $.each(data, function (a, b) {
                var item = { id: b.value, text: b.text };
                arrRes.push(item);
            });
            arrRes.unshift({ id: '-1', text: selectText });
            $("#fiberReportRegion").select2({
                data: arrRes,
                max_shown_results: 500
            }).trigger('change');
            $("#fiberReportCity").removeAttr('disabled');
            SetLoadingItemToTrue('Regions');
            $("#fiberReportRegion, #fiberReportRegionComponent").select2({
                data: arrRes,
                max_shown_results: 500
            }).trigger('change');
            $("#fiberReportCity, #fiberReportRegionComponent").removeAttr('disabled');
        },
        error: function (errMsg) {
            SetLoadingItemToTrue('Regions');
        }
    });
    GetUserLenReports(selectText);
    GetUserLenReportsComponent(selectText);
    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/Reporting/FiberReportAttributes",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $("#startDate").removeAttr('disabled');
            $("#endDate").removeAttr('disabled');
            $("#cableType").removeAttr('disabled');
            $("#fiberLocation").removeAttr('disabled');
            $("#fiberType").removeAttr('disabled');
            $("#owner").removeAttr('disabled');
            $("#purposeOfUse").removeAttr('disabled');
            $("#tenant").removeAttr('disabled');
            try {
                var minDt = new Date(data.minimumDate);
                var maxDt = new Date(data.maximumDate);
                if ((new Date()).getFullYear() - minDt.getFullYear() > 20) {
                    var tmpDt = new Date();
                    minDt = tmpDt.setMonth(tmpDt.getMonth() - 1);
                }
                if ((new Date()).getFullYear() - maxDt.getFullYear() > 20) {
                    var tmpDt = new Date();
                    minDt = tmpDt;
                }
                $("#startDate").dateDropper({
                    dropWidth: 200,
                    init_animation: "bounce",
                    dropPrimaryColor: "#1abc9c",
                    dropBorder: "1px solid #1abc9c",
                    currentDate: moment(minDt)
                });
                $("#endDate").dateDropper({
                    dropWidth: 200,
                    init_animation: "bounce",
                    dropPrimaryColor: "#1abc9c",
                    dropBorder: "1px solid #1abc9c",
                    currentDate: moment(maxDt)
                });
            } catch (e) {
                $("#startDate").attr('disabled', 'disabled');
                $("#endDate").attr('disabled', 'disabled');
            }
            var arrRes = [];
            if (data.cableType.length > 0) {
                arrRes = [];
                $.each(data.cableType.sort(dynamicSort("text")), function (a, b) {
                    var item = { id: b.value, text: b.text };
                    arrRes.push(item);
                });
                arrRes.unshift({ id: '-1', text: selectText });
                $("#cableType").select2({
                    data: arrRes
                }).trigger('change');
            }
            else {
                $("#cableType").attr('disabled', 'disabled');
            }
            if (data.fiberLocation.length > 0) {
                arrRes = [];
                $.each(data.fiberLocation.sort(dynamicSort("text")), function (a, b) {
                    var item = { id: b.value, text: b.text };
                    arrRes.push(item);
                });
                arrRes.unshift({ id: '-1', text: selectText });
                $("#fiberLocation").select2({
                    data: arrRes
                }).trigger('change');
            }
            else {
                $("#fiberLocation").attr('disabled', 'disabled');
            }
            if (data.fiberType.length > 0) {
                arrRes = [];
                $.each(data.fiberType.sort(dynamicSort("text")), function (a, b) {
                    var item = { id: b.value, text: b.text };
                    arrRes.push(item);
                });
                arrRes.unshift({ id: '-1', text: selectText });
                $("#fiberType").select2({
                    data: arrRes
                }).trigger('change');
            }
            else {
                $("#fiberType").attr('disabled', 'disabled');
            }
            if (data.owner.length > 0) {
                arrRes = [];
                $.each(data.owner.sort(dynamicSort("text")), function (a, b) {
                    var item = { id: b.value, text: b.text };
                    arrRes.push(item);
                });
                arrRes.unshift({ id: '-1', text: selectText });
                $("#owner").select2({
                    data: arrRes
                }).trigger('change');
            }
            else {
                $("#owner").attr('disabled', 'disabled');
            }
            if (data.purposeOfUse.length > 0) {
                arrRes = [];
                $.each(data.purposeOfUse.sort(dynamicSort("text")), function (a, b) {
                    var item = { id: b.value, text: b.text };
                    arrRes.push(item);
                });
                arrRes.unshift({ id: '-1', text: selectText });
                $("#purposeOfUse").select2({
                    data: arrRes
                }).trigger('change');
            }
            else {
                $("#purposeOfUse").attr('disabled', 'disabled');
            }
            if (data.tenant.length > 0) {
                arrRes = [];
                $.each(data.tenant.sort(dynamicSort("text")), function (a, b) {
                    var item = { id: b.value, text: b.text };
                    arrRes.push(item);
                });
                arrRes.unshift({ id: '-1', text: selectText });
                $("#tenant").select2({
                    data: arrRes
                }).trigger('change');
            }
            else {
                $("#tenant").attr('disabled', 'disabled');
            }
            SetLoadingItemToTrue('FiberReportAttributes');
        },
        error: function (errMsg) {
            SetLoadingItemToTrue('FiberReportAttributes');
        }
    });
    $('#btnHome').on('click', function () {
        location.href = appUrl;
    });
    $('#btnDashboard').on('click', function () {
        location.href = appUrl + "Reporting";
    });
    $('#btnReporting').on('click', function () {
        location.href = appUrl + "Reporting/FiberReports";
    });
    $('#startDateComponent').on('click', function () {
        $('#startDateComponent').val('');
    });
    $('#endDateComponent').on('click', function () {
        $('#endDateComponent').val('');
    });
    $('#startDate').on('click', function () {
        $('#startDate').val('');
    });
    $('#endDate').on('click', function () {
        $('#endDate').val('');
    });
    $("#dashboardExportAsImageComponent").on('click', function () {
        CreateImageComponent();
    });
    $("#dashboardExportAsPDFComponent").on('click', function () {
        CreatePDFComponent();
    });
    $("#dashboardExportAsImage").on('click', function () {
        CreateImage();
    });
    $("#dashboardExportAsPDF").on('click', function () {
        CreatePDF();
    });
    $('#componentType').change(function () {
        ShowLoading();
        $.ajax({
            type: "GET",
            url: webApiUrl + "/api/Reporting/FiberReportComponentAttributes?typeOfComponent=" + $(this).val(),
            headers: UserHelper.GetUserAjaxRequestOptions().headers,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                HideLoading();
                $('#typeOfComponent').empty();
                $('#capacityComponent').empty();
                $("#typeOfComponent").select2().trigger('change');
                $("#capacityComponent").select2().trigger('change');
                $('#startDateComponent').attr('disabled', 'disabled');
                $('#endDateComponent').attr('disabled', 'disabled');
                $('#typeOfComponent').attr('disabled', 'disabled');
                $('#capacityComponent').attr('disabled', 'disabled');
                $("#startDateComponent").val('');
                $("#endDateComponent").val('');
                if (data.maximumDate != null && data.minimumDate != null) {
                    try {
                        $("#startDateComponent").removeAttr('disabled');
                        $("#endDateComponent").removeAttr('disabled');
                        var minDt = new Date(data.minimumDate);
                        var maxDt = new Date(data.maximumDate);
                        if ((new Date()).getFullYear() - minDt.getFullYear() > 20) {
                            var tmpDt = new Date();
                            minDt = tmpDt.setMonth(tmpDt.getMonth() - 1);
                        }
                        if ((new Date()).getFullYear() - maxDt.getFullYear() > 20) {
                            var tmpDt = new Date();
                            minDt = tmpDt;
                        }
                        $("#startDateComponent").dateDropper({
                            dropWidth: 200,
                            init_animation: "bounce",
                            dropPrimaryColor: "#1abc9c",
                            dropBorder: "1px solid #1abc9c",
                            currentDate: moment(minDt)
                        });
                        $("#endDateComponent").dateDropper({
                            dropWidth: 200,
                            init_animation: "bounce",
                            dropPrimaryColor: "#1abc9c",
                            dropBorder: "1px solid #1abc9c",
                            currentDate: moment(maxDt)
                        });
                    } catch (e) {
                        $("#startDateComponent").attr('disabled', 'disabled');
                        $("#endDateComponent").attr('disabled', 'disabled');
                    }
                }
                if (data.typeColumn != null && data.typeColumn.length > 0) {
                    $("#typeOfComponent").removeAttr('disabled');
                    arrRes = [];
                    $.each(data.typeColumn.sort(dynamicSort("text")), function (a, b) {
                        var item = { id: b.value, text: b.text };
                        arrRes.push(item);
                    });
                    arrRes.unshift({ id: '-1', text: selectText });
                    $("#typeOfComponent").select2({
                        data: arrRes
                    }).trigger('change');
                    if (globalReportingFromDbTypeComponent) {
                        $("#typeOfComponent").val(globalReportingFromDbTypeComponent).trigger('change');
                        globalReportingFromDbTypeComponent = null;
                    }
                }
                if (data.capacity != null && data.capacity.length > 0) {
                    $("#capacityComponent").removeAttr('disabled');
                    arrRes = [];
                    $.each(data.capacity.sort(dynamicSort("text")), function (a, b) {
                        var item = { id: b.value, text: b.text };
                        arrRes.push(item);
                    });
                    arrRes.unshift({ id: '-1', text: selectText });
                    $("#capacityComponent").select2({
                        data: arrRes
                    }).trigger('change');
                    if (globalReportingFromDbCapacityComponent) {
                        $("#capacityComponent").val(globalReportingFromDbCapacityComponent).trigger('change');
                        globalReportingFromDbCapacityComponent = null;
                    }
                }
            },
            error: function (errMsg) {
                HideLoading();
            },
            statusCode: {
                401: function () {
                    location.href = "Login";
                }
            }
        });
    });
    $('#myReports').change(function () {
        if (globalReportingIsNewCreated) {
            return;
        }
        if ($(this).val() == '-1') {
            $('#bottomButtonsReport').hide();
            return;
        }
        else {
            $.ajax({
                type: "GET",
                url: webApiUrl + "/api/Reporting/GetFiberLengthReportById?reportId=" + parseInt($(this).val()),
                headers: UserHelper.GetUserAjaxRequestOptions().headers,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (data) {
                        ShowLoading();
                        $("#cableType").val('-1').trigger('change');
                        $("#palette").val('-1').trigger('change');
                        $("#chartType").val('-1').trigger('change');
                        $("#fiberReportRegion").val('-1').trigger('change');
                        $("#fiberReportCity").val('-1').trigger('change');
                        $("#endDate").val('');
                        $("#fiberLocation").val('-1').trigger('change');
                        $("#groupByReport").val('-1').trigger('change');
                        $("#owner").val('-1').trigger('change');
                        $("#purposeOfUse").val('-1').trigger('change');
                        $("#resultByReport").val('-1').trigger('change');
                        $("#fiberType").val('-1').trigger('change');
                        $("#startDate").val('');
                        $("#tenant").val('-1').trigger('change');
                        if (data.cableType) {
                            $("#cableType").val(data.cableType).trigger('change');
                        }
                        if (data.chartStyle) {
                            $("#palette").val(data.chartStyle).trigger('change');
                        }
                        if (data.chartType) {
                            $("#chartType").val(data.chartType).trigger('change');
                        }
                        if (data.regionName) {
                            $("#fiberReportRegion").val(data.regionName).trigger('change');
                        }
                        else {
                            globalReportingIsRegionLoad = true;
                        }
                        if (data.cityName) {
                            globalReportingFromDbCity = data.cityName;
                            $("#fiberReportCity").val(data.cityName).trigger('change');
                        }
                        if (data.endDate) {
                            $("#endDate").val(data.endDate);
                        }
                        if (data.fiberLocation) {
                            $("#fiberLocation").val(data.fiberLocation).trigger('change');
                        }
                        if (data.fiberType) {
                            $("#fiberType").val(data.fiberType).trigger('change');
                        }
                        if (data.groupBy) {
                            $("#groupByReport").val(data.groupBy).trigger('change');
                        }
                        if (data.owner) {
                            $("#owner").val(data.owner).trigger('change');
                        }
                        if (data.purposeOfUse) {
                            $("#purposeOfUse").val(data.purposeOfUse).trigger('change');
                        }
                        if (data.resultBy) {
                            $("#resultByReport").val(data.resultBy).trigger('change');
                        }
                        if (data.startDate) {
                            $("#startDate").val(data.startDate);
                        }
                        if (data.tenant) {
                            $("#tenant").val(data.tenant).trigger('change');
                        }
                        globalReportingFromDbInterval = setInterval(createReportClick, 100);

                    }
                    else {
                        swal({ title: 'An error occur while getting report, page will be refreshed.' }, (function () {
                            location.reload();
                        }));
                    }
                },
                error: function (errMsg) {
                },
                statusCode: {
                    401: function () {
                        location.href = "Login";
                    }
                }
            });
        }
    });
    $('#myReportsComponent').change(function () {
        if (globalReportingIsNewCreatedComponent) {
            return;
        }
        if ($(this).val() == '-1') {
            $('#bottomButtonsReportComponent').hide();
            return;
        }
        else {
            $.ajax({
                type: "GET",
                url: webApiUrl + "/api/Reporting/GetFiberLengthReportByIdComponent?reportId=" + parseInt($(this).val()),
                headers: UserHelper.GetUserAjaxRequestOptions().headers,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (data) {
                        $('#typeOfComponent').empty();
                        $('#capacityComponent').empty();
                        $("#typeOfComponent").select2().trigger('change');
                        $("#capacityComponent").select2().trigger('change');
                        $('#startDateComponent').attr('disabled', 'disabled');
                        $('#endDateComponent').attr('disabled', 'disabled');
                        $('#typeOfComponent').attr('disabled', 'disabled');
                        $('#capacityComponent').attr('disabled', 'disabled');
                        $("#startDateComponent").val('');
                        $("#endDateComponent").val('');
                        if (data.chartStyle) {
                            $("#paletteComponent").val(data.chartStyle).trigger('change');
                        }
                        if (data.chartType) {
                            $("#chartTypeComponent").val(data.chartType).trigger('change');
                        }
                        if (data.regionName) {
                            $("#fiberReportRegionComponent").val(data.regionName).trigger('change');
                        }
                        else {
                            globalReportingIsRegionLoadComponent = true;
                        }
                        if (data.componentType) {
                            $("#componentType").val(data.componentType).trigger('change');
                        }
                        else {
                            globalReportingIsComponentTypeLoadComponent = true;
                        }
                        if (data.cityName) {
                            globalReportingFromDbCityComponent = data.cityName;
                            $("#fiberReportCityComponent").val(data.cityName).trigger('change');
                        }
                        if (data.capacity) {
                            globalReportingFromDbCapacityComponent = data.capacity;
                            $("#capacityComponent").val(data.capacity).trigger('change');
                        }
                        if (data.typeOfComponent) {
                            globalReportingFromDbTypeComponent = data.typeOfComponent;
                            $("#typeOfComponent").val(data.typeOfComponent).trigger('change');
                        }
                        if (data.endDate) {
                            $("#endDateComponent").val(data.endDate);
                        }
                        if (data.groupBy) {
                            $("#groupByReportComponent").val(data.groupBy).trigger('change');
                        }
                        if (data.resultBy) {
                            $("#resultByReportComponent").val(data.resultBy).trigger('change');
                        }
                        if (data.startDate) {
                            $("#startDateComponent").val(data.startDate);
                        }
                        globalReportingFromDbIntervalComponent = setInterval(createReportClickComponent, 100);

                    }
                    else {
                        swal({ title: 'An error occur while getting report, page will be refreshed.' }, (function () {
                            location.reload();
                        }));
                    }
                },
                error: function (errMsg) {
                },
                statusCode: {
                    401: function () {
                        location.href = "Login";
                    }
                }
            });
        }
    });
    $('#fiberReportRegion').change(function () {
        $('#fiberReportCity').empty();
        $('#fiberReportCity').attr('disabled', 'disabled');
        if ($(this).val() == '-1') {
            return;
        }
        ShowLoading();
        $.ajax({
            type: "GET",
            url: webApiUrl + "/api/Reporting/Cities?regionName=" + $(this).val(),
            headers: UserHelper.GetUserAjaxRequestOptions().headers,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                HideLoading();
                var arrRes = [];
                $.each(data, function (a, b) {
                    var item = { id: b.value, text: b.text };
                    arrRes.push(item);
                });
                arrRes.unshift({ id: '-1', text: selectText });
                if (arrRes.length == 1)
                    $('#fiberReportCity').attr('disabled', 'disabled');
                else
                    $('#fiberReportCity').removeAttr('disabled');
                $('#fiberReportCity').select2({
                    data: arrRes
                }).trigger('change');
                if (globalReportingFromDbCity) {
                    $("#fiberReportCity").val(globalReportingFromDbCity).trigger('change');
                    globalReportingFromDbCity = null;
                }
                globalReportingIsRegionLoad = true;
            },
            error: function (errMsg) {
                globalReportingIsRegionLoad = true;
                HideLoading();
            }
        });
    });
    $('#fiberReportRegionComponent').change(function () {
        $('#fiberReportCityComponent').empty();
        $('#fiberReportCityComponent').attr('disabled', 'disabled');
        if ($(this).val() == '-1') {
            return;
        }
        ShowLoading();
        $.ajax({
            type: "GET",
            url: webApiUrl + "/api/Reporting/Cities?regionName=" + $(this).val(),
            headers: UserHelper.GetUserAjaxRequestOptions().headers,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                HideLoading();
                var arrRes = [];
                $.each(data, function (a, b) {
                    var item = { id: b.value, text: b.text };
                    arrRes.push(item);
                });
                arrRes.unshift({ id: '-1', text: selectText });
                if (arrRes.length == 1)
                    $('#fiberReportCityComponent').attr('disabled', 'disabled');
                else
                    $('#fiberReportCityComponent').removeAttr('disabled');
                $('#fiberReportCityComponent').select2({
                    data: arrRes
                }).trigger('change');
                if (globalReportingFromDbCityComponent) {
                    $("#fiberReportCityComponent").val(globalReportingFromDbCityComponent).trigger('change');
                    globalReportingFromDbCityComponent = null;
                }
                globalReportingIsRegionLoadComponent = true;
            },
            error: function (errMsg) {
                globalReportingIsRegionLoadComponent = true;
                HideLoading();
            }
        });
    });
    $("#btnDashboardReportComponent").on('click', function () {
        if ($("#myReportsComponent").val() == null || $("#myReportsComponent").val() == '-1')
            return;
        swal({
            title: "TCDD",
            text: "Are you sure to add this report to your dashboard?",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $.ajax({
                type: "GET",
                url: webApiUrl + "/api/Reporting/DashboardFiberLengthReportComponent?reportId=" + parseInt($("#myReportsComponent").val()),
                headers: UserHelper.GetUserAjaxRequestOptions().headers,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    swal({ title: 'Operation success.' }, (function () {
                    }));
                },
                error: function (errMsg) {
                },
                statusCode: {
                    401: function () {
                        location.href = "Login";
                    }
                }
            });
        });
    });
    $("#btnDeleteReportComponent").on('click', function () {
        if ($("#myReportsComponent").val() == null || $("#myReportsComponent").val() == '-1')
            return;
        swal({
            title: "TCDD",
            text: "Are you sure to delete this report?",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $.ajax({
                type: "GET",
                url: webApiUrl + "/api/Reporting/DeleteFiberLengthReportComponent?reportId=" + parseInt($("#myReportsComponent").val()),
                headers: UserHelper.GetUserAjaxRequestOptions().headers,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    swal({ title: 'Operation success, page will be refreshed.' }, (function () {
                        location.reload();
                    }));
                },
                error: function (errMsg) {
                },
                statusCode: {
                    401: function () {
                        location.href = "Login";
                    }
                }
            });
        });
    });
    $("#btnDashboardReport").on('click', function () {
        if ($("#myReports").val() == null || $("#myReports").val() == '-1')
            return;
        swal({
            title: "TCDD",
            text: "Are you sure to add this report to your dashboard?",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $.ajax({
                type: "GET",
                url: webApiUrl + "/api/Reporting/DashboardFiberLengthReport?reportId=" + parseInt($("#myReports").val()),
                headers: UserHelper.GetUserAjaxRequestOptions().headers,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    swal({ title: 'Operation success.' }, (function () {
                    }));
                },
                error: function (errMsg) {
                },
                statusCode: {
                    401: function () {
                        location.href = "Login";
                    }
                }
            });
        });
    });
    $("#btnDeleteReport").on('click', function () {
        if ($("#myReports").val() == null || $("#myReports").val() == '-1')
            return;
        swal({
            title: "TCDD",
            text: "Are you sure to delete this report?",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $.ajax({
                type: "GET",
                url: webApiUrl + "/api/Reporting/DeleteFiberLengthReport?reportId=" + parseInt($("#myReports").val()),
                headers: UserHelper.GetUserAjaxRequestOptions().headers,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    swal({ title: 'Operation success, page will be refreshed.' }, (function () {
                        location.reload();
                    }));
                },
                error: function (errMsg) {
                },
                statusCode: {
                    401: function () {
                        location.href = "Login";
                    }
                }
            });
        });
    });
    $("#btnSaveReportComponent").on('click', function () {
        swal({
            title: "TCDD",
            text: "Are you sure to save the report?",
            inputPlaceholder: "Name of report",
            type: "input",
            animation: "slide-from-top",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function (inputValue) {
            if (inputValue === false) return false;

            if (inputValue === "") {
                swal.showInputError("You need to write name of report.");
                return false
            }
            if (inputValue.length > 199) {
                swal.showInputError("Maximum name should be 200 character.");
                return false
            }
            $.ajax({
                type: "GET",
                url: webApiUrl + "/api/Reporting/SaveFiberLengthReportComponent?regionName=" + $('#fiberReportRegionComponent').val() + "&cityName=" + $('#fiberReportCityComponent').val() + "&startDate=" + $('#startDateComponent').val() + "&endDate=" + $('#endDateComponent').val() + "&typeOf=" + $('#typeOfComponent').val() + "&capacity=" + $('#capacityComponent').val() + "&componentType=" + $('#componentType').val() + "&groupByColumn=" + $('#groupByReportComponent').val() + "&resultBy=" + $('#resultByReportComponent').val() + "&chartType=" + $('#chartTypeComponent').val() + "&chartStyle=" + $('#paletteComponent').val() + "&isDashboard=0" + "&reportName=" + inputValue,
                headers: UserHelper.GetUserAjaxRequestOptions().headers,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (data > -1) {
                        swal({ title: 'Operation success.' }, (function () {
                            $('#bottomButtonsReportComponent').show();
                            globalReportingIsNewCreatedComponent = true;
                            GetUserLenReportsComponent(selectText, data);
                        }));
                    }
                    else {
                        swal({ title: 'An error occur while saving report.' }, (function () {
                        }));
                    }
                },
                error: function (errMsg) {
                },
                statusCode: {
                    401: function () {
                        location.href = "Login";
                    }
                }
            });
        });
    });
    $("#btnSaveReport").on('click', function () {
        swal({
            title: "TCDD",
            text: "Are you sure to save the report?",
            inputPlaceholder: "Name of report",
            type: "input",
            animation: "slide-from-top",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function (inputValue) {
            if (inputValue === false) return false;

            if (inputValue === "") {
                swal.showInputError("You need to write name of report.");
                return false
            }
            if (inputValue.length > 199) {
                swal.showInputError("Maximum name should be 200 character.");
                return false
            }
            $.ajax({
                type: "GET",
                url: webApiUrl + "/api/Reporting/SaveFiberLengthReport?regionName=" + $('#fiberReportRegion').val() + "&cityName=" + $('#fiberReportCity').val() + "&startDate=" + $('#startDate').val() + "&endDate=" + $('#endDate').val() + "&cableType=" + $('#cableType').val() + "&fiberType=" + $('#fiberType').val() + "&purposeOfUse=" + $('#purposeOfUse').val() + "&fiberLocation=" + $('#fiberLocation').val() + "&owner=" + $('#owner').val() + "&tenant=" + $('#tenant').val() + "&groupByColumn=" + $('#groupByReport').val() + "&resultBy=" + $('#resultByReport').val() + "&chartType=" + $('#chartType').val() + "&chartStyle=" + $('#palette').val() + "&isDashboard=0" + "&reportName=" + inputValue,
                headers: UserHelper.GetUserAjaxRequestOptions().headers,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (data > -1) {
                        swal({ title: 'Operation success.' }, (function () {
                            $('#bottomButtonsReport').show();
                            globalReportingIsNewCreated = true;
                            GetUserLenReports(selectText, data);
                        }));
                    }
                    else {
                        swal({ title: 'An error occur while saving report.' }, (function () {
                        }));
                    }
                },
                error: function (errMsg) {
                },
                statusCode: {
                    401: function () {
                        location.href = "Login";
                    }
                }
            });
        });
    });
    $("#btnCreateReportComponent").on('click', function () {
        $('#exportButtonsComponent').hide();
        ShowHideBottomButtonsComponent(false);
        if ($('#groupByReportComponent').val() == '-1') {
            ShowInfo('You should select group by section.');
            return;
        }
        if ($('#resultByReportComponent').val() == '-1') {
            ShowInfo('You should select result by section.');
            return;
        }
        if ($('#chartTypeComponent').val() == '-1') {
            ShowInfo('You should select chart type section.');
            return;
        }
        if ($('#paletteComponent').val() == '-1') {
            ShowInfo('You should select chart style section.');
            return;
        }
        var d1 = moment($('#startDateComponent').val(), 'DD/MM/YYYY').toDate();
        var d2 = moment($('#endDateComponent').val(), 'DD/MM/YYYY').toDate();
        if ($('#startDateComponent').val() != "" && d1 == 'Invalid Date') {
            ShowInfo(d1);
            return;
        }
        if ($('#endDateComponent').val() != "" && d2 == 'Invalid Date') {
            ShowInfo(d2);
            return;
        }
        if (d1 > d2) {
            ShowInfo('Start date can not be bigger than end date');
            return;
        }
        var resGroupSelection = CheckGroupBySelectionComponent();
        if (!resGroupSelection.IsSuccess) {
            ShowInfo(resGroupSelection.Msg);
            return;
        }
        var resGroupComponentSelection = CheckGroupByAndComponentName();
        if (!resGroupComponentSelection.IsSuccess) {
            ShowInfo(resGroupComponentSelection.Msg);
            return;
        }
        ShowLoading();
        $.ajax({
            type: "GET",
            url: webApiUrl + "/api/Reporting/CreateFiberLengthReportComponent?regionName=" + $('#fiberReportRegionComponent').val() + "&cityName=" + $('#fiberReportCityComponent').val() + "&startDate=" + $('#startDateComponent').val() + "&endDate=" + $('#endDateComponent').val() + "&typeOf=" + $('#typeOfComponent').val() + "&capacity=" + $('#capacityComponent').val() + "&componentType=" + $('#componentType').val() + "&groupByColumn=" + $('#groupByReportComponent').val() + "&resultBy=" + $('#resultByReportComponent').val(),
            headers: UserHelper.GetUserAjaxRequestOptions().headers,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var howMany = 0;
                var withoutRangeData;
                if (data.olt != null && data.olt.length > 0) {
                    data.olt = data.olt.filter(a => a.text != null);
                    withoutRangeData = data.olt;
                    howMany++;
                }
                if (data.pop != null && data.pop.length > 0) {
                    data.pop = data.pop.filter(a => a.text != null);
                    withoutRangeData = data.pop;
                    howMany++;
                }
                if (data.splitter != null && data.splitter.length > 0) {
                    data.splitter = data.splitter.filter(a => a.text != null);
                    withoutRangeData = data.splitter;
                    howMany++;
                }
                if (data.spliceBox != null && data.spliceBox.length > 0) {
                    data.spliceBox = data.spliceBox.filter(a => a.text != null);
                    withoutRangeData = data.spliceBox;
                    howMany++;
                }
                DisposeCharts('fiberCustomReportComponent');
                if (howMany == 1) {
                    CreateDXReport('fiberCustomReportComponent', withoutRangeData, $('#chartTypeComponent').val(), $('#paletteComponent').val());
                    PrepareGridComponent('fiberCustomReportGridComponent', withoutRangeData);
                }
                else {
                    CreateDXRangeReport('fiberCustomReportComponent', data, $('#chartTypeComponent').val(), $('#paletteComponent').val());
                    var getedData = PrepareRangeGridData(data);
                    PrepareGridRangeComponent('fiberCustomReportGridComponent', getedData);
                }
                $('#btnSaveReportComponent').removeAttr('disabled');
                ShowHideBottomButtonsComponent(true);
                HideLoading();
            },
            error: function (errMsg) {
                HideLoading();
            }
        });
    });
    $("#btnCreateReport").on('click', function () {
        $('#exportButtons').hide();
        ShowHideBottomButtons(false);
        if ($('#groupByReport').val() == '-1') {
            ShowInfo('You should select group by section.');
            return;
        }
        if ($('#resultByReport').val() == '-1') {
            ShowInfo('You should select result by section.');
            return;
        }
        if ($('#chartType').val() == '-1') {
            ShowInfo('You should select chart type section.');
            return;
        }
        if ($('#palette').val() == '-1') {
            ShowInfo('You should select chart style section.');
            return;
        }
        var d1 = moment($('#startDate').val(), 'DD/MM/YYYY').toDate();
        var d2 = moment($('#endDate').val(), 'DD/MM/YYYY').toDate();
        if ($('#startDate').val() != "" && d1 == 'Invalid Date') {
            ShowInfo(d1);
            return;
        }
        if ($('#endDate').val() != "" && d2 == 'Invalid Date') {
            ShowInfo(d2);
            return;
        }
        if (d1 > d2) {
            ShowInfo('Start date can not be bigger than end date');
            return;
        }
        var resGroupSelection = CheckGroupBySelection();
        if (!resGroupSelection.IsSuccess) {
            ShowInfo(resGroupSelection.Msg);
            return;
        }
        ShowLoading();
        $.ajax({
            type: "GET",
            url: webApiUrl + "/api/Reporting/CreateFiberLengthReport?regionName=" + $('#fiberReportRegion').val() + "&cityName=" + $('#fiberReportCity').val() + "&startDate=" + $('#startDate').val() + "&endDate=" + $('#endDate').val() + "&cableType=" + $('#cableType').val() + "&fiberType=" + $('#fiberType').val() + "&purposeOfUse=" + $('#purposeOfUse').val() + "&fiberLocation=" + $('#fiberLocation').val() + "&owner=" + $('#owner').val() + "&tenant=" + $('#tenant').val() + "&groupByColumn=" + $('#groupByReport').val() + "&resultBy=" + $('#resultByReport').val(),
            headers: UserHelper.GetUserAjaxRequestOptions().headers,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                data = data.filter(a => a.text != null);
                DisposeCharts('fiberCustomReport');
                CreateDXReport('fiberCustomReport', data, $('#chartType').val(), $('#palette').val());
                PrepareGrid('fiberCustomReportGrid', data);
                $('#btnSaveReport').removeAttr('disabled');
                ShowHideBottomButtons(true);
                HideLoading();
            },
            error: function (errMsg) {
                HideLoading();
            }
        });
    });
});
function PrepareGrid(divId, data, isRefresh) {
    $('#exportButtons').show();
    var newData = [];
    data.forEach(function (item) {
        var item = { Content: item.text, Value: item.value };
        newData.push(item);
    });
    try {
        $("#" + divId).dxDataGrid("dispose");
    } catch (e) {

    }
    $("#" + divId).dxDataGrid({
        dataSource: newData,
        howColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        showBorders: true,
        selection: {
            mode: "single",
            showCheckBoxesMode: "onClick"
        },
        paging: {
            pageSize: newData.length
        },
        allowColumnReordering: true,
        columns: GetColumnsFromJSON(newData)
    });
}
function PrepareGridRangeComponent(divId, data, isRefresh) {
    $('#exportButtonsComponent').show();
    try {
        $("#" + divId).dxDataGrid("dispose");
    } catch (e) {

    }
    $("#" + divId).dxDataGrid({
        dataSource: data,
        howColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        showBorders: true,
        selection: {
            mode: "single",
            showCheckBoxesMode: "onClick"
        },
        paging: {
            pageSize: data.length
        },
        allowColumnReordering: true,
        columns: GetColumnsFromJSON(data)
    });
}
function PrepareGridComponent(divId, data, isRefresh) {
    $('#exportButtonsComponent').show();
    var newData = [];
    data.forEach(function (item) {
        var item = { Content: item.text, Value: item.value };
        newData.push(item);
    });
    try {
        $("#" + divId).dxDataGrid("dispose");
    } catch (e) {

    }
    $("#" + divId).dxDataGrid({
        dataSource: newData,
        howColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        showBorders: true,
        selection: {
            mode: "single",
            showCheckBoxesMode: "onClick"
        },
        paging: {
            pageSize: newData.length
        },
        allowColumnReordering: true,
        columns: GetColumnsFromJSON(newData)
    });
}
function createReportClickComponent() {
    HideLoading();
    $('#btnCreateReportComponent').trigger('click');
    globalReportingIsRegionLoadComponent = false;
    ShowHideBottomButtonsComponent(true);
    clearInterval(globalReportingFromDbIntervalComponent);
}
function createReportClick() {
    HideLoading();
    $('#btnCreateReport').trigger('click');
    globalReportingIsRegionLoad = false;
    ShowHideBottomButtons(true);
    clearInterval(globalReportingFromDbInterval);
}
function ShowHideBottomButtons(isShow) {
    if (isShow) {
        if ($("#myReports").val() == null || $("#myReports").val() == '-1')
            return;
        if (!$('#bottomButtonsReport').hasClass('d-flex'))
            $('#bottomButtonsReport').addClass('d-flex');
        $('#bottomButtonsReport').show();
    }
    else {
        if ($('#bottomButtonsReport').hasClass('d-flex'))
            $('#bottomButtonsReport').removeClass('d-flex');
        $('#bottomButtonsReport').hide();
    }
}
function ShowHideBottomButtonsComponent(isShow) {
    if (isShow) {
        if ($("#myReportsComponent").val() == null || $("#myReportsComponent").val() == '-1')
            return;
        if (!$('#bottomButtonsReportComponent').hasClass('d-flex'))
            $('#bottomButtonsReportComponent').addClass('d-flex');
        $('#bottomButtonsReportComponent').show();
    }
    else {
        if ($('#bottomButtonsReportComponent').hasClass('d-flex'))
            $('#bottomButtonsReportComponent').removeClass('d-flex');
        $('#bottomButtonsReportComponent').hide();
    }
}

function GetColumnsFromJSON(data) {
    var arr = [];
    if (data.length > 0) {
        var columnsIn = data[0];
        for (var key in columnsIn) {
            arr.push(key);
        }
    }
    return arr;
}
function CreateExportTextComponent() {
    var bigText = 'Group by: ' + $('#groupByReportComponent').val() + ", Report Type: " + $('#resultByReportComponent').val() + ", ";
    if ($('#fiberReportRegionComponent').val() != '-1')
        bigText += 'Region: ' + $('#fiberReportRegionComponent').val() + ', ';
    if ($('#fiberReportCityComponent').val() != '-1' && $('#fiberReportCityComponent').val() != null)
        bigText += 'City: ' + $('#fiberReportCityComponent').val() + ', ';
    if ($('#startDateComponent').val() != '')
        bigText += 'Start Date: ' + $('#startDateComponent').val() + ' ' + 'End Date: ' + $('#endDateComponent').val() + ', ';
    if ($('#typeOfComponent').val() != null && $('#typeOfComponent').val() != '-1')
        bigText += 'Type: ' + $('#typeOfComponent').val() + ', ';
    if ($('#capacityComponent').val() != null && $('#capacityComponent').val() != '-1')
        bigText += 'Capacity: ' + $('#capacityComponent').val() + ', ';
    if ($('#componentType').val() != '-1')
        bigText += 'Component Type: ' + $('#componentType').val() + ', ';
    if (bigText != '')
        bigText = bigText.substr(0, bigText.length - 2)
    $('#exportBottomComponent').show();
    $('#exportBottomComponent p').text('Report created by TCDD, date: ' + new Date().toJSON().slice(0, 10) + ', time: ' + new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toJSON().slice(11, 19) + ', user: ' + UserHelper.GetUser().Name + ' ' + UserHelper.GetUser().Surname + ' ' + bigText);
}
function CreateExportText() {
    var bigText = 'Group by: ' + $('#groupByReport').val() + ", Report Type: " + $('#resultByReport').val() + ", ";
    if ($('#fiberReportRegion').val() != '-1')
        bigText += 'Region: ' + $('#fiberReportRegion').val() + ', ';
    if ($('#fiberReportCity').val() != '-1' && $('#fiberReportCity').val() != null)
        bigText += 'City: ' + $('#fiberReportCity').val() + ', ';
    if ($('#startDate').val() != '')
        bigText += 'Start Date: ' + $('#startDate').val() + ' ' + 'End Date: ' + $('#endDate').val() + ', ';
    if ($('#cableType').val() != '-1')
        bigText += 'Cable Type: ' + $('#cableType').val() + ', ';
    if ($('#fiberType').val() != '-1')
        bigText += 'Fiber Type: ' + $('#fiberType').val() + ', ';
    if ($('#purposeOfUse').val() != '-1')
        bigText += 'Purpose Of Use: ' + $('#purposeOfUse').val() + ', ';
    if ($('#fiberLocation').val() != '-1')
        bigText += 'Location: ' + $('#fiberLocation').val() + ', ';
    if ($('#owner').val() != '-1')
        bigText += 'Owner: ' + $('#owner').val() + ', ';
    if ($('#tenant').val() != '-1')
        bigText += 'Tenant: ' + $('#tenant').val() + ', ';
    if (bigText != '')
        bigText = bigText.substr(0, bigText.length - 2)
    $('#exportBottom').show();
    $('#exportBottom p').text('Report created by TCDD, date: ' + new Date().toJSON().slice(0, 10) + ', time: ' + new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toJSON().slice(11, 19) + ', user: ' + UserHelper.GetUser().Name + ' ' + UserHelper.GetUser().Surname + ' ' + bigText);
}
function CheckGroupBySelection() {
    var message = 'If you select ' + $('#groupByReport').val() + ' for group, you should\'nt select any ' + $('#groupByReport').val() + '.';
    var res = {
        IsSuccess: true,
        Msg: message
    };
    if ($('#groupByReport').val() == 'Region' && $('#fiberReportRegion').val() != '-1') {
        res.IsSuccess = false;
    }
    else if ($('#groupByReport').val() == 'City' && $('#fiberReportCity').val() != null) {
        if ($('#fiberReportCity').val() != '-1')
            res.IsSuccess = false;
    }
    else if ($('#groupByReport').val() == 'Date' && $('#startDate').val() != '' && $('#endDate').val() != '') {
        res.IsSuccess = false;
    }
    else if ($('#groupByReport').val() == 'Cable Type' && $('#cableType').val() != '-1') {
        res.IsSuccess = false;
    }
    else if ($('#groupByReport').val() == 'Fiber Type' && $('#fiberType').val() != '-1') {
        res.IsSuccess = false;
    }
    else if ($('#groupByReport').val() == 'Purpose Of Use' && $('#purposeOfUse').val() != '-1') {
        res.IsSuccess = false;
    }
    else if ($('#groupByReport').val() == 'Location' && $('#fiberLocation').val() != '-1') {
        res.IsSuccess = false;
    }
    else if ($('#groupByReport').val() == 'Owner' && $('#owner').val() != '-1') {
        res.IsSuccess = false;
    }
    else if ($('#groupByReport').val() == 'Tenant' && $('#tenant').val() != '-1') {
        res.IsSuccess = false;
    }
    return res;
}
function CheckGroupBySelectionComponent() {
    var message = 'If you select ' + $('#groupByReportComponent').val() + ' for group, you should\'nt select any ' + $('#groupByReportComponent').val() + '.';
    var res = {
        IsSuccess: true,
        Msg: message
    };
    if ($('#groupByReportComponent').val() == 'Region' && $('#fiberReportRegionComponent').val() != '-1') {
        res.IsSuccess = false;
    }
    else if ($('#groupByReportComponent').val() == 'City' && $('#fiberReportCityComponent').val() != null) {
        if ($('#fiberReportCityComponent').val() != '-1')
            res.IsSuccess = false;
    }
    else if ($('#groupByReportComponent').val() == 'Date' && $('#startDateComponent').val() != '' && $('#endDateComponent').val() != '') {
        res.IsSuccess = false;
    }
    else if ($('#groupByReportComponent').val() == 'Cable Type' && $('#typeOfComponent').val() != '-1') {
        res.IsSuccess = false;
    }
    else if ($('#groupByReportComponent').val() == 'Fiber Type' && $('#capacityComponent').val() != '-1') {
        res.IsSuccess = false;
    }
    return res;
}
function CheckGroupByAndComponentName() {
    var res = {
        IsSuccess: true,
        Msg: ''
    };
    if ($('#groupByReportComponent').val() == 'Type') {
        if ($('#componentType').val() != 'Splitter')
            if ($('#componentType').val() != 'Splice Box') {
                res.IsSuccess = false;
                res.Msg = 'If you select ' + $('#groupByReportComponent').val() + ' for group, you should select Splitter or Splice Box for component type.';
            }
    }
    else if ($('#groupByReportComponent').val() == 'Capacity' && $('#componentType').val() == '-1') {
        res.Msg = 'If you select ' + $('#groupByReportComponent').val() + ' for group, you should select OLT, Splice Box or Splitter component type.';
        res.IsSuccess = false;
    }
    else if ($('#groupByReportComponent').val() == 'Capacity' && $('#componentType').val() == 'POP') {
        res.Msg = 'If you select ' + $('#groupByReportComponent').val() + ' for group, you should\'nt select POP component type.';
        res.IsSuccess = false;
    }
    else if ($('#groupByReportComponent').val() == 'Date') {
        if ($('#componentType').val() != 'POP')
            if ($('#componentType').val() != 'Splice Box') {
                res.IsSuccess = false;
                res.Msg = 'If you select ' + $('#groupByReportComponent').val() + ' for group, you should select POP or Splice Box for component type.';
            }
    }
    if ($('#chartTypeComponent').val() == 'pie' && $('#componentType').val() == '-1') {
        res.Msg = 'If you want to see pie chart you should select one component type.';
        res.IsSuccess = false;
    }
    return res;
}
function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
}
function CheckSession() {
    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/Reporting/CheckSession",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
        },
        error: function (errMsg) {
        },
        statusCode: {
            401: function () {
                location.href = "Login";
            }
        }
    });
}
function SetLoadingItemToTrue(key) {
    globalReportingAjaxRequestArr.filter(function (item) { return item.Key == key })[0].State = true;
}
function SetLoadingToHide() {
    if (globalReportingAjaxRequestArr.filter(function (item) { return item.State == false }).length == 0) {
        HideLoading();
        clearInterval(globalReportingInterval);
    }
}
function toggleVisibility(item) {
    if (item.isVisible()) {
        item.hide();
    } else {
        item.show();
    }
}
function DisposeCharts(divId) {
    try {
        $('#' + divId).dxChart("dispose");
    } catch (e) {

    }
    try {
        $('#' + divId).dxPieChart("dispose");
    } catch (e) {
    }
}
function UpdateDXReport(divId, type, style) {
    var data = null;
    try {
        data = $('#' + divId).dxPieChart().data().dxPieChart._dataSource.store()._array;
    } catch (e) {
        data = $('#' + divId).dxChart().data().dxChart._dataSource.store()._array;
    }
    DisposeCharts(divId);
    CreateDXReport(divId, data, type, style);
}
function PrepareRangeGridData(data) {
    var firstValues = [];
    var res = [];
    if (data.olt != null && data.olt.length > 0) {
        $.each(data.olt, function (a, b) {
            firstValues.push(b.text);
        });
    }
    if (data.pop != null && data.pop.length > 0) {
        $.each(data.pop, function (a, b) {
            firstValues.push(b.text);
        });
    }
    if (data.splitter != null && data.splitter.length > 0) {
        $.each(data.splitter, function (a, b) {
            firstValues.push(b.text);
        });
    }
    if (data.spliceBox != null && data.spliceBox.length > 0) {
        $.each(data.spliceBox, function (a, b) {
            firstValues.push(b.text);
        });
    }
    firstValues = firstValues.map(item => item).filter((value, index, self) => self.indexOf(value) === index);
    $.each(firstValues, function (a, b) {
        res.push({ key: b, olt: 0, pop: 0, splitter: 0, splicebox: 0 });
    });
    if (data.olt != null && data.olt.length > 0) {
        $.each(data.olt, function (a, b) {
            res.filter(a => a.key == b.text)[0].olt = b.value;
        });
    }
    if (data.pop != null && data.pop.length > 0) {
        $.each(data.pop, function (a, b) {
            res.filter(a => a.key == b.text)[0].pop = b.value;
        });
    }
    if (data.splitter != null && data.splitter.length > 0) {
        $.each(data.splitter, function (a, b) {
            res.filter(a => a.key == b.text)[0].splitter = b.value;
        });
    }
    if (data.spliceBox != null && data.spliceBox.length > 0) {
        $.each(data.spliceBox, function (a, b) {
            res.filter(a => a.key == b.text)[0].splicebox = b.value;
        });
    }
    return res;
}
function CreateDXRangeReport(divId, data, type, style) {
    var firstValues = [];
    var res = [];
    var seriesOption = [];
    if (data.olt != null && data.olt.length > 0) {
        $.each(data.olt, function (a, b) {
            firstValues.push(b.text);
        });
    }
    if (data.pop != null && data.pop.length > 0) {
        $.each(data.pop, function (a, b) {
            firstValues.push(b.text);
        });
    }
    if (data.splitter != null && data.splitter.length > 0) {
        $.each(data.splitter, function (a, b) {
            firstValues.push(b.text);
        });
    }
    if (data.spliceBox != null && data.spliceBox.length > 0) {
        $.each(data.spliceBox, function (a, b) {
            firstValues.push(b.text);
        });
    }
    firstValues = firstValues.map(item => item).filter((value, index, self) => self.indexOf(value) === index);
    $.each(firstValues, function (a, b) {
        res.push({ key: b, oltvalue: 0, popvalue: 0, splittervalue: 0, spliceboxvalue: 0 });
    });
    if (data.olt != null && data.olt.length > 0) {
        $.each(data.olt, function (a, b) {
            res.filter(a => a.key == b.text)[0].oltvalue = b.value;
        });
        seriesOption.push({ valueField: "oltvalue", name: "OLT" });
    }
    if (data.pop != null && data.pop.length > 0) {
        $.each(data.pop, function (a, b) {
            res.filter(a => a.key == b.text)[0].popvalue = b.value;
        });
        seriesOption.push({ valueField: "popvalue", name: "POP" });
    }
    if (data.splitter != null && data.splitter.length > 0) {
        $.each(data.splitter, function (a, b) {
            res.filter(a => a.key == b.text)[0].splittervalue = b.value;
        });
        seriesOption.push({ valueField: "splittervalue", name: "Splitter" });
    }
    if (data.spliceBox != null && data.spliceBox.length > 0) {
        $.each(data.spliceBox, function (a, b) {
            res.filter(a => a.key == b.text)[0].spliceboxvalue = b.value;
        });
        seriesOption.push({ valueField: "spliceboxvalue", name: "Splice Box" });
    }
    if (type == 'bar') {
        $("#" + divId).dxChart({
            dataSource: res,
            series: seriesOption,
            palette: style,
            title: FindChartTextComponent(divId),
            commonSeriesSettings: {
                type: type,
                hoverMode: "allArgumentPoints",
                selectionMode: "allArgumentPoints",
                argumentField: "key",
                ignoreEmptyPoints: true,
                label: {
                    visible: true,
                    connector: {
                        visible: true
                    }
                },
                legend: {
                    visible: false
                }
            },
            tooltip: {
                enabled: true,
                customizeTooltip: function (arg) {
                    return {
                        text: arg.seriesName + "<br/>" + arg.value
                    };
                }
            },
            export: {
                enabled: true,
                fileName: divId
            },
            size: {
                height: '100%',
                width: '100%'
            }
        });
    }
    else {
        $("#" + divId).dxChart({
            dataSource: res,
            palette: style,
            series: seriesOption,
            title: FindChartTextComponent(divId),
            commonSeriesSettings: {
                argumentField: "key",
                type: type,
                point: {
                    hoverMode: "allArgumentPoints"
                }
            },
            argumentAxis: {
                valueMarginsEnabled: false,
                discreteAxisDivisionMode: "crossLabels",
                grid: {
                    visible: true
                }
            },
            crosshair: {
                enabled: true,
                color: "#949494",
                width: 3,
                dashStyle: "dot",
                label: {
                    visible: true,
                    backgroundColor: "#949494",
                    font: {
                        color: "#fff",
                        size: 12,
                    }
                }
            },
            "export": {
                enabled: true
            },
            tooltip: {
                enabled: true,
                customizeTooltip: function (arg) {
                    return {
                        text: arg.seriesName + "<br/>" + arg.value
                    };
                }
            }
        });
    }
}
function CreateDXReport(divId, data, type, style) {
    if (type == 'pie') {
        $("#" + divId).dxPieChart({
            dataSource: data,
            palette: style,
            title: FindChartText(divId),
            series: [
                {
                    argumentField: "text",
                    valueField: "value",
                    label: {
                        visible: true,
                        connector: {
                            visible: true,
                            width: 1
                        }
                    }
                }
            ],
            tooltip: {
                enabled: true,
                customizeTooltip: function (arg) {
                    return {
                        text: arg.argumentText + "<br/>" + arg.value
                    };
                }
            },
            export: {
                enabled: true,
                fileName: divId
            },
            onPointClick: function (e) {
                var point = e.target;

                toggleVisibility(point);
            },
            onLegendClick: function (e) {
                var arg = e.target;

                toggleVisibility(this.getAllSeries()[0].getPointsByArg(arg)[0]);
            }
        });
    }
    else if (type == 'bar') {
        $("#" + divId).dxChart({
            dataSource: data,
            palette: style,
            title: FindChartText(divId),
            commonSeriesSettings: {
                type: type,
                valueField: "value",
                argumentField: "text",
                ignoreEmptyPoints: true,
                label: {
                    visible: true,
                    connector: {
                        visible: true
                    }
                },
                legend: {
                    visible: false
                }
            },
            seriesTemplate: {
                nameField: "text"
            },
            tooltip: {
                enabled: true,
                customizeTooltip: function (arg) {
                    return {
                        text: arg.argumentText + "<br/>" + arg.value
                    };
                }
            },
            export: {
                enabled: true,
                fileName: divId
            },
            size: {
                height: '100%',
                width: '100%'
            }
        });
    }
    else {
        $("#" + divId).dxChart({
            dataSource: data,
            palette: style,
            title: FindChartText(divId),
            commonSeriesSettings: {
                argumentField: "text",
                type: type,
                point: {
                    hoverMode: "allArgumentPoints"
                }
            },
            argumentAxis: {
                valueMarginsEnabled: false,
                discreteAxisDivisionMode: "crossLabels",
                grid: {
                    visible: true
                }
            },
            crosshair: {
                enabled: true,
                color: "#949494",
                width: 3,
                dashStyle: "dot",
                label: {
                    visible: true,
                    backgroundColor: "#949494",
                    font: {
                        color: "#fff",
                        size: 12,
                    }
                }
            },
            series: [
                { valueField: "value", name: "Total Count" }
            ],
            "export": {
                enabled: true
            },
            tooltip: {
                enabled: true,
                customizeTooltip: function (arg) {
                    return {
                        text: arg.argumentText + "<br/>" + arg.value
                    };
                }
            }
        });
    }
}
function FindChartTextComponent(divId) {
    var title = $("#myReportsComponent option:selected").text();
    if (title != undefined && title != '')
        return title;
    else
        return 'TCDD Report';
}
function FindChartText(divId) {
    var title = $("#myReports option:selected").text();
    if (title != undefined)
        return title;
    else
        return 'TCDD Report';
}
function CreatePDF() {
    ShowLoading();
    $('#exportButtons').hide();
    $('html, body').animate({ scrollTop: 0 }, 'fast');
    setTimeout(CreatePDFMainFunc, 3000);
}
function CreatePDFMainFunc() {
    CreateExportText();
    var HTML_Width = $("#mainAreaOfReport").width();
    var HTML_Height = $("#mainAreaOfReport").height();
    var top_left_margin = 15;
    var PDF_Width = HTML_Width + (top_left_margin * 2);
    var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    html2canvas($("#mainAreaOfReport")[0]).then(function (canvas) {
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
        pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
        for (var i = 1; i <= totalPDFPages; i++) {
            pdf.addPage(PDF_Width, PDF_Height);
            pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
        }
        pdf.save("TCDD Report.pdf");
        $('#exportBottom').hide();
        $('#exportButtons').show();
        HideLoading();
    });
}
function CreatePDFComponent() {
    ShowLoading();
    $('#exportButtonsComponent').hide();
    $('html, body').animate({ scrollTop: 0 }, 'fast');
    setTimeout(CreatePDFMainFuncComponent, 3000);
}
function CreatePDFMainFuncComponent() {
    CreateExportTextComponent();
    var HTML_Width = $("#mainAreaOfReportComponent").width();
    var HTML_Height = $("#mainAreaOfReportComponent").height();
    var top_left_margin = 15;
    var PDF_Width = HTML_Width + (top_left_margin * 2);
    var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    html2canvas($("#mainAreaOfReportComponent")[0]).then(function (canvas) {
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
        pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
        for (var i = 1; i <= totalPDFPages; i++) {
            pdf.addPage(PDF_Width, PDF_Height);
            pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
        }
        pdf.save("TCDD Report.pdf");
        $('#exportBottomComponent').hide();
        $('#exportButtonsComponent').show();
        HideLoading();
    });
}
function CreateImageComponent() {
    ShowLoading();
    $('#exportButtonsComponent').hide();
    $('html, body').animate({ scrollTop: 0 }, 'fast');
    setTimeout(CreateImageMainFuncComponent, 3000);
}
function CreateImageMainFuncComponent() {
    CreateExportTextComponent();
    html2canvas($("#mainAreaOfReportComponent")[0]).then(function (canvas) {
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        downloadBase64File(imgData, 'TCDD Image');
        $('#exportBottomComponent').hide();
        $('#exportButtonsComponent').show();
        HideLoading();
    });
}
function CreateImage() {
    ShowLoading();
    $('#exportButtons').hide();
    $('html, body').animate({ scrollTop: 0 }, 'fast');
    setTimeout(CreateImageMainFunc, 3000);
}
function downloadBase64File(contentBase64, fileName) {
    const linkSource = contentBase64;
    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);

    downloadLink.href = linkSource;
    downloadLink.target = '_self';
    downloadLink.download = fileName + '.png';
    downloadLink.click();
}
function CreateImageMainFunc() {
    CreateExportText();
    html2canvas($("#mainAreaOfReport")[0]).then(function (canvas) {
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        downloadBase64File(imgData, 'TCDD Image');
        $('#exportBottom').hide();
        $('#exportButtons').show();
        HideLoading();
    });
}
function GetUserLenReports(selectText, selectedText) {
    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/Reporting/GetFiberLengthReport",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {
                var arrRes = [];
                $.each(data, function (a, b) {
                    var item = { id: b.value, text: b.text };
                    arrRes.push(item);
                });
                arrRes.unshift({ id: '-1', text: selectText });
                $("#myReports").empty();
                $("#myReports").select2({
                    data: arrRes,
                    max_shown_results: 500
                }).trigger('change');
                $("#myReports").removeAttr('disabled');
                if (selectedText) {
                    $("#myReports").val(selectedText).trigger('change');
                    globalReportingIsNewCreated = false;
                }
            }
            SetLoadingItemToTrue('UserFiberLenReports');
        },
        error: function (errMsg) {
            SetLoadingItemToTrue('UserFiberLenReports');
        }
    });
}
function GetUserLenReportsComponent(selectText, selectedText) {
    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/Reporting/GetFiberLengthReportComponent",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {
                var arrRes = [];
                $.each(data, function (a, b) {
                    var item = { id: b.value, text: b.text };
                    arrRes.push(item);
                });
                arrRes.unshift({ id: '-1', text: selectText });
                $("#myReportsComponent").empty();
                $("#myReportsComponent").select2({
                    data: arrRes,
                    max_shown_results: 500
                }).trigger('change');
                $("#myReportsComponent").removeAttr('disabled');
                if (selectedText) {
                    $("#myReportsComponent").val(selectedText).trigger('change');
                    globalReportingIsNewCreatedComponent = false;
                }
            }
        },
        error: function (errMsg) {
        }
    });
}
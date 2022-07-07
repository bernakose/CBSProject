var globalReportingInterval = null;
var globalRemovedWidgets = [];
var globalAllWidgets = [];
var globalAllCustomReports;
var globalPerformUserDashboard = true;
var getedRemoved;
var getedUserRemoved = '';
var globalReportingAjaxRequestArr =
    [
        { Key: 'Dashboard', State: false },
        { Key: 'FiberLenAccordingToCities', State: false },
        { Key: 'FiberLenAccordingToStreet', State: false },
        { Key: 'FiberSubscribersAccordingToCities', State: false },
        { Key: 'CopperSubscribersAccordingToCities', State: false }
    ];
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
var grid;
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
            title: FindChartText(divId),
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
            title: FindChartText(divId),
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
            legend: {
                verticalAlignment: "bottom",
                horizontalAlignment: "center"
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
//'use strict';
//$(function () {
//    new Sortable(toDraggable, {
//        group: "2",
//        animation: 150,
//        onEnd: function (/**Event*/evt) {
//            var itemEl = evt.item;  // dragged HTMLElement

//        },
//        placeholder: "highlight",
//        start: function (event, ui) {
//            // Resize elements
//            $(this).sortable('refreshPositions');
//        }
//    });
//});
$(document).ready(function () {
    ShowLoading();
    CheckSession();
    $('.pcoded-inner-navbar').html(reportingTopMenu);
    $('#btnShowProfileInfo').parent().hide();
    $('#btnSaveWorkpsace').parent().hide();
    $('.displayChatbox').hide();
    $('.menuBaseLayerList').remove();
    $('#exportBottom').hide();
    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover'
    });
    globalReportingInterval = setInterval(function () { SetLoadingToHide(); }, 100);
    setInterval(function () { CheckSession(); }, 5000);
    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/Reporting/Dashboard",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $.each($('h4'), function (a, b) {
                if ($(b).attr('data-report') == 'dashboardReportValue') {
                    var getedVal = GetDashboardValueById(data, $(b).attr('data-report-id')).replace(',', '.');
                    var size = getedVal.split(".")[1] ? getedVal.split(".")[1].length : 0;
                    $(b).prop('Counter', 0).animate({
                        Counter: getedVal
                    }, {
                        duration: 5000,
                        easing: 'swing',
                        step: function (now) {
                            $(b).text(parseFloat(now).toFixed(size).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                        }
                    });
                }
            });
            $.each($('h6'), function (a, b) {
                if ($(b).attr('data-report') == 'dashboardReportText') {
                    var getedDashboardText = GetDashboardTextById(data, $(b).attr('data-report-id'));
                    $('#' + $(b).closest("div[id]").attr('id')).attr('data-widget-visible-text', getedDashboardText);
                    $(b).text(getedDashboardText);
                }
            });
            $.each($('.footerDashboard'), function (a, b) {
                if ($(b).attr('data-report') == 'dashboardReportUpdateTime') {
                    $(b).html('<i class="feather icon-clock text-white f-14 m-r-10"></i>' + GetDashboardExtraValueById(data, $(b).attr('data-report-id')));
                }
            });
            SetLoadingItemToTrue('Dashboard');
        },
        error: function (errMsg) {
            SetLoadingItemToTrue('Dashboard');
        }
    });
    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/Reporting/FiberLenAccordingToCities",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $.each(data, function (a, b) {
                b.value = parseFloat(b.value);
            });
            CreateDXReport('fiberLengthChart', data, $('#fiberLengthChart').attr('data-chart-type'), 'material');
            SetLoadingItemToTrue('FiberLenAccordingToCities');
        },
        error: function (errMsg) {
            SetLoadingItemToTrue('FiberLenAccordingToCities');
        }
    });
    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/Reporting/FiberLenAccordingToStreet",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $.each(data, function (a, b) {
                b.value = parseFloat(b.value);
            });
            CreateDXReport('fiberLengthStreetChart', data, $('#fiberLengthStreetChart').attr('data-chart-type'), 'violet');
            SetLoadingItemToTrue('FiberLenAccordingToStreet');
        },
        error: function (errMsg) {
            SetLoadingItemToTrue('FiberLenAccordingToStreet');
        }
    });
    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/Reporting/FiberSubscribersAccordingToCities",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $.each(data, function (a, b) {
                b.value = parseFloat(b.value);
            });
            CreateDXReport('fiberLengthSubscriberChart', data, $('#fiberLengthSubscriberChart').attr('data-chart-type'), 'Harmony Light');
            SetLoadingItemToTrue('FiberSubscribersAccordingToCities');
        },
        error: function (errMsg) {
            SetLoadingItemToTrue('FiberSubscribersAccordingToCities');
        }
    });
    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/Reporting/CopperSubscribersAccordingToCities",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $.each(data, function (a, b) {
                b.value = parseFloat(b.value);
            });
            CreateDXReport('copperLengthSubscriberChart', data, $('#copperLengthSubscriberChart').attr('data-chart-type'), 'Harmony Light');
            SetLoadingItemToTrue('CopperSubscribersAccordingToCities');
        },
        error: function (errMsg) {
            SetLoadingItemToTrue('CopperSubscribersAccordingToCities');
        }
    });
    $('#btnHome').on('click', function () {
        location.href = appUrl;
    });
    $('#btnDashboard').on('click', function () {
        location.href = appUrl +"Reporting";
    });
    $('#btnReporting').on('click', function () {
        location.href = appUrl +"Reporting/FiberReports";
    });
    $(".changeReportStyle").on('click', function () {
        UpdateDXReport($(this).attr('data-chart-id'), $(this).attr('data-chart-type'), $(this).attr('data-chart-template'));
        $('#' + $(this).attr('data-chart-id')).attr('data-chart-type', $(this).attr('data-chart-type'));
        UpdateUserDashboardSettings($('#' + $(this).attr('data-chart-id')).attr('data-widget-id'));
    });
    $(".removeWidget").on('click', function () {
        var getedWidgetId = $(this).attr('data-widget-id');
        $('#checkboxDashboard' + getedWidgetId).trigger('click');
        $(".bs-tooltip-top").remove();
    });
    $("#dashboardExportAsImage").on('click', function () {
        CreateImage();
    });
    $("#dashboardExportAsPDF").on('click', function () {
        CreatePDF();
    });
    $("#dashboardGoDefault").on('click', function () {
        swal({
            title: "TCDD CBS",
            text: "Are you sure to go back to default dashboard?",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $.ajax({
                type: "GET",
                url: webApiUrl + "/api/Reporting/RestoreDashboard",
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
    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/Reporting/GetUserWidgets",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            data.forEach(function (item) {
                var b = item.text;
                if (item.value.toString() == '0') {
                    getedUserRemoved += $(b).attr('id') + ',';
                }
                var k = { Text: $(b).attr('data-widget-visible-text'), Id: $(b).attr('id') };
                globalAllWidgets.push(k);
                $('.grid-stack').append(b);
            });
            if (getedUserRemoved.substr(getedUserRemoved.length - 1, getedUserRemoved.length) == ',') {
                getedUserRemoved = getedUserRemoved.substr(0, getedUserRemoved.length - 1)
            }
        },
        error: function (errMsg) {
        }
    });
    var arrForCustomDiv = [];
    $("[id^=customDiv_]").each(function (a, b) {
        var k = { CustomDivType: $(b).attr('data-customdiv-type'), CustomDivId: $(b).attr('data-customdiv-id'), CustomChartName: $(b).attr('data-customdiv-chart-name') };
        arrForCustomDiv.push(k);
    });
    $.ajax({
        type: "POST",
        url: webApiUrl + "/api/Reporting/GetUserWidgetsResult",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        data: { req: arrForCustomDiv },
        dataType: "json",
        success: function (data) {
            if (data != null && data.length > 0) {
                globalAllCustomReports = data;
                CreateCustomReports();
            }
        },
        statusCode: {
            401: function () {
                location.href = "Login";
            }
        }
    });
    grid = GridStack.init({
        alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        ),
        resizable: {
            handles: 'e, se, s, sw, w'
        },
        removeTimeout: 100
    });

    grid.on('added', function (e, items) { log('added ', items) });
    grid.on('removed', function (e, items) { log('removed ', items) });
    grid.on('change', function (e, items) {
        UpdateUserDashboardSettings();
        log('change ', items);
        $.each($('.customChart'), function (a, b) {
            try {
                if ($(this).attr('data-chart-type') == 'pie') {
                    $(this).dxPieChart({
                        size: {
                            width: '80%',
                            height: '100%'
                        }
                    });
                }
                else {
                    $(this).dxChart({
                        size: {
                            width: '80%',
                            height: '100%'
                        }
                    });
                }
            } catch (e) {

            }
        });
    });
    function log(type, items) {
        //var str = '';
        //items.forEach(function (item) { str += ' (x,y)=' + item.x + ',' + item.y; });
        //console.log(type + items.length + ' items.' + str);
    }
    grid.compact();
});
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
function CreatePDF() {
    ShowLoading();
    $('html, body').animate({ scrollTop: 0 }, 'fast');
    setTimeout(CreatePDFMainFunc, 1000);
}
function CreatePDFMainFunc() {
    $('#exportBottom').show();
    $('#exportBottom p').text('Report created by TCDD, date: ' + new Date().toJSON().slice(0, 10) + ', time: ' + new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toJSON().slice(11, 19) + ', user: ' + UserHelper.GetUser().Name + ' ' + UserHelper.GetUser().Surname);
    var HTML_Width = $("#grid-main_content").width();
    var HTML_Height = $("#grid-main_content").height();
    var top_left_margin = 15;
    var PDF_Width = HTML_Width + (top_left_margin * 2);
    var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    html2canvas($("#grid-main_content")[0]).then(function (canvas) {
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
        pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
        for (var i = 1; i <= totalPDFPages; i++) {
            pdf.addPage(PDF_Width, PDF_Height);
            pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
        }
        pdf.save("TCDD Dashboard.pdf");
        $('#exportBottom').hide();
        HideLoading();
    });
}
function CreateImage() {
    ShowLoading();
    $('html, body').animate({ scrollTop: 0 }, 'fast');
    setTimeout(CreateImageMainFunc, 1000);
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
    $('#exportBottom').show();
    $('#exportBottom p').text('Report created by TCDD, date: ' + new Date().toJSON().slice(0, 10) + ', time: ' + new Date().toJSON().slice(11, 19) + ', user: ' + UserHelper.GetUser().Name + ' ' + UserHelper.GetUser().Surname);
    html2canvas($("#grid-main_content")[0]).then(function (canvas) {
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        downloadBase64File(imgData, 'TCDD Dashboard');
        $('#exportBottom').hide();
        HideLoading();
    });
}
function UpdateUserDashboardSettings(divId, isRemove) {
    if (!globalPerformUserDashboard)
        return;
    var arr = [];
    var getedGridNodes = grid.engine.nodes;
    var visibleStatus = 1;
    if (isRemove)
        visibleStatus = 0;
    if (divId != undefined && divId != null) {
        getedGridNodes = getedGridNodes.filter(function (item) { return item.el.id == divId });
    }
    getedGridNodes.forEach(function (item) {
        var reportType = '';
        $.each($('.customChart'), function (a, b) {
            if (item.el.id == $(b).attr('data-widget-id')) {
                reportType = $(b).attr('data-chart-type');
            }
        });
        arr.push({ divName: item.el.id, valx: item.x, valy: item.y, valw: item.width, valh: item.height, visibleStatus: visibleStatus, ReportType: reportType });
    });
    $.ajax({
        type: "POST",
        url: webApiUrl + "/api/Reporting/SetWizard",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        data: { req: arr },
        dataType: "json",
        statusCode: {
            401: function () {
                location.href = "Login";
            }
        }
    });
}

function GetDashboardTextById(data, val) {
    return data.filter(function (item) { return item.extraNextValue == val })[0].text;
}
function GetDashboardValueById(data, val) {
    return data.filter(function (item) { return item.extraNextValue == val })[0].value;
}
function GetDashboardExtraValueById(data, val) {
    return data.filter(function (item) { return item.extraNextValue == val })[0].extraValue;
}
function SetLoadingItemToTrue(key) {
    globalReportingAjaxRequestArr.filter(function (item) { return item.Key == key })[0].State = true;
}
function SetLoadingToHide() {
    if (globalReportingAjaxRequestArr.filter(function (item) { return item.State == false }).length == 0) {
        HideLoading();
        clearInterval(globalReportingInterval);
        $("[id^=widget_]").each(function (a, b) {
            var k = { Text: $(b).attr('data-widget-visible-text'), Id: $(b).attr('id') };
            globalAllWidgets.push(k);
        });
        AddDashboardLeftMenu();
    }
}
function AddDashboardLeftMenu() {
    var appendedText = '';
    if (!getedRemoved)
        getedRemoved = getedUserRemoved;
    else
        if (getedUserRemoved)
            getedRemoved = getedUserRemoved + ',' + getedRemoved;
    if (getedRemoved != null && getedRemoved != undefined && getedRemoved != '') {
        globalPerformUserDashboard = false;
        if (getedRemoved.indexOf(',') > -1) {
            $.each(getedRemoved.split(','), function (a, b) {
                var removedItem = { BaseItem: grid.engine.nodes.filter(function (item) { return item.el.id == b })[0], Id: $('#' + b).attr('id'), Text: $('#' + b).attr('data-widget-visible-text') };
                globalRemovedWidgets.push(removedItem);
                grid.removeWidget($('#' + b));
            });
        }
        else {
            var removedItem = { BaseItem: grid.engine.nodes.filter(function (item) { return item.el.id == getedRemoved })[0], Id: $('#' + getedRemoved).attr('id'), Text: $('#' + getedRemoved).attr('data-widget-visible-text') };
            globalRemovedWidgets.push(removedItem);
            grid.removeWidget($('#' + getedRemoved));
        }
        globalPerformUserDashboard = true;
    }

    globalAllWidgets.forEach(function (item) {
        var checkedStatus = globalRemovedWidgets.filter(a => a.Id == item.Id).length > 0 ? '' : 'checked';
        appendedText +=
            '<li id="dashboardCheckbox' + item.Id + '" class="list-group-item">'
            + item.Text
            + '<label class="switch ">'
            + '<input type="checkbox" id="checkboxDashboard' + item.Id + '" class="warning dashboardCheckbox" data-widget-id="' + item.Id + '" ' + checkedStatus + '>'
            + '<span class="slider round"></span>'
            + '</label>'
            + '</li>';

    });
    $('#leftMenuDashboardCreatorList').append(appendedText);
    $(".dashboardCheckbox").change(function () {
        if (this.checked) {
            var b = $(this).attr('data-widget-id');
            var getedDeletedWidget = globalRemovedWidgets.filter(a => a.Id == b)[0];
            grid.addWidget(getedDeletedWidget.BaseItem.el, getedDeletedWidget.BaseItem);
            UpdateUserDashboardSettings(b);
            globalRemovedWidgets = globalRemovedWidgets.filter(a => a.Id != b);
            if (b.indexOf('customDiv') > -1) {
                CreateCustomReports();
                setTimeout(UpdateUserDashboardSettings(), 500);
            }
        }
        else {
            if (globalPerformUserDashboard) {
                var b = $(this).attr('data-widget-id');
                UpdateUserDashboardSettings(b, true);
                var removedItem = { BaseItem: grid.engine.nodes.filter(function (item) { return item.el.id == b })[0], Id: $('#' + b).attr('id'), Text: $('#' + b).attr('data-widget-visible-text') };
                globalRemovedWidgets.push(removedItem);
                grid.removeWidget($('#' + b));
            }
        }
    });
}
function FindChartText(divId) {
    var getedDiv = $('#' + divId);
    var parentDiv = getedDiv.parents().find('#' + getedDiv.attr('data-widget-id'))[0];
    if (parentDiv != undefined) {
        var title = $(parentDiv).attr('data-widget-visible-text');
        if (title != undefined)
            return title;
        else
            return 'TCDD Report';
    }
    else {
        return 'TCDD Report';
    }
}
function RemoveCustomWidget(val) {
    var getedWidgetId = $(val).attr('data-widget-id');
    $('#checkboxDashboard' + getedWidgetId).trigger('click');
    $(".bs-tooltip-top").remove();
}
function CreateCustomReports() {
    globalAllCustomReports.forEach(function (item) {
        if (item.value.text == "Component") {
            var tempData = item.value.value;
            var howMany = 0;
            var withoutRangeData;
            if (tempData.olt != null && tempData.olt.length > 0) {
                tempData.olt = tempData.olt.filter(a => a.text != null);
                withoutRangeData = tempData.olt;
                howMany++;
            }
            if (tempData.pop != null && tempData.pop.length > 0) {
                tempData.pop = tempData.pop.filter(a => a.text != null);
                withoutRangeData = tempData.pop;
                howMany++;
            }
            if (tempData.splitter != null && tempData.splitter.length > 0) {
                tempData.splitter = tempData.splitter.filter(a => a.text != null);
                withoutRangeData = tempData.splitter;
                howMany++;
            }
            if (tempData.spliceBox != null && tempData.spliceBox.length > 0) {
                tempData.spliceBox = tempData.spliceBox.filter(a => a.text != null);
                withoutRangeData = tempData.spliceBox;
                howMany++;
            }
            DisposeCharts(item.text);
            if (howMany == 1) {
                CreateDXReport(item.text, withoutRangeData, item.extraNextValue, item.extraValue);
            }
            else {
                CreateDXRangeReport(item.text, item.value.value, item.extraNextValue, item.extraValue);
            }
        }
        else if (item.value.text == "Line") {
            CreateDXReport(item.text, item.value.value, item.extraNextValue, item.extraValue);
        }
    });
    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover'
    });
}
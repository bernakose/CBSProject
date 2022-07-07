var selectedtype = "";
var selectedtable = "";
$(document).ready(function () {

    var selectText = 'Select';
    var arrRes = [{ id: '-1', text: selectText }];
    $('.subscriber-search-select-area').select2({
        data: arrRes
    }).trigger('change');
    $('#btnSearchByServiceNumber').hide();
    $('#btnSearchByServiceName').hide();
    $('#btnSearchByStreetCabinet').hide();
    $('#btnSearchBySplitter').hide();
    $('#txtServiceNumberByServiceNumber').on('keyup change', function () {
        if ($(this).val().length > 0) {
            $('#btnSearchByServiceNumber').fadeIn(3000);
        }
        else {
            $('#btnSearchByServiceNumber').hide();
        }
    });
    $('#txtServiceNumberByName').on('keyup change', function () {
        if ($(this).val().length > 2) {
            $('#btnSearchByServiceName').fadeIn(3000);
        }
        else {
            $('#btnSearchByServiceName').hide();
        }
    });
    $('#cmbDPByStreetCabinet').change(function () {
        if ($(this).val() && $(this).val() != '-1') {
            $('#btnSearchByStreetCabinet').fadeIn(3000);
        }
        else {
            $('#btnSearchByStreetCabinet').hide();
        }
    });
    $('#cmbEndSplitterBySplitter').change(function () {
        if ($(this).val() && $(this).val() != '-1') {
            $('#btnSearchBySplitter').fadeIn(3000);
        }
        else {
            $('#btnSearchBySplitter').hide();
        }
    });
    $('#cmbCityByStreetCabinet').change(function () {
        if ($(this).val() && $(this).val() != '-1') {
            try {
                $("#gridByStreetCabinet").dxDataGrid("dispose");
            } catch (e) {

            }
            SetSubscriberSearchDivsEmpty('#cmbStreetCabinetByStreetCabinet');
            SetSubscriberSearchDivsEmpty('#cmbDPByStreetCabinet');
            GetSubscriberSearchData('MSANandStreetCabinets?cityId=' + $(this).val() + '&isRigit=false', '#cmbStreetCabinetByStreetCabinet', 'SubscriberManagement');
        }
    });
    $('#cmbStreetCabinetByStreetCabinet').change(function () {
        if ($(this).val() && $(this).val() != '-1') {
            try {
                $("#gridByStreetCabinet").dxDataGrid("dispose");
            } catch (e) {

            }
            SetSubscriberSearchDivsEmpty('#cmbDPByStreetCabinet');
            GetSubscriberSearchData('DPs?deviceId=' + $(this).val() + '&isRigit=false', '#cmbDPByStreetCabinet', 'SubscriberManagement');
        }
    });
    $('#cmbCityBySplitter').change(function () {
        if ($(this).val() && $(this).val() != '-1') {
            try {
                $("#gridBySplitter").dxDataGrid("dispose");
            } catch (e) {

            }
            SetSubscriberSearchDivsEmpty('#cmbNetworkSplitterBySplitter');
            SetSubscriberSearchDivsEmpty('#cmbEndSplitterBySplitter');
            GetSubscriberSearchData('NetworkSplitters?cityId=' + $(this).val(), '#cmbNetworkSplitterBySplitter', 'SubscriberManagement');
        }
    });
    $('#cmbNetworkSplitterBySplitter').change(function () {
        if ($(this).val() && $(this).val() != '-1') {
            try {
                $("#gridBySplitter").dxDataGrid("dispose");
            } catch (e) {

            }
            SetSubscriberSearchDivsEmpty('#cmbEndSplitterBySplitter');
            GetSubscriberSearchData('EndSplitters?networkSplitterId=' + $(this).val(), '#cmbEndSplitterBySplitter', 'SubscriberManagement');
        }
    });
    GetSubscriberSearchData('Cities', '.subscriber-search-city', 'SubscriberManagement');
    $("#btnSearchByServiceNumber").on('click', function () {
        if (!$('#txtServiceNumberByServiceNumber').val() || $('#txtServiceNumberByServiceNumber').val().length < 3)
            return;

        selectedtype = "";
        GetSubscriberSearchData('GetSubscriber?serviceId=' + $('#txtServiceNumberByServiceNumber').val(), '#gridByServiceNumber', 'Search', false);
    });
    $("#btnSearchByServiceName").on('click', function () {
        if (!$('#txtServiceNumberByName').val() || $('#txtServiceNumberByName').val().length < 3)
            return;
        selectedtype = "";
        GetSubscriberSearchData('GetSubscriber?name=' + $('#txtServiceNumberByName').val(), '#gridByServiceName', 'Search', false);
    });
    $("#btnSearchByStreetCabinet").on('click', function () {
        if (!$('#cmbDPByStreetCabinet').val() || $('#cmbDPByStreetCabinet').val() == '-1')
            return;

        selectedtype = "";
        GetSubscriberSearchData('GetSubscriber?dpId=' + $('#cmbDPByStreetCabinet').val(), '#gridByStreetCabinet', 'Search', false);
    });
    $("#btnSearchBySplitter").on('click', function () {
        if (!$('#cmbEndSplitterBySplitter').val() || $('#cmbEndSplitterBySplitter').val() == '-1')
            return;
        selectedtype = "";
        GetSubscriberSearchData('GetSubscriber?endSplitterId=' + $('#cmbEndSplitterBySplitter').val(), '#gridBySplitter', 'Search', false);
    });
});
function SetSubscriberSearchDivsEmpty(div) {
    $(div).empty();
    $(div).select2().trigger('change');
    $(div).attr('disabled', 'disabled');
}
function ssDynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
function GetSubscriberSearchData(urlParam, div, urlDirectory = 'Search', isForSelect = true) {
    ShowLoading();
    var selectText = 'Select';
    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/" + urlDirectory + "/" + urlParam,
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            HideLoading();
            if (isForSelect) {
                var arrRes = [];
                $.each(data.sort(ssDynamicSort("text")), function (a, b) {
                    var item = { id: b.value, text: b.text };
                    arrRes.push(item);
                });
                arrRes.unshift({ id: '-1', text: selectText });
                if (arrRes.length == 1)
                    $(div).attr('disabled', 'disabled');
                else
                    $(div).removeAttr('disabled');
                $(div).select2({
                    data: arrRes
                }).trigger('change');
            }
            else {
                CreateGridForSubscriberSearch(div, data);
            }
        },
        error: function (errMsg) {
            HideLoading();
        }
    });
}
function CreateGridForSubscriberSearch(div, data) {
    $(div).dxDataGrid({
        dataSource: data,
        showBorders: true,
        paging: {
            pageSize: 8
        },
        headerFilter: {
            visible: true
        },
        filterRow: {
            visible: true,
            applyFilter: "auto"
        },
        pager: {
            showPageSizeSelector: false,
            showInfo: true
        },
        onContextMenuPreparing: function (e) {
            if (e.row.rowType === "data") {

                e.items = [{
                    text: "Show On Map (" + e.row.data['serviceId'] + ")",
                    onItemClick: function () {
                        SelectTableForSubsSearch("serviceId", e.row.data['serviceId']);
                    }
                }];
            }
        },


        columns: GetColumnsFromJSONForSubscriberSearch(data)
    });
}
function GetColumnsFromJSONForSubscriberSearch(data) {
    var arr = [];
    if (data.length > 0) {
        var columnsIn = data[0];
        for (var key in columnsIn) {
            arr.push(key);
        }
    }
    return arr;
}
var hsfModel = { t: null, c: null, v: null };
$(document).ready(function () {
    GetFiberHsData('GetRegions', '#hsfRegion');
    $('#hsfRegion').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        SetFiberHsDivsEmpty('#hsfCity');
        SetFiberHsDivsEmpty('#hsfOlt');
        //SetFiberHsDivsEmpty('#hsfFdbOdf');
        SetFiberHsDivsEmpty('#hsfNetworkSplitter');
        SetFiberHsDivsEmpty('#hsfEndSplitter');
        GetFiberHsData('GetCities?regionId=' + parseInt($(this).val()), '#hsfCity', 'gis_adr_geo_region', 'region_id', parseInt($(this).val()));
    });
    $('#hsfCity').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        SetFiberHsDivsEmpty('#hsfOlt');
        //SetFiberHsDivsEmpty('#hsfFdbOdf');
        SetFiberHsDivsEmpty('#hsfNetworkSplitter');
        SetFiberHsDivsEmpty('#hsfEndSplitter');
        GetFiberHsData('GetOlts?cityId=' + parseInt($(this).val()), '#hsfOlt', 'gis_adr_geo_city', 'city_id', parseInt($(this).val()));
    });
    $('#hsfOlt').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        //SetFiberHsDivsEmpty('#hsfFdbOdf');
        SetFiberHsDivsEmpty('#hsfNetworkSplitter');
        SetFiberHsDivsEmpty('#hsfEndSplitter');
        //GetFiberHsData('GetConnectionType', '#hsfFdbOdf', 'gis_net_geo_olt', 'olt_id', parseInt($(this).val()));
        SetFiberHsDivsEmpty('#hsfNetworkSplitter');
        SetFiberHsDivsEmpty('#hsfEndSplitter');
        GetFiberHsData('GetNetworkSplitters?oltId=' + parseInt($('#hsfOlt').val()), '#hsfNetworkSplitter', 'gis_net_geo_olt', 'olt_id', parseInt($('#hsfOlt').val()));
    });
    //$('#hsfFdbOdf').change(function () {
    //    if (!$(this).val() || parseInt($(this).val()) == '-1')
    //        return;
    //    SetFiberHsDivsEmpty('#hsfNetworkSplitter');
    //    SetFiberHsDivsEmpty('#hsfEndSplitter');
    //    GetFiberHsData('GetNetworkSplitters?oltId=' + parseInt($('#hsfOlt').val()) + '&connType=' + parseInt($(this).val()), '#hsfNetworkSplitter', 'gis_net_geo_olt', 'olt_id', parseInt($('#hsfOlt').val()));
    //});
    $('#hsfNetworkSplitter').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        SetFiberHsDivsEmpty('#hsfEndSplitter');
        GetFiberHsData('GetEndSplitters?nsId=' + parseInt($(this).val()) + '&connType=' + parseInt($(this).val()), '#hsfEndSplitter', 'gis_net_geo_splitter', 'splitter_id', parseInt($(this).val()));
    });
    $('#hsfEndSplitter').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        hsfModel.t = 'gis_net_geo_splitter';
        hsfModel.c = 'splitter_id';
        hsfModel.v = parseInt($(this).val());
    });
    $("#hsfBtnShowMap").on('click', function () {
        ShowOnMap(hsfModel.t, hsfModel.c, hsfModel.v);
    });
});
function SetFiberHsDivsEmpty(div) {
    $(div).empty();
    $(div).select2().trigger('change');
    $(div).attr('disabled', 'disabled');
}
function hsmDynamicSort(property) {
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
function GetFiberHsData(urlParam, div, t, c, v) {
    if (t) {
        hsfModel.t = t;
        hsfModel.c = c;
        hsfModel.v = v;
    }
    ShowLoading();
    var selectText = 'Select';
    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/Search/" + urlParam,
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            HideLoading();
            var arrRes = [];
            $.each(data.sort(hsmDynamicSort("text")), function (a, b) {
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
        },
        error: function (errMsg) {
            HideLoading();
        }
    });
}
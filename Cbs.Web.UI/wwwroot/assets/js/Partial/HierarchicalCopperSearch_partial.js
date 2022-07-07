var hscModel = { t: null, c: null, v: null };
$(document).ready(function () {
    $('.hscHideArea').hide();
    GetFiberHsData('GetRegions', '#hscRegion');
    $('#hscRegion').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        $('.hscHideArea').hide();
        SetFiberHsDivsEmpty('#hscCity');
        GetFiberHsData('GetCities?regionId=' + parseInt($(this).val()), '#hscCity', 'gis_adr_geo_region', 'region_id', parseInt($(this).val()));
    });
    $('#hscCity').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        $('.hscHideArea').hide();
        GetFiberHsData('GetInventories', '#hscInventory', 'gis_adr_geo_city', 'city_id', parseInt($(this).val()));
    });
    $('#hscInventory').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        var createdUrl = '';
        var divName = '';
        $('.hscHideArea').hide();
        SetFiberHsDivsEmpty('#hscStreetCabinet');
        SetFiberHsDivsEmpty('#hscDpStreetCabinet');
        SetFiberHsDivsEmpty('#hscLocalCableStreetCabinet');
        SetFiberHsDivsEmpty('#hscPrincipalDevice');
        SetFiberHsDivsEmpty('#hscPBoxPrincipalDevice');
        SetFiberHsDivsEmpty('#hscDp');
        SetFiberHsDivsEmpty('#hscLocalCable');
        SetFiberHsDivsEmpty('#hscPrincipalCable');
        SetFiberHsDivsEmpty('#hscPBoxPrincipalBox');
        if ($(this).val() == '1') {
            $('#hscStreetCabinetArea').fadeIn(500);
            createdUrl = 'GetStreetCabinet?cityId=' + parseInt($('#hscCity').val());
            divName = '#hscStreetCabinet';
        }
        else if ($(this).val() == '2') {
            $('#hscDPArea').fadeIn(500);
            createdUrl = 'GetMSANStreetCabinet?cityId=' + parseInt($('#hscCity').val());
            divName = '#hscDpStreetCabinet';
        }
        else if ($(this).val() == '3') {
            $('#hscLocalCableArea').fadeIn(500);
            createdUrl = 'GetStreetCabinet?cityId=' + parseInt($('#hscCity').val());
            divName = '#hscLocalCableStreetCabinet';
        }
        else if ($(this).val() == '4') {
            $('#hscPrincipalCableArea').fadeIn(500);
            createdUrl = 'GetPDevice?cityId=' + parseInt($('#hscCity').val());
            divName = '#hscPrincipalDevice';
        }
        else if ($(this).val() == '5') {
            $('#hscPrincipalBoxArea').fadeIn(500);
            createdUrl = 'GetPDevice?cityId=' + parseInt($('#hscCity').val());
            divName = '#hscPBoxPrincipalDevice';
        }
        GetFiberHsData(createdUrl, divName, 'gis_adr_geo_city', 'city_id', parseInt($('#hscCity').val()));
    });
    $('#hscDpStreetCabinet').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        GetFiberHsData('GetDP?ldeviceId=' + parseInt($(this).val()), '#hscDp', 'gis_net_geo_ldevice', 'ldevice_id', parseInt($(this).val()));
    });
    $('#hscLocalCableStreetCabinet').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        GetFiberHsData('GetLCable?ldeviceId=' + parseInt($(this).val()), '#hscLocalCable', 'gis_net_geo_ldevice', 'ldevice_id', parseInt($(this).val()));
    });
    $('#hscPrincipalDevice').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        GetFiberHsData('GetPCable?pdeviceId=' + parseInt($(this).val()), '#hscPrincipalCable', 'gis_net_geo_pdevice', 'pdevice_id', parseInt($(this).val()));
    });
    $('#hscPBoxPrincipalDevice').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        GetFiberHsData('GetPDp?pdeviceId=' + parseInt($(this).val()), '#hscPBoxPrincipalBox', 'gis_net_geo_pdevice', 'pdevice_id', parseInt($(this).val()));
    });
    $('#hscDp').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        hscModel.t = 'gis_net_geo_local_dp';
        hscModel.c = 'dp_id';
        hscModel.v = parseInt($(this).val());
    });
    $('#hscLocalCable').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        hscModel.t = 'gis_net_geo_lcable';
        hscModel.c = 'cable_id';
        hscModel.v = parseInt($(this).val());
    });
    $('#hscPrincipalCable').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        hscModel.t = 'gis_net_geo_pcable';
        hscModel.c = 'cable_id';
        hscModel.v = parseInt($(this).val());
    });
    $('#hscPBoxPrincipalBox').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        hscModel.t = 'gis_net_geo_principal_dp';
        hscModel.c = 'dp_id';
        hscModel.v = parseInt($(this).val());
    });
    $('#hscStreetCabinet').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        hscModel.t = 'gis_net_geo_ldevice';
        hscModel.c = 'ldevice_id';
        hscModel.v = parseInt($(this).val());
    });
    $("#hscBtnShowMap").on('click', function () {
        ShowOnMap(hscModel.t, hscModel.c, hscModel.v);
    });
});
function SetFiberHsDivsEmpty(div) {
    $(div).empty();
    $(div).select2().trigger('change');
    $(div).attr('disabled', 'disabled');
}
function hscDynamicSort(property) {
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
        hscModel.t = t;
        hscModel.c = c;
        hscModel.v = v;
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
            $.each(data.sort(hscDynamicSort("text")), function (a, b) {
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
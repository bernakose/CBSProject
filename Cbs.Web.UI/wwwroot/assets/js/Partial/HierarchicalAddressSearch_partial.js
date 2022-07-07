var hsaModel = { t: null, c: null, v: null };
$(document).ready(function () {
    GetFiberHsData('GetRegions', '#hsaRegion');
    $('#hsaRegion').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        SetFiberHsDivsEmpty('#hsaCity');
        SetFiberHsDivsEmpty('#hsaStreet');
        SetFiberHsDivsEmpty('#hsaDoor');
        GetFiberHsData('GetCities?regionId=' + parseInt($(this).val()), '#hsaCity', 'gis_adr_geo_region', 'region_id', parseInt($(this).val()));
    });
    $('#hsaCity').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        SetFiberHsDivsEmpty('#hsaStreet');
        SetFiberHsDivsEmpty('#hsaDoor');
        GetFiberHsData('GetStreets?cityId=' + parseInt($(this).val()), '#hsaStreet', 'gis_adr_geo_city', 'city_id', parseInt($(this).val()));
    });
    $('#hsaStreet').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        SetFiberHsDivsEmpty('#hsaDoor');
        GetFiberHsData('GetDoors?streetCode=' + parseInt($(this).val()), '#hsaDoor', 'gis_adr_geo_street', 'city_unique_code', parseInt($(this).val()));
    });
    $('#hsaDoor').change(function () {
        if (!$(this).val() || parseInt($(this).val()) == '-1')
            return;
        hsaModel.t = 'gis_adr_geo_door';
        hsaModel.c = 'door_id';
        hsaModel.v = parseInt($(this).val());
    });
    $("#hsaBtnShowMap").on('click', function () {
        ShowOnMap(hsaModel.t, hsaModel.c, hsaModel.v);
    });
});
function SetFiberHsDivsEmpty(div) {
    $(div).empty();
    $(div).select2().trigger('change');
    $(div).attr('disabled', 'disabled');
}
function hsaDynamicSort(property) {
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
        hsaModel.t = t;
        hsaModel.c = c;
        hsaModel.v = v;
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
            $.each(data.sort(hsaDynamicSort("text")), function (a, b) {
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
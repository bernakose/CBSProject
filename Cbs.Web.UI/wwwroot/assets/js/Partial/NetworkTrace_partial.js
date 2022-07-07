$(document).ready(function () {
    $('#thematicLayers').change(function () {
        if ($('#thematicLayers > option').length > 0) {
            $(this).removeAttr('disabled');
        }
    });

    $('#traceType').change(function () {
        if ($('#traceType > option').length > 0) {
            $(this).removeAttr('disabled');
        }
    });

    $("#startNetworkTraceButton").on('click', function () {
        if ($('#thematicLayers').val() == '-1') {
            ShowError('Select layer');
            return;
        }

        if ($('#traceType').val() == '-1') {
            ShowError('Select trace type.');
            return;
        }


        var selectedLayer = $('#thematicLayers option:selected').text();
        var p = selectedLayer.split("(");

        var _layerName = p[0].trim();
        var _uniqueColumnName = $('#thematicLayers option:selected').val();
        var _uniqueColumnValue = p[1].replace(")", "")
        var _traceType = $('#traceType option:selected').val();
        StartTrace(_layerName, _uniqueColumnName, _uniqueColumnValue, _traceType);
    });
});

function SetDropDownEmpty(dropDown) {
    $(dropDown).empty();
    //$(dropDown).select2().trigger('change');
    $(dropDown).attr('disabled', 'disabled');
}
function FillItems(model) {
    SetDropDownEmpty("#thematicLayers");
    if (model.length > 0) {
        for (var i = 0; i < model.length; i++) {
            $("#thematicLayers").append(new Option(model[i].layerName + " (" + model[i].uniqueColumnValue + ")", model[i].uniqueColumn));
        }
        $("#thematicLayers").removeAttr('disabled');
    }
}
function StartTrace(layerName, uniqueColumnName, value, traceType) {
    var requestModel = {
        LayerName: layerName,
        UniqColumn: uniqueColumnName,
        ColumnValue: value,
        TraceType: traceType
    };

    $.ajax({
        type: "POST",
        url: webApiUrl + "/api/Map/NetworkTrace",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(requestModel),
        success: function (data) {
            HideLoading();
            if (data && data.length > 0) {
                var _wkt = [];
                for (var i = 0; i < data.length; i++) {
                    _wkt.push(data[i].wkt);
                }
                ZoomToWkt(_wkt, true);
            }
            else {
                ShowError('Not found data.');
            }
        },
        error: function (errMsg) {
            HideLoading();
            if (errMsg.status == 401) {
                UnAuthorized();
            }
        }
    });
}
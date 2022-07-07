function ShowOnMap(_tableName, _columnName, _columnvalue) {

    var sendData = [{
        tableName: _tableName,
        uniqColumn: _columnName,
        columnValue: _columnvalue.toString()
    }];

    WriteShowOnMapLog(sendData[0]);

    ShowLoading();

    $.ajax({
        type: "POST",
        url: webApiUrl + "/api/Map/GetMapObjects",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(sendData),
        success: function (data) {
            HideLoading();

            if (data && data.length > 0) {
                var _wkt = [];
                for (var i = 0; i < data.length; i++) {
                    _wkt.push(data[i].wkt);
                }
                ZoomToWkt(_wkt);
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

function ShowOnMultiMap(_tableName, _whereclause) {

    var sendData = [{
        tableName: _tableName,
        whereclause: _whereclause
    }];

    WriteShowOnMapLog(sendData[0]);

    ShowLoading();

    $.ajax({
        type: "POST",
        url: webApiUrl + "/api/Map/GetMapMultiObjects",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(sendData),
        success: function (data) {
            HideLoading();

            if (data && data.length > 0) {
                var _wkt = [];
                for (var i = 0; i < data.length; i++) {
                    _wkt.push(data[i].wkt);
                }
                ZoomToWkt(_wkt);
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

function ShowOnPDeviceMap(_tableName, _columnName, _columnvalue) {

    var sendData = [{
        tableName: _tableName,
        uniqColumn: _columnName,
        columnValue: _columnvalue.toString()
    }];

    WriteShowOnMapLog(sendData[0]);

    ShowLoading();

    $.ajax({
        type: "POST",
        url: webApiUrl + "/api/Map/GetMapForPDevice",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(sendData),
        success: function (data) {
            HideLoading();

            if (data && data.length > 0) {
                var _wkt = [];
                for (var i = 0; i < data.length; i++) {
                    _wkt.push(data[i].wkt);
                }
                ZoomToWkt(_wkt);
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


function UnAuthorized() {
    ShowError('Your session ended.');
    location.href = "Login";
}
function WriteShowOnMapLog(data) {
    var sendData = [{
        operationId: "13",
        title: "Viewing On The Map",
        content:"Approached data of { " + data.uniqColumn + "} = { " + data.columnValue + "} in table { " + data.tableName + "}."
    }];

    $.ajax({
        type: "POST",
        url: webApiUrl + "/api/Log/WriteLog",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(sendData),
        success: function (data) {

        },
        error: function (errMsg) {

        }
    });
}
function ZoomToWkt(wktStrings, bestFit) {
    try {
        var say = map.getOverlays().getArray().length;
        for (var i = say - 1; i >= 0; i--) {
            map.removeOverlay(map.getOverlays().getArray()[i]);
        }

    } catch (e) {

    }

    var _newFeautureArray = [];


    var _format = new ol.format.WKT();

    var _features = [];
    for (var i = 0; i < wktStrings.length; i++) {
        var wktString = wktStrings[i];
        var _feature = _format.readFeature(wktString, {
            dataProjection: 'EPSG:3857',
            featureProjection: 'EPSG:3857'
        });

        //_feature.setStyle(fstyle);
        _feature.setStyle(new ol.style.Style({
            fill: manager.CreateFillStyle([177, 221, 238, 0.3]),
            stroke: manager.CreateStrokeStyle('#bf00ff', 5)
        }));
        _features.push(_feature);
        _newFeautureArray.push(_feature);

    }
    //_newFeautureArray = wktStrings;

    wktforzoom.setSource(new ol.source.Vector({ features: _newFeautureArray }));

    ShowOnMapAnimation(_newFeautureArray);
    selectionLayer.setSource(new ol.source.Vector({ features: _features }));
    map.getView().fit(selectionLayer.getSource().getExtent(), map.getSize());
    map.getView().setZoom(map.getView().getZoom() - 1);

    if (!(bestFit != undefined && bestFit == true)) {
        map.getView().setZoom(19);
    }
}

function ShowQueryWindow(queryOptions) {
    var divId = "popup" + queryOptions.ServiceName;



    $("body").append('<div id="' + divId + '"> <table id="dtQueryData' + queryOptions.MenuId + '" class="table table-striped table-bordered nowrap" data-table-name="' + queryOptions.TableName + '" data-uniq-field="' + queryOptions.UniqFieldName + '" data-uniq-column="' + queryOptions.UniqColumnName + '"></table></div>');

    var _columns = [];
    var curentColumns = [];
    var helperuserforcol = [];

    var searchGrid = JSON.parse($('#hdGridSearchs').val());
    for (var i = 0; i < searchGrid.length; i++) {
        if (searchGrid[i].ServiceName == queryOptions.ServiceName) {
            for (var m = 0; m < searchGrid[i].Properties.length; m++) {
                //if (searchGrid[i].Properties[m].Visible) {
                _columns.push({
                    dataField: searchGrid[i].Properties[m].FieldName,
                    caption: searchGrid[i].Properties[m].Tag,
                    dataType: searchGrid[i].Properties[m].FieldType,
                    width: 'auto',
                    visible: searchGrid[i].Properties[m].Visible
                });
                helperuserforcol = searchGrid[i].HelperColUser;
                //}
            }
        }
    }

    $.ajax({
        type: "GET",
        crossDomain: true,
        async: false,
        url: webApiUrl + "/api/User/GetUserSearchColumns?userid=" + UserHelper.GetUser().Id + "&entity=" + helperuserforcol,
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (_data) {
            HideLoading();
            if (_data != null) {
                for (var i = 0; i < _data.length; i++) {
                    for (var k = 0; k < _columns.length; k++) {
                        if (_columns[k].dataField == _data[i].fieldName) {
                            _columns[k].visible = _data[i].visible
                        }
                    }
                }

            }


        },
        error: function (errMsg) {
            HideLoading();
            ShowError(errMsg);
        }
    });


    DisposePopup(divId);

    var _width = _columns.length * 125;

    if (_width > ($(window).width() * 0.6)) {
        _width = ($(window).width() * 0.6);
    }

    var ssname = queryOptions.ServiceName;

    if (queryOptions.ServiceName.indexOf("Boxs") !== -1) {
        ssname = queryOptions.ServiceName.replace("Box", "");
    }

    if (queryOptions.customODataUrl) {
        ssname = queryOptions.customODataUrl;
    }

    //if (queryOptions.ServiceName == "VSubscriberDoorSplitter")
    //    queryOptions.ServiceName = "Subscribers";

    var popupOptions = {
        width: _width,
        height: 400,
        id: divId,
        showTitle: true,
        title: queryOptions.MenuName,
        dragEnabled: true,
        closeOnOutsideClick: false,
        shading: false,
        resizeEnabled: true,
        columnAutoWidth: false,
        _defaultHeight: 400,
        _defaultWidht: _width,
        _templateId: divId,
        onShown: function (e) {
            if (!e.component.option("isBringToFront")) {
                $("#dtQueryData" + queryOptions.MenuId).dxDataGrid({
                    height: '100%',
                    selection: {
                        mode: "single"
                    },
                    showBorders: true,
                    "export": {
                        enabled: true,
                        fileName: queryOptions.MenuName
                    },
                    onExporting: function (e) {
                        ShowLoading();
                    },
                    onExported: function (e) {
                        HideLoading();
                    },
                    pager: {
                        allowedPageSizes: [5, 10, 25, 50],
                        showInfo: true,
                        showNavigationButtons: true,
                        showPageSizeSelector: true,
                        visible: true
                    },
                    filterRow: {
                        visible: true,
                        applyFilter: "auto"
                    },
                    headerFilter: {
                        visible: true
                    },
                    allowColumnReordering: true,
                    dataSource: {
                        store: {
                            type: "odata",
                            url: odataUrl + "/" + ssname,
                            version: 4,
                            key: (queryOptions.IsParentElem === true && queryOptions.dpp !== null) ? (queryOptions.dpp.indexOf("DPP") !== -1 ? "Id" : queryOptions.UniqFieldName) : queryOptions.UniqFieldName,
                            keyType: "Int32",
                            errorHandler: function (error) {
                                HideLoading();
                                ShowError(error.message);
                            },
                            beforeSend: function (request) {
                                if (queryOptions.IsParentElem === true) {
                                    var param = queryOptions.Id;
                                    if (queryOptions.dpp !== null && queryOptions.dpp.indexOf("DPP") !== -1) {
                                        var dgr = queryOptions.dpp.split('_')[0];
                                        param = queryOptions.Id + "_" + dgr;
                                    }
                                    request.params = {
                                        "$orderby": request.params.$orderby,
                                        "$top": request.params.$top,
                                        "$skip": request.params.$skip,
                                        "$select": request.params.$select,
                                        "$expand": request.params.$expand,
                                        "$filter": request.params.$filter,
                                        "$count": "true",
                                        "param": param
                                    }
                                    //request.headers = {
                                    //    "Custom Header": "value"
                                    //};
                                }

                                request.timeout = 1500000;
                            },
                        }
                    },
                    columnChooser: {
                        enabled: true,
                        mode: "select"
                    },
                    onContentReady: function (e) {
                        curentColumns = e.component.getVisibleColumns();
                    },
                    columnFixing: {
                        enabled: true
                    },
                    columns: _columns,
                    onContextMenuPreparing: function (e) {

                        if (queryOptions.HideLeftClick)
                            return;
                        if (queryOptions.ServiceName == "Subscribers")
                            return;
                        if (e.row.rowType === "data") {
                            var uniqField = "";
                            if (queryOptions.IsParentElem === true)
                                uniqField = queryOptions.ServiceName == "Subscribers" ? $(e.element).data('uniq-field') : queryOptions.helperUniqColDgr;
                            else
                                uniqField = $(e.element).data('uniq-field');

                            this.selectRowsByIndexes(e.rowIndex);
                            e.items = [{
                                text: "Show On Map (" + e.row.data[uniqField] + ")",
                                onItemClick: function () {
                                    if (queryOptions.IsParentElem === true) {
                                        if (queryOptions.helperUniqColSubscrb !== null && queryOptions.helperUniqColSubscrb !== "" && queryOptions.MenuName === "SHOW SUBSCRIBER")
                                            ShowOnMultiMap(queryOptions.helperTableName, queryOptions.helperUniqColSubscrb.replace("~", queryOptions.ServiceName == "Subscribers" ? e.row.data[$(e.element).data('uniq-field')] : e.row.data[queryOptions.helperUniqColDgr]));
                                        else
                                            ShowOnMap(queryOptions.helperTableName, queryOptions.helperUniqCol, e.row.data[queryOptions.helperUniqColDgr]);
                                    } else if (queryOptions.ServiceName === "VGisNetPdevices") {
                                        ShowOnPDeviceMap($(e.element).data('table-name'), $(e.element).data('uniq-column'), e.row.data[$(e.element).data('uniq-field')]);
                                    }
                                    else if (queryOptions.ServiceName === "VGisOthSubscriberDps") {
                                        ShowOnMap("gis_net_geo_local_dp", "dp_id", e.row.data["DpId"]);
                                    }
                                    else
                                        ShowOnMap($(e.element).data('table-name'), $(e.element).data('uniq-column'), e.row.data[$(e.element).data('uniq-field')]);

                                }
                            }];
                        }
                    }
                });
            }

        },
        onHidden: function (x) {
            DisposePopup(x.element[0].id);
            if (helperuserforcol != null)
                SaveUserSearchColumns(helperuserforcol, curentColumns);
        },

    };

    AddPopupMinimizeButton(popupOptions);

    var popup = $("#" + divId).dxPopup(popupOptions).dxPopup("instance");

    popup.show();

    window.PopupWindows.push({
        id: divId,
        instance: popup
    });

    $('.dx-popup-title').off('click');



    $('.dx-popup-title').click(function () {
        if ($($($(this).parent()).parent()).parent().attr("id")) {
            var popupId = $($($(this).parent()).parent()).parent().attr("id");
            for (var i = 0; i < window.PopupWindows.length; i++) {
                if (window.PopupWindows[i].id == popupId) {
                    var animation = window.PopupWindows[i].instance.option('animation');
                    window.PopupWindows[i].instance.option('animation', null);
                    //window.PopupWindows[i].instance.hide();
                    window.PopupWindows[i].instance.option("isBringToFront", true);
                    window.PopupWindows[i].instance.show();
                    //window.PopupWindows[i].instance.option("isBringToFront", false);
                    //var animation = window.PopupWindows[i].instance.option('animation', animation);
                }
            }
        }
    });
}
function DisposePopup(popupId) {
    var _index = -1;
    for (var i = 0; i < window.PopupWindows.length; i++) {
        if (popupId == window.PopupWindows[i].id) {
            _index = i;
        }
    }

    if (_index >= 0) {
        $("#" + popupId).dxPopup("dispose");
        $("#" + popupId).remove();
        window.PopupWindows.splice(_index, 1);
    }
}
function SaveUserSearchColumns(gridname, _curentColumns) {
    var listcolname = [];
    for (var i = 0; i < _curentColumns.length; i++) {
        listcolname.push(_curentColumns[i].dataField);
    }
    var sendData = {
        ColumnNames: listcolname,
        GridName: gridname
    };

    $.ajax({
        type: "POST",
        url: webApiUrl + "/api/User/SaveUserSearchColumns",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        data: JSON.stringify(sendData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            HideLoading();
            curentColumns = [];
            helperuserforcol = [];
        },
        error: function (errMsg) {
            HideLoading();
        }
    });

}
function baseLayerClicker() {
    document.getElementsByClassName('dropdownBaseLayerList')[0].classList.toggle('downBaseLayerList');
    document.getElementsByClassName('arrowBaseLayerList')[0].classList.toggle('gone');
    if (document.getElementsByClassName('dropdownBaseLayerList')[0].classList.contains('downBaseLayerList')) {
        setTimeout(function () {
            document.getElementsByClassName('dropdownBaseLayerList')[0].style.overflow = 'visible'
        }, 500)
    } else {
        document.getElementsByClassName('dropdownBaseLayerList')[0].style.overflow = 'hidden'
    }
}

function SelectTableForSubsSearch(_columnName, _columnvalue) {

    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/Search/SelectTableForSubsSearch?columnValue=" + _columnvalue.toString(),
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            HideLoading();

            if (data.value.toString() == 'true') {
                ShowOnMap(data.text, data.extraValue, data.extraNextValue);
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


var animationOverlay;
function addAnimation(coords) {

    var element = document.createElement('div');
    element.setAttribute('class', 'pulse');
    animationOverlay = new ol.Overlay({
        element: element,
        position: [coords[0], coords[1]],
        positioning: 'center-center',
        offset: [1, 1]
    });
    map.addOverlay(animationOverlay);
}
function ShowOnMapAnimation(wkt) {
    for (var i = 0; i < wkt.length; i++) {
        addAnimation(ol.extent.getCenter(wkt[i].getGeometry().getExtent()));
        map.getView().fit(wkt[i].getGeometry().getExtent(), map.getSize());
    }

}
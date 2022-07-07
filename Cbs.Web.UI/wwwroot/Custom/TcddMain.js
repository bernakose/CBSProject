function ShowLoading() {
    $('.theme-loader').fadeIn('slow');
}
function HideLoading() {
    $('.theme-loader').fadeOut('slow');
}

Function.prototype.addMethod = function (name, fn) {
    this.prototype[name] = fn;
    return this;
};

Array.prototype.uniqueObjects = function (props) {
    function compare(a, b) {
        var prop;
        if (props) {
            for (var j = 0; j < props.length; j++) {
                prop = props[j];
                if (a[prop] != b[prop])
                    return false;
            }
        } else {
            for (prop in a) {
                if (a[prop] != b[prop])
                    return false;
            }
        }
        return true;
    }
    return this.filter(function (item, index, list) {
        for (var i = 0; i < index; i++) {
            if (compare(item, list[i]))
                return false;
        }
        return true;
    });
};

var buffer;
var antenThematicLayer;
var baseLayerHelper = function () { };
var globalArrExternalLayers = [];
var GlobalBaseLayer;
var manager = new MapManager()
var getCooordinate, googleCoordinateRes;
var _infoMaker = appUrl + "/images/info_marker_64.png";
var networkTraceModel = [];
var wktforzoom;

$(document).ready(function () {
    window.PopupWindows = [];
    window.isInfoActive = false;
    window.isNetworkTrace = false;
    window.isCoordinateActive = false;
    $('.theme-loader').fadeOut('slow', function () {

    });
    $(".mobile-options").on('click', function () {
        $(".navbar-container .nav-right").slideToggle('slow');
    });
    $('#mobile-collapse i').addClass('icon-toggle-right');
    $('#mobile-collapse').on('click', function () {
        $('#mobile-collapse i').toggleClass('icon-toggle-right');
        $('#mobile-collapse i').toggleClass('icon-toggle-left');
    });

    //var settingsss = {
    //    "async": false,
    //    "crossDomain": true,
    //    "url": webApiUrl + "/api/Map/BufferValue",
    //    "method": "GET",
    //    "headers": {}
    //}
    //$.ajax(settingsss).done(function (response) {
    //    HideLoading();
    //    buffer = response;
    //});

    InitPageElements();

    ResizeMapContent();

    initMap();

    var layerGroups = $('div[name ="dxLayerOrder"]');

    window.LayerInfo = [];

    for (var i = 0; i < layerGroups.length; i++) {
        var divItemKey = $(layerGroups[i]).data('group-key');
        for (var m = 0; m < UserHelper.GetUserLayers().length; m++) {
            if (divItemKey == UserHelper.GetUserLayers()[m].GroupKey) {
                window.LayerInfo.push({
                    GroupKey: divItemKey,
                    instance: $(layerGroups[i]).dxList({
                        items: UserHelper.GetUserLayers()[m].Layers,
                        repaintChangesOnly: true,
                        keyExpr: "LayerName",
                        itemTemplate: function (data) {
                            var _text = '<div><input type="checkbox" class="js-success js-small" name="layeritem" data-group-key="' + divItemKey + '" data-layer-name="' + data.LayerName + '" ' + (data.IsOpen ? 'checked=""' : '') + '>   ' + data.LayerTitle + '</div>';
                            return $(_text);
                            //return $("<div>").text(data.LayerTitle);
                        },
                        itemDragging: {
                            allowReordering: true,
                        },
                        onItemReordered: function (e) {
                            //var _entity = $("#menuItemOrdering").dxSelectBox('instance').option('value');
                            ReorderLayers(e.itemElement.find('[name="layeritem"]').data('group-key'), e.fromIndex, e.toIndex);
                        }
                    }).dxList("instance")
                });
            }
        }
    }

    var layerItems = $('[name=layeritem]');
    for (var i = 0; i < layerItems.length; i++) {
        var init = new Switchery(layerItems[i], {
            size: 'small',
            color: '#404E67'
        });
    }

    $('[name=layeritem]').change(function () {
        var _state = $(this).is(':checked');
        var _layerName = $(this).data('layer-name');

        var _groups = UserHelper.GetUserLayers();
        for (var i = 0; i < _groups.length; i++) {
            var _group = _groups[i];

            for (var m = 0; m < _group.Layers.length; m++) {
                if (_group.Layers[m].LayerName == _layerName) {
                    _group.Layers[m].IsOpen = _state;
                }
            }
        }
        localStorage.setItem('UserLayers', JSON.stringify(_groups));
        RefreshWmsLayers();
    });

    $('[name=albMenuItem]').click(function () {

        var isQueryWindow = JSON.parse($(this).data('is-query-window').toLowerCase());

        if (isQueryWindow) {
            var menuId = parseInt($(this).data('menu-id'));

            var menuName = $(this).data('menu-name');
            var queryServiceName = $(this).data('query-service-name');
            var queryTableName = $(this).data('query-table-name');
            var queryUniqColumnName = $(this).data('query-uniq-column-name');
            var queryUniqFieldName = $(this).data('query-uniq-field-name');

            var queryOptions = {
                MenuId: menuId,
                MenuName: menuName,
                ServiceName: queryServiceName,
                TableName: queryTableName,
                UniqColumnName: queryUniqColumnName,
                UniqFieldName: queryUniqFieldName,
                IsParentElem: false,
                Id: ""
            };
            WriteQueryLog(menuName);
            ShowQueryWindow(queryOptions);
        } else {
            var callFunctionName = $(this).data('call-function-name');
            window[callFunctionName]();
        }
    });

    $('#btnCloseInfoLayer').click(function () {
        ShowInfoLayers();
    });
    $('#btnClosethematicLegend').click(function () {
        ShowThematicLegend();
    });
    $('#btnSaveWorkpsace').click(function () {
        ShowLoading();

        var sendData = {
            zoom: parseInt(map.getView().getZoom()),
            centerX: map.getView().getCenter()[0],
            centerY: map.getView().getCenter()[1],
            layerList: UserHelper.GetUserLayers()
        };

        $.ajax({
            type: "POST",
            url: webApiUrl + "/api/User/SaveWorkspace",
            headers: UserHelper.GetUserAjaxRequestOptions().headers,
            data: JSON.stringify(sendData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                HideLoading();
                if (data.isSuccess) {
                    ShowInfo('Workspace saved successfully');
                } else {
                    ShowError(data.message);
                }
            },
            error: function (errMsg) {
                HideLoading();
            }
        });

    });

    $('#btnShowProfileInfo').click(function () {
        $.ajax({
            type: "GET",
            crossDomain: true,
            async: true,
            url: webApiUrl + "/api/User/Profile",
            headers: UserHelper.GetUserAjaxRequestOptions().headers,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (_data) {
                HideLoading();

                //DisposePopup("#dvProfile");

                var popupOptions = {
                    width: ($(window).width() * 0.6),
                    height: 500,
                    id: "dvProfile",
                    showTitle: true,
                    title: "User Profile",
                    dragEnabled: true,
                    closeOnOutsideClick: false,
                    shading: false,
                    resizeEnabled: true,
                    columnAutoWidth: false,
                    data: _data,
                    onShown: function () {
                        $('#dvProfile').css('display', '');
                        $("#dtProfileOperationLogs").dxDataGrid({
                            height: '100%',
                            scrolling: {
                                mode: "virtual"
                            },
                            selection: {
                                mode: "single"
                            },
                            hoverStateEnabled: true,
                            showBorders: true,
                            allowColumnReordering: true,
                            dataSource: _data.operations,
                            columns: [{
                                dataField: "operationDate",
                                caption: "Operation Date",
                                dataType: 'datetime'
                            },
                            {
                                dataField: "title",
                                caption: "Title",
                            },
                            {
                                dataField: "content",
                                caption: "Content"
                            },
                            ]
                        });
                        $("#profileLoginLogout").dxDataGrid({
                            height: '100%',
                            scrolling: {
                                mode: "virtual"
                            },
                            selection: {
                                mode: "single"
                            },
                            hoverStateEnabled: true,
                            showBorders: true,
                            allowColumnReordering: true,
                            dataSource: _data.loginLogouts,
                            columns: [{
                                dataField: "loginTime",
                                caption: "Login",
                                dataType: 'datetime'
                            },
                            {
                                dataField: "logoutTime",
                                caption: "Logout",
                                dataType: 'datetime',
                            },
                            {
                                dataField: "clientInfo",
                                caption: "Client Info",
                            },
                            {
                                dataField: "applicationType",
                                caption: "Application"
                            }
                            ]
                        });
                        $("#userProfileImage").attr("src", _data.avatarImage);
                        $('#userDisplayName').text(_data.name + ' ' + _data.surname);
                        $('#userMailAddress').text('[' + _data.mailAddress + ']');
                        $('#userUsername').text(_data.username);
                    },
                    onHidden: function () {
                        $('#dvProfile').css('display', 'none');
                        // DisposePopup(this._options.id);
                    }
                };

                var popup = $("#dvProfile").dxPopup(popupOptions).dxPopup("instance");

                popup.show();
            },
            error: function (errMsg) {
                HideLoading();
                ShowError(errMsg);
            }
        });
    });

    $("#filer_inputProfileImage").on('change', function () {
        if (cropper)
            cropper.destroy();

        readURL(this);
    });
    var readURL = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imgProfilePicEdit').attr('src', e.target.result);
                var image = document.getElementById('imgProfilePicEdit');
                cropper = new Cropper(image, {
                    aspectRatio: 1 / 1,
                    crop(event) {
                    },
                });
                setTimeout(function () {
                    $('.cropper-container.cropper-bg').width($('.cropper-container.cropper-bg').width() - 33);
                }, 200);
            }

            reader.readAsDataURL(input.files[0]);
        }
    };

    $('#btnSaveCropedProfileImage').click(function () {
        ShowLoading();
        $.ajax({
            type: "POST",
            url: webApiUrl + "/api/User/ChangeProfileImage",
            headers: UserHelper.GetUserAjaxRequestOptions().headers,
            data: JSON.stringify(cropper.getCroppedCanvas().toDataURL()),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                HideLoading();
                if (data.isSuccess) {
                    ShowInfo('Profile image changed successfully');
                    document.getElementById("userProfileImage").src = cropper.getCroppedCanvas().toDataURL();
                    document.getElementById("imgNavbarProfile").src = cropper.getCroppedCanvas().toDataURL();
                    var popup = $("#dvProfileImageChange").dxPopup("instance");
                    popup.hide();
                } else {
                    ShowError(data.message);
                }
            },
            error: function (errMsg) {
                HideLoading();
                ShowError(errMsg.message);
            }
        });
    });
    $('.ol-rotate').remove();
});
var cropper = null;

function GetLayer(title) {
    var layers = map.getLayers().a;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].get('title') == title) {
            return layers[i];
        }
    }
    return null;
}

function ReorderLayers(groupKey, from, to) {

    var _groups = UserHelper.GetUserLayers();

    for (var i = 0; i < _groups.length; i++) {
        if (_groups[i].GroupKey == groupKey) {

            var _movingItem = _groups[i].Layers[from];

            if (from > to) {
                _groups[i].Layers.splice(to, 0, _movingItem);
                _groups[i].Layers.splice(from + 1, 1);
            } else {
                _groups[i].Layers.splice(to + 1, 0, _movingItem);
                _groups[i].Layers.splice(from, 1);
            }

            for (var k = 0; k < _groups[i].Layers.length; k++) {
                _groups[i].Layers[k].Order = k;
            }
        }
    }

    sessionStorage.setItem('UserLayers', JSON.stringify(_groups));
    RefreshWmsLayers();
}

function InitPageElements() {
    $('.displayChatbox').on('click', function () {
        var my_val = $('.pcoded').attr('vertical-placement');
        if (my_val == 'right') {
            var options = {
                direction: 'left'
            };
        } else {
            var options = {
                direction: 'right'
            };
        }
        $('.showChat').toggle('slide', options, 500);
    });

    $('#mobile-collapse i').addClass('icon-toggle-right');
    $('#mobile-collapse').on('click', function () {
        $('#mobile-collapse i').toggleClass('icon-toggle-right');
        $('#mobile-collapse i').toggleClass('icon-toggle-left');
    });
}

function GetDxTreeCheckedValues(treeName) {
    var _arr = [];
    if ($("#" + treeName).length > 0) {
        var nodes = $("#" + treeName).dxTreeView("instance").getNodes();
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].selected) {
                _arr.push(nodes[i].key);
                var _subArr = GetSubNodes(nodes[i]);
                if (_subArr && _subArr.length > 0) {
                    for (var k = 0; k < _subArr.length; k++) {
                        _arr.push(_subArr[k]);
                    }
                }
            }

        }
    }
    return _arr;
}
function GetSubNodes(node) {
    var _arr = [];
    if (node.children.length > 0) {
        for (var i = 0; i < node.children.length; i++) {
            if (node.children[i].selected) {
                _arr.push(node.children[i].key);

                var _subArr = GetSubNodes(node.children[i]);
                if (_subArr && _subArr.length > 0) {
                    for (var k = 0; k < _subArr.length; k++) {
                        _arr.push(_subArr[k]);
                    }
                }
            }
        }
    }
    return _arr;
}
$(window).resize(function () {
    setTimeout(function () {
        ResizeMapContent();
    }, 200);
    //for (var i = 0; i < jsPanel.getPanels().length; i++) {
    //    var _panel = $(jsPanel.getPanel(jsPanel.getPanels()[i].id));
    //    if (_panel[0].options.isQueryWindow) {
    //        var _containers = $(jsPanel.getPanel(jsPanel.getPanels()[i].id)).find("div[id^='panelContainer']");
    //        if (_containers.length > 0) {
    //            var _containerId = $(jsPanel.getPanel(jsPanel.getPanels()[i].id)).find("div[id^='panelContainer']")[0].id;
    //            var _panelId = $(jsPanel.getPanel(jsPanel.getPanels()[i].id))[0].id;
    //            ResizeJsPanel(_panelId, _containerId);
    //        }
    //    }
    //}
});
function ResizeMapContent() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var navbarHeight = $('#TcddNavbar').outerHeight();
    var footerHeight = $('#TcddMenu').outerHeight();


    if (width < 992) {
        $('#map').width(width);
        $('#map').height(height - (navbarHeight));
    } else {
        $('#map').width(width);
        $('#map').height(height - (navbarHeight + footerHeight));
    }

    if (map) {
        map.updateSize();
    }
}

var source;

baseLayerHelper.addMethod('setBaseLayer', function (baseLayerType) {

    if (GlobalBaseLayer != undefined) {
        GlobalBaseLayer.setSource(null);
        if (baseLayerType)
            switch (baseLayerType.toString()) {
                case "0":
                    source = null;
                    break;
                case "4":
                    source = new ol.source.XYZ({
                        crossOrigin: 'Anonymous', url: 'https://mts0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
                        , tileLoadFunction: function (image, src) {
                            if (manager.GetZoom() > 22) {
                                image.getImage().src = "Web/assets/images/Altlik/noimage.png";
                            }
                            else {
                                image.getImage().src = src;
                            }
                        }
                    });
                    break;
                case "5":
                    source = new ol.source.XYZ({
                        crossOrigin: 'Anonymous', url: 'https://mts0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
                        , tileLoadFunction: function (image, src) {
                            if (manager.GetZoom() > 22) {
                                image.getImage().src = "Web/assets/images/Altlik/noimage.png";
                            }
                            else {
                                image.getImage().src = src;
                            }
                        }
                    });
                    break;
                case "6":
                    source = new ol.source.XYZ({
                        crossOrigin: 'Anonymous', url: 'https://mts0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'
                        , tileLoadFunction: function (image, src) {
                            if (manager.GetZoom() > 22) {
                                image.getImage().src = "Web/assets/images/Altlik/noimage.png";
                            }
                            else {
                                image.getImage().src = src;
                            }
                        }
                    });
                    break;
                case "8":
                    source = new ol.source.BingMaps({ crossOrigin: 'Anonymous', key: bingMapKey, imagerySet: 'Aerial' });
                    break;
                case "9":
                    source = new ol.source.BingMaps({ crossOrigin: 'Anonymous', key: bingMapKey, imagerySet: 'AerialWithLabels' });
                    break;
                case "10":
                    source = new ol.source.BingMaps({ crossOrigin: 'Anonymous', key: bingMapKey, imagerySet: 'Road' });
                    break;
                case "11":
                    source = new ol.source.OSM({ crossOrigin: 'Anonymous', url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png' });
                    break;

                default: break;
            }

        if (baseLayerType && (baseLayerType == 8 || baseLayerType == 9 || baseLayerType == 10)) {
            var prop = GlobalBaseLayer.getProperties();
            prop.preload = Infinity;
        } else {
            GlobalBaseLayer.setProperties(null);
        }

        GlobalBaseLayer.setSource(source);

        if (source != null) {
            var tile_loading = 0, tile_loaded = 0, run = 0;
            source.on('tileloadstart', function () {
                ++tile_loading;
            });
            source.on('tileloadend', function () {
                ++tile_loaded;
                if (tile_loaded == tile_loading) {
                    if (run <= 0) {
                        run++;
                        setTimeout(function () { HideLoading(); }, 2000);
                    }
                }
            });
        }
    }
});


function initMap() {

    GlobalBaseLayer = new ol.layer.Tile({});

    GetBaseLayers();
    //baseLayerSource = new ol.source.XYZ({
    //    crossOrigin: 'Anonymous',
    //    url: 'https://mts0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
    //});

    //GlobalBaseLayer = new ol.layer.Tile({
    //    preload: Infinity,
    //    source: source
    //});
    selectionLayer = new ol.layer.Vector({
        title: 'SelectionLayer',
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255,255,102, 0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: '#BD2031',
                width: 5
            }),
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: 'rgba(255,255,102, 0.5)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#BD2031'
                })
            }),

        })
    });
    antenThematicLayer = new ol.layer.Vector({
        title: 'antenThematicLayer',
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255,255,102, 0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: '#BD2031',
                width: 5
            }),
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: 'rgba(255,255,102, 0.5)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#BD2031'
                })
            }),

        })
    });
    var _layerList = [];
    _layerList.push(GlobalBaseLayer);
    for (var i = UserHelper.GetUserLayers().length - 1; i >= 0; i--) {
        var _group = UserHelper.GetUserLayers()[i];
        if (_group.Layers.length > 0) {
            var _url = _group.Layers[0].Url;

            var _openLayers = [];

            for (var m = _group.Layers.length - 1; m >= 0; m--) {
                if (_group.Layers[m].IsOpen) {
                    _openLayers.push(_group.Layers[m].WorkspaceName + ':' + _group.Layers[m].LayerName);
                }
            }
            var layer = new ol.layer.Tile({
                title: _group.GroupKey,
                source: new ol.source.TileWMS(({
                    crossOrigin: 'Anonymous',
                    url: _url,
                    params: {
                        'LAYERS': _openLayers.join(','),
                        'FORMAT': 'image/png8',
                        'TILED': true
                    },
                    projection: 'EPSG:3857'
                }))
            });

            _layerList.push(layer);
        }
    }

    _layerList.push(selectionLayer);
    _layerList.push(antenThematicLayer);

    map = new ol.Map({
        layers: _layerList,
        target: 'map',
        view: new ol.View({
            center: mapCenter,
            zoom: mapZoom,
            maxZoom: 25
        })
    });

    map.on('singleclick', function (evt) {
        if (window.isInfoActive) {
            var icon = new ol.style.Style({
                image: new ol.style.Icon({
                    src: _infoMaker
                })
            });

            var query_layers = '';
            var _arr = [];
            for (var i = 0; i < UserHelper.GetUserLayers().length; i++) {
                var layerName = UserHelper.GetUserLayers()[i].GroupKey;

                var _layer = GetLayer(layerName);

                if (_layer.getSource() != null) {
                    _arr.push(_layer.getSource().getParams().LAYERS.replace("null:", "TCDD:"));
                }
            }

            query_layers = _arr.join(',');

            var viewResolution = map.getView().getResolution();
            var url = GetLayer('WEB_ADR').getSource().getGetFeatureInfoUrl(
                evt.coordinate, viewResolution, 'EPSG:3857',
                {
                    'INFO_FORMAT': 'application/json',
                    'feature_count': 10000,
                    'LAYERS': query_layers,
                    'QUERY_LAYERS': query_layers,
                    'BUFFER': buffer
                });
            var _feature = new ol.Feature({
                type: 'removable',
                geometry: new ol.geom.Point(evt.coordinate)
            });
            _feature.setStyle(icon);
            selectionLayer.setSource(new ol.source.Vector({ features: [_feature] }));
            //map.getView().fit(selectionLayer.getSource().getExtent(), map.getSize());


            ConvertPostFeatureInfo(url);
        }
        else if (window.isCoordinateActive) {
            ShowLoading();
            var actualCoord = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
            $.ajax({
                type: "GET",
                url: webApiUrl + "/api/Coordinate/GetCoordinate?x=" + actualCoord[0] + "&y=" + actualCoord[1],
                headers: UserHelper.GetUserAjaxRequestOptions().headers,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    try {
                        DisposePopup('info_ShowCoordinatesForm');
                    } catch (e) {

                    }
                    var _format = new ol.format.WKT();
                    var _features = [];
                    var wktString = 'POINT(' + evt.coordinate[0] + ' ' + evt.coordinate[1] + ')';
                    var _feature = _format.readFeature(wktString, {
                        dataProjection: 'EPSG:3857',
                        featureProjection: 'EPSG:3857'
                    });
                    _features.push(_feature);
                    selectionLayer.setSource(new ol.source.Vector({ features: _features }));
                    googleCoordinateRes = data;
                    var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": appUrl + "Partial/CallPartial",
                        "method": "GET",
                        "data": { partialPageName: 'ShowCoordinates' },
                        "headers": {}
                    }
                    $.ajax(settings).done(function (response) {
                        if (response != null) {
                            var infoId = 'info_ShowCoordinatesForm';
                            $("body").append('<div id="' + infoId + '"><div name="popupinfoscroll">' + response + '</div></div>');
                            $('#showCoordinateGoogleX').val(googleCoordinateRes.googleY);
                            $('#showCoordinateGoogleY').val(googleCoordinateRes.googleX);
                            $('#showCoordinateDMSX').val(googleCoordinateRes.dmsx);
                            $('#showCoordinateDMSY').val(googleCoordinateRes.dmsy);
                            $('#showCoordinateGoogleLink').val(googleCoordinateRes.googleUrl);
                            $('#showCoordinateGoogleLinkLabel').attr('href', googleCoordinateRes.googleUrl);
                            DisposePopup(infoId);

                            var popupOptionsHierarchical = {
                                width: ($(window).width() * 0.2),
                                height: "auto",
                                id: infoId,
                                showTitle: true,
                                title: "Coordinates",
                                dragEnabled: true,
                                closeOnOutsideClick: false,
                                shading: false,
                                resizeEnabled: true,
                                columnAutoWidth: false,
                                onShown: function () {
                                    var abc = $('div[name="popupinfoscroll"]');
                                    for (var i = 0; i < abc.length; i++) {

                                        $(abc).dxScrollView({
                                            height: '100%',
                                            width: '100%'

                                        })
                                    }
                                },
                                onHidden: function () {
                                    DisposePopup(this._options.id);
                                    selectionLayer.getSource().clear();
                                }
                            };
                            var popup = $("#" + infoId).dxPopup(popupOptionsHierarchical).dxPopup("instance");

                            popup.show();

                            window.PopupWindows.push({
                                id: infoId,
                                instance: popup
                            });
                        }
                        HideLoading();
                    });
                },
                error: function (errMsg) {
                    HideLoading();
                }
            });

        }
        else if (window.isNetworkTrace) {

            var query_layers = '';
            var _arr = [];
            for (var i = 0; i < UserHelper.GetUserLayers().length; i++) {
                var groupName = UserHelper.GetUserLayers()[i].GroupKey;

                var _layer = GetLayer(groupName);

                if (_layer.getSource() != null) {
                    _arr.push(_layer.getSource().getParams().LAYERS.replace("null:", "TCDD:"));
                }
            }

            query_layers = _arr.join(',');

            var viewResolution = map.getView().getResolution();
            var url = GetLayer('WEB_ADR').getSource().getGetFeatureInfoUrl(
                evt.coordinate, viewResolution, 'EPSG:3857',
                {
                    'INFO_FORMAT': 'application/json',
                    'feature_count': 10000,
                    'LAYERS': query_layers,
                    'QUERY_LAYERS': query_layers,
                    'BUFFER': buffer
                });

            ConvertPostFeatureNetworkTrace(url);
        }
    });
    var vectorMeasureLayerStyle = manager.CreateStyle(manager.CreateFillStyle([230, 120, 23, 0.2]), manager.CreateStrokeStyle('#006FA6', 2), manager.CreateImageStyle(5, [230, 120, 23, 0.2], '#006FA6', 2));
    vectorMeasureLayer = manager.CreateVectorLayer('VectorLayer', vectorMeasureLayerStyle);

    var wktforzoomStyle = manager.CreateStyle(manager.CreateFillStyle([177, 221, 238, 0.3]), manager.CreateStrokeStyle('#bf00ff', 5), manager.CreateImageStyle(5, '#f279ba', '#e616d4', 1));
    wktforzoom = manager.CreateVectorLayer('wktforzoom', wktforzoomStyle);

    createMeasureTooltip();
    createHelpTooltip();

    Draw = {
        init: function () {
            map.addInteraction(this.Distance);
            this.Distance.setActive(false);
            map.addInteraction(this.Area);
            this.Area.setActive(false);

            this.Distance.on('drawstart', function (event) {
                sketch = event.feature;
            });

            this.Distance.on('drawend', function (event) {
                measureTooltipElement.className = 'tooltip-measure tooltip-measure-static';
                measureTooltip.setOffset([0, -7]);
                sketch = null;
                measureTooltipElement = null;
                createMeasureTooltip();
            });

            this.Area.on('drawstart', function (event) {
                sketch = event.feature;
            });

            this.Area.on('drawend', function (event) {
                measureTooltipElement.className = 'tooltip-measure tooltip-measure-static';
                measureTooltip.setOffset([0, -7]);
                sketch = null;
                measureTooltipElement = null;
                createMeasureTooltip();
            });
        },

        Distance: new ol.interaction.Draw({
            source: vectorMeasureLayer.getSource(),
            type: ('LineString')
        }),

        Area: new ol.interaction.Draw({
            source: vectorMeasureLayer.getSource(),
            type: ('Polygon')
        }),

        getActive: function () {
            if (this.activeType == undefined) return true;
            return this.activeType ? this[this.activeType].getActive() : false;
        },

        setActive: function (active) {
            var type = DrawType;
            if (active) {
                try {
                    this.activeType && this[this.activeType].setActive(false);
                    this[type].setActive(true);
                    this.activeType = type;
                } catch (e) {
                }
            } else {
                this.activeType && this[this.activeType].setActive(false);
                this.activeType = null;
            }
        }
    };
    Draw.init();
    Draw.setActive(true);
    manager.AddLayerToMap(vectorMeasureLayer);
    manager.AddLayerToMap(wktforzoom);

    createContextMenu();

}
var firstBaseLayer = true;
var altlikDizi = [];

function GetBaseLayers() {

    var settingsasd = {
        "async": false,
        "crossDomain": true,
        "url": webApiUrl + '/api/Layer/BaseLayers/en-US',
        "method": "GET",
        "headers": {}
    }
    ShowLoading();
    $.ajax(settingsasd).done(function (result) {
        HideLoading();
        var selectedBaseLayer;
        var selectednum;
        for (var i = 0; i < result.length; i++) {
            var item = {
                TEXT: result[i].layerName,
                VALUE: result[i].order,
                SELECTED: result[i].isDefault,
                DESCRIPTION: result[i].layerTitle,
                IMAGESRC: appUrl + "/assets/images/Altlik/" + result[i].imageName.replace("svg", "png"),
                ORDERNUMBER: result[i].order,
                TITLE: result[i].layerTitle,
            };
            altlikDizi.push(item);
            if (result[i].isDefault === 1) {
                selectedBaseLayer = result[i];
                selectednum = i;
            }
        }
        var layerHtml = '';
        $.each(altlikDizi, function (a, b) {
            var className = '';
            b.SELECTED == 1 ? className = 'pBaseLayerActive' : className = '';
            layerHtml += '<p class="pBaseLayerList ' + className + '" baselayer-id="' + b.VALUE + '" baselayer-desc="' + b.DESCRIPTION + '" baselayer-image="' + b.IMAGESRC + '">' + b.DESCRIPTION + ' <span class="fa fa-inbox spanBaseLayerList"><img src="' + b.IMAGESRC + '"></img></span></p>';
            if (b.SELECTED == 1) {
                $('#selectedBaseLayerId').html(b.DESCRIPTION + '<span class="fa fa-inbox spanBaseLayerList"><img src="' + b.IMAGESRC + '"></img></span>');
                baseLayerHelper.prototype.setBaseLayer(b.VALUE);
                $(this).addClass('pBaseLayerActive');
            }
        });
        $('.dropdownBaseLayerList').append(layerHtml);
        $('.pBaseLayerList').click(function () {
            var val = $(this).attr('baselayer-id');
            baseLayerHelper.prototype.setBaseLayer(val);
            $('#selectedBaseLayerId').html($(this).attr('baselayer-desc') + '<span class="fa fa-inbox spanBaseLayerList"><img src="' + $(this).attr('baselayer-image') + '"></img></span>');
            if (!firstBaseLayer)
                ShowInfo('Underlay layer updated to "' + $(this).attr('baselayer-desc') + '"');
            firstBaseLayer = false;
            $('.pBaseLayerActive').removeClass('pBaseLayerActive');
            $(this).addClass('pBaseLayerActive');
            baseLayerClicker();
        });

    });
}

function GetLayerTitle(_layerName) {
    var result = '';
    for (var i = 0; i < UserHelper.GetUserLayers().length; i++) {
        var _group = UserHelper.GetUserLayers()[i];
        for (var m = 0; m < _group.Layers.length; m++) {
            if (_group.Layers[m].LayerName == _layerName) {
                result = _group.Layers[m].LayerTitle;
            }
        }
    }
    return result;
}

var icerikTable;
var icerikTableDoorsBuilding;
var icerikTableLocalDP = '';
var icerikTableSplitter = '';
function ShowInfoDetail(_serviceName, _uniqField, _value, _title, _displayText) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": odataUrl + "/" + _serviceName + "?$filter=" + _uniqField + " eq " + _value,
        "method": "GET",
        "headers": {}
    }
    ShowLoading();
    $.ajax(settings).done(function (response) {
        HideLoading();
        var _tableName;
        var _colName;
        var searchGrid = JSON.parse($('#hdGridSearchs').val());

        for (var i = 0; i < searchGrid.length; i++) {
            if (searchGrid[i].ServiceName == _serviceName) {
                _tableName = searchGrid[i].TableNameBtn;
                _colName = searchGrid[i].UnqColNameBtn;

                var doorsbuildings = false;
                var localdp = false;
                var splitter = false;
                if (searchGrid[i].TableNameBtn == "gis_net_geo_door" && searchGrid[i].EntityName == "VDoor") {
                    doorsbuildings = true;
                    var settings = {
                        "async": false,
                        "crossDomain": true,
                        "url": webApiUrl + "/api/Layer/DoorsBuildings/" + response.value[0].BuildingId,
                        "method": "GET",
                        "headers": {}
                    }
                    ShowLoading();
                    $.ajax(settings).done(function (responseBuilding) {
                        HideLoading();
                        icerikTableDoorsBuilding = '<table class="table">';
                        icerikTableDoorsBuilding += '<tbody>';
                        icerikTableDoorsBuilding += '<tr>';
                        icerikTableDoorsBuilding += '     <th scope="row">Building Id</th>';
                        icerikTableDoorsBuilding += '     <td>' + responseBuilding.buildingId + '</td>';
                        icerikTableDoorsBuilding += '</tr>';
                        icerikTableDoorsBuilding += '<tr>';
                        icerikTableDoorsBuilding += '     <th scope="row">Building Name</th>';
                        icerikTableDoorsBuilding += '     <td>' + responseBuilding.buildingName + '</td>';
                        icerikTableDoorsBuilding += '</tr>';
                        icerikTableDoorsBuilding += '<tr>';
                        icerikTableDoorsBuilding += '     <th scope="row">Workplace</th>';
                        icerikTableDoorsBuilding += '     <td>' + responseBuilding.workplace + '</td>';
                        icerikTableDoorsBuilding += '</tr>';
                        icerikTableDoorsBuilding += '<tr>';
                        icerikTableDoorsBuilding += '     <th scope="row">Floor</th>';
                        icerikTableDoorsBuilding += '     <td>' + responseBuilding.floor + '</td>';
                        icerikTableDoorsBuilding += '</tr>';
                        icerikTableDoorsBuilding += '<tr>';
                        icerikTableDoorsBuilding += '     <th scope="row">Flat</th>';
                        icerikTableDoorsBuilding += '     <td>' + responseBuilding.flat + '</td>';
                        icerikTableDoorsBuilding += '</tr>';
                        icerikTableDoorsBuilding += '</tbody>';
                        icerikTableDoorsBuilding += '</table>'
                    });
                }

                if (searchGrid[i].TableNameBtn == "gis_net_geo_local_dp" && searchGrid[i].EntityName == "VGisNetLocalDp") {

                    var settings = {
                        "async": false,
                        "crossDomain": true,
                        "url": webApiUrl + "/api/Layer/GetMSAN/" + response.value[0].LdeviceId,
                        "method": "GET",
                        "headers": {}
                    }
                    ShowLoading();
                    $.ajax(settings).done(function (responsemsan) {
                        HideLoading();
                        if (responsemsan.split('#')[0] == "1") {
                            icerikTableLocalDP += '<tr>';
                            icerikTableLocalDP += '     <th scope="row">MSAN Id</th>';
                            icerikTableLocalDP += '     <td>' + responsemsan.split('#')[1] + '</td>';
                            icerikTableLocalDP += '</tr>';

                            localdp = true;

                        }

                    });
                }
                if (searchGrid[i].TableNameBtn == "gis_net_geo_splitter" && searchGrid[i].EntityName == "VGisNetSplitterSearch") {

                    var settings = {
                        "async": false,
                        "crossDomain": true,
                        "url": webApiUrl + "/api/Layer/GetOLT/" + response.value[0].SplitterId,
                        "method": "GET",
                        "headers": {}
                    }
                    ShowLoading();
                    $.ajax(settings).done(function (responsesplitter) {
                        HideLoading();
                        if (responsesplitter.split('#')[0] == "1") {
                            icerikTableSplitter += '<tr>';
                            icerikTableSplitter += '     <th scope="row">OLT Id</th>';
                            icerikTableSplitter += '     <td>' + responsesplitter.split('#')[1] + '</td>';
                            icerikTableSplitter += '</tr>';
                            splitter = true;
                        }

                    });
                }

                icerikTable = '<table class="table">';
                icerikTable += '<tbody>';
                var visiblePropCount = 0;
                for (var m = 0; m < searchGrid[i].Properties.length; m++) {
                    if (searchGrid[i].Properties[m].Visible) {
                        icerikTable += '<tr>';
                        icerikTable += '     <th scope="row">' + searchGrid[i].Properties[m].Tag + '</th>';
                        icerikTable += '     <td>' + response.value[0][searchGrid[i].Properties[m].FieldName] + '</td>';
                        icerikTable += '</tr>';
                        visiblePropCount++;
                    }
                    if (visiblePropCount == 1) {
                        if (localdp)
                            icerikTable += icerikTableLocalDP;
                        if (splitter)
                            icerikTable += icerikTableSplitter;
                    }
                }

                icerikTableLocalDP = '';
                icerikTableSplitter = '';

                icerikTable += '</tbody>';
                icerikTable += '</table>'

                //#region File Tab
                var infoId = 'info_' + _serviceName + _uniqField + _value;
                var fileUploader;
                var fileManager;
                var fileExplanation;
                var popupFile;

                var t = '<div id="tabpanel-container' + infoId + '">'
                    + '  </div> '
                    + '     <div class="item-box">'
                    + '       Tab <span class="selected-index">1</span>'
                    + '       of <span class="item-count"></span>'
                    + '     </div>'

                    + '<div id="customFileManager' + infoId + '" class="demo-container" style="display: none;">'
                    + '     <div id = "fileuploader-container">'
                    + '         <div id="file-uploader' + infoId + '"></div>'
                    + '         <div id="fileupload-explanation' + infoId + '"></div>'
                    + '     </div >'
                    + '     <div id="file-manager' + infoId + '"></div>'
                    + '     <div id="photo-popup' + infoId + '"></div>'
                    + '</div>'
                $("body").append('<div id="' + infoId + '"><div name="popupinfoscroll">' + t + '</div></div>');
                //#endregion



                DisposePopup(infoId);

                var _height = visiblePropCount * 40;

                if (_height > ($(window).height() * 0.6)) {
                    _height = $(window).height() * 0.6;
                }

                _height = _height + 60;

                var tbt = [];
                var lstquery = [];
                var lstqueryfirst = [];
                //show wkts
                if (searchGrid[i].ShowOnMapBtn !== null && searchGrid[i].ShowOnMapBtn !== "" && searchGrid[i].ShowOnMapBtn !== undefined) {
                    var spltdgr = searchGrid[i].ShowOnMapBtn.split(',');

                    for (var l = 0; l < spltdgr.length; l++) {

                        var title = spltdgr[l].replace("_", " ").replace("_", " ");

                        var shwquery = {
                            tblname: searchGrid[i].TableNameBtn,
                            whereclause: searchGrid[i].ShowWhereClause.replace("~", _value).replace("~", _value).replace("~", _value).replace("~", _value).replace("~", _value),
                            titled: title
                        };

                        lstqueryfirst.push(shwquery);

                        tbt.push({
                            widget: "dxButton",
                            toolbar: "bottom",
                            location: "after",
                            options: {
                                stylingMode: "contained",
                                type: "success",
                                width: "auto",
                                text: title,
                                onClick: function (e) {
                                    var elem = e.element[0].innerText;
                                    for (var i = 0; i < lstqueryfirst.length; i++) {
                                        if (lstqueryfirst[i].titled === elem) {
                                            ShowOnMultiMap(lstqueryfirst[i].tblname, lstqueryfirst[i].whereclause);
                                        }
                                    }
                                }
                            }
                        });

                    }

                }
                switch (searchGrid[i].TableNameBtn) {
                    case "gis_net_geo_local_dp":
                    case "gis_net_geo_principal_dp":
                    case "gis_net_geo_pcable":
                    case "gis_net_geo_lcable":
                    case "gis_net_geo_fiber":
                        tbt.push({
                            widget: "dxButton",
                            toolbar: "bottom",
                            location: "after",
                            options: {
                                stylingMode: "contained",
                                type: "success",
                                width: "auto",
                                text: "SHOW PATH",
                                onClick: function (e) {
                                    networkTraceModel = [];
                                    networkTraceModel.push({ layerName: _tableName, uniqueColumn: _colName, uniqueColumnValue: _value, traceType: 1 });
                                    OpenNetworkTraceForm(networkTraceModel);
                                }
                            }
                        });
                        if (searchGrid[i].TableNameBtn === "gis_net_geo_lcable") {
                            tbt.push({
                                widget: "dxButton",
                                toolbar: "bottom",
                                location: "after",
                                options: {
                                    stylingMode: "contained",
                                    type: "default",
                                    width: "auto",
                                    text: "SHOW SUBSCRIBERS",
                                    onClick: function (e) {
                                        networkTraceModel = [];
                                        networkTraceModel.push({ layerName: _tableName, uniqueColumn: _colName, uniqueColumnValue: _value, traceType: 1 });
                                        ShowCableSubscriber(networkTraceModel);
                                    }
                                }
                            });
                        }
                        break;
                    default:
                }

                //open search panel
                if (searchGrid[i].ShowOpenSearchBtn !== null && searchGrid[i].ShowOpenSearchBtn !== "" && searchGrid[i].ShowOpenSearchBtn !== undefined) {
                    var spltop = searchGrid[i].ShowOpenSearchBtn !== null ? searchGrid[i].ShowOpenSearchBtn.split(',') : null;
                    var helpercol = searchGrid[i].HelperCol !== null ? searchGrid[i].HelperCol.split('~') : null;

                    for (var k = 0; k < spltop.length; k++) {
                        var titleop = spltop[k].replace("_", " ").replace("_", " ");
                        var _helperTableName = helpercol !== null ? helpercol[k].split(',')[0] : null;
                        var _helperUniqCol = helpercol !== null ? helpercol[k].split(',')[1] : null;
                        var _helperUniqColDgr = helpercol !== null ? helpercol[k].split(',')[2] : null;
                        var _dpp = helpercol[k].split(',').length > 3 ? helpercol[k].split(',')[3] : null;

                        var queryOptions = {
                            MenuId: "queryopt_" + k + "_" + _value,
                            MenuName: titleop,
                            ServiceName: searchGrid[i].SearchTable.split(',')[k],
                            TableName: searchGrid[i].TableNameBtn,
                            UniqColumnName: searchGrid[i].UnqColNameBtn,
                            UniqFieldName: searchGrid[i].UnqFieldNameBtn,
                            SearchTable: searchGrid[i].SearchTable.split(',')[k],
                            IsParentElem: true,
                            helperTableName: _helperTableName,
                            helperUniqCol: _helperUniqCol,
                            helperUniqColDgr: _helperUniqColDgr,
                            helperUniqColSubscrb: searchGrid[i].HelperColSubscrb,
                            dpp: _dpp,
                            Id: _value
                        };
                        lstquery.push(queryOptions);

                        tbt.push({
                            id: k,
                            widget: "dxButton",
                            toolbar: "bottom",
                            location: "after",
                            options: {
                                stylingMode: "contained",
                                type: "default",
                                width: "auto",
                                text: titleop,
                                onClick: function (e) {

                                    var elem = e.element[0].innerText;
                                    for (var i = 0; i < lstquery.length; i++) {
                                        if (lstquery[i].MenuName === elem) {
                                            ShowQueryWindow(lstquery[i]);
                                        }
                                    }
                                }
                            }
                        });
                    }

                }

                var popupOptions = {
                    width: ($(window).width() * 0.25),
                    height: _height,
                    id: infoId,
                    showTitle: true,
                    title: _title + ' (' + _displayText + ')',
                    dragEnabled: true,
                    closeOnOutsideClick: false,
                    shading: false,
                    resizeEnabled: true,
                    columnAutoWidth: false,
                    toolbarItems: tbt,
                    onShown: function () {
                        var abc = $('div[name="popupinfoscroll"]');
                        for (var i = 0; i < abc.length; i++) {

                            $(abc).dxScrollView({
                                height: '100%',
                                width: '100%'

                            })
                        }
                    },
                    onHidden: function () {
                        DisposePopup(this._options.id);
                    }
                };


                //#region FileManager

                var provider = new DevExpress.fileManagement.CustomFileSystemProvider({
                    getItems: function (pathInfo) {
                        const settings = {
                            "async": false,
                            "crossDomain": true,
                            "url": webApiUrl + "/api/File/GetFilesWithModel?layerName=" + _tableName + "&recordId=" + _value,
                            "method": "GET",
                            "headers": UserHelper.GetUserAjaxRequestOptions().headers
                        };
                        var r;
                        $.ajax(settings).done(function (response) {
                            r = response;
                        });
                        return r;
                    },
                    deleteItem: function (item) {
                        const settings = {
                            "async": false,
                            "crossDomain": true,
                            "url": webApiUrl + "/api/File/DeleteFile?id=" + item.dataItem.id,
                            "method": "GET",
                            "headers": UserHelper.GetUserAjaxRequestOptions().headers
                        };
                        var r;
                        $.ajax(settings).done(function (response) {
                            fileManager.refresh();
                            r = response;
                        });
                        fileManager._itemView.clearSelection();
                        $("#" + infoId).find(".dx-drawer-panel-content").css("display", "none");
                        return r;
                    },
                    downloadItems: function (item) {
                        window.open(item[0].dataItem.downloadUrl, '_blank', '');
                    }
                });

                fileManager = $("#file-manager" + infoId).dxFileManager({
                    name: "fileManager",
                    rootFolderName: "Files",
                    selectionMode: "single",
                    fileSystemProvider: provider,
                    itemView: {
                        showFolders: false,
                        showParentFolder: false,
                        details: {
                            columns: [
                                "thumbnail",
                                {
                                    hidingPriority: 100,
                                    dataField: "id",
                                    caption: "Id",
                                    width: 40
                                },
                                {
                                    dataField: "fileType",
                                    caption: "File Type",
                                    visible: false
                                },
                                "name",
                                "dateModified",
                                {
                                    hidingPriority: 1,
                                    dataField: "customSize",
                                    dataType: 'string',
                                    caption: "Size",
                                    width: 50,
                                },
                                {
                                    hidingPriority: 0,
                                    dataField: "explanation",
                                    caption: "Explanation",
                                    heigth: 90,
                                    width: 100
                                }
                            ]
                        }
                    },
                    permissions: {
                        create: false,
                        copy: false,
                        move: false,
                        delete: true,
                        rename: false,
                        upload: false,
                        download: true,
                    },
                    onContentReady: function (e) {
                        $('.dx-filemanager-dirs-panel').parent().remove();
                        $('.dx-menu-horizontal').parent().remove();
                        $(".dx-widget dx-filemanager-breadcrumbs").remove();
                    },
                    onSelectedFileOpened: function (e) {

                        var popContent;
                        var filePath = e.file.dataItem.downloadUrl;

                        switch (e.file.dataItem.fileType.toUpperCase()) {
                            case ".PDF":
                                popContent = '<div name="popupFileDetailsInfoscroll" class="popupFileDetailsInfoscroll"><iframe class="popupFileDetailsInfoscroll" src="https://docs.google.com/viewer?url=' + filePath + '&embedded=true" allowfullscreen></iframe> </div>';
                                break;
                            case ".DOC":
                            case ".DOCX":
                            case ".XLS":
                            case ".XLSX":
                            case ".XLSB":
                                popContent = '<div name="popupFileDetailsInfoscroll" class="popupFileDetailsInfoscroll"><iframe class="popupFileDetailsInfoscroll" src="https://view.officeapps.live.com/op/view.aspx?src=' + filePath + '" allowfullscreen></iframe> </div>';
                                break;
                            case ".JPG":
                            case ".JPEG":
                            case ".PNG":
                            case ".GIF":
                                popContent = '<div name="popupFileDetailsInfoscroll" ><img id="popupimage" src="' + filePath + '" class="photo-popup-image"/> </div>';
                                break;
                            case ".TXT":
                                popContent = '<div name="popupFileDetailsInfoscroll" class="popupFileDetailsInfoscroll"><iframe class="popupFileDetailsInfoscroll" src="' + filePath + '" allowfullscreen></iframe> </div>';
                                break;
                            default:
                        }
                        popupFile.option({
                            "title": e.file.name,
                            "contentTemplate": popContent
                        });
                        popupFile.show();
                    }
                }).dxFileManager('instance');
                popupFile = $("#photo-popup" + infoId).dxPopup({
                    resizeEnabled: true,
                    closeOnOutsideClick: true,
                    onContentReady: function (e) {
                        var $contentElement = e.component.content();
                        $contentElement.addClass("photo-popup-content");
                    },
                    onShown: function (e) {
                        var abc = $('div[name="popupFileDetailsInfoscroll"]');
                        for (var i = 0; i < abc.length; i++) {

                            $(abc).dxScrollView({
                                height: '100%',
                                width: '100%'

                            })
                        }
                    },
                }).dxPopup('instance');
                //#endregion

                fileExplanation = $("#fileupload-explanation" + infoId).dxTextArea({
                    value: "",
                    visible: false,
                    height: 50,
                    maxLength: 98,
                    name: "fileUploadExplanation",
                    onValueChanged: function (data) {
                        var url = webApiUrl + "/api/File/FileUploadWithoutModel";
                        url = updateQueryStringParameter(url, {
                            "layerName": _tableName,
                            "recordId": _value,
                            "userId": UserHelper.GetUser().Id,
                            "explanation": data.value,
                        });
                        fileUploader.option("uploadUrl", url);
                    }
                }).dxTextArea("instance");

                var _duplicate;
                //#region FileUploader
                fileUploader = $("#file-uploader" + infoId).dxFileUploader({
                    selectButtonText: "Select File",
                    labelText: "",
                    accept: "*",
                    uploadMode: "useButtons",
                    uploadMethod: "POST",
                    uploadHeaders: {
                        'Authorization': 'Basic ' + UserHelper.GetToken(), 'Language': UserHelper.GetUserLanguage()
                    },
                    allowedFileExtensions: [".jpg", ".jpeg", ".png", ".gif", ".doc", ".docx", ".xls", ".xlsx", ".xlsb", ".pdf", ".txt"],
                    maxFileSize: 52428800,//50MB
                    multiple: false,
                    onUploadStarted: function (e) {
                        if (_duplicate) {
                            e.request.abort();
                        }
                    },
                    onUploaded: function () {
                        fileManager.refresh();
                        fileUploader.reset();
                    },
                    onUploadError: function (e) {
                        if (_duplicate) {
                            ShowError("File with the same name exists, select a different file or change the file name");
                        }
                    },
                    onValueChanged: function (e) {
                        var files = e.value;
                        if (files.length > 0) {
                            const settings = {
                                "async": true,
                                "crossDomain": true,
                                "url": webApiUrl + "/api/File/FileNameControl?layerName=" + _tableName + "&recordId=" + _value + "&fileName=" + files[0].name,
                                "method": "GET",
                                "headers": UserHelper.GetUserAjaxRequestOptions().headers,
                                statusCode: {
                                    409: function () {
                                        e.element.find('.dx-fileuploader-file-status-message').text("File with the same name exists, select a different file or change the file name.");
                                        ShowError("File with the same name exists, select a different file or change the file name.");
                                        _duplicate = true;
                                    },
                                    200: function () {
                                        _duplicate = false;
                                        fileExplanation.option("visible", true);
                                        $("#selected-files .selected-item").remove();

                                        $("#selected-files").show();
                                        var url = webApiUrl + "/api/File/FileUploadWithoutModel";
                                        url = updateQueryStringParameter(url, {
                                            "layerName": _tableName,
                                            "recordId": _value,
                                            "userId": UserHelper.GetUser().Id,
                                            "explanation": "",
                                        });
                                        e.component.option("uploadUrl", url);
                                    },
                                    500: function (errMsg) {
                                        _duplicate = true;
                                        ShowError(errMsg.message);
                                    }
                                }
                            };

                            $.ajax(settings).done(function (response) {

                            }).fail(function (jqXHR, textStatus, errorThrown) {
                            });


                        } else {
                            $("#selected-files").hide();
                            fileExplanation.option("visible", false);
                            fileExplanation.option("value", "");
                        }
                    },

                }).dxFileUploader("instance");

                //#endregion
                var datasources = doorsbuildings == true ?
                    [{ "customTabName": "Info", "customTabTitle": "Layer Info" }, { "customTabName": "DBInfo", "customTabTitle": "Door's Building Info" }, { "customTabName": "Files", "customTabTitle": "Files" }]
                    :
                    [{ "customTabName": "Info", "customTabTitle": "Layer Info" }, { "customTabName": "Files", "customTabTitle": "Files" }];
                //#region TabPanel
                tabPanel = $("#tabpanel-container" + infoId).dxTabPanel({
                    height: '100%',
                    dataSource: datasources,
                    selectedIndex: 0,
                    loop: false,
                    animationEnabled: true,
                    swipeEnabled: true,
                    itemTitleTemplate: function (itemData, itemIndex, itemElement) {
                        itemElement.append('<b>' + itemData.customTabTitle + '</b>');
                    },
                    itemTemplate: function (itemData, itemIndex, itemElement) {
                        switch (itemData.customTabName) {
                            case "Info":
                                itemElement.append(icerikTable);
                                $('#customtabpanel').css("display", "block");
                                break;
                            case "Files":
                                itemElement.append($('#customFileManager' + infoId));
                                $('#customFileManager' + infoId).css("display", "block");
                                break;
                            case "DBInfo":
                                itemElement.append(icerikTableDoorsBuilding);

                                break;
                        }
                    },
                    onSelectionChanged: function (e) {
                        $(".selected-index")
                            .text(e.component.option("selectedIndex") + 1);
                    },
                    onInitialized: function () {
                        // $('#customtabpanelFirst').css("display", "block");
                    }
                }).dxTabPanel("instance");


                $("#loop-enabled").dxCheckBox({
                    value: false,
                    text: "Loop enabled",
                    onValueChanged: function (e) {
                        tabPanel.option("loop", e.value);
                    }
                });

                $("#animation-enabled").dxCheckBox({
                    value: true,
                    text: "Animation enabled",
                    onValueChanged: function (e) {
                        tabPanel.option("animationEnabled", e.value);
                    }
                });

                $("#swipe-enabled").dxCheckBox({
                    value: true,
                    text: "Swipe enabled",
                    onValueChanged: function (e) {
                        tabPanel.option("swipeEnabled", e.value);
                    }
                });

                $(".item-count").text($("#tabpanel-container" + infoId).dxTabPanel()[0].childNodes[1].childNodes[0].childNodes[0].childElementCount);

                //#endregion

                var popup = $("#" + infoId).dxPopup(popupOptions).dxPopup("instance");

                popup.show();

                window.PopupWindows.push({
                    id: infoId,
                    instance: popup
                });
            }
        }
    });
}

function RefreshWmsLayers() {
    for (var i = UserHelper.GetUserLayers().length - 1; i >= 0; i--) {
        var _group = UserHelper.GetUserLayers()[i];
        if (_group.Layers.length > 0) {
            var _url = _group.Layers[0].Url;

            var _openLayers = [];

            for (var m = _group.Layers.length - 1; m >= 0; m--) {
                if (_group.Layers[m].IsOpen) {
                    _openLayers.push(_group.Layers[m].WorkspaceName + ':' + _group.Layers[m].LayerName);
                }
            }

            var _layer = GetLayer(_group.GroupKey);

            _layer.setSource(new ol.source.TileWMS(({
                crossOrigin: 'Anonymous',
                url: _url,
                params: {
                    'LAYERS': _openLayers.join(','),
                    'FORMAT': 'image/png8',
                    'TILED': true
                },
                projection: 'EPSG:3857'
            })));

        }
    }
}
function WriteQueryLog(menuName) {
    var sendData = [{
        operationId: "12",
        title:  menuName + " Search",
        content: menuName + " Query Runned."
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

function ShowInfoLayers() {
    $('.showInfoLayers').toggle('slide', {
        direction: 'left'
    }, 500);
}
function ShowThematicLegend() {
    $('.thematicLegend').toggle('slide', {
        direction: 'left'
    }, 500);
}
function PanControl() {
    cancelDraw();
    window.isInfoActive = false;
    window.isCoordinateActive = false;
    window.isNetworkTrace = false;
    $('li').find('[data-call-function-name="ActivateInfo"]').parent().removeClass("active");
    ShowInfo('Pan control is open.');
    $('body').css('cursor', 'default');
    //$('body').css('cursor', 'grab');
}
function ActivateCoordinate() {
    if (!window.isCoordinateActive) {
        window.isCoordinateActive = true;
        $('li').find('[data-call-function-name="ActivateCoordinate"]').parent().addClass("active");
        ShowInfo('Coordinate selection is open.');
        $('body').css('cursor', 'pointer');
    }
    else {
        window.isCoordinateActive = false;
        $('li').find('[data-call-function-name="ActivateCoordinate"]').parent().removeClass("active");
        ShowInfo('Coordinate selection is closed.');
        $('body').css('cursor', 'default');
    }
}
function ActivateInfo() {

    if (!window.isInfoActive) {
        window.isInfoActive = true;
        window.isCoordinateActive = false;
        $('li').find('[data-call-function-name="ActivateInfo"]').parent().addClass("active");
        ShowInfo('Info control is open.');
        $('body').css('cursor', 'pointer');
    }
    else {
        window.isInfoActive = false;
        $('li').find('[data-call-function-name="ActivateInfo"]').parent().removeClass("active");
        ShowInfo('Info control is closed.');
        $('body').css('cursor', 'default');
    }
}

function InfoForContextMenu(obj) {
    var icon = new ol.style.Style({
        image: new ol.style.Icon({
            src: _infoMaker
        })
    });

    var query_layers = '';
    var _arr = [];
    for (var i = 0; i < UserHelper.GetUserLayers().length; i++) {
        var layerName = UserHelper.GetUserLayers()[i].GroupKey;

        var _layer = GetLayer(layerName);

        if (_layer.getSource() != null) {
            _arr.push(_layer.getSource().getParams().LAYERS.replace("null:", "TCDD:"));
        }
    }

    query_layers = _arr.join(',');

    var viewResolution = map.getView().getResolution();
    var url = GetLayer('WEB_ADR').getSource().getGetFeatureInfoUrl(
        obj.coordinate, viewResolution, 'EPSG:3857',
        {
            'INFO_FORMAT': 'application/json',
            'feature_count': 10000,
            'LAYERS': query_layers,
            'QUERY_LAYERS': query_layers,
            'BUFFER': buffer
        });
    var _feature = new ol.Feature({
        type: 'removable',
        geometry: new ol.geom.Point(obj.coordinate)
    });
    _feature.setStyle(icon);
    selectionLayer.setSource(new ol.source.Vector({ features: [_feature] }));
    //map.getView().fit(selectionLayer.getSource().getExtent(), map.getSize());

    ConvertPostFeatureInfo(url);


}

function ConvertPostFeatureInfo(src) {
    ShowLoading();
    var xhr = new XMLHttpRequest();
    var url = src.substr(0, src.indexOf('?'));
    var params = src.substring(src.indexOf('?') + 1);
    xhr.open('POST', url, true);

    xhr.responseType = 'json';
    xhr.onload = function (e) {
        if (this.status === 200) {
            var _arr = this.response.features;

            var icerik = '';
            for (var i = 0; i < _arr.length; i++) {
                var serviceName = _arr[i].properties["controller_name"];

                if (serviceName === "VLDevices")
                    serviceName = _arr[i].properties["type"] == 2 ? serviceName : "VStreetCabinets";
                if (serviceName === "VPCables")
                    serviceName = _arr[i].properties["is_rigid"] == 0 ? serviceName : "RigidCableSearchs";
                if (serviceName === "VGisNetPrincipalDps")
                    serviceName = _arr[i].properties["is_rigid"] == 0 ? serviceName : "RigidDpSearchs";

                if (serviceName != null && serviceName != undefined && serviceName.trim().length > 0) {
                    var uniqField = _arr[i].properties["uniq_field_name"];
                    var uniqColumn = _arr[i].properties["uniq_column_name"];
                    var helperColumnName = _arr[i].properties["helper_column_name"];

                    var value = _arr[i].properties[uniqColumn];

                    var displayText = _arr[i].properties[helperColumnName];
                    var menuName = _arr[i].id.split('.')[0];

                    var _title = GetLayerTitle(menuName);

                    if (serviceName === "VStreetCabinets")
                        _title = "Street Cabinet";
                    if (serviceName === "RigidCableSearchs")
                        _title = "Rigid Cable";
                    if (serviceName === "RigidDpSearchs")
                        _title = "Rigid Distribution Point";
                    if (serviceName === "MinorPipeSearchs")
                        serviceName = "VPipeMinorSearchs";
                    if (serviceName === "MajorPipeSearchs")
                        serviceName = "VPipeMajorSearchs";

                    icerik += '<li class="info-list-item" onclick="ShowInfoDetail(\'' + serviceName + '\',\'' + uniqField + '\',\'' + value + '\',\'' + _title + '\',\'' + value + '\')"><i class="ti-hand-point-right"></i> ' + _title + ' (' + displayText + ')</li></br>';
                }
            }
            if (icerik.trim().length > 0) {
                document.getElementById('infoLayerList').innerHTML = icerik;
                if ($('.showInfoLayers').css('display') != 'block') {
                    ShowInfoLayers();
                }
            } else {
                ShowInfo('No data found in clicked point');
                document.getElementById('infoLayerList').innerHTML = '';
            }
            HideLoading();

            $("input[name='chInfoLayers']").change(function () {
                ShowOnMapWkt($(this).data("geometry-wkt"));
            })
        }
    };
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);
    //HideLoading();
}

function ConvertPostFeatureNetworkTrace(src) {
    ShowLoading();
    var xhr = new XMLHttpRequest();
    var url = src.substr(0, src.indexOf('?'));
    var params = src.substring(src.indexOf('?') + 1);
    xhr.open('POST', url, true);

    xhr.responseType = 'json';
    xhr.onload = function (e) {
        if (this.status === 200) {
            var _arr = this.response.features;

            networkTraceModel = [];

            for (var i = 0; i < _arr.length; i++) {
                var layerName;
                if (_arr != undefined && _arr[i].properties["layer_name"] != undefined) {
                    layerName = _arr[i].properties["layer_name"].toLowerCase();

                    var uniqColumn = _arr[i].properties["uniq_column_name"];
                    var value = _arr[i].properties[uniqColumn];

                    switch (layerName) {
                        case "gis_net_geo_local_dp":
                        case "gis_net_geo_principal_dp":
                        case "gis_net_geo_pcable":
                        case "gis_net_geo_lcable":
                        case "gis_net_geo_fiber":
                            networkTraceModel.push({ layerName: layerName, uniqueColumn: uniqColumn, uniqueColumnValue: value, traceType: 1 });
                            break;

                    }
                }
            }

            if (networkTraceModel != undefined && networkTraceModel.length > 0) {
                OpenNetworkTraceForm(networkTraceModel);
                window.isNetworkTrace = false;
            }
            else {
                ShowError("No data found in clicked point");
            }

            HideLoading();

            $("input[name='chInfoLayers']").change(function () {
                ShowOnMapWkt($(this).data("geometry-wkt"));
            })
        }
    };
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);
    //HideLoading();
}

function ClearExternalLayers() {
    for (var i = 0; i < globalArrExternalLayers.length; i++) {
        if (GetLayer(globalArrExternalLayers[i])) {
            map.removeLayer(GetLayer(globalArrExternalLayers[i]));
        }
    }
    globalArrExternalLayers = [];
}
function ClearMap() {
    clearMap();
    if ($('.showInfoLayers').css('display') == 'block') {
        ShowInfoLayers();
    }
    if ($('.thematicLegend').css('display') == 'block') {
        ShowThematicLegend();
    }
    ClearExternalLayers();
    document.getElementById('infoLayerList').innerHTML = '';
    selectionLayer.getSource().clear();
    antenThematicLayer.getSource().clear();
    $('li').find('[data-call-function-name="ActivateInfo"]').parent().removeClass("active");

    for (var i = 0; i < window.PopupWindows.length; i++) {
        DisposePopup(window.PopupWindows[i].id);
    }
    try {
        wktforzoom.getSource().clear();
        var say = map.getOverlays().getArray().length;
        for (var i = say - 1; i >= 0; i--) {
            map.removeOverlay(map.getOverlays().getArray()[i]);
        }
    } catch (e) {

    }
    ShowInfo('Map cleared.');

}
function HierarchicalSearchForm() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": appUrl + "Partial/CallPartial",
        "method": "GET",
        "data": { partialPageName: 'HierarchicalSearch' },
        "headers": {}
    }
    ShowLoading();
    $.ajax(settings).done(function (response) {
        HideLoading();
        if (response != null) {
            var infoId = 'info_HierarchicalSearchForm';
            $("body").append('<div id="' + infoId + '"><div name="popupinfoscroll">' + response + '</div></div>');

            DisposePopup(infoId);

            var popupOptionsHierarchical = {
                width: ($(window).width() * 0.25),
                height: "auto",
                id: infoId,
                showTitle: true,
                title: "Hierarchical Fiber Search",
                dragEnabled: true,
                closeOnOutsideClick: false,
                shading: false,
                resizeEnabled: true,
                columnAutoWidth: false,
                onShown: function () {
                    var abc = $('div[name="popupinfoscroll"]');
                    for (var i = 0; i < abc.length; i++) {

                        $(abc).dxScrollView({
                            height: '100%',
                            width: '100%'

                        })
                    }
                },
                onHidden: function () {
                    DisposePopup(this._options.id);
                    selectionLayer.getSource().clear();
                }
            };
            var popup = $("#" + infoId).dxPopup(popupOptionsHierarchical).dxPopup("instance");

            popup.show();

            window.PopupWindows.push({
                id: infoId,
                instance: popup
            });
        }

    });

}
function HierarchicalCopperSearchForm() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": appUrl + "Partial/CallPartial",
        "method": "GET",
        "data": { partialPageName: 'HierarchicalCopperSearch' },
        "headers": {}
    }
    ShowLoading();
    $.ajax(settings).done(function (response) {
        HideLoading();
        if (response != null) {
            var infoId = 'info_HierarchicalCopperSearchForm';
            $("body").append('<div id="' + infoId + '"><div name="popupinfoscroll">' + response + '</div></div>');

            DisposePopup(infoId);

            var popupOptionsHierarchical = {
                width: ($(window).width() * 0.25),
                height: "auto",
                id: infoId,
                showTitle: true,
                title: "Hierarchical Copper Search",
                dragEnabled: true,
                closeOnOutsideClick: false,
                shading: false,
                resizeEnabled: true,
                columnAutoWidth: false,
                position: {
                    my: 'center',
                    at: 'center',
                    of: '#map',
                    offset: "0 250"
                },
                onShown: function () {
                    var abc = $('div[name="popupinfoscroll"]');
                    for (var i = 0; i < abc.length; i++) {

                        $(abc).dxScrollView({
                            scrollByContent: true,
                            scrollByThumb: true,
                            showScrollbar: "onScroll",
                            height: '100%',
                            width: '100%'

                        })
                    }
                },
                onHidden: function () {
                    DisposePopup(this._options.id);
                    selectionLayer.getSource().clear();
                }
            };
            var popup = $("#" + infoId).dxPopup(popupOptionsHierarchical).dxPopup("instance");

            popup.show();

            window.PopupWindows.push({
                id: infoId,
                instance: popup
            });
        }

    });

}
function HierarchicalAddressSearchForm() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": appUrl + "Partial/CallPartial",
        "method": "GET",
        "data": { partialPageName: 'HierarchicalAddressSearch' },
        "headers": {}
    }
    ShowLoading();
    $.ajax(settings).done(function (response) {
        HideLoading();
        if (response != null) {
            var infoId = 'info_HierarchicalAddressSearchForm';
            $("body").append('<div id="' + infoId + '"><div name="popupinfoscroll">' + response + '</div></div>');

            DisposePopup(infoId);

            var popupOptionsHierarchical = {
                width: ($(window).width() * 0.25),
                height: "auto",
                id: infoId,
                showTitle: true,
                title: "Hierarchical Address Search",
                dragEnabled: true,
                closeOnOutsideClick: false,
                shading: false,
                resizeEnabled: true,
                columnAutoWidth: false,
                onShown: function () {
                    var abc = $('div[name="popupinfoscroll"]');
                    for (var i = 0; i < abc.length; i++) {

                        $(abc).dxScrollView({
                            height: '100%',
                            width: '100%'

                        })
                    }
                },
                onHidden: function () {
                    DisposePopup(this._options.id);
                    selectionLayer.getSource().clear();
                }
            };
            var popup = $("#" + infoId).dxPopup(popupOptionsHierarchical).dxPopup("instance");

            popup.show();

            window.PopupWindows.push({
                id: infoId,
                instance: popup
            });
        }

    });

}

function EditProfileInfo() {

    var popupOptions = {
        width: ($(window).width() * 0.3),
        height: 325,
        id: "dvChangeProfileInfo",
        showTitle: true,
        title: "Change User Info",
        dragEnabled: false,
        closeOnOutsideClick: false,
        shading: true,
        resizeEnabled: true,
        columnAutoWidth: false,
        onShown: function () {
            $('#dvChangeProfileInfo').css('display', '');

            try { $('#txtPrfUsername').dxTextBox('dispose'); } catch (e) { }
            try { $('#txtPrfName').dxTextBox('dispose'); } catch (e) { }
            try { $('#txtPrfSurname').dxTextBox('dispose'); } catch (e) { }
            try { $('#txtPrfEMail').dxTextBox('dispose'); } catch (e) { }

            $('#txtPrfUsername').dxTextBox({
                elementAttr: {
                    class: "form-control"
                },
                disabled: true,
                value: UserHelper.GetUser().Username
            });

            $('#txtPrfName').dxTextBox({
                elementAttr: {
                    class: "form-control"
                },
                value: UserHelper.GetUser().Name
            }).dxValidator({
                validationRules: [{
                    type: "required",
                    message: "Name is required"
                }, {
                    type: "stringLength",
                    min: 2,
                    message: "The name must be at least 2 characters"
                }]
            });

            $('#txtPrfSurname').dxTextBox({
                elementAttr: {
                    class: "form-control"
                },
                value: UserHelper.GetUser().Surname
            }).dxValidator({
                validationRules: [{
                    type: "required",
                    message: "Last name is required"
                }, {
                    type: "stringLength",
                    min: 2,
                    message: "Last name must be at least 2 characters"
                }]
            });

            $('#txtPrfEMail').dxTextBox({
                elementAttr: {
                    class: "form-control"
                },
                value: UserHelper.GetUser().MailAddress
            }).dxValidator({
                validationRules: [{
                    type: "required",
                    message: "Email information is required"
                }, {
                    type: "email",
                    message: "Email is not valid"
                },]
            });

            $("#btnPrfSave").dxButton({
                text: "Kaydet",
                onClick: validateAndSubmit,
                elementAttr: {
                    class: "btn btn-success btn-out-dotted form-control"
                },
            });

            var forceValidationBypassforProfileUpd = true;
            function validateAndSubmit(params) {
                forceValidationBypassforProfileUpd = false;
                var result = params.validationGroup.validate();
                if (result.isValid) {

                    var sendData = {
                        name: $('#txtPrfName').dxTextBox('instance').option('value'),
                        surname: $('#txtPrfSurname').dxTextBox('instance').option('value'),
                        mail: $('#txtPrfEMail').dxTextBox('instance').option('value')
                    };

                    $.ajax({
                        type: "POST",
                        url: webApiUrl + "/api/User/UpdateUserInfo",
                        headers: UserHelper.GetUserAjaxRequestOptions().headers,
                        data: JSON.stringify(sendData),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (data) {
                            HideLoading();
                            if (data.isSuccess) {
                                ShowInfo('User Infos saved successfully');

                                var _user = UserHelper.GetUser();
                                _user.Name = $('#txtPrfName').dxTextBox('instance').option('value');
                                _user.Surname = $('#txtPrfSurname').dxTextBox('instance').option('value');
                                _user.MailAddress = $('#txtPrfEMail').dxTextBox('instance').option('value');

                                $('#userDisplayName').text(_user.Name + " " + _user.Surname);
                                $('#spnUserDisplayName').text(_user.Name + " " + _user.Surname);
                                $('#userMailAddress').text('[' + _user.MailAddress + ']');

                                sessionStorage.setItem('SessionUser', JSON.stringify(_user));

                                $("#dvChangeProfileInfo").dxPopup("hide");
                            } else {
                                ShowError(data.message);
                            }
                        },
                        error: function (errMsg) {
                            HideLoading();
                            ShowError(errMsg.message);
                        }
                    });
                }
                forceValidationBypassforProfileUpd = true;
            }
        },
        onHidden: function () {
            //$('#dvChangeProfileInfo').css('display', 'none');
            DisposePopup(this._options.id);
        }
    };

    var popup = $("#dvChangeProfileInfo").dxPopup(popupOptions).dxPopup("instance");

    popup.show();
}

function EditProfileImage() {
    var popupOptions = {
        width: ($(window).width() * 0.5),
        height: 400,
        id: "dvProfileImageChanges",
        showTitle: true,
        title: "Change Picture",
        dragEnabled: false,
        closeOnOutsideClick: false,
        shading: true,
        resizeEnabled: true,
        columnAutoWidth: false,
        onShown: function () {
            $('#dvProfileImageChange').css('display', '');
            $('#imgProfilePicEdit').attr('src', $('#userProfileImage').attr('src'));
            var image = document.getElementById('imgProfilePicEdit');
            cropper = new Cropper(image, {
                aspectRatio: 1 / 1,
                crop(event) {
                },
            });
            setTimeout(function () {
                $('.cropper-container.cropper-bg').width($('.cropper-container.cropper-bg').width() - 33);
            }, 200);

        },
        onHidden: function () {
            //$('#dvProfileImageChange').css('display', 'none');
            DisposePopup(this._options.id);
            location.href = appUrl;
        }
    };

    var popup = $("#dvProfileImageChange").dxPopup(popupOptions).dxPopup("instance");

    popup.show();
}
function reportingDashboard() {
    location.href = appUrl + "Reporting";
}
function reportingFiber() {
    location.href = appUrl + "Reporting/FiberReports";
}
function SubscriberManagementFiber() {
    location.href = appUrl + "SubscriberManagementFiber";
}
function SubscriberManagement() {
    location.href = appUrl + "SubscriberManagement";
}
function ChangePassword() {
    var popupOptions = {
        width: ($(window).width() * 0.3),
        height: 200,
        id: "frmChangePassword",
        showTitle: true,
        title: "Change Password",
        dragEnabled: false,
        closeOnOutsideClick: false,
        shading: true,
        resizeEnabled: true,
        columnAutoWidth: false,
        onShown: function () {
            $('#frmChangePassword').css('display', '');

            $("#password-validation").dxTextBox({
                mode: "password"
            }).dxValidator({
                validationRules: [{
                    type: "required",
                    message: "Password is required"
                },
                {
                    type: "stringLength",
                    min: 5,
                    message: "Password must be min 5 characters"
                }
                ]
            });

            $("#confirm-password-validation").dxTextBox({
                mode: "password"
            }).dxValidator({
                validationRules: [{
                    type: "compare",
                    comparisonTarget: function () {
                        var password = $("#password-validation").dxTextBox("instance");
                        if (password) {
                            return password.option("value");
                        }
                    },
                    message: "'Password' and 'Confirm Password' do not match."
                },
                {
                    type: "required",
                    message: "Confirm Password is required"
                }]
            });
            var forceValidationBypass = true;
            function validateAndSubmit(params) {
                forceValidationBypass = false;
                var result = params.validationGroup.validate();
                if (result.isValid) {
                    $.ajax({
                        type: "POST",
                        url: webApiUrl + "/api/User/ChangePassword/" + $("#password-validation").dxTextBox('instance')._changedValue,
                        headers: UserHelper.GetUserAjaxRequestOptions().headers,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (data) {
                            HideLoading();
                            if (data.isSuccess) {
                                ShowInfo('Password changed successfully');

                                $("#frmChangePassword").dxPopup("hide");
                                $('#frmChangePassword').css('display', 'none');
                            } else {
                                ShowError(data.message);
                            }
                        },
                        error: function (errMsg) {
                            HideLoading();
                        }
                    });
                }
                forceValidationBypass = true;
            }

            $("#btnChangeUserPassword").dxButton({
                text: "Save",
                onClick: validateAndSubmit
            });
        },
        onHidden: function () {
            $('#frmChangePassword').css('display', 'none');
            // DisposePopup(this._options.id);
        }
    };

    var popup = $("#frmChangePassword").dxPopup(popupOptions).dxPopup("instance");

    popup.show();
}
function ThematicForm() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": appUrl + "Partial/CallPartial",
        "method": "GET",
        "data": { partialPageName: 'Thematic' },
        "headers": {}
    }
    ShowLoading();
    $.ajax(settings).done(function (response) {
        HideLoading();
        if (response != null) {
            var infoId = 'info_ThematicForm';
            $("body").append('<div id="' + infoId + '"><div name="popupinfoscroll">' + response + '</div></div>');

            DisposePopup(infoId);

            var popupOptionsHierarchical = {
                width: ($(window).width() * 0.25),
                height: "auto",
                id: infoId,
                showTitle: true,
                title: "Thematic Analysis",
                dragEnabled: true,
                closeOnOutsideClick: false,
                shading: false,
                resizeEnabled: true,
                columnAutoWidth: false,
                onShown: function () {
                    var abc = $('div[name="popupinfoscroll"]');
                    for (var i = 0; i < abc.length; i++) {

                        $(abc).dxScrollView({
                            height: '100%',
                            width: '100%'

                        })
                    }
                },
                onHidden: function () {
                    DisposePopup(this._options.id);
                    selectionLayer.getSource().clear();
                }
            };
            var popup = $("#" + infoId).dxPopup(popupOptionsHierarchical).dxPopup("instance");

            popup.show();

            window.PopupWindows.push({
                id: infoId,
                instance: popup
            });
        }

    });

}
function SubscriberSearchForm() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": appUrl + "Partial/CallPartial",
        "method": "GET",
        "data": { partialPageName: 'SubscriberSearch' },
        "headers": {}
    }
    ShowLoading();
    $.ajax(settings).done(function (response) {
        HideLoading();
        if (response != null) {
            var infoId = 'info_SubscriberSearchForm';
            $("body").append('<div id="' + infoId + '"><div name="popupinfoscroll">' + response + '</div></div>');

            DisposePopup(infoId);

            var popupOptionsHierarchical = {
                width: ($(window).width() * 0.5),
                height: "auto",
                id: infoId,
                showTitle: true,
                title: "Subscriber Searching",
                dragEnabled: true,
                closeOnOutsideClick: false,
                shading: false,
                resizeEnabled: true,
                columnAutoWidth: false,
                onShown: function () {
                    var abc = $('div[name="popupinfoscroll"]');
                    for (var i = 0; i < abc.length; i++) {

                        $(abc).dxScrollView({
                            height: '100%',
                            width: '100%'

                        })
                    }
                },
                onHidden: function () {
                    DisposePopup(this._options.id);
                    selectionLayer.getSource().clear();
                }
            };
            var popup = $("#" + infoId).dxPopup(popupOptionsHierarchical).dxPopup("instance");

            popup.show();

            window.PopupWindows.push({
                id: infoId,
                instance: popup
            });
        }

    });

}
function CreateWMSLayer(title, layerName, clearOlds, cqlFilter) {
    var _group = UserHelper.GetUserLayers()[0];
    if (_group.Layers.length > 0) {
        var globalParams = {
            'LAYERS': layerName,
            'FORMAT': 'image/png8',
            'TILED': true
        };
        if (cqlFilter) {
            globalParams = {
                'LAYERS': layerName,
                'FORMAT': 'image/png8',
                'CQL_FILTER': cqlFilter,
                'TILED': true
            };
        }
        var _url = _group.Layers[0].Url;
        var layer = new ol.layer.Tile({
            title: title,
            source: new ol.source.TileWMS(({
                crossOrigin: 'Anonymous',
                url: _url,
                params: globalParams,
                projection: 'EPSG:3857'
            }))
        });
    }
    if (clearOlds)
        ClearExternalLayers();
    globalArrExternalLayers.push(title);
    map.addLayer(layer);

    wktforzoom.setZIndex(layer.getZIndex() + 2);
}
function CreateThematic(thematicLayerName, cqlFilter) {
    ShowLoading();
    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/Thematic/GetLegend?tableName=" + thematicLayerName.toLowerCase(),
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            HideLoading();
            var preparedHTML = '<div class="col-md-12 col-lg-12 d-flex justify-content-center">'
                + '<div class="label-main">'
                + '<label class="label label-lg label-inverse">' + data[0].extraValue + '</label>'
                + '</div>'
                + '</div>';
            $.each(data, function (a, b) {
                preparedHTML += '<div class="col-md-12 col-lg-12 d-flex">'
                    + '<div class="label-main" style="width:100%">'
                    + '<label class="label label-lg label-inverse" style="width:100%;background:' + b.value + ';">' + b.text + '</label>'
                    + '</div>'
                    + '</div>';
            });
            $('#thematicLegendList').empty();
            $('#thematicLegendList').append(preparedHTML);
            if ($('.thematicLegend').css('display') != 'block') {
                ShowThematicLegend();
            }
            CreateWMSLayer(thematicLayerName, thematicLayerName, true, cqlFilter);
        },
        error: function (errMsg) {
            HideLoading();
        }
    });
}
function CreateGoToCoordinatePanel() {
    ShowLoading();
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": appUrl + "Partial/CallPartial",
        "method": "GET",
        "data": { partialPageName: 'GoCoordinate' },
        "headers": {}
    }
    $.ajax(settings).done(function (response) {
        if (response != null) {
            var infoId = 'info_GoCoordinate';
            $("body").append('<div id="' + infoId + '"><div name="popupinfoscroll">' + response + '</div></div>');

            DisposePopup(infoId);

            var popupOptionsHierarchical = {
                width: ($(window).width() * 0.2),
                height: "auto",
                id: infoId,
                showTitle: true,
                title: "Go to Coordinates",
                dragEnabled: true,
                closeOnOutsideClick: false,
                shading: false,
                resizeEnabled: true,
                columnAutoWidth: false,
                onShown: function () {
                    var abc = $('div[name="popupinfoscroll"]');
                    for (var i = 0; i < abc.length; i++) {

                        $(abc).dxScrollView({
                            height: '100%',
                            width: '100%'

                        })
                    }
                },
                onHidden: function () {
                    DisposePopup(this._options.id);
                    selectionLayer.getSource().clear();
                }
            };
            var popup = $("#" + infoId).dxPopup(popupOptionsHierarchical).dxPopup("instance");

            popup.show();

            window.PopupWindows.push({
                id: infoId,
                instance: popup
            });
        }
        HideLoading();
    });
}
function CreateCitySubscriberReport() {
    var menuId = 1459;
    var menuName = 'Subscriber Count According to Cities';
    var queryServiceName = 'ThemCitySubscribers';
    var queryTableName = 'gis_adr_geo_city';
    var queryUniqColumnName = 'city_id';
    var queryUniqFieldName = 'CityId';

    var queryOptions = {
        MenuId: menuId,
        MenuName: menuName,
        ServiceName: queryServiceName,
        TableName: queryTableName,
        UniqColumnName: queryUniqColumnName,
        UniqFieldName: queryUniqFieldName,
        IsParentElem: false,
        Id: ""
    };
    WriteQueryLog(menuName);
    ShowQueryWindow(queryOptions);
    CreateThematic('THEM_TMP_CITY_SUBSCRIBER');
}
function CreateReservedDaysReport() {
    var menuId = 1453;
    var menuName = 'Reserved Days Report';
    var queryServiceName = 'VThemReservedWithDays';
    var queryTableName = 'gis_adr_geo_door';
    var queryUniqColumnName = 'door_id';
    var queryUniqFieldName = 'DoorId';

    var queryOptions = {
        MenuId: menuId,
        MenuName: menuName,
        ServiceName: queryServiceName,
        TableName: queryTableName,
        UniqColumnName: queryUniqColumnName,
        UniqFieldName: queryUniqFieldName,
        IsParentElem: false,
        Id: ""
    };
    WriteQueryLog(menuName);
    ShowQueryWindow(queryOptions);
    CreateWMSLayer('them_tmp_reserved_days', 'THEM_TMP_RESERVED_DAYS', true);
}
function CreateBuildingDistanceReport() {
    var menuId = 1454;
    var menuName = 'Building Distance Report';
    var queryServiceName = 'VThemBuildingDistances';
    var queryTableName = 'gis_adr_geo_building';
    var queryUniqColumnName = 'building_id';
    var queryUniqFieldName = 'BuildingId';

    var queryOptions = {
        MenuId: menuId,
        MenuName: menuName,
        ServiceName: queryServiceName,
        TableName: queryTableName,
        UniqColumnName: queryUniqColumnName,
        UniqFieldName: queryUniqFieldName,
        IsParentElem: false,
        Id: ""
    };
    WriteQueryLog(menuName);
    ShowQueryWindow(queryOptions);
    CreateThematic('THEM_TMP_BUILDING_DP_SP_DISTANCE');
}
function CreateSubscriberHasNotReport() {
    var menuId = 1455;
    var menuName = 'Subscriber Report';
    var queryServiceName = 'VThemHasNotSubscribers';
    var queryTableName = 'gis_adr_geo_building';
    var queryUniqColumnName = 'building_id';
    var queryUniqFieldName = 'BuildingId';

    var queryOptions = {
        MenuId: menuId,
        MenuName: menuName,
        ServiceName: queryServiceName,
        TableName: queryTableName,
        UniqColumnName: queryUniqColumnName,
        UniqFieldName: queryUniqFieldName,
        IsParentElem: false,
        Id: ""
    };
    WriteQueryLog(menuName);
    ShowQueryWindow(queryOptions);
    CreateThematic('THEM_TMP_HAS_NOT_SUBSCRIBER');
}
function CreateSubscriberDpPerscReport() {
    var menuId = 1457;
    var menuName = 'DP Free / In Use Port Percentage';
    var queryServiceName = 'ThemSubscriberDpPercs';
    var queryTableName = 'gis_adr_geo_building';
    var queryUniqColumnName = 'building_id';
    var queryUniqFieldName = 'BuildingId';

    var queryOptions = {
        MenuId: menuId,
        MenuName: menuName,
        ServiceName: queryServiceName,
        TableName: queryTableName,
        UniqColumnName: queryUniqColumnName,
        UniqFieldName: queryUniqFieldName,
        IsParentElem: false,
        Id: ""
    };
    WriteQueryLog(menuName);
    ShowQueryWindow(queryOptions);
    CreateThematic('THEM_TMP_SUBSCRIBER_DP_PERC');
}
function CreateSubscriberSpPerscReport() {
    var menuId = 1458;
    var menuName = 'Splitter Free / In Use Port Percentage';
    var queryServiceName = 'ThemSubscriberSpPercs';
    var queryTableName = 'gis_adr_geo_building';
    var queryUniqColumnName = 'building_id';
    var queryUniqFieldName = 'BuildingId';

    var queryOptions = {
        MenuId: menuId,
        MenuName: menuName,
        ServiceName: queryServiceName,
        TableName: queryTableName,
        UniqColumnName: queryUniqColumnName,
        UniqFieldName: queryUniqFieldName,
        IsParentElem: false,
        Id: ""
    };
    WriteQueryLog(menuName);
    ShowQueryWindow(queryOptions);
    CreateThematic('THEM_TMP_SUBSCRIBER_SP_PERC');
}
function CreateAntenRangeReport() {
    ShowLoading();
    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/Thematic/GetAntenRange",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            HideLoading();
            if (data.length < 1)
                return;
            var format = new ol.format.WKT();
            var _features = [];
            $.each(data, function (a, b) {
                var feat = format.readFeature(b.wkt);
                var randColor = getRandomColor();
                var randHex = hexToRgbA(randColor);
                feat.setStyle(styleCreateFunction(randHex, randColor, b.range.toString()));
                _features.push(feat);
            });
            antenThematicLayer.setSource(new ol.source.Vector({ features: _features }));
            map.getView().fit(antenThematicLayer.getSource().getExtent(), map.getSize());

            var menuId = 1456;
            var menuName = 'Site Range Report';
            var queryServiceName = 'VThemAntenRanges';
            var queryTableName = 'gis_net_geo_anten';
            var queryUniqColumnName = 'anten_id';
            var queryUniqFieldName = 'AntenId';

            var queryOptions = {
                MenuId: menuId,
                MenuName: menuName,
                ServiceName: queryServiceName,
                TableName: queryTableName,
                UniqColumnName: queryUniqColumnName,
                UniqFieldName: queryUniqFieldName,
                IsParentElem: false,
                Id: ""
            };
            WriteQueryLog(menuName);
            ShowQueryWindow(queryOptions);
        },
        error: function (errMsg) {
            HideLoading();
        }
    });
}
function styleCreateFunction(fillColor, strokeColor, text) {
    return [
        new ol.style.Style({
            fill: new ol.style.Fill({
                color: fillColor
            }),
            stroke: new ol.style.Stroke({
                color: strokeColor,
                width: 5
            }),
            text: new ol.style.Text({
                font: 'Bold 10px Verdana',
                fill: new ol.style.Fill({ color: strokeColor }),
                stroke: new ol.style.Stroke({
                    color: '#ffffff', width: 3
                }),
                overflow: true,
                text: text
            })
        })
    ];
}
function hexToRgbA(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        var res = [];
        res.push((c >> 16) & 255);
        res.push((c >> 8) & 255);
        res.push(c & 255);
        res.push(0.3);
        return res;
    }
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function createMeasureTooltip() {
    $(".tooltip-message-measure").remove();

    if (measureTooltipElement) {
        if (measureTooltipElement.parentNode != null)
            measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.setAttribute('id', 'drawMeasure');
    measureTooltipElement.className = 'tooltip-measure tooltip-message-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);
}
function createHelpTooltip() {
    if (helpTooltipElement) {
        if (helpTooltipElement.parentNode != null)
            helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.setAttribute('id', 'drawComment');
    helpTooltipElement.className = 'tooltip-measure';
    helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    map.addOverlay(helpTooltip);
}

var ChangeGeometryType = {
    changeType: function (isModify) {
        if (isModify) {
            Draw.setActive(false);
            Modify.setActive(true);
        } else {
            Draw.getActive() && Draw.setActive(true);
        }
    }
};

var resetView = function () {
    map.getView().setCenter(mapCenter);
    map.getView().setZoom(mapZoom);
    ShowInfo("Map brought to first view");
}
var cancelDraw = function () {
    Draw.setActive(false);
    DrawType = undefined;
    map.removeEventListener("pointermove", mouseMoveHandler);
    $("#drawComment").remove();
    $(".tooltip-message-measure").remove();
    $('#displayName').html('Çizim Araçları <span class="caret"></span>');
    $('#displayName').data('partial', '');
    // WFSLayerNames = '';
}

var getSnapMeasure = function (measureType) {
    cancelDraw();
    measureTooltipElement.className = 'tooltip-measure tooltip-measure-static';
    measureTooltip.setOffset([0, -7]);
    sketch = null;
    measureTooltipElement = null;
    //WFSLayerNames = '', WFSServiceName = '', WFSServiceType = '';
    (measureType === 'distance') ? getDistance() : getArea();
}
var getDistance = function () {
    DrawType = 'Distance';
    ChangeGeometryType.changeType(false);
    map.addEventListener("pointermove", mouseMoveHandler);
};
var getArea = function () {
    DrawType = 'Area';
    ChangeGeometryType.changeType(false);
    map.addEventListener("pointermove", mouseMoveHandler);
};
var mouseMoveHandler = function (evt) {
    if (evt == undefined)
        return;

    if (evt.dragging)
        return;

    if ($('.tooltip-message-measure').length <= 0) {
        createHelpTooltip();
        createMeasureTooltip();
    }

    var helpMsg = "Çizime Başla";
    var tooltipCoord = evt.coordinate;

    if (sketch) {
        var output;
        var geom = (sketch.getGeometry());
        if (geom instanceof ol.geom.Polygon) {
            output = formatArea(/** @type {ol.geom.Polygon} */(geom));
            helpMsg = continueMsg;
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof ol.geom.LineString) {
            output = formatLength( /** @type {ol.geom.LineString} */(geom));
            helpMsg = continueMsg;
            tooltipCoord = geom.getLastCoordinate();
        } else if (geom instanceof ol.geom.Circle) {
            output = formatLength( /** @type {ol.geom.Circle} */(geom));
            helpMsg = continueMsg;
            tooltipCoord = geom.getLastCoordinate();
        }
        measureTooltipElement.innerHTML = output;
        measureTooltip.setPosition(tooltipCoord);
    }
    helpTooltipElement.innerHTML = helpMsg;
    helpTooltip.setPosition(evt.coordinate);
};
/*Çizim, Ölçüm ve Temizleme Fonksiyonları*/
var formatLength = function (line) {
    var sphereDistance = new ol.Sphere(6378137);
    var sphericalLength = 0;
    var cartesianLength = 0;
    var sphericalOutput;

    if (line.getType() == 'Circle') {
        var units = map.getView().getProjection().getUnits();
        var radius = line.getRadius() * ol.proj.METERS_PER_UNIT[units];

        var startPoint = ol.proj.transform(line.getFirstCoordinate(), 'EPSG:3857', 'EPSG:4326');
        var lastPoint = ol.proj.transform(line.getLastCoordinate(), 'EPSG:3857', 'EPSG:4326');

        sphericalLength = sphereDistance.haversineDistance(startPoint, lastPoint);

        if (sphericalLength > 1000) {
            sphericalOutput = (Math.round(sphericalLength / 1000 * 100) / 100) +
                ' ' + 'km';
        } else {
            sphericalOutput = (Math.round(sphericalLength * 100) / 100) +
                ' ' + 'm';
        }
    } else {
        var coordinates = line.getCoordinates();
        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
            var c1 = ol.proj.transform(coordinates[i], 'EPSG:3857', 'EPSG:4326');
            var c2 = ol.proj.transform(coordinates[i + 1], 'EPSG:3857', 'EPSG:4326');
            sphericalLength += sphereDistance.haversineDistance(c1, c2);
        }

        var cartesianLength = Math.round(line.getLength() * 100) / 100;
        var cartesianOutput;
        if (cartesianLength > 1000) {
            cartesianOutput = (Math.round(cartesianLength / 1000 * 100) / 100) +
                ' ' + 'km';
        } else {
            cartesianOutput = (Math.round(cartesianLength * 100) / 100) +
                ' ' + 'm';
        }

        if (sphericalLength > 1000) {
            sphericalOutput = (Math.round(sphericalLength / 1000 * 100) / 100) +
                ' ' + 'km';
        } else {
            sphericalOutput = (Math.round(sphericalLength * 100) / 100) +
                ' ' + 'm';
        }
    }

    return sphericalOutput;
};
var formatArea = function (polygon) {
    var sphereArea = new ol.Sphere(6378137);
    var sphericalArea = 0;
    var copyPolygon = polygon.clone();
    var polygonCoordinates = copyPolygon.transform('EPSG:3857', 'EPSG:4326').getLinearRing(0).getCoordinates();

    sphericalArea = Math.abs(sphereArea.geodesicArea(polygonCoordinates));
    var cartesianArea = polygon.getArea();
    var cartesianOutput, sphericalOutput;

    if (cartesianArea > 1000000) {
        cartesianOutput = (Math.round(cartesianArea / 1000000 * 100) / 100) +
            ' ' + 'km2';
    } else {
        cartesianOutput = (Math.round(cartesianArea * 100) / 100) +
            ' ' + 'm2';
    }

    if (sphericalArea > 1000000) {
        sphericalOutput = (Math.round(sphericalArea / 1000000 * 100) / 100) +
            ' ' + 'km2';
    } else {
        sphericalOutput = (Math.round(sphericalArea * 100) / 100) +
            ' ' + 'm2';
    }

    return sphericalOutput;
};
//Haritayı Temizle
var clearMap = function () {
    cancelDraw();
    $(".tooltip-measure-static").remove();
    $(".tooltip-message-measure").remove();

    vectorMeasureLayer.getSource().clear();
}

var infoact = false;
var panact = false;
var clearmapact = false;
var mapfirstviewact = false;

$(window).keydown(function (e) {
    if (e.which == 17)
        infoact = true;
    if (e.which == 81 && infoact) { //Q
        infoact = false;
        ActivateInfo();
    }
    if (e.which == 66 && infoact) {//B
        infoact = false;
        PanControl();
    }
    if (e.which == 73 && infoact) {//I
        infoact = false;
        ClearMap();
    }
    if (e.which == 77 && infoact) {//M
        infoact = false;
        resetView();
    }
});
function f() {
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

//File uploader da dosya ile birlikte parametrelerin gönderilmesi için kullanılır.
function updateQueryStringParameter(uri, array) {
    for (key in array) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            uri += uri.replace(re, '$1' + key + "=" + array[key] + '$2');
        } else {
            uri += separator + key + "=" + array[key];
        }
    }
    return uri;
}


function AddPopupMinimizeButton(_options) {
    $.extend(true, _options, {
        toolbarItems: [
            {
                widget: "dxButton",
                location: "after",
                options: {
                    text: "-",
                    elementAttr: {
                        class: "btn-popup-button"
                    },
                    _templateId: _options._templateId,
                    onClick: function (e) {
                        var titleHeight = $(e.component.element()).outerHeight() + 5;



                        if ($("#" + e.component.option('_templateId')).dxPopup("instance").option('height') > titleHeight) {
                            $("#" + e.component.option('_templateId')).dxPopup("instance").option('height', titleHeight);
                            $("#" + e.component.option('_templateId')).dxPopup("instance").option('resizeEnabled', false);
                            e.component.option('text', '+');
                        } else {
                            $("#" + e.component.option('_templateId')).dxPopup("instance").option('height', $("#" + e.component.option('_templateId')).dxPopup("instance").option('_defaultHeight'));
                            $("#" + e.component.option('_templateId')).dxPopup("instance").option('resizeEnabled', true);
                            e.component.option('text', '-');
                        }
                    }
                }
            }]
    });
}



function OpenNetworkTraceForm(model) {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": appUrl + "Partial/CallPartial",
        "method": "GET",
        "data": { partialPageName: 'NetworkTrace' },
        "headers": {}
    }
    ShowLoading();
    $.ajax(settings).done(function (response) {
        HideLoading();
        if (response != null) {
            var infoId = 'info_NetworkTraceForm';
            $("body").append('<div id="' + infoId + '"><div name="popupinfoscroll">' + response + '</div></div>');

            DisposePopup(infoId);

            var popupOptionsNetworkTrace = {
                width: ($(window).width() * 0.25),
                height: "auto",
                id: infoId,
                showTitle: true,
                title: "Network Trace",
                dragEnabled: true,
                closeOnOutsideClick: false,
                shading: false,
                resizeEnabled: true,
                columnAutoWidth: false,
                onShown: function () {
                    var abc = $('div[name="popupinfoscroll"]');
                    for (var i = 0; i < abc.length; i++) {

                        $(abc).dxScrollView({
                            height: '100%',
                            width: '100%'

                        })
                    }
                },
                onHidden: function () {
                    DisposePopup(this._options.id);
                    selectionLayer.getSource().clear();
                }
            };
            var popup = $("#" + infoId).dxPopup(popupOptionsNetworkTrace).dxPopup("instance");

            popup.show();

            SetDropDownEmpty("#thematicLayers");
            FillItems(model);
            //$("#thematicLayers").append(new Option(layerName + " (" + value + ")", columnName));

            window.PopupWindows.push({
                id: infoId,
                instance: popup
            });
        }
    });
}

function NetworkTrace() {
    ShowInfo("Network trace tool activated");
    window.isNetworkTrace = true;
}

function ShowCableSubscriber(model) {
    var menuId = 1299;
    var menuName = 'Subscribers Connected to Cable';
    var queryServiceName = 'VGisOthSubscriberDps';
    var queryTableName = 'v_gis_oth_subscriber_dp';
    var queryUniqColumnName = 'dp_id';
    var queryUniqFieldName = 'DpId';

    var queryOptions = {
        isFunction: true,
        customODataUrl: 'GetCableSubscribers',
        MenuId: menuId,
        MenuName: menuName,
        ServiceName: queryServiceName,
        TableName: queryTableName,
        UniqColumnName: queryUniqColumnName,
        UniqFieldName: queryUniqFieldName,
        IsParentElem: true,
        helperTableName: "",
        helperUniqCol: "",
        helperUniqColDgr: "",
        helperUniqColSubscrb: "",
        dpp: null,
        Id: model[0].uniqueColumnValue
    };
    WriteQueryLog(menuName);
    ShowQueryWindow(queryOptions);
}

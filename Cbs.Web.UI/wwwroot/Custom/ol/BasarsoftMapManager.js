var map;
var mapView;
var MapManager = function () {
}

$.extend(MapManager.prototype, {
    CreateMap: function (target, overlays, DragAndDropInteraction, mapView) {
        map = new ol.Map({
            target: target,
            interactions: ol.interaction.defaults().extend([DragAndDropInteraction]),
            layers: [],
            controls: ol.control.defaults({
                attribution: false,
                rotate: false,
                zoom: true
            }),
            loadTilesWhileInteracting: false,
            loadTilesWhileAnimating: false,
            view: mapView,
            overlays: overlays
        });
        return map;
    },
    CreateView: function (projection, center, zoom, rotation) {
        mapView = new ol.View({
            projection: projection,
            center: center,
            zoom: zoom,
            rotation: rotation
        });
        return mapView;
    },
    SetMapViewZoom: function (projection, center, zoom, rotation, max, min) {
        map.setView(new ol.View({
            projection: projection,
            center: center,
            zoom: zoom,
            rotation: rotation,
            maxZoom: max,
            minZoom: min,
        }));
    },
    GetView: function () {
        return map.getView();
    },
    ResetView: function (center, zoom) {
        this.SetCenter(center);
        this.SetZoom(zoom);
    },
    GetZoom: function () {
        return this.GetView().getZoom();
    },
    SetZoom: function (zoom) {
        this.GetView().setZoom(zoom);
    },
    SetCenter: function (center) {
        this.GetView().setCenter(center);
    },
    GetCenter: function () {
        return this.GetView().getCenter();
    },
    GetRotation: function () {
        return this.GetView().getRotation();
    },
    GetLayerSource: function (layer) {
        if (layer != null && layer != undefined)
            return layer.getSource();
        else
            return null;
    },
    GetLayerExtent: function (layer) {
        return this.GetLayerSource(layer).getExtent();
    },
    GetMapSize: function (layer) {
        return map.getSize();
    },
    SetLayerZIndex: function (layer, zIndex) {
        layer.setZIndex(zIndex);
    },
    SetLayerSource: function (layer, source) {
        layer.setSource(source);
    },
    RefreshLayer: function (layer) {
        this.GetLayerSource(layer).updateParams({ time_: (new Date()).getTime() });
    },
    RefreshMap: function () {
        var objTemp = this.GetLayer(WMSServiceName).getSource().getParams();
        objTemp.t = new Date().getMilliseconds();
        this.GetLayer(WMSServiceName).getSource().updateParams(objTemp);
    },
    ChangeWMSUrl: function (layerName, openLayers, url, opacity) {
        var layerObj = this.GetLayer(layerName);
        if (opacity == undefined) {
            this.GetLayerSource(layerObj).getUrls()[0] = url + '?url=' + WMSServiceName;
        }
        else {
            for (var i = 0; i < this.GetLayerSource(layerObj).getUrls().length; i++) {
                this.GetLayerSource(layerObj).getUrls()[i] = url + '?url=' + WMSServiceName;
            }
        }
        var params = {
            'LAYERS': openLayers,
            'FORMAT': 'image/png',
            'TILED': true,
        };
        if (opacity !== undefined)
            params.OPA = opacity;
        this.GetLayerSource(layerObj).updateParams(params);
    },
    ChangeLayer: function (layerName, val, opacity) {
        if (opacity === undefined) {
            var layers = val.split(',');
            opacity = '';
            for (var i = 0; i < layers.length; i++) {
                opacity += '100' + ',';
            }
            opacity = opacity.substring(0, opacity.length - 1);
        }
        if (val != "")
            openLayerList = val;

        layerOpacityList = opacity;

        var layerObj = this.GetLayer(layerName);
        this.GetLayerSource(layerObj).getParams().LAYERS = openLayerList;
        this.GetLayerSource(layerObj).getParams().OPA = layerOpacityList;
        var objTemp = this.GetLayerSource(layerObj).getParams();
        this.GetLayerSource(layerObj).updateParams(objTemp);
    },
    AddLayerToMap: function (layer) {
        map.addLayer(layer);
    },
    CreateVectorLayer: function (name, style, source) {
        var src;
        if (source == undefined) {
            src = new ol.source.Vector({});
        }
        else src = source;
        var vectorLayer = new ol.layer.Vector({
            title: name,
            name: name,
            source: src,
            style: style
        });
        return vectorLayer;
    },
    CreateWmsLayer: function (title, url, layers) {
        return new ol.layer.Tile({
            title: title,
            source: new ol.source.TileWMS(({
                crossOrigin: 'Anonymous',
                url: url,
                params: {
                    'TILED': true,
                    'LAYERS': layers,
                },
                format: 'image/png8'
            }))
        });
    },
    CreateStyle: function (fillStyle, strokeStyle, ImageStyle, ZIndex) {
        if (ZIndex == undefined) {
            ZIndex = 1;
        }

        return new ol.style.Style({
            fill: fillStyle,
            stroke: strokeStyle,
            image: ImageStyle,
            zIndex: ZIndex,
        });
    },
    CreateFillStyle: function (color) {
        return new ol.style.Fill({
            color: color
        });
    },
    CreateStrokeStyle: function (color, strokeWidth) {
        return new ol.style.Stroke({
            color: color,
            width: strokeWidth
        });
    },
    CreateImageStyle: function (radius, fillColor, strokeColor, strokeWidth) {
        return new ol.style.Circle({
            radius: radius,
            fill: new ol.style.Fill({
                color: fillColor
            }),
            stroke: new ol.style.Stroke({
                color: strokeColor,
                width: strokeWidth
            })
        });
    },
    AddInteractionToMap: function (interaction) {
        map.addInteraction(interaction);
    },
    RemoveInteractionFromMap: function (interaction) {
        map.removeInteraction(interaction);
    },
    GetProjection: function () {
        return this.GetView().getProjection();
    },
    GetResolution: function () {
        return this.GetView().getResolution();
    },
    SetResolution: function (resolution) {
        return this.GetView().setResolution(resolution);
    },
    GetProjectionUnit: function () {
        return this.GetProjection().getUnits();
    },
    GetCurrentScale: function () {
        var view = this.GetView();
        var resolution = this.GetResolution();
        var units = this.GetProjectionUnit();
        var dpi = 25.4 / 0.28;
        var mpu = ol.proj.METERS_PER_UNIT[units];
        var scale = resolution * mpu * 39.37 * dpi;
        return scale;
    },
    SetScale: function (scale) {
        if (scale.length <= 0) {
            createModal('msgBox', 'msgBoxContainer', '', 'Uyarı!', getLangValue(117), 'Warning');
            return;
        }
        var view = this.GetView();
        var units = this.GetProjectionUnit();
        var dpi = 25.4 / 0.28;
        var mpu = ol.proj.METERS_PER_UNIT[units];
        var resolution = scale / (mpu * 39.37 * dpi);
        this.SetResolution(resolution);
    },
    GetZoomFromResolution: function (resolution) {
        var z = 156543.04 / resolution;
        var zoom = Math.log(z) / Math.log(2);
        return zoom;
    },
    GetResolutionFromZoom: function (zoom) {
        return 156543.04 / Math.pow(2, zoom);
    },
    GetMapLayers: function () {
        return map.getLayers();
    },
    GetZoomFromScale: function (scale) {
        var view = this.GetView();
        var units = this.GetProjectionUnit();
        var dpi = 25.4 / 0.28;
        var mpu = ol.proj.METERS_PER_UNIT[units];
        var resolution = scale / (mpu * 39.37 * dpi);

        return parseInt(this.GetZoomFromResolution(resolution));
    },
    GetLayer: function (title) {
        var layer = null;

        this.GetMapLayers().forEach(function (l) {
            if (l.get('title') == title) {
                layer = l;
            }
        });
        return layer;
    },
    RemoveLayer: function (title) {
        this.GetMapLayers().forEach(function (l) {
            if (l.get('title') == title) {
                return map.removeLayer(l);
            }
        });
    },
    GoHome: function () {
        window.location = "/";
    },
    FitLayerExtent: function (layer) {
        this.GetView().fit(this.GetLayerExtent(layer), this.GetMapSize());
    },
    ClearLayer: function (layer) {
        this.GetLayerSource(layer).clear();
    },
    AddControlToMap: function (control) {
        map.addControl(control);
    },
    GetOl3FeatureFromWkt: function (WKT) {
        var format = new ol.format.WKT();
        var feature = format.readFeature(WKT, {
            dataProjection: 'EPSG:5256',
            featureProjection: 'EPSG:3857'
        });
        return feature;
    },
    DrawFeature: function (layer, zIndex, clearSource, fitExtent, maxZoom, feature) {
        if (clearSource) {
            this.SetLayerSource(layer, null);
        }
        this.SetLayerSource(layer, new ol.source.Vector({ features: feature }));
        if (zIndex != '') {
            this.SetLayerZIndex(layer, zIndex);
        }
        if (fitExtent) {
            this.FitLayerExtent(layer);
        }
        if (maxZoom != '') {
            if (this.GetZoom() > maxZoom) {
                this.SetZoom(maxZoom);
            }
        }
    },
    AddFeature: function (layer, zIndex, clearSource, fitExtent, maxZoom, feature) {
        if (clearSource) {
            this.SetLayerSource(layer, null);
        }
        if (this.GetLayerSource(layer) == null) {
            this.SetLayerSource(layer, new ol.source.Vector({}));
        }
        this.GetLayerSource(layer).addFeature(feature);
        if (zIndex != '') {
            this.SetLayerZIndex(layer, zIndex);
        }
        if (fitExtent) {
            this.FitLayerExtent(layer);
        }
        if (maxZoom != '') {
            if (this.GetZoom() > maxZoom) {
                this.SetZoom(maxZoom);
            }
        }
    },
    CreateWktFormat: function (dataProjection, featureProjection) {
        var WKTFormat = new ol.format.WKT(
            {
                dataProjection: dataProjection,
                featureProjection: featureProjection
            });
        return WKTFormat;
    },
    CreateWfsLayerSource: function (vectorFormat, loader, projection) {
        return new ol.source.Vector({
            format: vectorFormat,
            loader: loader,
            projection: projection
        });
    },
    GetMapViewport: function () {
        return map.getViewport();
    },
    //controlss

    CreateMousePositionControl: function (projection, className, target, undefinedHTML) {
        return new ol.control.MousePosition({
            coordinateFormat: function (coordinate) {
                if (epsgName[activeEpsg][1] != "DMS") {
                    return ol.coordinate.format(coordinate, ' {x} / {y}', 6);
                }
                else {
                    var _dms = GetDmsFormat(ol.coordinate.toStringHDMS(coordinate));
                    return _dms[0] + ' / ' + _dms[1];
                }
            },
            projection: projection,
            className: className,
            target: target,
            undefinedHTML: undefinedHTML
        });
    },

    //Adı Verilen Katmandaki Geometrilerden 1 Tanesinin WKT Stringini Verir
    GetGeometryWKTFromLayer: function (layerTitle, featureName) {
        var result = '';
        var manager = new MapManager();
        var layer = manager.FindLayer(layerTitle);
        try {
            var format = new ol.format.WKT();
            if (featureName.length > 0) {
                $.each(layer.getSource().getFeatures(), function (index, item) {
                    if (item.getProperties().name == featureName) {
                        result = format.writeGeometry(item.getGeometry());
                    }
                });
            } else {
                var geom = new ol.geom.Polygon(layer.getSource().getFeatures()[0].getGeometry().getCoordinates());
                geom = geom.transform('EPSG:3857', 'EPSG:5256');
                //var geom = layer.getSource().getFeatures()[0].getGeometry().getCoordinates().transform('EPSG:3857', 'EPSG:5256');
                result = format.writeGeometry(geom);
            }
        } catch (e) {
            console.log(e.message);
            return undefined;
        }

        return result;
    },

    //İstenilen Katmanı Başlığından Bulur
    FindLayer: function (layerTitle) {
        var layer;
        try {
            map.getLayers().forEach(function (l) {
                if (l.get('title') == layerTitle) {
                    layer = l;
                }
            });

            return layer;
        } catch (e) {
            console.log(e.message);
            return undefined;
        }
    }
});
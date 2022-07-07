var contextmenu_items = null;
var contextMenu = null;
var _ContextFeature = null;
var createContextMenu = function () {
    'use strict';

    contextmenu_items = [
        {
            text: 'Pan',
            classname: 'bold',
            icon: appUrl + '/images/ContextMenu/stop.png',
            callback: PanControl
        },
        {
            text: 'Info',
            classname: 'bold',
            icon: appUrl + '/images/ContextMenu/info64.png',
            callback: InfoForContextMenu
        },
        {
            text: 'Clear Map',
            classname: 'bold',
            icon: appUrl + '/images/ContextMenu/eraser.png',
            callback: ClearMap
        },
        {
            text: 'Go to Map First View',
            classname: 'bold',
            icon: appUrl + '/images/ContextMenu/iris.png',
            callback: resetView
        },
        //{
        //    text: 'Retrieve Map View',
        //    classname: 'bold',
        //    icon: appUrl + '/images/ContextMenu/previous.png',
        //    callback: mapBack
        //},
        //{
        //    text: 'Advance Map View',
        //    classname: 'bold',
        //    icon: appUrl + '/images/ContextMenu/skip.png',
        //    callback: mapForward
        //},
        //{
        //    text: 'Show Coordinates',
        //    classname: 'bold',
        //    icon: appUrl + '/images/ContextMenu/center.png',
        //    //callback: GetCoordinate
        //},
        '-', // this is a separator
        {
            text: 'Measuring Tools',
            icon: appUrl + '/images/ContextMenu/ruler.png',
            items: [
                {
                    text: 'Measure Distance',
                    icon: appUrl + '/images/ContextMenu/line-graphic.png',
                    callback: function () { getSnapMeasure('distance'); }
                },
                {
                    text: 'Measure Area',
                    icon: appUrl + '/images/ContextMenu/polygon.png',
                    callback: function () { getSnapMeasure('area'); }
                }
            ]
        },
    ];
    try {
        contextMenu = new ContextMenu({
            width: 210,
            default_items: false,
            items: contextmenu_items
        });
        contextMenu.element.hidden = true;

        map.addControl(contextMenu);

        contextMenu.on('open', function (evt) {

            contextMenu.element.hidden = false;

            var feature = map.forEachFeatureAtPixel(evt.pixel, function (ft, l) {
                return ft;
            });

            if (feature) {
                // add some other items to the menu
            }
        });

        map.on('pointermove', function (e) {
            if (e.dragging) return;

            var pixel = map.getEventPixel(e.originalEvent);
            var hit = map.hasFeatureAtPixel(pixel);

            //map.getTarget().style.cursor = hit ? 'pointer' : '';
        });
    } catch (e) {

    }
};
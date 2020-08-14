import * as $ from 'jquery';

export default class EditPolygonsMap {
    constructor($block) {
        if (!$block.length) return;

        this.$block = $block;
        this.mapId = this.$block.attr('id');

        try {
            this.settings = JSON.parse(this.$block[0].dataset['settings']);
            this.coords = this.settings.coords.split(',');
            this.map = null;

            this.init();
        } catch (e) {
            console.log(e);
        }
    }

    init() {
        this.initMap(this.mapId).then(map => this.map = map);
    }

    initMap(id) {
        return new Promise(resolve => {
            ymaps.ready(() => {
                const map = new ymaps.Map(id, {
                    center: this.coords,
                    controls: [],
                    zoom: 16
                }, {
                    suppressMapOpenBlock: true
                });

                let isDraw;
                let myPolygon;
                let coords = [];

                $('#show_coords').on('click', function (){
                    printGeometry(coords);

                    return false;
                });

                createPolygon();

                function getCoords(coordsArr) {
                    coords.push(coordsArr);
                    var stateMonitor = new ymaps.Monitor(myPolygon.editor.state);
                    if (!stateMonitor.drawing) createPolygon();
                }

                function createPolygon() {
                    isDraw = true;
                    myPolygon = new ymaps.Polygon([], {}, {
                        editorDrawingCursor: "crosshair"
                    });
                    map.geoObjects.add(myPolygon);

                    const stateMonitor = new ymaps.Monitor(myPolygon.editor.state);

                    stateMonitor.add("drawing", function(newValue) {
                        myPolygon.options.set("strokeColor", newValue ? '#FF0000' : '#0000FF');
                    });

                    myPolygon.editor.startDrawing();
                    myPolygon.editor.events.add("drawingstop", function(e) {
                        isDraw ? getCoords(myPolygon.geometry.getCoordinates()) : myPolygon.editor.stopDrawing();
                    });
                }


                function printGeometry (coords) {
                    $('#coords').html('Координаты: ' + stringify(coords));

                    function stringify (coords) {
                        var res = '';
                        if ($.isArray(coords)) {
                            res = '[ ';
                            for (var i = 0, l = coords.length; i < l; i++) {
                                if (i > 0) {
                                    res += ', ';
                                }
                                res += stringify(coords[i]);
                            }
                            res += ' ]';
                        } else if (typeof coords == 'number') {
                            res = coords.toPrecision(6);
                        } else if (coords.toString) {
                            res = coords.toString();
                        }

                        return res;
                    }
                }


                resolve(map);
            });
        })
    }
}

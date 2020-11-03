import * as $ from 'jquery';

export class PolygonsMapsMultiple {
    constructor() {
        this.$maps = $('.polygon-map-multiple')
        if (this.$maps.length === 0) return;

        this.init();
    }

    init() {
        this.$maps.each((_, item) => this.initPolygonMap(item))
        //this.initMap(this.mapId).then(map => this.map = map);
    }
    initPolygonMap = (item) => {
        try {
            let settings = JSON.parse($(item).attr('data-settings'));
           /* let coords = settings.coords.split(',');
            let polygons = settings.polygons;
            let placemarks = settings.placemarks;
            let mapId = $(item).attr('id');*/

            let data = {
                coords: settings.coords.split(','),
                polygons: settings.polygons,
                placemarks: settings.placemarks,
                id: $(item).attr('id')
            }
            this.initMap(data)
        } catch (e) {
            console.log(e);
        }
    }

    initMap(data) {
        console.log(data)
        return new Promise(resolve => {
            ymaps.ready(() => {
                const map = new ymaps.Map(data.id, {
                    center: data.coords,
                    controls: ['zoomControl'],
                    zoom: 14
                }, {
                    suppressMapOpenBlock: true
                });

                map.behaviors.disable('scrollZoom');
                map.behaviors.disable('dblClickZoom');
                map.behaviors.disable('multiTouch');

                if (data.polygons) {
                    for (let i = 0; i < data.polygons.length; i++) {
                        let name = data.polygons[i][0]['name'] || 'Нет ничего';
                        console.log(data.polygons[i])
                        let polygon = new ymaps.Polygon(data.polygons[i],{
                            balloonContent : name
                        },{
                            fillColor: '#48b83d',
                            fillOpacity: 0.4,
                            strokeColor: '#48b83d',
                            strokeWidth: 3
                        });
                        map.geoObjects.add(polygon);
                    }
                }



                if (data.placemarks) {
                    for (let count = 0; count < data.placemarks.length; count++) {
                        addPlacemark(data.placemarks[count]);
                    }
                }


                /**
                 * Добавление точек транспорта
                 * @param placemark
                 */
                function addPlacemark(placemark) {
                    if (!placemark) return;
                    const {
                        coords = '',
                        image = ''
                    } = placemark;

                    const arrCoords = coords.split(',');

                    if (arrCoords.length !== 2) return;

                    const tempPlacemark = new ymaps.Placemark(arrCoords, {}, {
                        iconLayout: 'default#image',
                        iconImageHref: image,
                        iconImageSize: [22, 22],
                        iconImageOffset: [-11, -11]
                    });
                    map.geoObjects.add(tempPlacemark);
                }


                resolve(map);
            });
        })
    }
}

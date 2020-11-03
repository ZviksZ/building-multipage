
export default class PolygonsMap {
    constructor($block) {
        if (!$block.length) return;

        this.$block = $block;
        this.mapId = this.$block.attr('id');


        try {
            this.settings = JSON.parse(this.$block[0].dataset['settings']);
            this.coords = this.settings.coords.split(',');
            this.polygons = this.settings.polygons;
            this.placemarks = this.settings.placemarks;
            this.map = null;

            console.log(this.polygons);

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
                    controls: ['zoomControl'],
                    zoom: 14
                }, {
                    suppressMapOpenBlock: true
                });




                for (let i = 0; i < this.polygons.length; i++) {
                    let name = this.polygons[i][0]['name'] || 'Нет ничего';
                    let polygon = new ymaps.Polygon(this.polygons[i],{
                        balloonContent : name
                    },{
                        fillColor: '#48b83d',
                        fillOpacity: 0.4,
                        strokeColor: '#48b83d',
                        strokeWidth: 3
                    });
                    map.geoObjects.add(polygon);
                }


                for (let count = 0; count < this.placemarks.length; count++) {
                    addPlacemark(this.placemarks[count]);
                }

                map.behaviors.disable('scrollZoom');
                map.behaviors.disable('dblClickZoom');
                map.behaviors.disable('multiTouch');

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

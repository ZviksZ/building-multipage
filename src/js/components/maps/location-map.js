export default class LocationMap {
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
                    controls: ['zoomControl'],
                    zoom: 16
                }, {
                    suppressMapOpenBlock: true
                });

                map.behaviors.disable('scrollZoom');
                map.behaviors.disable('dblClickZoom');
                map.behaviors.disable('multiTouch');

                const myPlacemark = new ymaps.Placemark(this.coords, {}, {
                    iconLayout: 'default#image',
                    iconImageHref: '/netcat_template/template/Primary/assets/img/balloon.svg',
                    iconImageSize: [30, 36],
                    iconImageOffset: [-16, -49]
                });


                map.geoObjects.add(myPlacemark);

                resolve(map);
            });
        })
    }
}

export default class infrastructureMap {
    constructor($block) {
        if (!$block.length) return;

        this.$block = $block;
        this.mapId = this.$block.attr('id');
        if (!this.$block) return;

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

                const myPlacemark = new ymaps.Placemark(this.coords, {}, {
                    iconLayout: 'default#image',
                    iconImageHref: './img/balloon.svg',
                    iconImageSize: [33, 49],
                    iconImageOffset: [-16, -49]
                });


                map.geoObjects.add(myPlacemark);

                resolve(map);
            });
        })
    }
}
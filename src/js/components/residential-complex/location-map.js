export default class LocationMap {
    constructor() {
        this.mapPreviewId = 'location_map_preview';
        this.mapId = 'location_map';
        this.$preview = document.getElementById(this.mapPreviewId);
        if (!this.$preview) return false;

        try {
            this.settings = JSON.parse(this.$preview.dataset['settings']);
            this.coords = this.settings.coords.split(',');
            this.mapPreview = null;
            this.map = null;

            this.init();
        } catch (e) {
            console.log(e);
        }
    }

    init() {
        this.initMap(this.mapPreviewId).then(map => this.mapPreview = map);
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
                    iconImageHref: '/assets/img/balloon.svg',
                    iconImageSize: [33, 49],
                    iconImageOffset: [-16, -49]
                });

                // зум только для фулскринной карты
                if (id !== 'location_map') {
                    map.behaviors.disable('scrollZoom');
                }

                map.geoObjects.add(myPlacemark);

                resolve(map);
            });
        })
    }
}

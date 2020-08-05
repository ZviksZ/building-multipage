export default class ObjectsMap {
    constructor() {
        this.mapPreviewId = 'objects_map_preview';
        this.$preview = document.getElementById(this.mapPreviewId);
        if (!this.$preview) return false;

        try {
            this.settings = JSON.parse(this.$preview.dataset['settings']);

            this.mapPreview = null;
            this.map = null;

            this.init();
        } catch (e) {
            console.log(e);
        }
    }

    init() {
        this.initMap(this.mapPreviewId).then(map => this.mapPreview = map);
    }

    initMap(id) {
        return new Promise(resolve => {
            ymaps.ready(() => {
                const map = new ymaps.Map(id, {
                    center: [53.19916307121316,50.11762049999998],
                    controls: ['zoomControl'],
                    zoom: 13
                }, {
                    suppressMapOpenBlock: true
                });

                let objectManager = new ymaps.ObjectManager({
                    clusterize: true,
                    gridSize: 100,
                    clusterOpenBalloonOnClick: true,
                    clusterDisableClickZoom: false
                });

                let features = [];
                for (let i = 0; i < this.settings.length; i++) {
                    let baloonContent = `<div class="balloon-map">                            
                            <img src=${this.settings[i].image} alt="img">
                            <p class="address">${this.settings[i].address}</p>
                            <p class="name">${this.settings[i].name}</p>
                            <p class="year">${this.settings[i].year} г.</p>
                           <a href=${this.settings[i].link} class="button small inline">Подробнее</a>                        
                        </div> `;
                    let coords = this.settings[i].coords.split(',');

                    if(coords.length !== 2) {
                        continue;
                    }
                    features.push({
                        type: 'Feature',
                        id: i,
                        geometry: {
                            type: 'Point',
                            coordinates: coords
                        },
                        properties: {
                            balloonContent: baloonContent
                        },
                        options: {
                            iconLayout: 'default#image',
                            iconImageHref: '/assets/img/balloon.svg',
                            iconImageSize: [33, 49],
                            iconImageOffset: [-16, -49],
                            hideIconOnBalloonOpen: false,
                            balloonCloseButton: false
                        }
                    });

                }

                objectManager.add({
                    type: 'FeatureCollection',
                    features: features
                });

                map.geoObjects.add(objectManager);

                objectManager.clusters.options.set('clusterIconColor', '#EF1B34');

                map.events.add('click', function() {
                    map.balloon.close();
                });

                resolve(map);
            });
        })
    }
}

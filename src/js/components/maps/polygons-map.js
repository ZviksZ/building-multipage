import * as $ from 'jquery';

export default class PolygonsMap {
    constructor($block) {
        if (!$block) return;

        this.$block = $block;
        this.mapId = this.$block.attr('id');
        if (!this.$block) return false;

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

                const polygonsCoords = [
                    [
                        {"name": "Квартал тест"},
                    [
                        [53.1575, 50.0758],
                        [53.1574, 50.0795],
                        [53.1558, 50.0793],
                        [53.1560, 50.0757],
                        [53.1575, 50.0758]
                    ]
            ],
                [
                    {"name": "Квартал тест2"},
                    [
                        [53.1559, 50.0757],
                        [53.1557, 50.0791],
                        [53.1556, 50.0800],
                        [53.1551, 50.0799],
                        [53.1550, 50.0804],
                        [53.1546, 50.0807],
                        [53.1540, 50.0808],
                        [53.1528, 50.0808],
                        [53.1530, 50.0801],
                        [53.1535, 50.0798],
                        [53.1538, 50.0797],
                        [53.1540, 50.0755],
                        [53.1559, 50.0757]
                    ]
                ],
                    [
                        {"name": "Квартал тест3"},
                        [
                            [53.1551, 50.0751],
                            [53.1551, 50.0747],
                            [53.1537, 50.0741],
                            [53.1529, 50.0728],
                            [53.1520, 50.0719],
                            [53.1495, 50.0729],
                            [53.1488, 50.0737],
                            [53.1493, 50.0743],
                            [53.1551, 50.0751]
                        ]
                    ],
                    [
                        {"name": "Квартал тест4"},
                        [
                            [53.1538, 50.0754],
                            [53.1493, 50.0747],
                            [53.1489, 50.0747],
                            [53.1487, 50.0751],
                            [53.1486, 50.0800],
                            [53.1492, 50.0800],
                            [53.1494, 50.0758],
                            [53.1506, 50.0758],
                            [53.1507, 50.0765],
                            [53.1515, 50.0767],
                            [53.1526, 50.0762],
                            [53.1535, 50.0759],
                            [53.1537, 50.0760],
                            [53.1538, 50.0754]
                        ]
                    ],
                    [
                        {"name": "Квартал тест5"},
                        [
                            [53.1462, 50.0759],
                            [53.1470, 50.0804],
                            [53.1473, 50.0807],
                            [53.1484, 50.0801],
                            [53.1484, 50.0751],
                            [53.1482, 50.0748],
                            [53.1462, 50.0759]
                        ]
                    ],
                    [
                        {"name": "Квартал тест6"},
                        [
                            [53.1477, 50.0746],
                            [53.1460, 50.0754],
                            [53.1456, 50.0728],
                            [53.1462, 50.0728],
                            [53.1467, 50.0728],
                            [53.1477, 50.0746]
                        ]
                    ],
                    [
                        {"name": "Квартал тест7"},
                        [
                            [53.1454, 50.0729],
                            [53.1423, 50.0745],
                            [53.1429, 50.0773],
                            [53.1459, 50.0756],
                            [53.1454, 50.0729]
                        ]
                    ]
            ];


                for (let i = 0; i < polygonsCoords.length; i++) {

                    console.log(polygonsCoords[i])
                    let name = polygonsCoords[i][0]['name'] || 'Нет ничего';
                    let polygon = new ymaps.Polygon(polygonsCoords[i],{
                        balloonContent : name
                    },{
                        fillColor: '#48b83d',
                        fillOpacity: 0.4,
                        strokeColor: '#48b83d',
                        strokeWidth: 3
                    });
                    map.geoObjects.add(polygon);
                }


                // const myPlacemark = new ymaps.Placemark(this.coords, {}, {
                //     iconLayout: 'default#image',
                //     iconImageHref: './img/balloon.svg',
                //     iconImageSize: [33, 49],
                //     iconImageOffset: [-16, -49]
                // });
                //
                // map.geoObjects.add(myPlacemark);

                resolve(map);
            });
        })
    }
}

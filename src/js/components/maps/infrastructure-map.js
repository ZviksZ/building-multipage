import * as $  from 'jquery';

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

                // const myPlacemark = new ymaps.Placemark(this.coords, {}, {
                //     iconLayout: 'default#image',
                //     iconImageHref: './img/balloon.svg',
                //     iconImageSize: [33, 49],
                //     iconImageOffset: [-16, -49]
                // });


                // map.geoObjects.add(myPlacemark);

                $('#infrastructure_map_toggles').on('click', '.item', function (){
                   const $this = $(this);

                   if ($this.hasClass('active')) {
                       $this.removeClass('active');
                   } else {
                       $this.addClass('active');
                   }
                    checkState();

                    return false;
                });


                // Функция, которая по состоянию чекбоксов в меню
                // показывает или скрывает геообъекты из выборки.
                function checkState () {
                    let shownObjects,
                        byColor = new ymaps.GeoQueryResult();

                    const $selectedItems = $('#infrastructure_map_toggles').find('.item.active');



                    $.each($selectedItems,function (key, val) {
                        const colorType = val.dataset.color;
                        if (colorType) {
                            console.log(colorType);
                            byColor = myObjects.search('options.fillColor = "' + colorType + '"').add(byColor);
                            shownObjects = byColor.addToMap(map);
                            myObjects.remove(shownObjects).removeFromMap(map);
                        }
                    });

                    console.log(byColor);


                    // Мы отобрали объекты по цвету и по форме. Покажем на карте объекты,
                    // которые совмещают нужные признаки.

                    // Объекты, которые не попали в выборку, нужно убрать с карты.

                }

                // Создадим объекты из их JSON-описания и добавим их на карту.
                window.myObjects = ymaps.geoQuery({
                    type: "FeatureCollection",
                    features: [
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [53.155253, 50.091401]
                            },
                            options: {
                                fillColor: "#1C81DE"
                            }
                        },
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [53.154751, 50.091883]
                            },
                            options: {
                                fillColor: "#FF364E"
                            }
                        },
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [53.150774,50.075012]
                            },
                            options: {
                                fillColor: "#48B83D"
                            }
                        }
                    ]
                }).addToMap(map);

                resolve(map);
            });
        })
    }
}

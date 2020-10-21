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
            this.points = this.settings.points;
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
                    zoom: 14
                }, {
                    suppressMapOpenBlock: true,
                    yandexMapDisablePoiInteractivity: true
                });

                map.behaviors.disable('scrollZoom');
                map.behaviors.disable('dblClickZoom');
                map.behaviors.disable('multiTouch');
                map.behaviors.disable('drag');


                // Создадим объекты из их JSON-описания и добавим их на карту.
                window.myObjects = ymaps.geoQuery(this.points).addToMap(map);

                // checkState();

                $('#infrastructure_map_toggles').on('click', '.item', function (){
                   const $this = $(this);

                   if ($this.hasClass('active')) {
                       $this.removeClass('active');
                   } else {
                       $this.addClass('active');
                   }
                   setTimeout(()=> {
                       checkState();
                   }, 10);


                    return false;
                });


                // Функция, которая по состоянию чекбоксов в меню
                // показывает или скрывает геообъекты из выборки.
                function checkState () {
                    let shownObjects,
                        byColor = new ymaps.GeoQueryResult();

                    const $selectedItems = $('#infrastructure_map_toggles').find('.item.active');

                    for (let i = 0; i < $selectedItems.length; i++) {
                        const colorType = $selectedItems[i].dataset.color;

                        if (colorType) {
                            byColor = myObjects.search('options.fillColor = "' + colorType + '"').add(byColor);
                        }
                    }
                    // Мы отобрали объекты по цвету. Покажем на карте объекты,
                    shownObjects = byColor.addToMap(map);
                    // Объекты, которые не попали в выборку, нужно убрать с карты.
                    myObjects.remove(shownObjects).removeFromMap(map);
                }

                $(window).on('resize', function() {
                    map.container.fitToViewport();
                })

                resolve(map);
            });
        })
    }
}

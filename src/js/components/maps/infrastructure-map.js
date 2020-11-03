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


                console.log(this.points)

                this.points.features = this.points.features.map(item => {
                    let baloon = ymaps.templateLayoutFactory.createClass(
                       `<div class="balloon-map">                             
                            <span>${item.properties.balloonContent}</span>
                            <i class="close icon-cancel"></i>              
                        </div> `
                    );
                    let circleLayout = ymaps.templateLayoutFactory.createClass(`
                        <div class="placemark_layout_container" style="background: ${item.options.fillColor};"></div>
                        `);
                    return {
                        ...item,
                        options: {
                            ...item.options,
                            iconLayout: circleLayout,
                            iconShape: {
                                type: 'Circle',
                                // Круг описывается в виде центра и радиуса
                                coordinates: [0, 0],
                                radius: 16
                            },
                            balloonLayout: baloon
                        }
                    }
                })
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

                $('body').on('click', '.balloon-map .close', (e) => {
                    map.balloon.close();
                })


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

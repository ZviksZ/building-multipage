import * as $ from 'jquery';

export class InteractiveMap {
   constructor() {
      this.$block = $('.interactive-map__block');
      if (this.$block.length === 0) return;

      this.mapId = this.$block.find('.interactive-map').attr('id');

      try {
         //this.settings = JSON.parse(this.$block[0].dataset['points']);
         this.coords = [53.151079, 50.075499];
         this.map = null;

         this.init();
      } catch (e) {
         console.log(e);
      }
   }

   init = () => {
      this.initMap(this.mapId).then(map => (this.map = map));
      this.$block.find('.interactive-map__controls .item').on('click', this.initMapControlsItem)
   }

   initMapControlsItem = (e) => {
      e.preventDefault();

      let data = JSON.parse($(e.currentTarget).attr('data-points'));
      let collection = new ymaps.GeoObjectCollection(null, { preset: "islands#redIcon" })

      if (data.points && data.points.length > 0) {
         data.points.forEach((item) => {
            let coords = item.coords.split(',');

            const placemark = new ymaps.Placemark(
               coords,
               {balloonContent: item.balloon},
               {
                  iconImageSize: [33, 49],
                  iconImageOffset: [-16, -49]
               }
            );

            collection.add(placemark)
         })

         if ($(e.currentTarget).hasClass('active')) {
            this.map.geoObjects.remove(collection);
            $(e.currentTarget).removeClass('active')
         } else {
            this.map.geoObjects.add(collection);
            $(e.currentTarget).addClass('active')
         }


         this.map.setBounds(this.map.geoObjects.getBounds());
      }

   }

   initMap = (id) => {
      return new Promise(resolve => {
         ymaps.ready(() => {
            const map = new ymaps.Map(
               id,
               {
                  center: this.coords,
                  controls: [],
                  zoom: 16
               },
               {
                  suppressMapOpenBlock: true
               }
            );

            const myPlacemark = new ymaps.Placemark(
               this.coords,
               {},
               {
                  iconLayout: 'default#image',
                  iconImageHref: './img/balloon.svg',
                  iconImageSize: [33, 49],
                  iconImageOffset: [-16, -49]
               }
            );

            map.geoObjects.add(myPlacemark);

            resolve(map);
         });


      });
   }
}

import * as $ from 'jquery';
import Swiper from 'swiper/js/swiper.min.js';

export class BuildProgressSliders {
   constructor() {
      this.$sliders = $('.bp-slider');

      if (this.$sliders.length === 0) return false;

      this.init();
   }

   init = () => {
      this.$sliders.each((_, item) => this.initSlider(item));

      $('.bp-item .h3').on('click', this.showItemMobile)
   };

   showItemMobile = (e) => {
      $(e.currentTarget).closest('.bp-item').toggleClass('bp-item__show')
   }

   initSlider = (slider) => {
      let options = {
         effect: 'slide',
         loop: false,
         preloadImages: false,
         lazy: true,
         resistance: true,
         slidesPerView: 'auto',
         autoHeight: true,
         spaceBetween: 32,
         freeMode: true
      }
      let sliderInstance;
      if ($(window).width() >= '1000') {
         sliderInstance = new Swiper(slider, options);
      }


      $(window).on('resize', () => {
         if ($(window).width() < '1000') {
            sliderInstance.destroy()
         } else {
            sliderInstance = new Swiper(slider, options);
         }
      })
   }
}

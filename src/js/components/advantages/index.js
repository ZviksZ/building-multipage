import * as $ from 'jquery';
import Swiper from 'swiper/js/swiper.min.js';

export class AdvantagesModal {
   constructor() {
      this.$blocks = $('.advantages-grid-block');
      if (this.$blocks.length === 0) {
         return false;
      }
      this.$modalContent = $('#advantages-modal__content')

      this.slidersInit = [];

      this.init();
   }
   init = () => {
      this.$blocks.find('.item').on('click', this.openModal)

      /*this.$modalContent.find('.advantages-gallery__slider').each((_, item) => {
         const tab = $(item).closest('.data-block').attr('data-tab')

         this.initSlider(item, tab)
      })*/
   };

   openModal = e => {
      let activeBlock = $(e.currentTarget).attr('data-tab');

      $('html').addClass('open-advantages-modal')

      this.$modalContent.find('.data-block').removeClass('active')
      this.$modalContent.find('.data-block[data-tab="' + activeBlock + '"]').addClass('active')


      console.log()
      if (!this.slidersInit.includes(activeBlock)) {
         this.initSlider(activeBlock);
         this.slidersInit.push(activeBlock);
      }
   }

   initSlider = (tab) => {
      new Swiper($('.data-block[data-tab="' + tab + '"] .advantages-gallery__slider'), {
         effect: 'slide',
         loop: false,
         preloadImages: false,
         lazy: true,
         resistance: false,
         slidesPerView: 1,
         centeredSlides: true,
         centeredSlidesBounds: true,
         spaceBetween: 0,
         navigation: {
            nextEl: '.data-block[data-tab="' + tab + '"] .advantages-gallery__wrap .swiper-button-next',
            prevEl: '.data-block[data-tab="' + tab + '"] .advantages-gallery__wrap .swiper-button-prev'
         }
      });
   }
}

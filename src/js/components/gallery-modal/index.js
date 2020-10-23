import * as $ from 'jquery';
import Swiper from 'swiper/js/swiper.min.js';

export class GalleryModal {
   constructor() {
      this.$galleryItems = $('[data-images]');

      if (this.$galleryItems.length === 0) return false;

      this.$slider = $('#gallery-modal__slider');
      this.$captionBlock = $('#gallery-modal__caption');

      this.init();
   }

   init = () => {
      this.$galleryItems.on('click', this.openGalleryModal);

      this.initSlider();
   };

   openGalleryModal = e => {
      e.preventDefault();
      let dataImages = $(e.currentTarget).attr('data-images');
      this.data = JSON.parse(dataImages);

      this.initSlidesToGallery();
      this.$sliderInstance.update();
      this.$sliderInstance.slideTo(0, 10, true);
   };

   initSlidesToGallery = () => {
      let data = this.data.images;
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         template += `
               <div 
                  class="swiper-slide" 
                  data-caption="${data[i].caption}"
                  style="background-image: url(${data[i].img})">               
               </div>
           `;
      }

      this.$slider.find('.swiper-wrapper').html(template);
   };

   initSlider = () => {
      this.$sliderInstance = new Swiper(this.$slider, {
         effect: 'slide',
         loop: false,
         preloadImages: false,
         lazy: true,
         resistance: true,
         slidesPerView: 1,
         autoHeight: true,
         spaceBetween: 0,
         pagination: {
            el: '#gallery-modal-pagination',
            type: 'fraction',
            renderFraction: function(currentClass, totalClass, index) {
               return `<i class="icon-photo"></i><span class="swiper-pagination-current"></span> из <span class="swiper-pagination-total"></span>`;
            }
         },
         navigation: {
            nextEl: '.gallery-modal .swiper-button-next',
            prevEl: '.gallery-modal .swiper-button-prev'
         },
         on: {
            slideChange: () => {
               let currentSlide = this.$slider.find('.swiper-slide')[this.$sliderInstance.activeIndex];
               let currentCaption = $(currentSlide).attr('data-caption');

               this.$captionBlock.text(currentCaption);
            }
         }
      });
   };
}

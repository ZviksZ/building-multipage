import * as $ from 'jquery';

export class AdvantagesModal {
   constructor() {
      this.$blocks = $('.advantages-grid-block');
      if (this.$blocks.length === 0) {
         return false;
      }
      this.$modalContent = $('#advantages-modal__content')

      this.init();
   }
   init = () => {
      this.$blocks.find('.item-link').on('click', this.openModal)
   };

   openModal = e => {
      let activeBlock = $(e.currentTarget).closest('.item').attr('data-tab');

      $('html').addClass('open-advantages-modal')

      this.$modalContent.find('.data-block').removeClass('active')
      this.$modalContent.find('.data-block[data-tab="' + activeBlock + '"]').addClass('active')
   }
}

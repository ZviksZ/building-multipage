import * as $ from 'jquery';

export class CustomTabs {
   constructor() {
      this.$container = $('.tabs-container');
      if (this.$container.length === 0) {
         return false;
      }

      this.$tabItems = this.$container.find('.tabs .item');
      this.$tabBlocks = this.$container.find('.tabs-block');
      this.$tabSelect = this.$container.find('.tabs-select');
      this.$tabSelectOptions = this.$tabSelect.find('option');

      this.init();
   }
   init = () => {
      this.initActiveTab();

      this.$container.find('.tabs .item').on('click', this.changeTab);

      this.$tabSelect.on('change', this.changeTab);

      $(window).on('resize', () => {
         if (this.$tabSelect.length > 0) {
            if ($(window).width() < '1000') {
               let tab = this.$tabSelect.val();

               this.$tabItems.removeClass('active');
               this.$tabBlocks.removeClass('active');

               this.$container.find('.tabs .item[data-tab="' + tab + '"]').addClass('active');
               this.$container.find('.tabs-block[data-tab="' + tab + '"]').addClass('active');
            }
         }

      });
   };

   initActiveTab = () => {
      if (this.$container.find('.tabs .item.active').length > 0) {
         let tab = this.$container.find('.tabs .item.active').attr('data-tab');

         this.$container.find('.tabs-block[data-tab="' + tab + '"]').addClass('active');
      } else if (this.$tabSelect.length > 0 && $(window).width() <= '1000') {
         let tab = this.$tabSelect.val();

         this.$container.find('.tabs .item[data-tab="' + tab + '"]').addClass('active');
         this.$container.find('.tabs-block[data-tab="' + tab + '"]').addClass('active');
      } else  {
         let tab = this.$container
            .find('.tabs .item')
            .first()
            .attr('data-tab');

         this.$container.find('.tabs .item[data-tab="' + tab + '"]').addClass('active');
         this.$container.find('.tabs-block[data-tab="' + tab + '"]').addClass('active');
      }
   };

   changeTab = e => {
      e.preventDefault();
      let tab;
      if ($(e.currentTarget).val()) {
         tab = $(e.currentTarget).val();
      } else {
         tab = $(e.currentTarget).attr('data-tab');
      }

      this.$tabItems.removeClass('active');
      this.$tabBlocks.removeClass('active');

      this.$container.find('.tabs .item[data-tab="' + tab + '"]').addClass('active');
      this.$container.find('.tabs-block[data-tab="' + tab + '"]').addClass('active');

   };
}

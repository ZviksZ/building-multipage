import * as $ from 'jquery';

export class CustomTabs {
   constructor() {
      this.$container = $('.tabs-container');
      if (this.$container.length === 0) {
         return false;
      }

      this.$tabItems = this.$container.find('.tabs .item');
      this.$tabBlocks = this.$container.find('.tabs-block');


      this.init();
   }
   init = () => {
      this.initActiveTab();

      this.$container.find('.tabs .item').on('click', this.changeTab);
   };

   initActiveTab = () => {
      if (this.$container.find('.tabs .item.active').length > 0) {
         let tab = this.$container.find('.tabs .item.active').attr('data-tab');

         this.$container.find('.tabs-block[data-tab="' + tab + '"]').addClass('active');
      } else {
         let tab = this.$container.find('.tabs .item').first().attr('data-tab');

         this.$container.find('.tabs .item[data-tab="' + tab + '"]').addClass('active');
         this.$container.find('.tabs-block[data-tab="' + tab + '"]').addClass('active');
      }
   };

   changeTab = (e) => {
      e.preventDefault();

      let tab = $(e.currentTarget).attr('data-tab');


      this.$tabItems.removeClass('active');
      this.$tabBlocks.removeClass('active');

      this.$container.find('.tabs .item[data-tab="' + tab + '"]').addClass('active');
      this.$container.find('.tabs-block[data-tab="' + tab + '"]').addClass('active');
   };
}

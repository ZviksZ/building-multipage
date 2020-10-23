import * as $ from 'jquery';

export class MortgagePage {
   constructor() {
      this.$block = $('.mortgage-list')

      if (this.$block.length === 0) return false

      this.init();
   }

   init = () => {
      $('body').on('click', '.mortgage-list .item-head', function() {
         $(this)
            .closest('.bank-item')
            .find('.item')
            .toggleClass('show-mobile');

      });
      $('body').on('click', '.mortgage-list .item-head .tooltip', function(e) {
         e.stopPropagation();
         $(this).toggleClass('tooltip-show');
      });

      $(document).mouseup(function (e){
         var div = $(".mortgage-list .item-head .tooltip");
         if (!div.is(e.target)
            && div.has(e.target).length === 0) {
            $(".mortgage-list .item-head .tooltip").removeClass('tooltip-show');
         }
      });
   }

}

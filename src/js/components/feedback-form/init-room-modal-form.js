import * as $ from 'jquery';
import { initFormWithValidate } from '../form';

export class InitRoomModalForm {
   constructor() {
      this.$form = $('#room-modal-form');
      this.$formMessageBlock = this.$form.find('.form-message');

      if (!this.$form.length) return false;

      this.successForm = this.successForm.bind(this);
      this.errorForm = this.errorForm.bind(this);
      this.clearForm = this.clearForm.bind(this);

      this.init();
   }

   init() {
      initFormWithValidate(this.$form);

      this.submit(this.successForm, this.errorForm);
   }
   /**
    * Вешаем обработчик отправки формы
    */
   submit(successFn, errorFn) {
      this.$form.on('submit', function(e) {
         e.preventDefault();

         let $formData = {};

         $(this)
            .find('input, textarea, select')
            .each(function() {
               $formData[this.name] = $(this).val();
            });

         let data = {
            sub: 49,
            cc: 72,
            f_name: $formData.feedback_modal_name,
            f_phone: $formData.feedback_modal_phone,
            f_message: $formData.feedback_modal_text,
            catalogue: 1,
            posting: 1
         };

         //const data = $(this).serialize();

         $.ajax({
            url: $('#feedback-modal-form').attr('action'),
            type: 'POST',
            dataType: 'text',
            data: data,
            success: function(res) {
               successFn();
            },
            error: function(res) {
               errorFn();
            },
            timeout: 30000
         });
      });
   }

   successForm() {
      this.clearForm();

      this.$formMessageBlock.find('.text').text('Ваше собщение успешно отправлено');

      this.$form.addClass('form-hide');

      setTimeout(() => {
         $('html').removeClass('open-modal open-modal-fade-effect');
         this.$form.closest('.modal-window').removeClass('fade-in-show');
      }, 2500);
   }

   errorForm() {
      this.$formMessageBlock.find('.text').text('Ошибка. Попробуйте еще раз');

      this.$form.addClass('form-hide');

      setTimeout(() => {
         this.$form.removeClass('form-hide');
         this.$formMessageBlock.find('.text').text('');
      }, 2500);
   }

   clearForm() {
      this.$form[0].reset();
      this.$form
         .find('.field')
         .removeClass('success')
         .addClass('empty');
   }
}

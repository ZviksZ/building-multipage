import * as $                 from 'jquery';
import {initFormWithValidate} from "../form";

export default class InitFeedbackModalForm {
   constructor() {
      this.$form = $('#feedback-modal-form');
      this.$formMessageBlock = this.$form.find('.form-message');

      if (!this.$form.length) return false;

      this.successForm = this.successForm.bind(this)
      this.errorForm = this.errorForm.bind(this)
      this.clearForm = this.clearForm.bind(this)

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
      this.$form.on('submit', function (e) {
         e.preventDefault();

         let $formData = {};

         $(this).find('input, textarea, select').each(function() {
            $formData[this.name] = $(this).val();
         });


         let data = {
            sub:49,
            cc:72,
            f_name:$formData.feedback_modal_name,
            f_phone:$formData.feedback_modal_phone,
            f_message:$formData.feedback_modal_text,
            catalogue:1,
            posting:1,
         };

         //const data = $(this).serialize();

         $.ajax({
            url: $('#feedback-modal-form').attr('action'),
            type: 'POST',
            dataType: 'text',
            data: data,
            success: function (res) {
               successFn()
            },
            error: function (res) {
               errorFn()
            },
            timeout: 30000
         });
      })
   }

   successForm() {
      this.clearForm();

      this.$formMessageBlock.find('.message-icon.error').addClass('hide');
      this.$formMessageBlock.find('.message-title').text('Отлично!');
      this.$formMessageBlock.find('.message-subtitle').text('Ваше собщение успешно отправлено');


      this.$form.addClass('form-hide');


   }

   errorForm() {
      this.$form.addClass('form-hide');

      this.$formMessageBlock.find('.message-icon.success').addClass('hide');
      this.$formMessageBlock.find('.message-title').text('Ошибка');
      this.$formMessageBlock.find('.message-subtitle').text('Попробуйте еще раз');

      setTimeout(() => {
         this.$form.removeClass('form-hide');
         this.$formMessageBlock.find('.message-icon.success').removeClass('icon-hide');

      }, 4000)
   }

   clearForm() {
      this.$form[0].reset();
      this.$form.find('.field').removeClass('success').addClass('empty');
   }
}

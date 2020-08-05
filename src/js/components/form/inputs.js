import * as $ from 'jquery';
import Inputmask from 'inputmask';

/**
 * Инициализация инпатов с маской ввода
 * Маска может инициализироваться для инпата двумя вариантами
 * 1. Из базовых шаблонов - data-mask_tpl="phone"
 * 2. Кастомная маска - data-mask="99.99.9999 99:99"
 * Если присутствуют оба атрибута - приоритет у шаблона
 */
function initMaskedInput() {
    $('.input-mask').each(function () {
        const $field = $(this);
        if ($field.hasClass('mask-ready')) return;

        const maskTpl = $field.attr('data-mask_tpl');
        let mask = $field.attr('data-mask');

        let autoUnmask = true;

        if (!maskTpl && !mask) return;

        switch (maskTpl) {
            case 'phone_plus7':
                mask = '+7 999 999 99 99';
                break;

            case 'phone':
                mask = '999 999 99 99';
                break;

            case 'date':
                mask = '99.99.9999';
                autoUnmask = false;
                break;

            case 'passport_code':
                mask = '999-999';
                autoUnmask = false;
                break;

            case 'passport_serial_number':
                mask = '9999 999999';
                autoUnmask = true;
                break;

            case 'snils':
                mask = '999-999-999 99';
                autoUnmask = true;
                break;
        }

        Inputmask({
            mask: mask,
            placeholder: '_',
            showMaskOnHover: false,
            showMaskOnFocus: true,
            autoUnmask: autoUnmask
        }).mask($field);

        $field.addClass('mask-ready');
    });
}

/**
 * Инициализация инпатов с вводом денежного формата
 */
function initMoneyInput() {
    $('.input-money').each(function () {
        const $field = $(this);
        if ($field.hasClass('mask-ready')) return;

        const currency = $field.attr('data-currency') || ' ₽';

        Inputmask({
            alias: 'numeric',
            digits: 0,
            digitsOptional: false,
            radixPoint: '.',
            placeholder: '',
            groupSeparator: ' ',
            autoGroup: true,
            min: 0,
            max: 999999999,
            suffix: currency,
            allowMinus: false,
            rightAlign: false,
            showMaskOnHover: false,
            autoUnmask: true
            // showMaskOnFocus: false,
            // clearMaskOnLostFocus: true
        }).mask($field);

        $field.addClass('mask-ready');
    });
}

/**
 * Инпаты с контролем заполненности и очисткой
 */
function initFillControlInput() {
    $('.input-fill-control').each(function () {
        const $this = $(this);
        if ($this.hasClass('fill-control-ready')) return;

        const $field = $(this).parents('.field');

        checkFilledInput($this);

        $this.on('change keyup', function () {
            checkFilledInput($this);
        });

        $field.find('.clear-input-button').on('click', function () {
            $this.val('');
            checkFilledInput($this);
        });

        $(this).addClass('fill-control-ready');
    });


    function checkFilledInput($input) {
        const filledClassName = 'filled';
        const val = $input.val();
        const $field = $input.parents('.field');
        if (val) {
            $field.addClass(filledClassName);
        } else {
            $field.removeClass(filledClassName);
        }
    }
}

/**
 * Получения чистого значения номера телефона - 10 знаков без форматирования
 * @param {HTMLElement} $input - поле ввода
 * @return {String} номер телефона очищенные
 */
function getMobilePhoneClearValue($input) {
    if (!$input) return '';

    let val = $input.val() || '';
    val = val.replace(/[\s]/g, '');
    val = val.replace('+7', '');

    return val;
}

/**
 * Получение массива фамилии, имени, отчества из строки ФИО
 * @param {String} fio
 * @return {Array} фамилия, имя, отчество
 */
function getLastnameNamePatronymicFromFio(fio = '') {
    const [ lastname, ...fioRest ] = fio.split(' ');

    let patronymic = '';
    if (fioRest.length > 1) {
        patronymic = fioRest[fioRest.length - 1];
        fioRest.pop();
    }

    const name = (fioRest && fioRest.length) ? fioRest.join(' ') : '';

    return [ lastname, name, patronymic ];
}

function initPlaceholders() {
    $('.placeholder').each(function () {
        if ($(this).hasClass('ready')) return;

        const $this = $(this);

        const $field = $this.parents('.field');
        const plh = $this.data('placeholder');
        const val = $.trim($this.val());
        if ((val === '' || val == plh) && plh != '' && plh != undefined) {
            $field.addClass('empty');

        } else {
            $field.removeClass('empty');
        }

        $field.prepend('<span class="label">' + plh + '</span>');

        $(this).addClass('ready');

        $(this)
           .on('focus', function () {
               const $this = $(this);
               const $field = $this.parents('.field');
               const plh = $this.attr('data-placeholder');
               const val = $.trim($this.val());

               if ($this.prop('readonly')) return false;

               if (val === '' || val === plh) {
                   $field.removeClass('empty');
               }
           })
           .on('blur', function () {
               const $this = $(this);
               const $field = $this.parents('.field');
               const plh = $this.attr('data-placeholder');
               const val = $.trim($this.val());

               if (val === '' || val === plh) {
                   $field.removeClass('error success').addClass('empty');

               } else {
                   $field.removeClass('empty');
               }
           });
    });

    $('.placeholder-select').each(function () {
        if ($(this).hasClass('ready')) return;

        const $this = $(this);
        const $field = $this.parents('.field');
        const plh = $this.attr('data-placeholder');
        const val = $.trim($this.val());


        if ((val === '' || val === plh) && plh !== '' && plh !== undefined) {
            $field.addClass('empty');

        } else {
            $field.removeClass('empty');
        }

        $field.find('.selectwrap').prepend('<span class="label">' + plh + '</span>');

        $this.addClass('ready');

        $this
           .on('focus', function () {
               const $this = $(this);
               const $field = $this.parents('.field');
               const plh = $this.attr('data-placeholder');
               const val = $.trim($this.val());

               if ($this.prop('readonly')) return false;

               if (val == '' || val == plh) {
                   $field.removeClass('empty');
               }
           })
           .on('blur', function () {
               const $this = $(this);
               setTimeout(function () {
                   const $field = $this.parents('.field');
                   const val = $this.val();
                   const plh = $this.attr('data-placeholder');

                   if (!val || val === plh) {
                       $field.removeClass('error success').addClass('empty');

                   } else {
                       $field.removeClass('empty');
                   }
               }, 150);
           });
    });
}

export {
    initMaskedInput,
    initFillControlInput,
    initMoneyInput,
    initPlaceholders,
    getLastnameNamePatronymicFromFio,
    getMobilePhoneClearValue
};

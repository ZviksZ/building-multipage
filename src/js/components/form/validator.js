import * as $ from 'jquery';
import moment from 'moment';

import { getMobilePhoneClearValue } from './inputs';

const regEmail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,}$/i;
const regNameRus = /^[А-Яа-яЁё\-'\s]+$/i;
const regDate = /(\d{2}\.\d{2}\.\d{4})/;
const regNum = /^\d+$/;

/**
 * Валидация формы
 * @param {HTMLElement}  $form - html объект формы
 * @param {Boolean} showError - показывать ошибки или нет
 * @return {boolean} результат проверки формы
 */
function validateForm($form, showError = true) {
	let error = 0;

	let $fields = $form.find('.validate');

	$fields.each(function () {
		if (!validateField($(this), showError)) {
			error++;
		}
	});

	if (error > 0) return false;

	return true;
}

/**
 * Валидация поля
 * @param {HTMLElement} $field - поле для валидации
 * @param {Boolean} showError - показывать ошибки или нет
 * @return {boolean} результат проверки поля
 */
function validateField($field, showError = true) {
	if (!$field.hasClass('validate')) return true;
	if ($field.hasClass('validate-disabled')) return true;

	const $fieldBlock = $field.parents('.field');
	const $errorMessage = $fieldBlock.find('.error-message');

	let error = 0;
	let message = '';

	let val = $.trim($field.val());
	const valLength = +$field.attr('maxlength') || 0;
	const plh = $field.attr('data-placeholder');
	const type = $field.attr('data-validate');
	const errorMessage = $field.attr('data-error_message');

	const mobilePhoneInvalidFirstSymbols = [ '0', '1', '2', '7' ];

	let firstSymbol = val[0] || '';

	switch (type) {
		//обязательно для заполнения
		case 'required':
			if (!val) {
				error++;
				message = 'Поле обязательно для заполнения';
			}
			break;

		//радио кнопки - обязательно для выбора
		case 'required_checkbox_radio':
			if (!+$field.find('input:checked').length) {
				error++;
				message = 'Выберите хотя бы 1 вариант';
			}
			break;

		// число
		case 'number':
			val = val + '';
			if (
				!val ||
				val.search(regNum) === -1 ||
				(valLength && valLength !== val.length)
			) {
				error++;
				message = 'Только цифры';
			}
			break;

		//номер телефона
		case 'mobile_phone':
			val = getMobilePhoneClearValue($field);
			firstSymbol = val[0];

			if (!val || val.search(regNum) === -1 || val.length !== 10 ||
				mobilePhoneInvalidFirstSymbols.includes(firstSymbol)) {
				error++;
				message = 'Укажите корректный номер телефона';
			}
			break;

		// серия и номер паспорта - 10 цифр
		case 'passport_serial_number':
			val = val + '';
			if (!val || val.search(regNum) == -1 || val.length !== 10) {
				error++;
				message = 'Укажите корректные данные';
			}
			break;

		// фио в одном поле
		case 'fio':
			const fio = val.split(' ') || [];
			const [ lastname, name, ...fioRest ] = fio;
			const patronymic = (fioRest && fioRest.length) ? fioRest.join(' ') : '';
			let checkLastname = true;
			let checkName = true;
			let checkPatronymic = true;
			if (!lastname || lastname.search(regNameRus) === -1 || lastname.length > 50 || lastname.length < 2) {
				checkLastname = false;
			}

			if (!name || name.search(regNameRus) === -1 || name.length > 50 || name.length < 2) {
				checkName = false;
			}

			if (
				patronymic &&
				(
					patronymic.search(regNameRus) === -1 ||
					patronymic.length > 50 ||
					patronymic.length < 2
				)
			) {
				checkPatronymic = false;
			}

			if (!checkLastname || !checkName || !checkPatronymic) {
				error++;
				message = 'Укажите ФИО как в паспорте';
			}
			break;

		//дата рождения
		case 'date_birthday':
			if (val.search(regDate) === -1) {
				error++;
				message = 'Дата в формате дд.мм.гггг';

			} else {
				const d = val.split('.');
				//месяц с 0 поэтому вычитаем
				const day = d[0] * 1;
				const month = d[1] * 1 - 1;
				const year = d[2] * 1;

				const dateCur = moment([ year, month, day ]);
				const dateNow = moment();

				//проверка на корректность даты
				if (dateCur.isValid() == 'Invalid date' || dateCur.isValid() == false || dateCur > dateNow) {
					error++;
					message = 'Укажите верную дату';

				} else if (dateNow.diff(dateCur, 'years') < 18) {
					error++;
					message = 'Возраст не менее 18 лет';
				}
			}

			break;

		//денежный формат
		case 'money':
			val = val + '';
			if (!val || val.search(regNum) === -1) {
				error++;
				message = 'Только цифры';
			}
			break;

		//email
		case 'email':
			val = val.toLowerCase();
			if (!val || val.search(regEmail) === -1 || val.length > 50 || val == 'mig@mig.mig' || val ==
				'email@adress.ru') {
				error++;
				message = 'Укажите корректный адрес электронной почты';
			}
			break;

		//СНИЛС
		case 'snils':
			if (!validateSnils(val)) {
				error++;
				message = 'Укажите корректный СНИЛС';
			}
			break;
	}

	// еслии задано кастомное сообщение об ошибке - выводим его
	if (errorMessage) message = errorMessage;

	//если поле заполнено не корректно
	//возвращаем
	if (error > 0) {
		if (showError) {
			$errorMessage.html(message);
			$fieldBlock.removeClass('success').addClass('error');
		}

		return false;

	} else {
		$errorMessage.html('');
		$fieldBlock.removeClass('error').addClass('success');
		return true;
	}
}

/**
 * Инициализация функционала валидации формы
 * @param {HTMLElement} $form - html объект формы
 */
function initFormWithValidate($form) {
	if (!$form) return;

	const $submit = $form.find('[type="submit"]');

	checkDisabledSubmit();

	// инпаты
	$form.find('.validate')
		 .on('keyup', () => {
			 checkDisabledSubmit();
		 })
		 .on('change', function () {
			 validateForm($form, false);
			 validateField($(this));
		 });

	// чекбоксы/радио
	$form.find('div.validate input')
		 .on('change', function () {
			 validateForm($form, false);
			 validateField($(this).parents('.validate'));
		 });

	function checkDisabledSubmit() {
		if (validateForm($form, false)) {
			$submit.removeAttr('disabled');
		} else {
			$submit.attr('disabled', 'disabled');
		}
	}
}

/**
 * Проверка корректности СНИЛС
 * @param {String} snils - проверяемый СНИЛС
 * @return {Boolean} результат проверки
 */
function validateSnils(snils = '') {
	snils = snils.replace(/[-\s]/g, '');

	if (!snils || snils.search(regNum) === -1 || snils.length !== 11) return false;

	if (+snils <= 1001998) return true;

	//расчитываем контрольное число
	const snilsArray = snils.split('');
	const snilsDigit = +snils.slice(-2);

	//контрольное число
	let checkDigit = 0;

	let sum = 0;
	for (let i = 0; i < 9; i++) {
		sum += snilsArray[i] * (9 - i);
	}

	if (sum < 100) {
		checkDigit = sum;
	} else if (sum > 101) {
		checkDigit = (sum % 101) * 1;
	}

	if (checkDigit === 100 || checkDigit === 101) {
		checkDigit = 0;
	}

	if (checkDigit != snilsDigit) return false;

	return true;
}

export {
	validateForm,
	validateField,
	initFormWithValidate,
};
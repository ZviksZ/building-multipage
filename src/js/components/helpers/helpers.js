import * as $ from 'jquery';
import './sex_by_russian_name';

/**
 * Форматирования числа в денежный формат
 * @param {Number} number - число для форматирования
 * @param {Number} decimals - знаков после запятой
 * @param {String} decPoint - разделитель для float
 * @param {String} thousandsSep - разделить разрядов
 * @returns {string} число в денежном формате
 */
function numberFormat(number, decimals = 0, decPoint = '', thousandsSep = ' ') {
	let i,
		j,
		kw,
		kd,
		km;

	i = parseInt(number = (+number || 0).toFixed(decimals)) + '';
	if ((j = i.length) > 3) {
		j = j % 3;
	} else {
		j = 0;
	}
	km = (j ? i.substr(0, j) + thousandsSep : '');
	kw = i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep);
	kd = (decimals ? decPoint + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : '');
	return km + kw + kd;
}

/**
 * Фукнция склонения
 * @param {Number} number - число для склонения
 * @param {Array} titles - массив слов склонений
 * @returns {String} подпись
 */
function declOfNum(number, titles) {
	const cases = [ 2, 0, 1, 1, 1, 2 ];
	return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

/**
 * Получение GET параметров из URL
 * @returns {Object} - объект с гет параметрами
 */
function parseGets() {
	let a = location.search;
	a = a.substring(1).split("&");
	const b = {};
	for (let i = 0; i < a.length; i++) {
		let c = a[i].split("=");
		b[c[0]] = c[1];
	}
	return b;
}

/**
 * Переключатели скрытого контента
 */
function initToggleBlock() {
	$('.toggle-block').not('.toggle-block-ready').on('click', '.toggle-button', function () {
		$(this).parents('.toggle-block').toggleClass('open');
		return false;
	});

	$('.toggle-block').addClass('toggle-block-ready');
}

/**
 * Форматирование даты
 * @param {Date} date - объект JS даты
 * @param {Number} [type] - какой вариант форматирования
 * @return {String} дата в указанном формате
 */
function formatDate(date, type = 0) {
	if (!date) return '';

	const monthsClassificator = ['', 'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
								'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];

	const day = +date.getDate();
	const month = +date.getMonth() + 1;
	const year = +date.getFullYear();

	let dayText = day;
	if (day < 10) dayText = `0${dayText}`;

	let monthText = month;
	if (month < 10) monthText = `0${monthText}`;

	let yearText = year;

	let result = '';
	switch (type) {
		case 1:
			// дата в формате 06 марта 2020
			result = `${dayText} ${monthsClassificator[month].toLowerCase()} ${year}`;
			break;

		case 0:
		default:
			result = `${dayText}.${monthText}.${yearText}`;
	}

	return result;
}

/**
 * Определение пола по ФИО
 * @param {String} lastname - фамилия
 * @param {String} name - имя
 * @param {String} patronymic - отчество
 * @return {number} 1 - мужской, 2 - женский, все неопределенные идут как 1))
 */
function getGenderByFIO(lastname = '', name = '', patronymic = '') {
	const sexByRussianName = new SexByRussianName(lastname, name, patronymic);
	let gender =  +sexByRussianName.get_gender();
	if (gender === 0) {
		gender = 2;
	} else {
		gender = 1;
	}

	return gender;
}

function initCompass() {
	let $compass = $('.compass');

	if ($compass.length) {
		let deg = $compass.attr('data-deg');
		$compass.css('transform', 'rotate(' + deg + 'deg)');
		$compass.find('.compass-symbol').css('transform', 'rotate(-' + deg + 'deg)');
	}
}

export { numberFormat, declOfNum, parseGets, initToggleBlock, formatDate, getGenderByFIO, initCompass };



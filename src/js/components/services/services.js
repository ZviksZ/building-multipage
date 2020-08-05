import * as $ from 'jquery';
import calculatorData from '../calculator/calculatorData';

/**
 * Отправка ajax запросов
 * @param { Object } options - параметры запроса
 */
function httpRequest(options = {}) {
	let countErrorQuery = 0;
	const maxCountError = 2;

	send(options);

	function send(options) {
		if (!options) return;

		const {
			action,
			data,
			successCallback,
			errorCallback,
			repeatRequest = true,
			timeoutRequest = 310000,
			timeoutResendQuery = 7000
		} = options;

		if (!successCallback || !errorCallback) return;

		if (countErrorQuery > maxCountError) {
			errorCallback({ limitRequest: true });
			return;
		}

		// const apiUrl = `https://beeline.internetlab.ru/api/${action}`;
		const apiUrl = `/api/${action}`;

		$.ajax({
			// headers: { 'X-Requested-With': 'XMLHttpRequest' },
			// xhrFields: {
			// 	withCredentials: true
			// },
			url: apiUrl,
			type: 'POST',
			dataType: 'json',
			data: data,
			success: function (res) {
				if (+res.status === 1) {
					successCallback(res);
				} else {

					if (repeatRequest) {
						countErrorQuery++;
						setTimeout(function () {
							send(options);
						}, timeoutResendQuery);

					} else {
						errorCallback(res);
					}

				}
			},
			error: function (res) {
				if (repeatRequest) {
					countErrorQuery++;
					setTimeout(function () {
						send(options);
					}, timeoutResendQuery);

				} else {
					errorCallback(res);
				}
			},
			timeout: timeoutRequest
		});
	}
}

/**
 * MOCKUP для запросов по процессу
 * @param { Object } options - параметры запроса
 */
function httpRequestMockup(options = {}) {
	const {
		action = '',
		actionStatus = '',
		successCallback = () => {},
		errorCallback = () => {}
	} = options;

	console.log(options);

	const data = {
		status: 1
	};

	switch (action) {
		case 'calculator.Get':
			data.calculator = calculatorData;
			break;
	}

	setTimeout(() => {
		successCallback(data);
		// errorCallback();
	}, 1000);
}

export {
	httpRequest,
	httpRequestMockup
};
import * as $ from 'jquery';
import { numberFormat, declOfNum } from  '../helpers/index';

export default class MortgageView {
    constructor($block) {
        if (!$block.length) return;

        this.$block = $block;
        this.$mortgageForm = this.$block.find('[data-mortgage-form]');

        this.$mortgageSumInput = this.$mortgageForm.find('[name="mortgage_sum"]');
        this.$mortgageTermInput = this.$mortgageForm.find('[name="mortgage_term"]');
        this.$mortgageTermDecorator = this.$mortgageForm.find('#mortgage_term_decorator');
        this.$mortgageInitialFeeInput = this.$mortgageForm.find('[name="mortgage_initial_fee"]');
        this.$mortgagePercentInput = this.$mortgageForm.find('[name="mortgage_percent"]');

        this.JSON = JSON.parse(this.$mortgageForm.attr('data-settings'));

        this.mortgageSumSlider = this.initMortgageSumRangeSlider();
        this.mortgageTermRangeSlider = this.initMortgageTermRangeSlider();
        this.mortgageInitialFeeSlider = this.initMortgageInitialFeeRangeSlider();
        this.mortgagePercentSlider = this.initMortgagePercentRangeSlider();

        this.init();

    }

    init () {
        this.mortgageSumSlider.on('change', (e) => {
            setTimeout(()=> {
                this.calculateMortgage();
                this.checkPriceVal(e.currentTarget.value);

            },10);
        })

        this.mortgageInitialFeeSlider.on('change', (e) => {
            setTimeout(()=> {
                this.calculateMortgage();
                this.checkFeeVal(e.currentTarget.value);

            },10);
        })
    }

    calculateMortgage() {
        const percentVal = +this.$mortgagePercentInput.val() / 12 / 100; //процентная ставка
        const yearsVal = +this.$mortgageTermInput.val(); // период в годах
        const monthVal = yearsVal * 12; // период в месяцаъ
        const sumVal = +this.$mortgageSumInput.val().replace(/\s+/g, ""); //стоимость квартиры
        const initialFeeVal = +this.$mortgageInitialFeeInput.val().replace(/\s+/g, ""); // первоначальный взнос

        const mortgageSum = sumVal  - initialFeeVal;

        const monthPaymentVal = Math.round(mortgageSum * (percentVal + (percentVal / (Math.pow(1 + percentVal, monthVal) - 1))));
        const overPayVal = (monthPaymentVal * monthVal) - mortgageSum;

    }

    checkFeeVal (value) {
        const priceVal = +this.$mortgageSumInput.val().replace(/\s+/g, "");
        const price20 = priceVal * 20 / 100;
        const price80 = priceVal * 80 / 100;

        const sumSlider = $('[name="mortgage_sum_range"]').data('ionRangeSlider');


        if (+value > price80) {
            console.log('сработал взнос');
            const newValue = +value * 100 / 80;
            this.$mortgageSumInput.val(numberFormat(newValue, 0, '', ' '));

            sumSlider.update({
                from: newValue
            });
        }
    }

    checkPriceVal(value) {
        //проверка на корректность суммы квартиры
        //проверяем на попадание в промежуток от 20 до 80% от суммы квартиры

       const priceVal = +value;
       const initialFeeVal = +this.$mortgageInitialFeeInput.val().replace(/\s+/g, "");

       const price20 = priceVal * 20 / 100;
       const price80 = priceVal * 80 / 100;

       const initialFeeSlider = $('[name="mortgage_initial_fee_range"]').data('ionRangeSlider');

        if (initialFeeVal > price80) {
            //var valNew = price*80/100;
            console.log('сработала сумма 1')
            this.$mortgageInitialFeeInput.val(numberFormat(price80, 0, '', ' '));

            initialFeeSlider.update({
                from: price80
            });

        } else if (initialFeeVal < price20) {
            //var valNew = price*20/100;
            console.log('сработала сумма 2')
            this.$mortgageInitialFeeInput.val(numberFormat(price20, 0, '', ' '));

            initialFeeSlider.update({
                from: price20
            });
        }
    }

    initMortgageSumRangeSlider() {
        const mortgageSumInput = this.$mortgageSumInput;

        mortgageSumInput[0].value = numberFormat(this.JSON.default.price,0,' ');

        return $('[name="mortgage_sum_range"]').ionRangeSlider({
            type: "single",
            min: this.JSON.values.minPrice,
            max: this.JSON.values.maxPrice,
            from: this.JSON.default.price,
            step: 50000,
            drag_interval: true,
            prettify_enabled: true,
            prettify_separator: " ",
            onChange: function (data) {
                mortgageSumInput[0].value = data.from_pretty;
            },
        });
    }

    initMortgageTermRangeSlider() {
        const mortgageTermInput = this.$mortgageTermInput;
        const mortgageDecorator = this.$mortgageTermDecorator;
        mortgageTermInput[0].value = this.JSON.default.term;

        return $('[name="mortgage_term_range"]').ionRangeSlider({
            type: "single",
            min: this.JSON.values.minTerm,
            max: this.JSON.values.maxTerm,
            from: this.JSON.default.term,
            step: 1,
            drag_interval: true,
            onChange: function (data) {
                mortgageDecorator[0].dataset.decorator = `${declOfNum(data.from,['год','года','лет'])}`;
                mortgageTermInput[0].value = data.from;
            },
        });
    }

    initMortgageInitialFeeRangeSlider() {
        const mortgageInitialFeeInput = this.$mortgageInitialFeeInput;

        mortgageInitialFeeInput[0].value = numberFormat(this.JSON.default.initialFee,0,' ');

        return $('[name="mortgage_initial_fee_range"]').ionRangeSlider({
            type: "single",
            min: this.JSON.values.minInitialFee,
            max: this.JSON.values.maxInitialFee,
            from: this.JSON.default.initialFee,
            step: 50000,
            drag_interval: true,
            prettify_enabled: true,
            prettify_separator: " ",
            onChange: function (data) {
                mortgageInitialFeeInput[0].value = data.from_pretty;
            },
        });
    }

    initMortgagePercentRangeSlider() {
        const mortgagePercentInput = this.$mortgagePercentInput;
        mortgagePercentInput[0].value = this.JSON.default.percent;

        return $('[name="mortgage_percent_range"]').ionRangeSlider({
            type: "single",
            min: this.JSON.values.minPercent,
            max: this.JSON.values.maxPercent,
            from: this.JSON.default.percent,
            step: 0.1,
            drag_interval: true,
            onChange: function (data) {
                mortgagePercentInput[0].value = data.from;
            },
        });
    }
}

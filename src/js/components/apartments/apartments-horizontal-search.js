import * as $  from 'jquery';
import 'ion-rangeslider';
import { numberFormat, declOfNum } from  '../helpers/index'

export default class ApartmentsHorizontalSearch {
    constructor($block) {
        if (!$block.length) return;
        this.$block = $block;
        this.$filterForm = this.$block.find('[data-filter]');
        //this.$residentialField = this.$filterForm.find('[name="residentials"]');

        this.$roomsField = this.$filterForm.find('[data-rooms]');

        /*Инпаты сумм*/
        this.$sumMin = this.$filterForm.find('[name="sum_min"]');
        this.$sumMinFormatted = this.$filterForm.find('[name="sum_min_formatted"]');
        this.$sumMax = this.$filterForm.find('[name="sum_max"]');
        this.$sumMaxFormatted = this.$filterForm.find('[name="sum_max_formatted"]');

        /*Инпаты площади*/
        this.$areaMin = this.$filterForm.find('[name="square_min"]');
        this.$areaMax = this.$filterForm.find('[name="square_max"]');

        /*Инпаты Этажа*/
        this.$floorMin = this.$filterForm.find('[name="floor_min"]');
        this.$floorMax = this.$filterForm.find('[name="floor_max"]');

        this.$searchResultText = $('#filter_result');

        this.JSON = JSON.parse(this.$block.attr('data-json'));
        this.apartments = this.JSON.apartments;

        this.minMaxValues = this.getMinMaxValues();
        this.sumRangeSlider = this.initPriceRangeSlider();
        this.floorsRangeSlider = this.initFloorsRangeSlider();
        this.squareRangeSlider = this.initAreaRangeSlider();

        this.filterParams = this.getFilterParams();

        this.init();
    }

    init() {

        this.filterApartments();

        this.sumRangeSlider.on('change', (e) => {
            setTimeout(() => {
                this.filterParams = this.getFilterParams();
                this.filterApartments();
            }, 10)
        });

        this.floorsRangeSlider.on('change', (e) => {
            setTimeout(() => {
                this.filterParams = this.getFilterParams();
                this.filterApartments();
            }, 10)
        });

        this.squareRangeSlider.on('change', (e) => {
            setTimeout(() => {
                this.filterParams = this.getFilterParams();
                this.filterApartments();
            }, 10)
        });

        //Переключение комнат
        this.$roomsField.on('click', '.item', (e) => {
            this.handlerChangeRooms(e);

            return false;
        });

        // this.$residentialField.on('change', (e) => {
        //     this.filterParams = this.getFilterParams();
        //     this.filterApartments();
        // });

        // this.$filterForm.on('submit', (e) => {
        //     this.submitForm();
        //
        //     return false;
        // });
    }

    // submitForm() {
    //     const formURL = this.$filterForm[0].dataset['href'];
    //     //const jkID = this.$residentialField.val() || 0;
    //     const $rooms = this.$roomsField.find('.item');
    //     const roomsArr = [];
    //     let roomsString = '';
    //     const minPrice = this.$sumMin.val();
    //     const maxPrice = this.$sumMax.val();
    //
    //     $rooms.each((item, value) => {
    //         if (value.classList.contains('active')) roomsArr.push(value.dataset['room']);
    //     });
    //
    //     if (roomsArr.length) {
    //         roomsString = roomsArr.join(',');
    //     } else {
    //         roomsString = 0;
    //     }
    //
    //     let redirectArr = [
    //         //`?residentials=${jkID}`,
    //         `&rooms=${roomsString}`,
    //         `&sum_min=${minPrice}`,
    //         `&sum_max=${maxPrice}`
    //     ];
    //
    //     redirectArr = redirectArr.join('');
    //
    //     window.location.href = formURL + redirectArr;
    //
    // }

    /**
     *
     */
    filterApartments() {
        let countApartments = 0;

        for (let i = 0; i < this.apartments.length; i++) {
           const apartment = this.apartments[i];
           const {id} = apartment;

           if (this.isAvailableApartment(apartment, this.filterParams)){
               countApartments++;
           }
        }
        const textMessage = `${countApartments} ${declOfNum(countApartments,['квартира','квартиры','квартир'])}`
        this.$searchResultText.html(textMessage);

    }

    /**
     * Проверка доступности квартиры
     * @param {Object} apartment - объект с данными о квартире
     * @param {Object} filter -  объект с параметрами фильтра
     */
    isAvailableApartment(apartment = {}, filter = {}) {
        const {
            fullPrice,
            name,
            jkId
        } = apartment;

        const {
            jkID,
            room = [],
            priceMax,
            priceMin
        } = filter;

        if (fullPrice >= priceMin
            && fullPrice <= priceMax) {

            if (room.length) {
                for (let i = 0; i < room.length; i++) {
                    const item = room[i];

                    if (+name === +item) {
                        if (jkID === +jkId) {
                            return true
                        }
                        if (jkID === 0) {
                            return true
                        }
                    }

                }
            } else {
                if (jkID === +jkId) {
                    return true
                }
                if (jkID === 0) {
                    return true
                }
            }
        } else {
            return false;
        }
    }


    //Переключение квартир
    handlerChangeRooms(e) {
        const element = e.target;

        if (element.classList.contains('active')) {
            element.classList.remove('active');
        } else {
            element.classList.add('active');
        }
        this.filterParams = this.getFilterParams();
        this.filterApartments();
    }


    //Остальное
    //Слайдер сумм
    initPriceRangeSlider() {
        const sumMaxInput = this.$sumMax;
        const sumMaxFormatted = this.$sumMaxFormatted;

        const sumMinInput = this.$sumMin;
        const sumMinFormatted = this.$sumMinFormatted;

        sumMinInput[0].value = this.minMaxValues.minPrice;
        sumMaxInput[0].value = this.minMaxValues.maxPrice;

        sumMinFormatted[0].value = this.minMaxValues.minPriceFormatted;
        sumMaxFormatted[0].value = this.minMaxValues.maxPriceFormatted;


        return $('[name="price_range"]').ionRangeSlider({
            type: "double",
            min: this.minMaxValues.minPrice,
            max: this.minMaxValues.maxPrice,
            from: +sumMinInput[0].value,
            to: +sumMaxInput[0].value,
            drag_interval: true,
            min_interval: null,
            max_interval: null,
            onChange: function (data) {
                sumMinInput[0].value = data.from;
                sumMaxInput[0].value = data.to;

                sumMinFormatted[0].value = numberFormat(data.from/1000000,2,',');
                sumMaxFormatted[0].value = numberFormat(data.to/1000000,2,',');
            },
        });
    }

    initFloorsRangeSlider() {
        const floorsMaxInput = this.$floorMax;
        const floorsMinInput = this.$floorMin;

        floorsMaxInput[0].value = this.minMaxValues.maxFloor;
        floorsMinInput[0].value = this.minMaxValues.minFloor;


        return $('[name="floor_range"]').ionRangeSlider({
            type: "double",
            min: this.minMaxValues.minFloor,
            max: this.minMaxValues.maxFloor,
            from: +floorsMinInput[0].value,
            to: +floorsMaxInput[0].value,
            drag_interval: true,
            min_interval: null,
            max_interval: null,
            onChange: function (data) {
                floorsMinInput[0].value = data.from;
                floorsMaxInput[0].value = data.to;
            },
        });
    }

    initAreaRangeSlider() {
        const areaMaxInput = this.$areaMax;
        const areaMinInput = this.$areaMin;

        areaMaxInput[0].value = this.minMaxValues.maxArea;
        areaMinInput[0].value = this.minMaxValues.minArea;


        return $('[name="square_range"]').ionRangeSlider({
            type: "double",
            min: this.minMaxValues.minArea,
            max: this.minMaxValues.maxArea,
            from: +areaMinInput[0].value,
            to: +areaMaxInput[0].value,
            drag_interval: true,
            min_interval: null,
            max_interval: null,
            onChange: function (data) {
                areaMinInput[0].value = data.from;
                areaMaxInput[0].value = data.to;
            },
        });
    }

    /**
     * Формирования массива всех доступных квартир
     * @returns {Array} - массив квартир
     */
    getApartments() {
        const apartmentsArray = [];
        const apartments = Object.values(this.apartments);

        for (let i = 0; i < apartments.length; i++) {
            const apartment = apartments[i];

            apartmentsArray.push(apartment);
        }

        console.log(apartmentsArray);

        return apartmentsArray;
    }

    /**
     * Получение параметров фильтра
     * @returns {Object}
     */
    getFilterParams() {
        //const jkId = this.$residentialField[0].value;
        const roomButtons = this.$roomsField.find('.item');
        const priceMin = this.$sumMin[0].value;
        const priceMax = this.$sumMax[0].value;

        const floorMin = this.$floorMin[0].value;
        const floorMax = this.$floorMax[0].value;

        const areaMin = this.$areaMin[0].value;
        const areaMax = this.$areaMax[0].value;

        const roomsArr = [];

        roomButtons.each((key, val) => {
            const item = val;
            if (item.classList.contains('active')) {
                roomsArr.push(+item.dataset.room);
            }
        });

        return {
            room: roomsArr,
            priceMin: +priceMin,
            priceMax: +priceMax,
            floorMin: +floorMin,
            floorMax: +floorMax,
            areaMin: +areaMin,
            areaMax: +areaMax
        };
    }

    //Получение минимальных и максимальных значений всего чего можно для инпатов
     getMinMaxValues() {
        let maxPrice = 0,
            minPrice = 0;

        let minFloor = 0,
            maxFloor = 0;

        let minArea = 0,
            maxArea = 0;

        const apartmentsArray = this.getApartments();

        for (let i = 0; i < apartmentsArray.length; i++) {
            if (apartmentsArray[i]['fullPrice'] > apartmentsArray[maxPrice]['fullPrice']) maxPrice = i;
            if (apartmentsArray[i]['fullPrice'] < apartmentsArray[minPrice]['fullPrice']) minPrice = i;

            if (apartmentsArray[i]['floor'] > apartmentsArray[maxFloor]['floor']) maxFloor = i;
            if (apartmentsArray[i]['floor'] < apartmentsArray[minFloor]['floor']) minFloor = i;

            if (apartmentsArray[i]['area'] > apartmentsArray[maxArea]['area']) maxArea = i;
            if (apartmentsArray[i]['area'] < apartmentsArray[minArea]['area']) minArea = i;
        }

        return {
            minPrice: apartmentsArray[minPrice]['fullPrice'],
            maxPrice: apartmentsArray[maxPrice]['fullPrice'],
            minFloor: apartmentsArray[minFloor]['floor'],
            maxFloor: apartmentsArray[maxFloor]['floor'],
            minArea: apartmentsArray[minArea]['area'],
            maxArea: apartmentsArray[maxArea]['area'],
            minPriceFormatted: numberFormat(apartmentsArray[minPrice]['fullPrice']/1000000, 2, ','),
            maxPriceFormatted:  numberFormat(apartmentsArray[maxPrice]['fullPrice']/1000000, 2, ',')
        }
    }

}


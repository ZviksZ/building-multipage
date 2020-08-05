import * as $  from 'jquery';
import 'ion-rangeslider';
import { declOfNum, numberFormat, parseGets } from '../helpers';

export default class ApartmentsSearch {
    constructor($block) {
        if (!$block.length) return;
        this.$block = $block;
        this.$apartmentsWrapper = this.$block.find('[data-apartments-wrapper]')
        this.$filterForm = $('#apartments_search_filter');
        this.$residentialField = this.$filterForm.find('[name="residentials"]');

        this.getParametrs = parseGets();

        this.$roomsField = this.$filterForm.find('[data-rooms]');
        this.$sumMin = this.$filterForm.find('[name="sum_min"]');
        this.$sumMinFormatted = this.$filterForm.find('[name="sum_min_formatted"]');
        this.$sumMax = this.$filterForm.find('[name="sum_max"]');
        this.$sumMaxFormatted = this.$filterForm.find('[name="sum_max_formatted"]');
        this.$searchResultText = this.$filterForm.find('[data-filter-result]');

        this.$mobileFilterToggle = this.$block.find('.apartments-filter-toggle');
        this.$mobileFilterClose = this.$filterForm.find('[data-close-filter]');

        this.JSON = JSON.parse(this.$block.attr('data-json'));
        this.apartments = this.JSON.apartments;
        this.minMaxSums = this.getMinMaxSums();

        this.filterParams = this.getFilterParams();

        this.roomsName = ['Студия', 'Однокомнатная', 'Двухкомнатная', 'Трехкомнатная', 'Четырехкомнатная', 'Пятикомнатная'];

        this.sumRangeSlider = this.initRangeSlider();


        this.init();
    }

    init() {
        this.isFilterVisible();
        this.renderApartments();

        this.setFilterParams();
        this.filterParams = this.getFilterParams();

        this.filterApartments();
        this.setFilterPosition();

        this.sumRangeSlider.on('change', (e) => {
            setTimeout(() => {
                this.filterParams = this.getFilterParams();
                this.filterApartments();
            }, 10)

        });

        $(window)
            .on('resize', (e) => {
                this.isFilterVisible();
                this.setFilterPosition();
            }).on('scroll', (e) => {
                this.setFilterPosition();
            });


        this.$mobileFilterToggle.on('click', (e) => {
            this.$filterForm.addClass('open-filter');
            this.filterApartments();

            setTimeout(() => {
                $('html').addClass('open-modal-effect');
                this.$filterForm.addClass('show');
            }, 5);
            return false;
        });

        this.$mobileFilterClose.on('click', (e) => {
            $('html').removeClass('open-modal-effect');
            this.$filterForm.removeClass('show');

            setTimeout(() => {
                this.$filterForm.removeClass('open-filter');
            }, 500);
            return false;
        });

        //Переключение комнат
        this.$roomsField.on('click', '.item', (e) => {
            this.handlerChangeRooms(e);

            return false;
        });

        this.$residentialField.on('change', (e) => {
            this.filterParams = this.getFilterParams();
            this.filterApartments();
        });

    }

    isFilterVisible () {
         if (this.isDesktop()) {
             this.$filterForm.addClass('visible');
         } else {
             this.$filterForm.removeClass('visible');
         }
    }

    /**
     *
     */
    filterApartments() {
        let countApartments = 0;

        for (let i = 0; i < this.apartments.length; i++) {
           const apartment = this.apartments[i];
           const {id} = apartment;

           if (this.isAvailableApartment(apartment, this.filterParams)){
               $(`#${id}`).removeClass('disabled');
               countApartments++;
           } else  {
               $(`#${id}`).addClass('disabled');
           }
        }
        const textMessage = `${declOfNum(countApartments,['Найдена','Найдено','Найдено'])} ${countApartments} ${declOfNum(countApartments,['квартира','квартиры','квартир'])}`
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

    /**
     * Формирование HTML квартир
     */
    renderApartments() {
        return this.renderList();
    }

    //Список квартир
    /**
     * Формирование HTML списка квартир
     */
    renderList() {
        let list = '';
        let result = '';

        const apartments = Object.values(this.apartments);

        for (let i = 0; i < apartments.length; i++) {
            const item = apartments[i];

            result += this.renderListItem(item);
        }

        if (!result) return;

        list = `<div class="apartments-list">
                    ${result}
                </div>`;

        this.$apartmentsWrapper.html(list);
    }

    /**
     * Формирование HTML карточки квартиры для списка
     * @returns {string}
     */
    renderListItem(apartment) {
        if (!apartment) return '';
        const {
            id,
            url,
            jkId,
            jkName,
            deadline,
            section,
            floor,
            area,
            img,
            name,
            number,
            fullPrice,
            squarePrice
        } = apartment;

        return  `<a class="apartment-item search-item" href="${url}" id="${id}" data-room="${name}" data-jk-id="${jkId}">
                            <div class="image">
                                <img src="${img}" alt="">
                            </div>
                            <div class="info">
                                <div class="heading hide-mobile">
                                    <div class="name">${jkName}</div>
                                    <div class="name">Секция ${section}</div>
                                    <div class="name">Этаж ${floor}</div>
                                </div>
                                <div class="room-name">${this.roomsName[name]} №${number}</div>
                                <div class="info-footer">
                                    <div class="square color-red">${area} м <sup>2</sup> <div class="deadline hide-mobile">${deadline}</div></div>
                                    <div class="deadline hide-desktop">${deadline}</div>
                                </div>
                                <div class="info-footer">
                                    <div class="name hide-desktop">${jkName}</div>
                                    <div class="name hide-desktop">Секция ${section}</div>
                                    <div class="name hide-desktop">Этаж ${floor}</div>
                                </div>
                            </div>
                            <div class="price">
                                <div class="full-price">${numberFormat(fullPrice)} ₽</div>
                                <div class="square-price">${numberFormat(squarePrice)} за м <sup>2</sup></div>
                       </div>
                </a>`;

    }
    //END список квартир



    //Остальное
    //Слайдер сумм
    initRangeSlider() {
        const sumMaxInput = this.$sumMax;
        const sumMaxFormatted = this.$sumMaxFormatted;

        const sumMinInput = this.$sumMin;
        const sumMinFormatted = this.$sumMinFormatted;

        sumMinInput[0].value = this.minMaxSums.minPrice;
        sumMaxInput[0].value = this.minMaxSums.maxPrice;

        sumMinFormatted[0].value = this.minMaxSums.minPriceFormatted + ' млн.';
        sumMaxFormatted[0].value = this.minMaxSums.maxPriceFormatted + ' млн.';


        return $('[name="search_range"]').ionRangeSlider({
            type: "double",
            min: this.minMaxSums.minPrice,
            max: this.minMaxSums.maxPrice,
            from: +sumMinInput[0].value,
            to: +sumMaxInput[0].value,
            drag_interval: true,
            min_interval: null,
            max_interval: null,
            onChange: function (data) {
                sumMinInput[0].value = data.from;
                sumMaxInput[0].value = data.to;

                sumMinFormatted[0].value = numberFormat(data.from/1000000,2,',') + ' млн.';
                sumMaxFormatted[0].value = numberFormat(data.to/1000000,2,',') + ' млн.';
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

        return apartmentsArray;
    }

    setFilterParams() {
        const params = this.getParametrs;
        if (!Object.values(params)) return;

        const {
            residentials = 0,
            rooms = [],
            sum_max = 0,
            sum_min = 0
        }  = params;

        let roomsArr = [];

        if (+residentials !== 0) this.$residentialField[0].value = residentials;

        if (rooms.length) {
            roomsArr = rooms.split(',');

            for (let i = 0; i < roomsArr.length; i++) {
                const item = roomsArr[i];
                this.$filterForm.find(`[data-room="${item}"]`).addClass('active').trigger('click');
            }
        }

        if (sum_min && sum_max) {
            this.sumRangeSlider.data('ionRangeSlider').update({
                from: sum_min,
                to: sum_max
            });
        }

        if (sum_max) this.$sumMaxFormatted[0].value = numberFormat(sum_max/1000000,2,',') + ' млн.';
        if (sum_min) this.$sumMinFormatted[0].value = numberFormat(sum_min/1000000,2,',') + ' млн.';
        this.filterApartments();
    }

    /**
     * Получение параметров фильтра
     * @returns {Object}
     */
    getFilterParams() {
        const jkId = this.$residentialField[0].value;
        const roomButtons = this.$roomsField.find('.item');
        const priceMin = this.$sumMin[0].value;
        const priceMax = this.$sumMax[0].value;

        const roomsArr = [];

        roomButtons.each((key, val) => {
            const item = val;
            if (item.classList.contains('active')) {
                roomsArr.push(+item.dataset.room);
            }
        });

        return {
            jkID: +jkId,
            room: roomsArr,
            priceMin: +priceMin,
            priceMax: +priceMax
        };
    }

    /**
     * Определение десктопа
     * @returns {boolean}
     */
    isDesktop() {
        return (window.innerWidth > 1000);
    }

    //Позиционирование фильтра на десктопе
    setFilterPosition() {
        if (this.isDesktop) {
            const apartmentsOffsetTop = this.$apartmentsWrapper.offset().top;
            const windowScrollTop = +$(window).scrollTop();
            const headerHeight = $('#header').height();
            const offsetLeft = +this.$block.offset().left;

            let sidebarTop =  apartmentsOffsetTop - windowScrollTop;
            let filterWrapperBottom = this.$apartmentsWrapper.height() - windowScrollTop - apartmentsOffsetTop - headerHeight;

            if (sidebarTop < headerHeight) sidebarTop = headerHeight;

            if (filterWrapperBottom <= 0) {
                sidebarTop =  this.$block.height() - windowScrollTop - 94 - this.$filterForm.height() / 2;
            }

            this.$filterForm.css({
                'top': sidebarTop + 'px',
                'left': offsetLeft + 'px'
            });
        }
    }

    //Получение минимальных и максимальных значений цен
     getMinMaxSums() {
        let maxPrice = 0,
            minPrice = 0;
        const apartmentsArray = this.getApartments();

        for (let i = 0; i < apartmentsArray.length; i++) {
            if (apartmentsArray[i]['fullPrice'] > apartmentsArray[maxPrice]['fullPrice']) maxPrice = i;
            if (apartmentsArray[i]['fullPrice'] < apartmentsArray[minPrice]['fullPrice']) minPrice = i;
        }

        return {
            minPrice: apartmentsArray[minPrice]['fullPrice'],
            maxPrice: apartmentsArray[maxPrice]['fullPrice'],
            minPriceFormatted: numberFormat(apartmentsArray[minPrice]['fullPrice']/1000000, 2, ','),
            maxPriceFormatted:  numberFormat(apartmentsArray[maxPrice]['fullPrice']/1000000, 2, ',')
        }
    }

}


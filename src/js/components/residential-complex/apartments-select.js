import * as $  from 'jquery';
import 'ion-rangeslider';
import { declOfNum, numberFormat } from '../helpers';

export default class ApartmentsSelect {
    constructor($block) {
        if (!$block.length) return;
        this.$block = $block;
        this.$apartmentsWrapper = this.$block.find('[data-apartments-wrapper]')
        this.$switchers = $block.find('[data-switchers]');
        this.$filterForm = $('#apartments_filter');
        this.$sectionsField = this.$filterForm.find('[name="sections"]');
        this.$roomsField = this.$filterForm.find('[data-rooms]');
        this.$sumMin = this.$filterForm.find('[name="sum_min"]');
        this.$sumMinFormatted = this.$filterForm.find('[name="sum_min_formatted"]');
        this.$sumMax = this.$filterForm.find('[name="sum_max"]');
        this.$sumMaxFormatted = this.$filterForm.find('[name="sum_max_formatted"]');
        this.$searchResultText = this.$filterForm.find('[data-filter-result]');
        this.$legend = this.$block.find('[data-legend]');
        this.$mobileFilterToggle = this.$block.find('.apartments-filter-toggle');
        this.$mobileFilterClose = this.$filterForm.find('[data-close-filter]');
        this.$previewImg = this.$filterForm.find('.preview-wrapper img');
        this.downloadPlanBtns = $('a.download-btn');

        this.sections = JSON.parse(this.$block.attr('data-json'));
        this.section = this.getSectionInfo();
        this.floors = this.getFloors();
        this.viewType = this.$block.attr('data-view-type') || 'list';
        this.apartments = this.getApartments();
        this.minMaxSums = this.getMinMaxSums();
        this.filterParams = this.getFilterParams();
        this.maxApartmentsLenght = this.getFloorMaxApartmentsCount();

        this.roomsName = ['Студия', 'Однокомнатная', 'Двухкомнатная', 'Трехкомнатная', 'Четырехкомнатная', 'Пятикомнатная'];
        this.statusClasses = ['sold-out', 'on-sale', 'hold'];
        this.statusNames = ['Продана','В продаже', 'Забронирована']

        this.sumRangeSlider = this.initRangeSlider();

        this.desktop = null;

        this.init();
    }

    init() {
        this.$popupInfo = this.createPopup();
        this.$popupInfoContent = this.$popupInfo.find('.content');

        this.isFilterVisible();
        this.initEventsHandler();
        this.renderApartments();

        this.setFilterPosition();

        this.filterApartments();
        this.setSectionPlan();
        this.setSectionPlanPdf();

        this.sumRangeSlider.on('change', (e) => {
            setTimeout(() => {
                this.filterParams = this.getFilterParams();
                this.filterApartments();
            }, 10)
        });

        $(window)
            .on('mousemove', (e) => {
                this.setPopupPosition(e);
            })
            .on('resize', (e) => {
                this.isFilterVisible();
                this.setFilterPosition();
                this.initEventsHandler();
            }).on('scroll', (e) => {
                this.setFilterPosition();
            });

        // закрытие тултипа
        $('body').on('click', '[data-close-popup-info]', () => {
            this.hidePopup();
            return false;
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

        //Переключение табов
        this.$switchers.on('click', '.item', (e) => {
            this.handlerChangeSwitcher(e);

            return false;
        });

        //Переключение комнат
        this.$roomsField.on('click', '.item', (e) => {
            this.handlerChangeRooms(e);

            return false;
        });

        this.$sectionsField.on('change', (e) => {
            this.updateApartments();
        });

    }


    setSectionPlan() {
        let section = this.getSectionInfo()

        this.$previewImg.attr('src', section.sectionPlan)
    }

    setSectionPlanPdf() {
        let section = this.getSectionInfo()

        this.downloadPlanBtns.attr('href', section.sectionPlanPdf)
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
               if (apartment.status == 1) {
                  countApartments++;
               }

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
            status,
        } = apartment;

        const {
            room = [],
            priceMax,
            priceMin
        } = filter;

        //if (+status !== 1) return false;

        if (fullPrice >= priceMin
            && fullPrice <= priceMax) {

            if (room.length) {
                for (let i = 0; i < room.length; i++) {
                    const item = room[i];

                    if (+name === +item) return true;
                }
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    initEventsHandler() {
        const desktop = this.isDesktop();
        if (desktop !== this.desktop) this.desktop = desktop;

        this.$block.off('mouseenter', '.apartments-scheme .apartment-item.room');
        this.$block.off('mouseleave', '.apartments-scheme .apartment-item.room');
        this.$block.off('click', '.apartments-scheme .apartment-item.room');

        if (this.desktop) {
            this.$block
                .on('mouseenter', '.apartments-scheme .apartment-item.room', e => {
                    //console.log(e.currentTarget)
                    this.handlerMouseenter(e.currentTarget);
                })
                .on('mouseleave', '.apartments-scheme .apartment-item.room', e => {
                    this.handlerMouseleave(e.currentTarget);
                })
                .on('click', '.apartments-scheme .apartment-item.room', e => {
                    this.handlerClick(e.currentTarget);
                    return false;
                });

        } else {
            this.$block.on('click', '.apartments-scheme .apartment-item.room', e => {
                this.handlerClickMobile(e.currentTarget);
                return false;
            });
        }

    }

    /**
     * Обновление всех данных по секции
     */
    updateApartments() {
        console.log('update');

        this.floors = this.getFloors();
        this.apartments = this.getApartments();
        this.minMaxSums = this.getMinMaxSums();
        this.sumRangeSlider = this.initRangeSlider();
        this.filterParams = this.getFilterParams();

        console.log(this.filterParams, this.minMaxSums);
        this.renderApartments();
        this.setSectionPlan();
        this.setSectionPlanPdf();
        this.setFilterPosition();
        this.filterApartments();
    }



    /**
     * Переключение вида
     * @param e
     * @returns {boolean}
     */
    handlerChangeSwitcher(e) {
        const element = e.target;
        if (element.classList.contains('active')) return false;

        this.viewType = element.dataset.type;

        this.$switchers.find(`.item[data-type="${this.viewType}"]`).addClass('active').siblings().removeClass('active');
        this.renderApartments();
        this.filterApartments();
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
        if (this.viewType === 'list') return this.renderList();
        if (this.viewType === 'scheme') return this.renderScheme();
    }

    //Список квартир
    /**
     * Формирование HTML списка квартир
     */
    renderList() {
        let list = '';
        let result = '';

        let apartments = Object.values(this.apartments);
        apartments = apartments.sort((a, b) => +a.fullPrice > +b.fullPrice ? 1 : -1);

        for (let i = 0; i < apartments.length; i++) {
            const item = apartments[i];

            result += this.renderListItem(item);
        }

        if (!result) return;

        list = `<div class="apartments-list">
                    ${result}
                </div>`;

        this.$legend.hide();
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
            area,
            img,
            name,
            floor,
            number,
            fullPrice,
            squarePrice,
            status
        } = apartment;

        const sectionName = this.getSectionInfo().sectionName;

        //Если квартира продана или забронирована, не выводим
        if (status === 0 || status === 2) return '';

        return  `<a class="apartment-item" href="${url}" id="${id}" data-room="${name}">
                            <div class="image">
                                <img src="${img}" alt="">
                            </div>
                            <div class="info">
                                <div class="heading hide-mobile">
                                    <div class="name">${sectionName}</div>
                                    <div class="name">Этаж ${floor}</div>
                                </div>
                                <div class="room-name">${this.roomsName[name]} №${number}</div>
                                <div class="info-footer">
                                    <div class="square">${area} м <sup>2</sup></div>
                                    <div class="name hide-desktop">${sectionName}</div>
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


    //Схема квартир
    /**
     * Формирование HTML схемы квартир
     */
    renderScheme() {
        let floors = Object.values(this.floors);

        floors = floors.sort((a, b) => +a.name > +b.name ? 1 : -1);

        let scheme = '';
        let result = '';

        for (let i = 0; i < floors.length; i++) {
            let item = floors[i];

            item = {...item, apartments: item.apartments.sort((a, b) => +a.number > +b.number ? 1 : -1)}
            result += this.renderFloor(item);
        }

        if (!result) return '<p>Ничего не найдено.</p>';

        let lowApartmentsClass = '';
        if (this.maxApartmentsLenght < 8) lowApartmentsClass = 'less-eight'

        scheme = `<div class="apartments-scheme ${lowApartmentsClass}">
                    <div class="apartments-scheme-body">
                            <div class="apartments-floors" data-section="${this.getSectionInfo().sectionName}">
                              ${result}
                            </div>
                
                        </div>
                        <div class="apartments-legend hide-desktop">
                            <div class="item in-sale">В продаже</div>
                            <div class="item hold">Забронирована</div>
                            <div class="item sold-out">Продана</div>
                        </div>
                </div>`;

       this.$legend.css({'display': 'flex'});
       this.$apartmentsWrapper.html(scheme);
    }

    /**
     * Формирования HTML этажа
     */
    renderFloor(floor) {
        if (!floor) return '';
        const {
            id,
            name,
            apartments
        } = floor;

        let result = '';

        for (let i = 0; i < apartments.length; i++) {
            const item = apartments[i];

            result += ` <div class="apartment-item name">${name}</div> ${this.renderFloorItem(item)}`;
        }

        if (!result) return '';

        return `<div class="floor-item">
                    ${result}
                </div>`;
    }

    /**
     * Формирование HTML квартиры
     */
    renderFloorItem(apartment) {
        if (!apartment) return '';

        const {
            id,
            status,
            area,
            fullPrice,
            img,
            name,
            number,
            url
        } = apartment;

        return  `<div class="apartment-item room ${this.statusClasses[status]}" 
                    id="${id}"
                    data-url="${url}" 
                    data-name="${this.roomsName[name]} №${number}" 
                    data-room="${name}" 
                    data-area="${area}" 
                    data-price="${fullPrice}" 
                    data-img="${img}"
                    data-status="${status}">
                    ${name}
                 </div>`;
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


        return $('[name="section_range"]').ionRangeSlider({
            type: "double",
            min: this.minMaxSums.minPrice,
            max: this.minMaxSums.maxPrice,
            from: this.minMaxSums.minPrice,
            to: this.minMaxSums.maxPrice,
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
        const floors = Object.values(this.floors);

        for (let i = 0; i < floors.length; i++) {
            const item = floors[i];

            const {
                apartments,
                name
            } = item;

            for (let count = 0; count < apartments.length; count++) {
                const apartment = apartments[count];
                //Добавляем к квартире этаж
                apartment.floor = name;
                apartmentsArray.push(apartment);
            }

        }

        return apartmentsArray;
    }

    /**
     * Получение параметров фильтра
     * @returns {Object}
     */
    getFilterParams() {
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
            room: roomsArr,
            priceMin: +priceMin,
            priceMax: +priceMax
        };
    }

    /**
     * Получение объекта всех этажей
     */
    getFloors() {
        const section = this.$sectionsField.val();

        return this.sections[`k${section}`].floors;
    }

    getFloorMaxApartmentsCount() {
        const floors = this.floors;
        let maxApartmentsCount = 0;

        for (let i = 0; i < Object.keys(floors).length; i++) {
            const floor = floors[`k${i}`];
            if (!floor) continue;
            const apartments = floor.apartments;

            if (maxApartmentsCount < apartments.length) maxApartmentsCount = apartments.length;
        }

        return maxApartmentsCount;
    }

    /**
     * Получение объекта информации о секции
     * @returns {{sectionName: *, id: *}}
     */
    getSectionInfo() {
        const section = this.$sectionsField.val();
        const sectionObj = this.sections[`k${section}`];


        return {
            id: sectionObj.id,
            sectionName: sectionObj.name,
            sectionPlan: sectionObj.plan,
            sectionPlanPdf: sectionObj.planPdf
        }
    }

    /**
     * Обработчик наведения на объект
     * @param {Object} item - svg.js объект
     */
    handlerMouseenter(item) {
        this.setDataPopup(item);
        this.showPopup();
    }

    /**
     * Обработчик ухода курсора с объекта
     * @param {Object} item - svg.js объект
     */
    handlerMouseleave(item) {
        this.hidePopup();
    }

    /**
     * Обработчик клика на объект - десктоп
     * @param {Object} item - svg.js объект
     */
    handlerClick(item) {
        window.location.href = item.dataset.url;
        return false;
    }

    /**
     * Обработчик клика на объект - мобильные устройства
     * @param {Object} item - svg.js объект
     */
    handlerClickMobile(item) {
        // открываем попап
        this.setDataPopup(item);
        this.showPopup();
    }

    /**
     * Позиционирование тултипа
     * @param {Object} e - объект с параметрами курсора
     */
    setPopupPosition(e) {
        const mouseX = e.clientX + document.body.scrollLeft;
        const mouseY = e.clientY + document.body.scrollTop;

        let top = mouseY + 25;
        let left = mouseX + 15;
        const tooltipHeight = this.$popupInfo.height() + 30;
        const tooltipWidth = this.$popupInfo.width() + 15;

        //условия, чтобы тултип не ушел за вьюпорт
        if ( (mouseY + tooltipHeight) > $(window).height()) {
            top = top - tooltipHeight;
        }

        if ( (mouseX + tooltipWidth) > $(window).width()) {
            left = left - tooltipWidth;
        }

        const style = {
            left: `${left}px`,
            top: `${top}px`
        };

        this.$popupInfo.css(style);
    }

    /**
     * Показ тултипа
     */
    showPopup() {
        this.$popupInfo.addClass('show');
        setTimeout(() => {
            this.$popupInfo.addClass('show-effect');
        }, 5);
    }

    /**
     * Закрытие тултипа
     */
    hidePopup() {
        if (this.desktop) {
            this.$popupInfo.removeClass('show show-effect');
            this.clearPopup();

        } else {
            this.$popupInfo.removeClass('show-effect');
            setTimeout(() => {
                this.$popupInfo.removeClass('show');
                this.clearPopup();
            }, 400);
        }
    }

    /**
     * Создание тултипа
     * @return {HTMLElement} созданный тултип
     */
    createPopup() {
        $('body').append(`
            <div id="popup_info" class="popup-info">
                <div class="content content-with-image"></div>
            </div>
        `);

        return $('#popup_info');
    }

    /**
     * Добавление данных в тултип
     * @param {Object} item - svg.js объект
     */
    setDataPopup(item = {}) {
        const href = item.dataset.url;
        const name = item.dataset.name;
        const price = item.dataset.price;
        const image = item.dataset.img || {};
        const area = item.dataset.area || {};
        const status = +item.dataset.status;

        const headHTML = `
            <div class="head">
                <p class="text big">${name}</p>
                <a href="#" class="close hide-desktop" data-close-popup-info><i class="icon icon-close1"></i></a>
            </div>
        `;

        let apartmentsHTML = '';
        const statusName = this.statusNames[status];

        let priceHTML = `<span class="text text-red margin-top center-mob">${numberFormat(price)} ₽ </span>`;

        if (status === 0 || status === 2) {
            priceHTML = `<span class="text text-red margin-top center-mob">${statusName}</span>`;
        }

        apartmentsHTML += `
                    <div class="item item-with-image">
                        <span class="text text-gray">${area} м<sup>2</sup></span>
                        <img class="image" src=${image} alt="">                
                        ${priceHTML}                  
                     </div>`;

        apartmentsHTML = `<div>${apartmentsHTML}</div>`;

        const buttonHTML = `
            <div class="text-align-center hide-desktop">
                <a href="${href}" class="button inline margin-top margin-bottom-x2 no-margin-horizontal">Продолжить</a>
            </div>
        `;

        const popupHTML = headHTML + apartmentsHTML + buttonHTML;
        this.$popupInfoContent.html(popupHTML);
    }

    /**
     * Очистка HTML тултипа
     */
    clearPopup() {
        this.$popupInfoContent.html('');
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


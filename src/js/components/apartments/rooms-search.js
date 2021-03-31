import * as $ from 'jquery';
import 'ion-rangeslider';
import { numberFormat, declOfNum } from '../helpers/index';
import * as _ from 'lodash'

export class RoomsSearch {
   constructor($block) {
      if ($block.length === 0) return;
      this.$block = $block;
      this.$filterForm = this.$block.find('[data-filter]');
      this.$apartmentsWrapper = this.$block.parents().find('[data-apartments-wrapper]');

      this.$roomsField = this.$filterForm.find('[data-rooms]');

      this.$filterSort = this.$block.parents().find('#filter_sort');

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

      /*Срок сдачи селект*/
      this.$deadlineSelect = this.$filterForm.find('[name="deadline"]');

      this.$searchResultText = $('#filter_result');
      this.$searchResultBtn = $('#filter_result-btn');

      this.JSON = JSON.parse(this.$block.attr('data-json'));
      this.apartments = this.JSON.apartments;

      this.minMaxValues = this.getMinMaxValues();
      this.sumRangeSlider = this.initPriceRangeSlider();
      this.floorsRangeSlider = this.initFloorsRangeSlider();
      this.areaRangeSlider = this.initAreaRangeSlider();

      this.filterParams = this.getFilterParams();

      this.roomsName = ['Ст.', '1', '2', '3', '4', '5'];

      this.showFilterBtn = $('#show-room-filter-btn');
      this.hideFilterBtn = $('#hide-room-filter-btn');

      this.init();
   }

   init() {
      this.getUniqueApartments();

      this.renderApartments();
      this.filterApartments();

      this.sumRangeSlider.on('change', e => {
         setTimeout(() => {
            this.filterParams = this.getFilterParams();
            this.filterApartments();
         }, 10);
      });

      this.floorsRangeSlider.on('change', e => {
         setTimeout(() => {
            this.filterParams = this.getFilterParams();
            this.filterApartments();
         }, 10);
      });

      this.areaRangeSlider.on('change', e => {
         setTimeout(() => {
            this.filterParams = this.getFilterParams();
            this.filterApartments();
         }, 10);
      });

      //Переключение комнат
      this.$roomsField.on('click', '.item', e => {
         this.handlerChangeRooms(e);
         return false;
      });

      this.$deadlineSelect.on('change', e => {
         this.filterParams = this.getFilterParams();
         this.filterApartments();
         return false;
      });

      this.$filterSort.on('click', '.sort-item', e => {
         const $this = e.currentTarget;

         this.handlerSortApartments($this);

         return false;
      });

      this.showFilterBtn.on('click', e => {
         $('body').addClass('show-room-filter');
      });
      this.hideFilterBtn.on('click', e => {
         $('body').removeClass('show-room-filter');
      });

      this.$searchResultBtn.on('click', this.setDisabledApartmentsOnMobile);
   }

   handlerSortApartments(element) {
      if (element.classList.contains('active')) {
         if (element.dataset.sort === 'asc') {
            element.dataset.sort = 'desc';
         } else {
            element.dataset.sort = 'asc';
         }
      } else {
         element.classList.add('active');

         if (element.nextElementSibling) element.nextElementSibling.classList.remove('active');
         if (element.previousElementSibling) element.previousElementSibling.classList.remove('active');
      }

      const sortType = element.dataset.type;
      const sortDirection = element.dataset.sort;

      this.renderList({
         type: sortType,
         direction: sortDirection
      });

      this.filterApartments();
   }

   sortApartments() {
      for (let i = 0; i < this.apartments.length; i++) {
         const apartment = this.apartments[i];
         const { id } = apartment;

         if (this.isAvailableApartment(apartment, this.filterParams)) {
            $(`#${id}`).removeClass('disabled');
         } else {
            $(`#${id}`).addClass('disabled');
         }
      }
   }

   /**
    * Фильтрация элементов на странице в моб версии при клике на кнопку
    */
   setDisabledApartmentsOnMobile = () => {
      let countApartments = 0;
      for (let i = 0; i < this.apartments.length; i++) {
         const apartment = this.apartments[i];
         const { id } = apartment;

         if (this.isAvailableApartment(apartment, this.filterParams)) {
            $(`#${id}`).removeClass('disabled');
            countApartments++;
         } else {
            $(`#${id}`).addClass('disabled');
         }
      }
      const textMessage = `${countApartments} ${declOfNum(countApartments, ['квартира', 'квартиры', 'квартир'])}`;
      this.$searchResultText.html(textMessage);
      $('body').removeClass('show-room-filter');
   };

   /**
    *
    */
   filterApartments() {
      let countApartments = 0;

      if ($('body').hasClass('show-room-filter')) {
         for (let i = 0; i < this.apartments.length; i++) {
            const apartment = this.apartments[i];
            if (this.isAvailableApartment(apartment, this.filterParams)) {
               countApartments++;
            }
         }
         const textMessage = `${countApartments} ${declOfNum(countApartments, ['квартира', 'квартиры', 'квартир'])}`;

         this.$searchResultBtn.html('Показать ' + textMessage);
      } else {
         for (let i = 0; i < this.apartments.length; i++) {
            const apartment = this.apartments[i];
            const { id } = apartment;

            if (this.isAvailableApartment(apartment, this.filterParams)) {
               $(`#${id}`).removeClass('disabled');
               countApartments++;
            } else {
               $(`#${id}`).addClass('disabled');
            }
         }
         const textMessage = `${countApartments} ${declOfNum(countApartments, ['квартира', 'квартиры', 'квартир'])}`;
         this.$searchResultText.html(textMessage);
         this.$searchResultBtn.html('Показать ' + textMessage);
      }
   }

   /**
    * Проверка доступности квартиры
    * @param {Object} apartment - объект с данными о квартире
    * @param {Object} filter -  объект с параметрами фильтра
    */
   isAvailableApartment(apartment = {}, filter = {}) {
      const { fullPrice, name, area, floor, deadline } = apartment;

      const { room = [], priceMax, priceMin, floorMin, floorMax, areaMin, areaMax, deadlineValue } = filter;

      const apartmentDeadline = deadline.value;

      const isPrice = fullPrice >= priceMin && fullPrice <= priceMax;
      const isArea = area >= areaMin && area <= areaMax;
      let isFloor;
      let isFullPrice;

      if (Array.isArray(floor)) {
         isFloor = floor.some(item => item >= floorMin && item <= floorMax)
      } else {
         isFloor = floor >= floorMin && floor <= floorMax;
      }

      if (Array.isArray(fullPrice)) {
         isFullPrice = fullPrice.some(item => item >= priceMin && item <= priceMax)
      } else {
         isFullPrice = fullPrice >= priceMin && fullPrice <= priceMax;
      }

      let isDeadline = apartmentDeadline >= deadlineValue && apartmentDeadline <= deadlineValue;

      if (+deadlineValue === 0) isDeadline = true;

      if (isFullPrice && isArea && isFloor && isDeadline) {
         if (isRoomLength(room)) return true;
      } else {
         return false;
      }

      /*
        Функция проверки на необходимость вывода квартиры по определенным комнатам, если пусто, то возвращает все
         */
      function isRoomLength(rooms) {
         if (rooms.length) {
            for (let i = 0; i < rooms.length; i++) {
               const item = room[i];

               if (+name === +item) {
                  return true;
               }
            }
         } else {
            return true;
         }
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
         type: 'double',
         min: this.minMaxValues.minPrice,
         max: this.minMaxValues.maxPrice,
         from: +sumMinInput[0].value,
         to: +sumMaxInput[0].value,
         drag_interval: true,
         min_interval: null,
         max_interval: null,
         onChange: function(data) {
            sumMinInput[0].value = data.from;
            sumMaxInput[0].value = data.to;

            sumMinFormatted[0].value = numberFormat(data.from / 1000000, 2, ',');
            sumMaxFormatted[0].value = numberFormat(data.to / 1000000, 2, ',');
         }
      });
   }

   initFloorsRangeSlider() {
      const floorsMaxInput = this.$floorMax;
      const floorsMinInput = this.$floorMin;

      floorsMaxInput[0].value = this.minMaxValues.maxFloor;
      floorsMinInput[0].value = this.minMaxValues.minFloor;

      return $('[name="floor_range"]').ionRangeSlider({
         type: 'double',
         min: this.minMaxValues.minFloor,
         max: this.minMaxValues.maxFloor,
         from: +floorsMinInput[0].value,
         to: +floorsMaxInput[0].value,
         drag_interval: true,
         min_interval: null,
         max_interval: null,
         onChange: function(data) {
            floorsMinInput[0].value = data.from;
            floorsMaxInput[0].value = data.to;
         }
      });
   }

   initAreaRangeSlider() {
      const areaMaxInput = this.$areaMax;
      const areaMinInput = this.$areaMin;

      areaMaxInput[0].value = this.minMaxValues.maxArea;
      areaMinInput[0].value = this.minMaxValues.minArea;

      return $('[name="square_range"]').ionRangeSlider({
         type: 'double',
         step: 0.1,
         min: this.minMaxValues.minArea,
         max: this.minMaxValues.maxArea,
         from: +areaMinInput[0].value,
         to: +areaMaxInput[0].value,
         drag_interval: true,
         min_interval: null,
         max_interval: null,
         onChange: function(data) {
            areaMinInput[0].value = data.from;
            areaMaxInput[0].value = data.to;
         }
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

      const deadline = this.$deadlineSelect[0].value;

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
         areaMax: +areaMax,
         deadlineValue: deadline
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
         minPriceFormatted: numberFormat(apartmentsArray[minPrice]['fullPrice'] / 1000000, 2, ','),
         maxPriceFormatted: numberFormat(apartmentsArray[maxPrice]['fullPrice'] / 1000000, 2, ',')
      };
   }

   /**
    * Убираем однотипные квартиры
    */
   getUniqueApartments = () => {
      let uniqueApartments = [];
      let filter = [];

      this.apartments.forEach(item => {
         const stringifyItem = this.getStringifyForCompare(item);

         if (!filter.includes(stringifyItem)) {
            uniqueApartments.push(item);
            filter.push(stringifyItem);
         } else {
            for (let i = 0; i < uniqueApartments.length; i++) {
               const stringifyApartment = this.getStringifyForCompare(uniqueApartments[i])
               if (stringifyApartment === stringifyItem) {
                  const {floor, fullPrice} = uniqueApartments[i]

                  if (Array.isArray(fullPrice)) {
                     uniqueApartments[i].fullPrice = [...fullPrice, item.fullPrice]
                  } else {
                     uniqueApartments[i].fullPrice = [fullPrice, item.fullPrice]
                  }

                  if (Array.isArray(floor)) {
                     uniqueApartments[i].floor = [...floor, item.floor]
                  } else {
                     uniqueApartments[i].floor = [floor, item.floor]
                  }
               }
            }
         }
      });

      this.apartments = uniqueApartments;
   }

   getStringifyForCompare = item => {
      const { area, house, section, deadline, decoration, name } = item;
      return JSON.stringify({area, house, section, deadline, decoration, name});
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
   renderList(sort = {}) {
      let result = '';

      let apartments = Object.values(this.apartments);
      const { type, direction } = sort;

      if (type === 'fullPrice') {
         if (direction === 'asc') {
            apartments = apartments.sort((a, b) => (+a.fullPrice < +b.fullPrice ? 1 : -1));
         } else {
            apartments = apartments.sort((a, b) => (+a.fullPrice > +b.fullPrice ? 1 : -1));
         }
      }

      if (type === 'area') {
         if (direction === 'asc') {
            apartments = apartments.sort((a, b) => (+a.area < +b.area ? 1 : -1));
         } else {
            apartments = apartments.sort((a, b) => (+a.area > +b.area ? 1 : -1));
         }
      }

      for (let i = 0; i < apartments.length; i++) {
         const item = apartments[i];

         result += this.renderListItem(item);
      }

      if (!result) return;

      this.$apartmentsWrapper.html(result);
   }

   /**
    * Формирование HTML карточки квартиры для списка
    * @returns {string}
    */
   renderListItem(apartment) {
      if (!apartment) return '';
      const { id, url, area, img, name, floor, decoration, deadline = {}, section, quarter, house, fullPrice, houseImage } = apartment;

      const { text, value } = deadline;

      let floorText = floor
      if (Array.isArray(floor)) {
         floorText = floor.sort((a, b) => a - b)
      }

      let priceText = `${numberFormat(fullPrice)} ₽`
      if (Array.isArray(fullPrice)) {
         let sortedPrices = fullPrice.sort((a, b) => a - b)

         if (sortedPrices[0] === sortedPrices[sortedPrices.length - 1]) {
            priceText = `${numberFormat(sortedPrices[0])} ₽`
         } else {
            priceText = `${numberFormat(sortedPrices[0])} ₽ - ${numberFormat(sortedPrices[sortedPrices.length - 1])} ₽`
         }

      }

      //Если квартира продана или забронирована, не выводим
      // if (status === 0 || status === 2) return '';
      let studioClass = '';
      let mapImage = houseImage ? houseImage : '/netcat_template/template/Primary/assets/img/rooms/123.jpg';

      if (this.roomsName[name] === 'Ст.') studioClass = 'studio';

      return `<a class="rooms-item ${studioClass}" href="${url}" id="${id}" data-room="${name}" data-deadline="${value}">
                    <div class="inner">
                        <div class="item-front">
                            <div class="item-head">
                                <div class="room-name">${this.roomsName[name]}</div>
                                <div class="room-price-square">
                                    <div class="price">${priceText}</div>
                                    <div class="square">${area} м<sup>2</sup> </div>
                                </div>
                            </div>
                            <div class="item-photo">
                                <div class="room-photo lazy"  style="background-image: url(${img})">
                                </div>
                            </div>
                            <div class="item-info">
                                <div class="item">
                                    <div class="name">Срок сдачи</div>
                                    <div class="value">${text}</div>
                                </div>
                                <div class="item">
                                    <div class="name">Отделка</div>
                                    <div class="value">${decoration}</div>
                                </div>
                                <div class="item">
                                    <div class="name">Квартал /дом</div>
                                    <div class="value">${quarter} / ${house}</div>
                                </div>
                                <div class="item">
                                    <div class="name">Секция</div>
                                    <div class="value">${section}</div>
                                </div>
                                <div class="item">
                                    <div class="name">Этаж</div>
                                    <div class="value">${floorText}</div>
                                </div>
                            </div>
                        </div>
                        <div class="item-back" >
                            <div class="baloon-item" style="background-image: url(${mapImage})"></div>
                        </div>
                    </div>
                </a>`;
   }

   //END список квартир
}

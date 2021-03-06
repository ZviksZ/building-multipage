import * as $ from 'jquery';
import { AdvantagesModal } from './components/advantages';
import { RoomsSearch } from './components/apartments/rooms-search.js';
import { BuildProgressSliders } from './components/build-progress-slider';
import { CustomTabs } from './components/custom-tabs';
import { GalleryModal } from './components/gallery-modal';
import { Header } from './components/header';
import { PolygonsMapsMultiple } from './components/maps/polygons-maps-multiple.js';
import { MobileMenu } from './components/mobile-menu';
import { Effects } from './components/effects';
/*import DeviceDetector   from "device-detector-js";*/

import { LocationMap, PolygonsMap, EditPolygonsMap, infrastructureMap, InteractiveMap } from './components/maps';

import { ModalWindowFullScreen } from './components/modal-window-fullscreen';
import { initMaskedInput, initPlaceholders } from './components/form';
import { InitFeedbackForm, InitFeedbackModalForm, InitRoomModalForm } from './components/feedback-form';

import { InitReserveForm } from './components/reserve-form';

import { MortgagePage, MortgageView } from './components/mortgage';

import { Selects } from './components/form';

const ProgressBar = require("progressbar.js");

$(function() {
   /* const deviceDetector = new DeviceDetector();
    const userAgent = navigator.userAgent;
    const device = deviceDetector.parse(userAgent);*/

   /* try {
        const {
            client
        } = device;

        if (client.name === 'Safari') $('body').addClass('helloApple')

    } catch (e) {
        console.log(device);
    }*/

   // скрываем прелоадер страницы если он есть
   const $pagePreloader = $('#page_preloader');

   if ($pagePreloader.length) {
      //$pagePreloader.addClass('animate-start');

      let bar = new ProgressBar.Circle('.page-preloader .logo-wrap', {
         strokeWidth: 7,
         easing: "easeInOut",
         duration: 3000,
         color: "#fff",
         trailColor: "rgba(255,255,255,0)",
         trailWidth: 2,
         svgStyle: null
      });

      bar.animate(1.0);

      setTimeout(() => {
         hidePreloaderPage();
         initScripts();
         $pagePreloader.remove();
      }, 3400);
   } else {
      hidePreloaderPage();
      initScripts();
   }

   function hidePreloaderPage() {
      setTimeout(() => {
         $('html').addClass('animate-end');
      }, 1000);

      $('.preloader-page').removeClass('preloader-page');
   }
});

// инициализация скриптов
function initScripts() {
   // инициализация функционала хедера
   new Header();

   // инициализация мобильного меню
   const mobileMenu = new MobileMenu();
   $('body').on('click', '.mobile-menu-toggle-button', function() {
      mobileMenu.toggle();
      return false;
   });

   // эффекты
   new Effects();

   // Карты все
   new LocationMap($('#map_sell_office_1'));
   new LocationMap($('#map_sell_office_2'));
   new PolygonsMap($('#polygon_map'));
   new EditPolygonsMap($('#edit_polygon_map'));
   new infrastructureMap($('#infrastructure_map'));

   new InteractiveMap();
   new PolygonsMapsMultiple();

   //Горизонатальный блок с фильтром
   new RoomsSearch($('#apartments_search_filter_horizontal'));

   // Форма обратной связи в модалке
   new InitFeedbackModalForm();

   // Форма обратной связи
   new InitFeedbackForm();

   // Форма заявки при выборе квартиры
   new InitRoomModalForm();

   //Форма заявки на бронирование
   new InitReserveForm();

   //Ипотечный калькулятор
   new MortgageView($('#mortgage_view'));
   new MortgagePage();

   //Функционал табов
   new CustomTabs();

   //Функционал модалок на странице преимуществ
   new AdvantagesModal();

   //Модальная галерея
   new GalleryModal();

   // Инициализация плейсхолдеров и масок
   initMaskedInput();
   initPlaceholders();

   //Слайдеры на странице Ход строительства
   new BuildProgressSliders();

   // кноики показать ещё
   $('body').on('click', '[data-show_more_button]', function() {
      const id = $(this).attr('data-show_more_button');
      $(`[data-show_more="${id}"]`).removeClass('hide');
      $(this).remove();
      return false;
   });

   //плавный скролл к якорю
   /*$('a[href*="#"]').click(function() {
        let $page = $('html, body');

        $page.animate({
            scrollTop: $($.attr(this, 'href')).offset().top - 100
        }, 500);
        return false;
    });*/

   // модальные окна фулскрин
   const modalWindow = new ModalWindowFullScreen();

   if ($('[data-modal="main_info_modal"]').length && !sessionStorage.getItem('promo-modal')) {
      modalWindow.open('main_info_modal', 'open-modal-fade-effect');
      sessionStorage.setItem('promo-modal', 'show');
   }

   const selects = new Selects({ searchEnabled: false, itemSelectText: '' });

   if ($('#sticky-row').length > 0) {
      let rowTop = $('#sticky-row').offset().top;
      $(window).on('scroll', function() {
         let windowScrollTop = $(window).scrollTop();
         if (rowTop <= windowScrollTop) {
            $('#sticky-row').addClass('sticky-row-fixed')
         } else {
            $('#sticky-row').removeClass('sticky-row-fixed')
         }
      })
   }
}

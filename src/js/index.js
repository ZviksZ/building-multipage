import * as $  from 'jquery';
import { Header } from './components/header';
import { MobileMenu } from './components/mobile-menu';
import { Effects} from './components/effects';
import DeviceDetector from "device-detector-js";

import {
    LocationMap,
    PolygonsMap,
    EditPolygonsMap,
    infrastructureMap
} from './components/maps';


import { ModalWindowFullScreen } from './components/modal-window-fullscreen';
import {
    initMaskedInput,
    initPlaceholders
} from './components/form'
import {
    InitFeedbackForm,
    InitFeedbackModalForm
} from './components/feedback-form'

import {
    InitReserveForm
} from './components/reserve-form';

import {
    RoomsSearch,
} from './components/apartments';

import {
    MortgageView
} from './components/mortgage'

import {Selects} from './components/form';


$(function () {
    const deviceDetector = new DeviceDetector();
    const userAgent = navigator.userAgent;
    const device = deviceDetector.parse(userAgent);

    try {
        const {
            client
        } = device;

        if (client.name === 'Safari') $('body').addClass('helloApple')

    } catch (e) {
        console.log(device);
    }


    // скрываем прелоадер страницы если он есть
    const $pagePreloader = $('#page_preloader');

    if ($pagePreloader.length) {
        $pagePreloader.addClass('animate-start');

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
    $('body').on('click', '.mobile-menu-toggle-button', function () {
        mobileMenu.toggle();
        return false;
    });

    // эффекты
    new Effects();

    // Карты все
    new LocationMap($('#map_sell_office_1'));
    new LocationMap($('#map_sell_office_2'));
    new PolygonsMap($('#polygon_map'));
    new EditPolygonsMap($('#edit_polygon_map'))
    new infrastructureMap($('#infrastructure_map'));

    //Горизонатальный блок с фильтром
    new RoomsSearch($('#apartments_search_filter_horizontal'));

    // Форма обратной связи в модалке
    new InitFeedbackModalForm();

    // Форма обратной связи
    new InitFeedbackForm();

    //Форма заявки на бронирование
    new InitReserveForm();

    new MortgageView($('#mortgage_view'));

    // Инициализация плейсхолдеров и масок
    initMaskedInput();
    initPlaceholders();

    // кноики показать ещё
    $('body').on('click', '[data-show_more_button]', function () {
        const id = $(this).attr('data-show_more_button');
        $(`[data-show_more="${id}"]`).removeClass('hide');
        $(this).remove();
        return false;
    });

    //плавный скролл к якорю
    $('a[href*="#"]').click(function() {
        let $page = $('html, body');

        $page.animate({
            scrollTop: $($.attr(this, 'href')).offset().top - 100
        }, 500);
        return false;
    });

    // модальные окна фулскрин
    const modalWindow = new ModalWindowFullScreen();

    if ($('[data-modal="main_info_modal"]').length && !sessionStorage.getItem('promo-modal')) {
        modalWindow.open('main_info_modal', 'open-modal-fade-effect')
        sessionStorage.setItem('promo-modal', 'show')
    }

    const selects = new Selects({searchEnabled:false, itemSelectText: ''});





   //
}

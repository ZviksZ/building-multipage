import * as $  from 'jquery';
import Choices from "choices.js";

export default class Selects {
    constructor() {
        this.init();
    }

    init() {
        $('select.select').each((key, item) => this.initChoices(item));
    }

    initChoices($element, options = {
        searchEnabled:false,
        itemSelectText: ''
    }) {
        if(!$element) return;

        return new Choices($element, options);
    }
}

//     if ($('select.select').length) {
//     customSelectInit();
// }
//
// //Инициализация селектов
// function customSelectInit() {
//     const element = document.querySelector('select.select');
//     const choices = new Choices(element, {
//         searchEnabled: false,
//         itemSelectText: ''
//     });
// }

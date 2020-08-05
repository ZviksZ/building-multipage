import * as $  from 'jquery';
export class ModalWindowFullScreen {
    constructor() {
        this.init();
        this.scrollTop = 0;
    }

    init() {
        this.resizeModals();

        $('body')
            .on('click', '[data-open-modal-button]', (e) => {
                e.preventDefault();
                this.open(e.currentTarget.dataset['openModalButton'], e.currentTarget.dataset['effectType']);
                return false;
            })
            .on('click', '[data-close-modal-button]', (e) => {
                e.preventDefault();
                this.close(e.currentTarget.dataset['closeModalButton'], e.currentTarget.dataset['effectType']);
                return false;
            });

        $(window)
           .on('resize', (e) => {
               this.resizeModals();
           });
    }

    open(name, effect) {
        this.scrollTop = pageYOffset;
        let effectClass = 'open-modal-effect';
        let showClass = 'show';

        if (effect) {
            effectClass = effect;
            showClass = 'fade-in-show';
        }
        $('html').addClass('open-modal');

        setTimeout(() => {
            $('html').addClass(effectClass);
            $(`[data-modal="${name}"]`).addClass(showClass);

        }, 5);
    }

    close(name, effect) {
        let effectClass = 'open-modal-effect';
        let showClass = 'show';

        if (effect) {
            effectClass = effect;
            showClass = 'fade-in-show';
        }

        $('html').removeClass(effectClass);
        $(`[data-modal="${name}"]`).removeClass(showClass);

        setTimeout(() => {
            $('html').removeClass('open-modal');
            // $(window).scrollTop(this.scrollTop);
            this.scrollTop = 0;
        }, 600);
    }

    resizeModals() {
        if ($('.modal-window:visible').length) {
            var viewportHeight = +$(window).height(),
               $modal = $('.modal-window:visible'),
               $modalContent = $modal.find('.modal-content'),
               modalHeight = $modalContent.height() * 1 + 60;

            var marginModal = 30;
            var diff = viewportHeight - modalHeight;
            if (diff > 60) {
                marginModal = diff / 2;
            }

            $modalContent.css({
                'marginTop': marginModal
            });
        }
    }
}

import * as $ from 'jquery';
import {SVG} from '@svgdotjs/svg.js';

export default class ApartmentView {
    constructor($block) {
        this.$block = $block;
        this.$drawing = $block.find('[data-drawing]');

        if (!this.$drawing.length) return false;

        this.desktop = null;

        this.items = JSON.parse(this.$drawing.attr('data-items'));

        this.drawingItems = [];

        this.drawingOptions = {
            id: this.$drawing.attr('id'),
            image: this.$drawing.attr('data-image'),
            colorBase: 'rgba(37, 187, 54, 0.3)',
            colorFill: 'rgba(37, 187, 54, 0.7)',
            strokeBase: {color: '#EF1B34', opacity: 0.5, width: 2},
            strokeFill: {color: '#fff', opacity: 0.7, width: 2},
            width: 4000,
            height: 3600
        }

        this.init();
    }

    init() {
        this.draw = this.drawingInit();
        this.addDrawingItems();
        this.drawingResize();

        $(window)
            .on('resize', (e) => {
                this.drawingResize();
            });

    }



    drawingInit() {
        const draw = SVG().addTo(`#${this.drawingOptions.id}`);
        draw.viewbox(0, 0, this.drawingOptions.width, this.drawingOptions.height);

        const image = draw.image(this.drawingOptions.image);
        image.size('100%', '100%').move(0, 0);

        return draw;
    }

    drawingResize() {
        const kHW = this.drawingOptions.height / this.drawingOptions.width;
        const kWH = this.drawingOptions.width / this.drawingOptions.height;
        const blockWidth = this.$block.width();
        const blockHeight = this.$block.height();
        const kBlock = blockHeight / blockWidth;

        let widthDrawing = blockWidth;
        let heightDrawing = blockWidth * kHW;

        if (widthDrawing < 1000) {
            heightDrawing = 480;
            widthDrawing = heightDrawing * kWH;
        }

        let scale = widthDrawing / 1920 + 0.2;
        if (scale > 1) scale = 1;
        this.$block.find('.item').css({
            'transform': `translateX(-50%) translateY(-50%) scale(${scale})`
        });

        this.$drawing.css({
            width: `${widthDrawing}px`,
            height: `${heightDrawing}px`,
            marginLeft: `${-widthDrawing / 2}px`,
            marginTop: `${-heightDrawing / 2}px`
        });
    }

    /**
     * Добавлеине навигационных элементов секций
     * @returns {boolean}
     */
    addDrawingItems() {
        for (let i = 0; i < this.items.length; i++) {

            const item = this.items[i];

            if (!item.id) continue;

            this.addItemSVG(item);
        }
    }


    /**
     * Добавление SVG элемента на холст
     * @param {Object} item - данные о секции
     */
    addItemSVG(item = {}) {
        const {
            id = null,
            name = '',
            nameType = '',
            nameTypeShort = '',
            deadline = '',
            href = '',
            coords = '',
            items = {},
            image = '',
            area = ''
        } = item;

        this.drawingItems[id] = this.draw.polygon(coords);
        this.drawingItems[id].fill(this.drawingOptions.colorBase);
        this.drawingItems[id].stroke(this.drawingOptions.strokeBase);
        this.drawingItems[id].style('cursor', 'pointer');
        this.drawingItems[id].data({
            id,
            href,
            coords,
            name,
            nameType,
            nameTypeShort,
            deadline,
            items,
            image,
            area
        });
    }

}

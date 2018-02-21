'use strict';

import Config from './config.js';

let $ = require('jquery');

/** Class Layoutmanager */
export default class LayoutManager {
    /**
     * Create a Layoutmanager
     * @param {string} m - Layout Type
     */
    constructor(m = 'ramdom') {
        this.mode = m;
        this.config = (new Config()).loadConfig()
    }
    /**
     * 次の付箋紙の場所を決定する
     */
    nextPosition() {
        if (this.mode == 'ramdom') {
            return {
                left: Math.floor(Math.random() * ($(window).width() - this.config.defaultProperty.width)),
                top: Math.floor(Math.random() * ($(window).height() - this.config.defaultProperty.height))
            }
        }
    }
}
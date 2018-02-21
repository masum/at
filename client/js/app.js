'use strict';

import Canvas from './canvas.js';
import Socket from './socket.js';
import Bootstrap from 'bootstrap';
import '../css/style.css'
//import 'drawer.min.css'
import 'jquery'
import 'fabric'
import 'iscroll'
import 'jquery-drawer'
import '../assets/map.jpg'
let $ = require('jquery');

let data = [
    {
        id: "123",
        property: {
            fill: "rgba(255,0,0,0.5)",
            stroke: "rgba(255, 200, 200, 0.5)",
            strokeWidth: 3
        }
    },
    {
        id: "456",
        property: {
            fill: "rgba(255,255,50,0.5)",
            stroke: "rgba(255, 200, 200, 0.5)",
            strokeWidth: 3
        }
    },
    {
        id: "789",
        type: "circle",
        property: {
            fill: "rgba(255,50,255,0.5)",
            stroke: "rgba(255, 200, 200, 0.5)",
            strokeWidth: 3
        }
    }
]


let canvas;
$(document).ready(() => {
    canvas = new Canvas('c');
});

$("#pen").click(function () {
    canvas.drawingMode(true);
});
$("#select").click(function () {
    canvas.drawingMode(false);
});

$('#c').attr("width", $(window).width());
$('#c').attr("height", $(window).height());
console.log($(window).width())
console.log($("#c").get(0).width);

$(window).resize(function () {
    canvas.canvas.requestRenderAll();
});


$('.drawer').drawer({
    class: {
        nav: 'drawer-nav',
        toggle: 'drawer-toggle',
        overlay: 'drawer-overlay',
        open: 'drawer-open',
        close: 'drawer-close',
        dropdown: 'drawer-dropdown'
    },
    iscroll: {
        // Configuring the iScroll
        // https://github.com/cubiq/iscroll#configuring-the-iscroll
        mouseWheel: true,
        preventDefault: false
    },
    showOverlay: true
});



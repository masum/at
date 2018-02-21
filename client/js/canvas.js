'use strict';

import Task from './task.js';
import Config from './config.js';
import LayoutManager from './layoutmanager.js';
import Data from './data.js'
import Socket from './socket.js';

let $ = require('jquery');

/**
 * Canvas
 */
export default class Canvas {
    /**
     * Create Canvas
     * @param {string} name 
     */
    constructor(name) {
        this.index = 0;
        this.list = [];
        this.config = (new Config()).loadConfig();
        this.canvas = new fabric.Canvas(name, this.config.canvasProperty);
        this.canvas.setBackgroundImage('img/map.jpg', this.canvas.renderAll.bind(this.canvas));
        this.initialize();
        this.registEvent();
        this.socket = new Socket();
        this.socket.canvas = this;
    }
    /**
     * １つの付箋紙の追加
     * @param {*} task 
     */
    add(task) {
        task.canvas = this;
        this.list.push(task);
        this.canvas.add(task.object);
    }
    update(param) {
        let task = this.getObjectByID(param.id);
        task.update(param);
    }
    /**
     * IDからオブジェクトを探す
     * @param {*} id 
     */
    getObjectByID(id) {
        let ret = null;
        this.list.forEach(function (o) {
            if (o.object.id == id) {
                ret = o;
                return;
            }
        });
        return ret;
    }
    /**
     * Canvasの初期化処理
     */
    initialize() {
        let layout = new LayoutManager();
        Data.loadData().forEach(function (d) {
            $.extend(d.property, layout.nextPosition());
            this.add(new Task(this.index++, d));
        }, this);
    }
    /**
     * 複数のObjectの移動
     * @param {*} target
     */
    modifyObjects(target) {
        console.log(">> Canvas:modifyObjects");
        console.log("target.left = " + target.left);
        console.log("target.top = " + target.top);
        console.log(target);
        let task;
        target["_objects"].forEach(function (o) {
            console.log(JSON.stringify(o));
            task = this.getObjectByID(o.id);
            task.modify({
                "id": o.id,
                "left": (target.left + o.left),
                "top": (target.top + o.top),
                "width": (o.width),
                "height": (o.height)
            });
        }.bind(this));
    }
    /**
     * Objectの移動
     * @param {*} id 
     */
    modifyObject(id) {
        console.log(">> modifyObject : " + id);
        let task = this.getObjectByID(id);
        console.log(task);
        task.modify();
    }

    /**
     * ペンモードへ変更
     * @param {*} mode 
     */
    drawingMode(mode) {
        this.canvas.isDrawingMode = mode;
        this.canvas.freeDrawingBrush.color = "#ffffff";
        this.canvas.freeDrawingBrush.width = 2;
    }

    /**
     * イベントの登録
     */
    registEvent() {
        this.canvas.on("object:added", function (e) {
            console.log("■■■ event.object:added");
            console.log(e);
        }.bind(this));

        this.canvas.on("object:removed", function (e) {
            //console.log("■■■ event.object:removed");
            //console.log(e);
        }.bind(this));

        this.canvas.on("object:modified", function (e) {
            console.log("■■■ event.object:modified");
            console.log(e);
            if ("_objects" in e.target) {
                this.modifyObjects(e.target);
            } else {
                this.modifyObject(e.target.id);
            }
        }.bind(this));

        this.canvas.on("object:rotating", function (e) {
            console.log("■■■ event.object:rotating");
            console.log(e);
        }.bind(this));

        this.canvas.on("object:scaling", function (e) {
            console.log("■■■ event.object:scaling");
            console.log(e);
        }.bind(this));

        //"object:moving": function(e) {
        //    console.log("object:moving");
        //    console.log(e);
        //}.bind(this),

        this.canvas.on("before:selection:cleared", function (e) {
            console.log("■■■ event.before:selection:cleared");
            console.log(e);
        }.bind(this));

        this.canvas.on("selection:cleared", function (e) {
            console.log("■■■ event.selection:cleared");
            console.log(e);
        }.bind(this));

        this.canvas.on("selection:updated", function (e) {
            console.log("■■■ event.selection:updated");
            console.log(e);
        }.bind(this));

        this.canvas.on("selection:created", function (e) {
            console.log("■■■ event.selection:created");
            console.log(e);
        }.bind(this));

        this.canvas.on("path:created", function (e) {
            console.log("■■■ event.path:created");
            console.log(e);
        }.bind(this));
        /*
        "mouse:down": function(e) {
            console.log("mouse:down");
            console.log(e);
        },
        "mouse:move": function(e) {
            console.log("mouse:move");
            console.log(e);
        },
        "mouse:up": function(e) {
            console.log("mouse:up");
            console.log(e);
        },
        "mouse:over": function(e) {
            console.log("mouse:over");
            console.log(e);
        },
        "mouse:out": function(e) {
            console.log("mouse:out");
            console.log(e);
        },
        "mouse:dblclick": function(e) {
            console.log("mouse:dblclick");
            console.log(e);
        } 
        */
    }
}
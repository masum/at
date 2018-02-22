'use strict';

import Task from './task.js';
import Config from './config.js';
import LayoutManager from './layoutmanager.js';
import Data from './data.js';
import Socket from './socket.js';
import fabric from 'fabric';

const $ = require('jquery');

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
        const task = this.getObjectByID(param.id);
        task.update(param);
    }
    /**
     * IDからオブジェクトを探す
     * @param {*} id 
     */
    getObjectByID(id) {
        let ret = null;
        this.list.forEach((o) => {
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
        const layout = new LayoutManager();
        Data.loadData().forEach((d) => {
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
        console.log("target.left = ",target.left);
        console.log("target.top = ",target.top);
        console.log(target);
        let task;
        target["_objects"].forEach((o) => {
            console.log(JSON.stringify(o));
            task = this.getObjectByID(o.id);
            task.modify({
                "id": o.id,
                "left": (target.left + o.left),
                "top": (target.top + o.top),
                "width": (o.width),
                "height": (o.height)
            });
        });
    }
    /**
     * Objectの移動
     * @param {*} id 
     */
    modifyObject(id) {
        console.log(">> modifyObject : ",id);
        const task = this.getObjectByID(id);
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
        this.canvas.on("object:added", (e) => {
            console.log("■■■ event.object:added");
            console.log(e);
        });

        this.canvas.on("object:removed", (e) => {
            //console.log("■■■ event.object:removed");
            console.log(e);
        });

        this.canvas.on("object:modified", (e) => {
            console.log("■■■ event.object:modified");
            console.log(e);
            if ("_objects" in e.target) {
                this.modifyObjects(e.target);
            } else {
                this.modifyObject(e.target.id);
            }
        });

        this.canvas.on("object:rotating", (e) => {
            console.log("■■■ event.object:rotating");
            console.log(e);
        });

        this.canvas.on("object:scaling", (e) => {
            console.log("■■■ event.object:scaling");
            console.log(e);
        });

        //"object:moving": (e) => {
        //    console.log("object:moving");
        //    console.log(e);
        //},

        this.canvas.on("before:selection:cleared", (e) => {
            console.log("■■■ event.before:selection:cleared");
            console.log(e);
        });

        this.canvas.on("selection:cleared", (e) => {
            console.log("■■■ event.selection:cleared");
            console.log(e);
        });

        this.canvas.on("selection:updated", (e) => {
            console.log("■■■ event.selection:updated");
            console.log(e);
        });

        this.canvas.on("selection:created", (e) => {
            console.log("■■■ event.selection:created");
            console.log(e);
        });

        this.canvas.on("path:created", (e) => {
            console.log("■■■ event.path:created");
            console.log(e);
        });

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
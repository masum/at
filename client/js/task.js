'use strict';

import Config from './config.js';

let $ = require('jquery');

/**
 * Task
 */
export default class Task {
    /**
     * Create Task
     * @param {*} d 
     */
    constructor(id, d) {
        this.socket = null;
        this.canvas = null;
        this.config = (new Config()).loadConfig();
        let param = this.config.defaultProperty;
        $.extend(param, d.property);
        if (d.type == "circle") {
            this.object = new fabric.Circle();
        } else {
            this.object = new fabric.Rect()
        }
        this.object.set(param);
        this.object.id = id;
        this.object.on({
            'mouse:down': function (e) {
                console.log("mouse:down");
                console.log(this.object.oCoords);
            },
            'event:select': function (e) {
                console.log("object.event:select");
            },
            'selection:created': function (e) {
                console.log("object.selection:created")
            },
            'selection:updated': function (e) {
                console.log("object.selection:updated")
            }
        });
        console.log(this.object);
    }
    modify(param = null) {
        console.log(">> Task:modify = " + JSON.stringify(param));
        console.log(this);
        if (param == null) {
            param = {
                "id": this.object.id,
                "left": this.object.left,
                "top": this.object.top,
                "width": this.object.width,
                "height": this.object.height
            }
        }
        this.canvas.socket.emit("move", JSON.stringify(param));
    }
    update(param) {
        console.log(">> Task:update = " + JSON.stringify(param));
        console.log(this);
        this.object.set({
            "left": param.left,
            "top": param.top,
            "width": param.width,
            "height": param.height
        });
        this.object.isMoving = false;
        //console.log(this.canvas);
        this.canvas.canvas.renderAll();
    }
}

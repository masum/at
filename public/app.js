'use strict';

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

let config = {
    canvasProperty: {
        backgroundColor: 'rgb(100,100,200)',
        selectionLineWidth: 5
    },
    defaultProperty: {
        fill: 'yellow',
        width: 100,
        height: 100,
        radius: 50,
        borderColor: 'white',
        cornerColor: 'green',
        cornerSize: 6
    }
};

/** Class Layoutmanager */
class LayoutManager {
    /**
     * Create a Layoutmanager
     * @param {string} m - Layout Type
     */
    constructor(m = 'ramdom') {
        this.mode = m;
    }
    /**
     * 次の付箋紙の場所を決定する
     */
    nextPosition() {
        if (this.mode == 'ramdom') {
            return {
                left: Math.floor(Math.random() * ($(window).width() - config.defaultProperty.width)),
                top: Math.floor(Math.random() * ($(window).height() - config.defaultProperty.height))
            }
        }
    }
}

/**
 * Canvas
 */
class Canvas {
    /**
     * Create Canvas
     * @param {string} name 
     */
    constructor(name) {
        this.index = 0;
        this.list = [];
        this.canvas = new fabric.Canvas(name, config.canvasProperty);
        this.canvas.setBackgroundImage('assets/map.jpg', this.canvas.renderAll.bind(this.canvas));
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
        data.forEach(function (d) {
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
     * イベントの登録
     */
    registEvent() {
        this.canvas.on("object:added", function (e) {
            console.log("■■■ event.object:added");
            console.log(e);
        }.bind(this))

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

/**
 * ペンモードへ変更
 * @param {*} mode 
 */
drawingMode(mode) {
    this.canvas.isDrawingMode = mode;
    this.canvas.freeDrawingBrush.color = "#ffffff";
    this.canvas.freeDrawingBrush.width = 2;
}
}

/**
 * Task
 */
class Task {
    /**
     * Create Task
     * @param {*} d 
     */
    constructor(id, d) {
        this.socket = null;
        this.canvas = null;
        let param = config.defaultProperty;
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

class Socket {
    constructor() {
        this.socket = io.connect("http://localhost:8888");
        this.socket.on("rsvmove", function (d) {
            console.log("on");
            let json = JSON.parse(d);
            this.canvas.update(json);
        }.bind(this));
    }
    emit(key, msg) {
        this.socket.emit(key, msg);
    }
}

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



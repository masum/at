'use strict';

let data = [
    {
        id: "123",
        color: "yellow"
    },
    {
        id: "456",
        color: "blue"
    },
    {
        id: "789",
        type: "circle"
    }
]
class LayoutManager {
    constructor(m = 'ramdom') {
        this.mode = m;
    }
    nextPosition() {
        if (this.mode == 'ramdom') {
            return [
                Math.floor(Math.random() * ($(window).width()-config.task.width)),
                Math.floor(Math.random() * ($(window).height()-config.task.height))
            ]
        }
    }
}
class Canvas {
    constructor(name) {
        this.canvas = new fabric.Canvas(name, {
            backgroundColor: 'rgb(100,100,200)',
            //selectionColor: 'blue',
            selectionLineWidth: 5,
            //selectionBorderColor: 'pink'
        });
        this.canvas.setBackgroundImage('assets/map.jpg',this.canvas.renderAll.bind(this.canvas));
        this.initialize();
        this.registEvent();
    }
    add(task) {
        this.canvas.add(task.object);
    }

    initialize() {
        let layout = new LayoutManager();
        data.forEach(function(d) {
            d.position = layout.nextPosition();
            this.add(new Task(d));
        },this);
    }
    registEvent() {
        this.canvas.on({
            'mouse:down': function(e) {
                console.log('canvas:mouse:down')
                console.log(e);
            },
            'event:select': function(e) {
                console.log("canvas.event:select");
            },
            'selection:created': function(e) {
                console.log("canvas.selection:created")
            },
            'selection:updated': function(e) {
                console.log("canvas.selection:updated")
            }
        })
    }
    drawingMode(mode) {
        this.canvas.isDrawingMode = mode;
        this.canvas.freeDrawingBrush.color = "#ffffff";
        this.canvas.freeDrawingBrush.width = 2;
    }
}

let config = {
    task : {
        color: 'yellow',
        width: 100,
        height: 100,
        radius: 50
    }
};

class Task {
    constructor(d) {
        if (d.color == null) {
            d.color = config.task.color;
        }
        if (d.type == null) {
            d.type = "rect";
        }
        let param = {
            width: config.task.width,
            height: config.task.height,
            left: d.position[0],
            top: d.position[1],
            fill: d.color,
            radius: config.task.radius
        };
        if (d.type == "circle") {
            this.object = new fabric.Circle(param);
        } else {
            this.object = new fabric.Rect(param)
        }
        this.object.set({
            borderColor: 'white',
            cornerColor: 'green',
            cornerSize: 6            
        });

        this.object.isDrawingMode = true;
        this.object.on('mouse:down', function(e) {
            console.log("mouse:down");
            console.log(e);
            console.log(this.object.oCoords);
        });
        this.object.on('event:select', function(e) {
            console.log("object.event:select");
        });
        this.object.on('selection:created', function(e) {
            console.log("object.selection:created")
        });
        this.object.on('selection:updated', function(e) {
            console.log("object.selection:updated")
        });

    }
}


let canvas;
$(document).ready(() => {
    canvas = new Canvas('c');
});

$("#pen").click(function() {
    canvas.drawingMode(true);
});
$("#select").click(function() {
    canvas.drawingMode(false);
});

$( '#c' ).attr("width",$( window ).width());
$( '#c' ).attr("height", $( window ).height());
console.log($(window).width())
console.log($("#c").get(0).width);

$(window).resize(function() {
    canvas.canvas.requestRenderAll();
});

'use strict';

export default class Socket {
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

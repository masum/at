'use strict';

import io from 'socket.io-client';

export default class Socket {
    constructor() {
        this.socket = io.connect("http://localhost:8888");
        this.socket.on("rsvmove", (d) => {
            console.log("on");
            this.canvas.update(JSON.parse(d));
        });
    }
    emit(key, msg) {
        this.socket.emit(key, msg);
    }
}

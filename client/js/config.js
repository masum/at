'use strict';

const conf = {
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

export default class Config {
    loadConfig() {
        return conf;
    }
}

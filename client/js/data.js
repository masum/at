'use strict';

let dummy = [
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
];

export default class Data {
    constructor() {
    }
    static loadData() {
        return dummy;
    }
}

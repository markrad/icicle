"use strict";

var Gpio = undefined;// = require('rpio2').Gpio;
var endpoint = require('../templates/endpoint');

class InputPin extends endpoint {
    constructor(config, loggers) {
        super(config, loggers);
        this.isFake = 'fake' in this.properties;

        if (!this.isFake) {
            Gpio = require('rpio2').Gpio;
            this.pin = new Gpio(this.properties.pinNumber);
        }
    }
    open() {
        if (this.isFake) {
            setInterval(() => {
                this.setState(1);
                setTimeout(() => {
                    this.setState(0);
                }, 500);
            }, this.properties.fake);
        }
        else {
            this.pin.open(Gpio.INPUT);
            this.pin.on('rising', () => {
                this.setState(1);
            });
            this.pin.on('falling', () => {
                this.setState(0);
            })
        }
    }
    close() {
        this.pin.close();
    }
}

module.exports = InputPin;
"use strict";

var dht22 = undefined;
var endpoint = require('../templates/endpoint');

class DHT22 extends endpoint {
    constructor(config, loggers) {
        super(config, loggers);
        this.isFake = 'fake' in this.properties;
        this.lastTemp = 0;
        this.lastHumid = 0;

        if (!this.isFake) {
            dht22 = require('node-dht-sensor');
        }
    }
    open() {
        setInterval(this.read, this.poll, this);
    }
    close() {
    }
    read(that) {
        if (that.isFake) {
            that.setState(0, 73 + (Math.random() * 10));
            that.setState(1, 50 + (Math.random() * 10));
        }
        else {
            dht22.read(22, this.properties.pin, (err, temp, humid) => {
                if (!err) {
                    that.lastTemp = temp;
                    that.lastHumid = humid;
                }
                else {
                    that.logwarn('Failed to read DHT22');
                }
                that.setState(0, that.lastTemp);
                that.setState(1, that.lastHumid);
            });
        }
    }
}

module.exports = DHT22;
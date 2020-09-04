"use strict";

const process = require('process');

var endpoint = require('../templates/endpoint');

const states = ['off', 'on', 'open', 'closed', 'no', 'yes'];

class OutputPin extends endpoint {
    constructor(config, loggers) {
        super(config, loggers);
        this.timeout = 0;
    }

    open() {
        this.setState(this.coerceState(this.properties.initialState));
    }

    command(topic, payload) {
        this.logverbose(`Received on ${topic} payload ${payload}`);

        var newState = this.coerceState(payload);

        if (newState || !this.properties.autoOff) {
            this.setState(newState);
        }
        else if (this.getState() && this.properties.autoOff) {
            if (this.timeout != 0) {
                clearTimeout(this.timeout);
            }
            this.timeout = setTimeout(() => {
                this.logdebug(`Turning off`);
                this.timeout = 0;
                this.setState(0);
            }, this.properties.autoOff)
        }
    }

    coerceState(state) {
        if (typeof state == 'number') {
            return !!state * 1;
        }
        else if (typeof state == 'string') {
            var stateNo = states.indexOf(state.toLowerCase());

            if (stateNo == -1) {
                this.logterm(`Unrecognized state ${state}`);
                process.exit(4);
            }

            return stateNo % 2;
        }
        else if (typeof state == 'boolean') {
            return state * 1;
        }
        else {
            this.logterm(`Unrecognized state type ${state}`);
        }
    }
}

module.exports = OutputPin;
const EventEmitter = require('events');

class endpoint extends EventEmitter {
    constructor(config, loggers) {
        super();
        this.loggers = loggers;
        this.name = config.name;
        this.type = config.type;
        this.channels = config.channels;
        this.subscriptions = config.subscriptions || [];
        this.properties = config.properties || {};

        if (this.channels.input) {
            this.poll = config.poll || 0;
            this.interrupt = config.interrupt || false;
        }
        else {
            this.poll = undefined;
            this.interrupt = undefined;
        }

        if ('outputs' in config) {
            this.outputs = config.outputs;
            this.state = Array.apply(null, Array(5)).map(() => { return undefined; });
        }
        else {
            this.outputs = [ this.name ]
            this.state = [ undefined ];
        }
    }

    open() {}
    close() {}

    getState(index) { 
        if (index == undefined) {
            index = 0;
        }
        return this.state[index]; 
    }

    setState(index, newState) { 
        if (newState == undefined) {
            newState = index;
            index = 0;
        }
        if (newState != this.state[index]) {
            this.state[index] = newState; 
            this.logdebug(`${this.outputs[index]} state set to ${this.state[index]}`);
            this.publish(this.outputs[index], this.state[index]);
        }
    }

    isSubscribed(topic) {
        return this.subscriptions.indexOf(topic) != -1;
    }

    isInput() {
        return this.channels.input;
    }

    isOutput() {
        return this.channels.output;
    }

    command(topic, payload) {
        this.logerror('command function has not been defined in subclass');
    }

    publish(topic, payload) {
        this.logdebug(`${topic} publishing ${payload}`);
        this.emit('publish', topic, payload);
    }

    logverbose(message) {
        this.loggers.logverbose(`[${this.name}] ${message}`);
    }

    logdebug(message) {
        this.loggers.logdebug(`[${this.name}] ${message}`);
    }

    loginfo(message) {
        this.loggers.loginfo(`[${this.name}] ${message}`);
    }

    logwarn(message) {
        this.loggers.logwarn(`[${this.name}] ${message}`);
    }

    logerror(message) {
        this.loggers.logerror(`[${this.name}] ${message}`);
    }

    logterm(message) {
        this.loggers.logterm(`[${this.name}] ${message}`);
    }

    log(severity, message) {
        this.loggers.log(severity, `[${this.name}] ${message}`);
    }
};

module.exports = endpoint;
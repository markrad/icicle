"use strict"

const config = require('../config.json');

class icicle {
    constructor(config)
    {
        this.loggersDir = "../" + (config.directories.loggers || "loggers");
        this.endpointsDir = "../" + (config.directories.endpoints || "endpoints");

        var loggerconfig = config.items.filter((item) => item.class == "logger");
        this.loggers = [];

        for (var i = 0; i < loggerconfig.length; i++) {
            this.loggers.push(new (require(this.loggersDir + "/" + loggerconfig[i].name))(loggerconfig[i]));
            this.loggers[this.loggers.length - 1].open();
        }

        this.loginfo('Loggers constructed - start up in progress');
        this.logdebug('Constructing endpoints');

        var endpointsconfig = config.items.filter((item) => item.class == 'endpoint');
        this.endpoints = [];

        for (var i = 0; i < endpointsconfig.length; i++) {
            this.logdebug(`Creating endpoint type ${endpointsconfig[i].type} name ${endpointsconfig[i].name}`);
            var ep = new (require(this.endpointsDir + "/" + endpointsconfig[i].type))(endpointsconfig[i], this);
            this.endpoints.push(ep);
            ep.open();

            if (ep.isInput()) {
                let innerep = ep;
                innerep.on('publish', (topic, payload) => {
                    this.loginfo(`${innerep.name} published on ${topic} payload: ${payload}`);

                    this.endpoints.forEach((ep, index) => {
                        if (ep.isSubscribed(topic)) {
                            ep.command(topic, payload);
                        }
                    })
                })
            }
        }
    }

    log(sev, message) {
        for (var i = 0; i < this.loggers.length; i++) {
            this.loggers[i].log(sev, message);
        }
    }

    logverbose(message) {
        this.log('ver', message);
    }

    logdebug(message) {
        this.log('dbg', message);
    }

    loginfo(message) {
        this.log('inf', message);
    }

    logwarn(message) {
        this.log('wrn', message);
    }

    logerror(message) {
        this.log('err', message);
    }

    logterminal(message) {
        this.log('trm', message);
    }

};

var main = new icicle(config);

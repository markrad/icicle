var logger = require("../templates/logger");

class consolelog extends logger {
    constructor(config) {
        super(config.level);
    }
    
    // open() {
        
    // }

    // close() {

    // }

    log(level, message) {
        if (this.shouldLog(level)) console.log(`${(new Date()).toISOString()} [${level}]: ${message}`)
    }
};

module.exports = consolelog;
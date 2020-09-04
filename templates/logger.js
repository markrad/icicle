const levels = ['trm', 'err', 'wrn', 'inf', 'dbg', 'ver'];

class logger {
    constructor(level) {
        this.level = level;
        this.levelNum = levels.indexOf(level);
    }
    open() {}
    close() {}
    setLevel(config) { this.level = config.level; }
    getLevel() { return this.level; }
    log(sev, message) {}

    shouldLog(sev) {
        return levels.indexOf(sev) <= this.levelNum;
    }
};

module.exports = logger;
const exec = require('child_process').execSync;
const noop = require('noop');

class Isql {
    constructor(user, log, alias = 'isql') {
        this.user = user;
        this.alias = alias;
        this.logger = log ? console.log : noop;
        this.commands = [];
    }
    exec(command) {
        let isqlCommand = this.toString(command);
        this.logger(`> ${isqlCommand}`);
        let exc = exec(isqlCommand);
        printError(exc.error);
        this.logger(exc.toString());
    }
    saveCommand(command,c) {
        this.commands.push(this.toString(command));
    }
    toString(command) {
        return `${this.alias} -U ${this.user} exec="${command}"`;
    }
    getCommands() {
        return this.commands;
    }
}

function printError(err) {
    if (err) console.error(err);
}

module.exports = Isql;

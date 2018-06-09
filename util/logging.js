const chalk = require('chalk');
const moment = require('moment');
const fs = require('fs');

module.exports.logError = (content) => {
    const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
    return console.log(chalk.red(`${timestamp} [ERROR] ${content}`));
}

module.exports.logUse = (cmd, msg) => {
    const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
    return console.log(`${timestamp} [COMMAND USED] The command ${cmd} was used in ${msg.guild.name} (ID: ${msg.guild.id}), by user of tag ${msg.author.tag} (and of ID ${msg.author.id}). `);
}

module.exports.warn = (content) => {
    const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
    return console.log(chalk.yellow(`${timestamp} [WARN] ${content}`));
}

module.exports.log = (content) => {
    const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
    return console.log(chalk.whiteBright(`${timestamp} [LOG] ${content}`));
}
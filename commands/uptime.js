module.exports.help = {
    name: "uptime",
    description: "Sends the uptime of the bot to the current channel.",
    usage: "uptime",
    disablable: true
}

const moment = require('moment');
const momentPreciseRangePlugin = require("moment-precise-range-plugin");

module.exports.run = async (client, msg, args) => {
    let timeStarted = moment(client.readyAt);
    let currTime = moment(new Date());
    let currUptime = moment.preciseDiff(timeStarted, currTime);
    msg.channel.send(`I have been online for ${currUptime}.`);
}
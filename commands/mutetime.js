module.exports.help = {
    name: "mutetime",
    description: "Displays the mute time of the mentioned user, if they are in the mute database.",
    usage: "mutetime <mention/user id>",
    disablable: true
}

const moment = require('moment');
const momentPreciseRangePlugin = require("moment-precise-range-plugin");

module.exports.run = async (client, msg, args) => {
    try {
        let memb;
        if (!msg.mentions.members.isEmpty()) {
            memb = msg.mentions.members.first().id;
        } else {
            memb = args[0];
        }
        if (!memb) return msg.channel.send("Please mention someone to check their mute time, or provide a user ID.");
        if (!await memb.isUserID()) return msg.channel.send("Please provide a valid user mention or user ID.");
        const id = `${msg.guild.id}-${memb}`; // ID of the mute log we want to check.
        if (!client.muteData.has(id)) return msg.reply("the specified user is not in the mute database for this server.");
        const timestamp = client.muteData.get(id).expireTimestamp;
        if (timestamp < 1) return msg.reply("this user should have been unmuted. If this happens again, you should probably report it to the Developer. You can get a link to the support server with ;invite.");
        let timeStarted = moment(timestamp);
        let currTime = moment(new Date());
        let timeLeft = moment.preciseDiff(timeStarted, currTime);
        await msg.reply(`the specified user will be unmuted in: ${timeLeft}.`);    
    } catch (e) {
        client.logging.logError(`mutetime command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
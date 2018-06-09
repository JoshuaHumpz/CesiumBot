module.exports.help = {
    name: "banmessage",
    description: "Allows you to configure the message that is sent when a user is banned, and the channel that it's sent to. Please make sure yzbot has the VIEW_AUDIT_LOG permission or the message WILL NOT WORK. You can set placeholders for this too, see https://yzbot.gitbook.io/welcome/configuring-messages-to-be-sent-when-a-user-is-banned for more info. (Note: With the first option it literally means type message or channel).",
    usage: "banmessage <message/channel/remove> <actual message/channel mention>",
    disablable: false
}

module.exports.run = async (client, msg, args) => {
    try {
        if(client.checks.hasPerm(msg.member, "MANAGE_GUILD", msg)){
            const guildConfig = client.guildSettings.get(msg.guild.id);
            let allowedOpts = ["message", "channel", "remove"];
            let opt = args[0];
            if(allowedOpts.includes(opt)){
                if(opt === "message") {
                    const message = args.slice(1).join(" "); // Slice and join! Slice and join! (Get the rest of args.)
                    if(!message) return msg.channel.send("Please provide a message to set as your ban message.");
                    guildConfig.banmessage = message;
                    client.guildSettings.set(msg.guild.id, guildConfig);
                    await msg.reply(`set new ban message as the following successfully: \`\`\`${message}\`\`\``);
                } else if (opt === "channel"){
                    const channel = msg.mentions.channels.first(); // Get the first channel mention.
                    if(!channel) return msg.channel.send("Please provide a channel mention to send your ban message to.");
                    guildConfig.banmessagechannel = channel.id;
                    client.guildSettings.set(msg.guild.id, guildConfig);
                    await msg.reply(`set ban message channel as the following successfully: ${channel}`);
                } else if (opt === "remove") {
                    guildConfig.banmessage = "";
                    guildConfig.banmessagechannel = "";
                    client.guildSettings.set(msg.guild.id, guildConfig);
                    await msg.reply("removed the ban message successfully.");
                }
            } else {
                return msg.channel.send(`Please provide a valid first option. (Type either "message", or "channel").\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
            }
        }
    } catch (e) {
        client.logging.logError(`banmessage command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
module.exports.help = {
    name: "modlog",
    description: "Allows you to set a mod log channel, or turn off mod logs. The enable and disable options allow you to enable or disable modlogs for a specific action.",
    usage: "modlog <set/remove/enable/disable/listdisabled> <channel/log>",
    disablable: false
}


module.exports.run = async (client, msg, args) => {
    if(client.checks.hasPerm(msg.member, "MANAGE_GUILD", msg)){
        let guildConfig = client.guildSettings.get(msg.guild.id);
        let loggingConfig = client.loggingConfig.get(msg.guild.id);
        let opt = args[0];
        let allowedOpts = ["set", "remove", "enable", "disable", "listdisabled"];
        const allowedLogs = ["ban", "kick", "mute", "unban", "hackban", "softban", "unmute"];
        if (allowedOpts.includes(opt)) {
            if (opt === "set") { // Allows the user to set a mod log channel.
                let channel = msg.mentions.channels.first();
                if (!channel) return msg.channel.send(`You must provide a valid channel mention, like #mod-log.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
                let id = channel.id;
                if (!msg.guild.channels.get(id)) return msg.channel.send("You may not set your mod log channel to one outside of this server.");
                if (guildConfig.modlog === id) return msg.channel.send("This channel has already been set as your mod-log.");
                guildConfig.modlog = id;
                client.guildSettings.get(msg.guild.id, guildConfig);
                return msg.reply(`mod log has been set as <#${channel.id}> successfully.`);
            } else if (opt === "remove") { // Allows the user to remove their mod log channel.
                if (guildConfig.modlog === "none") return msg.channel.send(`You don't have a set mod log.`);
                guildConfig.modlog = "none";
                client.guildSettings.set(msg.guild.id, guildConfig);
                return msg.reply(`removed mod log successfully.`);
            } else if (opt === "disable") { // Allows the user to disable moderation logging for certain commands.
                let cmd = args[1];
                const disableLog = log => {
                    if(client.checks.isLogDisabled(log, msg, client)) return msg.channel.send(`${log.charAt(0).toUpperCase()}${log.slice(1)} logs are already disabled.`);
                    loggingConfig[`${log}LogDisabled`] = true;
                    client.loggingConfig.set(msg.guild.id, loggingConfig);
                    return msg.reply(`disabled ${log} logs successfully.`);
                };

                if(allowedLogs.includes(cmd)){
                    // Go through all the moderation logs.
                    if(cmd === "ban"){ 
                        disableLog("ban");
                    }else if(cmd === "kick"){ 
                        disableLog("kick");
                    }else if(cmd === "mute"){ 
                        disableLog("mute");
                    }else if(cmd === "unban"){ 
                        disableLog("unban");
                    }else if(cmd === "hackban"){ 
                        disableLog("hackban");
                    }else if(cmd === "unmute"){
                        disableLog("unmute");
                    }else if(cmd === "softban"){
                        disableLog("softban");
                    }
                }else{
                    return msg.channel.send(`You must provide a valid modlog to disable. Possible mod logs: ${allowedLogs.join(", ")}.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
                }
            } else if (opt === "enable") { // Allows the user to enable previously disabled moderation logs.
                let cmd = args[1];
                const enableLog = log => {
                    if(!client.checks.isLogDisabled(log, msg, client)) return msg.channel.send(`${log.charAt(0).toUpperCase()}${log.slice(1)} logs are already enabled.`);
                    loggingConfig[`${log}LogDisabled`] = false;
                    client.loggingConfig.set(msg.guild.id, loggingConfig);
                    return msg.reply(`enabled ${log} logs successfully.`);
                };

                if(allowedLogs.includes(cmd)){
                    if(cmd === "ban"){
                        enableLog("ban");
                    }else if(cmd === "kick"){
                        enableLog("kick");
                    }else if(cmd === "mute"){
                        enableLog("mute");
                    }else if(cmd === "unban"){
                        enableLog("unban");
                    }else if(cmd === "hackban"){
                        enableLog("hackban");
                    }else if(cmd === "unmute"){
                        enableLog("unmute");
                    }else if(cmd === "softban"){
                        enableLog("softban");
                    }
                } else {
                    return msg.channel.send(`You must provide a valid modlog to enable. Possible mod logs: ${allowedLogs.join(", ")}.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
                }
            } else if (opt === "listdisabled") {
                let arrDisabled = [];
                const readable = {
                    "banLogDisabled": "ban",
                    "muteLogDisabled": "mute",
                    "kickLogDisabled": "kick",
                    "hackbanLogDisabled": "hackban",
                    "unbanLogDisabled": "unban",
                    "unmuteLogDisabled": "unmute",
                    "softbanLogDisabled": "softban"
                }
                for (let log in loggingConfig) {
                    if(loggingConfig[log] === true) arrDisabled.push(readable[log]);
                }
                let phrase;
                phrase = arrDisabled.length > 0 ? `Here are the currently disabled moderation logs: ${arrDisabled.join(", ")}` : 'No mod logs are currently disabled.';
                await msg.channel.send(phrase);
            }
        } else {
            return msg.channel.send(`You must provide a valid first option.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
        }
    }
}

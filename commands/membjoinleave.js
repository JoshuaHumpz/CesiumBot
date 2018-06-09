module.exports.help = {
    name: 'membjoinleave',
    description: `This command can be used to set member join and leave messages.`,
    usage: 'membjoinleave <join/leave> <message/channel/remove> <*actual message or channel mention*>',
    disablable: false
}

module.exports.run = async (client, msg, args) => {
    if(client.checks.hasPerm(msg.member, "MANAGE_GUILD", msg)){ // Does the member have appropriate perms?
        let opt = args[0]; // The first option that they'll say. Like, membjoinleave <opt>.
        let allowedOpts = ["join", "leave"];
        let guildConfig = client.guildSettings.get(msg.guild.id);
        if(allowedOpts.includes(opt)){
            if(opt === "join") { // membjoinleave join
                let subOpt = args[1];
                let allowedSubOpts = ["message", "channel", "remove"];
                if(allowedSubOpts.includes(subOpt)){
                    if(subOpt === "message"){ // membjoinleave join message
                        // The third option of the args. So,
                        // membjoinleave join message <MSG>
                        let message = args.slice(2).join(" "); 
                        if(!message) return msg.channel.send(`Please provide a valid message to set.`); // Error if they failed to provide a message.
                        guildConfig.welcMsg = message; // In the previous thing it returns, that means it stops execution so this will always set a message.
                        client.guildSettings.set(msg.guild.id, guildConfig); // Set it in DB.
                        return msg.reply(`set the new welcome message as the below successfully:\n\`\`\`${guildConfig.welcMsg}\`\`\``); // Success message.
                    } else if(subOpt === "channel"){ // membjoinleave join channel
                        let chan = msg.mentions.channels.first(); // Get the first channel mention.
                        if(!chan) return msg.channel.send(`Please provide a valid channel mention, like #join-leave.`); // Error if they failed to provide a channel.
                        if(!msg.guild.channels.get(chan.id)) return msg.channel.send("You may not set your join message channel to one outside of this server."); // Error if they attempted to provide a channel outside of this server.
                        guildConfig.welcChan = chan.id; // Set it.
                        client.guildSettings.set(msg.guild.id, guildConfig); // Really set it.
                        return msg.reply(`set the new welcome message channel as <#${chan.id}> successfully.`); // Success.
                    } else if (subOpt === "remove") {
                        guildConfig.welcMsg = "";
                        guildConfig.welcChan = "";
                        client.guildSettings.set(msg.guild.id, guildConfig);
                        return msg.reply("removed join message for this server successfully.");
                    }
                } else {
                    return msg.channel.send(`Please provide a valid sub-option (can be message or channel).\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``); // Error if they failed to provide a valid sub-opt.
                }
            } else if(opt === "leave") {
                let subOpt = args[1];
                let allowedSubOpts = ["message", "channel", "remove"];
                if(allowedSubOpts.includes(subOpt)){
                    if(subOpt === "message"){ // membjoinleave leave message
                        let message = args.slice(2).join(" "); // The third option of the args.
                        if(!message) return msg.channel.send(`Please provide a valid message to set.`); // Fail if they didn't provide a message.
                        guildConfig.leaveMsg = message; // Set it in DB
                        client.guildSettings.set(msg.guild.id, guildConfig); // Truly set it
                        return msg.reply(`set the new leave message as the below successfully:\n\`\`\`${guildConfig.leaveMsg}\`\`\``); // Success.
                    } else if(subOpt === "channel"){ // membjoinleave leave channel
                        let chan = msg.mentions.channels.first(); // Get the first channel mention
                        if(!chan) return msg.channel.send(`Please provide a valid channel mention, like #join-leave.`); // Fail if they didn't provide a channel
                        if(!msg.guild.channels.get(chan.id)) return msg.channel.send("You may not set your leave message channel to one outside of this server."); // Fail if they tried to provide a channel outside of the server.
                        guildConfig.leaveChan = chan.id; // Set it
                        client.guildSettings.set(msg.guild.id, guildConfig); // Really set it
                        return msg.reply(`set the new leave message channel as <#${chan.id}> successfully.`); // Success
                    } else if (subOpt === "remove") {
                        guildConfig.leaveMsg = "";
                        guildConfig.leaveChan = "";
                        client.guildSettings.set(msg.guild.id, guildConfig);
                        return msg.reply("removed leave message for this server successfully.");
                    }
                } else {
                    return msg.channel.send(`Please provide a valid sub-option (can be message or channel).\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``); // Error if they failed to provide a valid subopt
                }
            }
        } else {
            return msg.channel.send(`Please provide a valid option (can be join or leave).\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``); // Error if they failed to provide an opt.
        }
    }
}
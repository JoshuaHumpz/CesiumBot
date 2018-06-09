const Discord = require('discord.js');
module.exports.run = async (client, msg, args) => {
    if (client.checks.isDev(msg.author)) {
        try {
            let opt = args[0];
            let allowedOpts = ["add", "remove"];
            if (allowedOpts.includes(opt)) {
                let blacklistLogID = client.channels.get("445633045253324810");
                let id;
                if(!msg.mentions.members.isEmpty()){
                    id = msg.mentions.members.first().id;
                } else {
                    id = args[1];
                }
                if(!id) return msg.channel.send("Please provide an ID or user mention to blacklist.");
                if(!await id.isUserID()) return msg.channel.send("Please provide a valid user ID to blacklist.");
                let reason = args.slice(2).join(" ");
                if(!reason) reason = 'None specified.';
                const logBlacklist = async (action) => {
                    const embed = new Discord.RichEmbed();
                    embed.setColor(action === "Blacklist" ? 'RED' : 'GREEN');
                    embed.setTitle(`${action} Log`);
                    embed.addField(`User`, `<@${id}>`);
                    embed.addField(`Reason`, `${reason}`);
                    embed.setFooter(`A user was ${action.toLowerCase()}ed.`);
                    embed.setTimestamp();
                    client.channels.get(blacklistLogID).send(embed); 
                }
                if (opt === "add"){
                    if(client.blacklist.has(id)) return msg.channel.send("That user's already blacklisted.");
                    client.blacklist.set(id, reason);
                    msg.reply(`blacklisted the user with the ID of ${id} successfully.`);
                    return logBlacklist("Blacklist");
                }else if(opt === "remove"){
                    if(!client.blacklist.has(id)) return msg.channel.send("That user isn't blacklisted.");
                    client.blacklist.delete(id);
                    msg.reply(`unblacklisted the user with the ID of ${id} successfully.`);
                    return logBlacklist("Unblacklist");
                }
            } else {
                return msg.channel.send("Please specify whether to add or remove a member or ID from the blacklist.");
            }
        } catch (e) {
            client.logging.logError(`blacklist command failed ${e.stack}`);
            await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
        }
    }
}
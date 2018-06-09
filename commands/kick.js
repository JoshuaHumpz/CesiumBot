const Discord = require('discord.js');

module.exports.help = {
    name: "kick",
    description: "Kicks a member from the server with the reason specified.",
    usage: "kick <member> <reason>",
    disablable: true
}

module.exports.run = async (client, msg, args) => {
    if (client.checks.botHasPerm(msg.guild.me, "KICK_MEMBERS", msg)) { // Check if bot has appropriate perms
        if (client.checks.hasPerm(msg.member, "KICK_MEMBERS", msg)) { // Check if member has appropriate perm
            try {
                let memb = msg.mentions.members.first();
                if (!memb) return msg.reply("you must mention someone.");
                let reason = args.slice(1).join(" ");
                if (!reason) reason = 'None specified.';
                let membHighestRole = memb.highestRole.position;
                let authHighestRole = msg.member.highestRole.position;
                if (membHighestRole >= authHighestRole && msg.author.id !== msg.guild.ownerID) return msg.channel.send("The user specified has a higher than or equal role compared to you in the role hierarchy.");
                if (memb.id === msg.guild.ownerID) return msg.channel.send("You can't kick the owner of this server.");
                if (msg.author.id === memb.id) return msg.channel.send("You can't kick yourself.");
                if (!memb.kickable) return msg.channel.send("I can't kick this user.");
                const m = await memb.kick(`${reason} | Kicked by ${msg.author.tag} using yzbot.`)
                await msg.reply(`user ${memb} (Tag: ${memb.user.tag}, ID: ${memb.id}) was kicked successfully.`);
                if (!client.checks.isLogDisabled("kick", msg, client)) {
                    let guildConfig = client.guildSettings.get(msg.guild.id);
                    let modlog = guildConfig.modlog; // The ID of the Mod Log.
                    if (!client.channels.get(modlog)) { // If the mod log channel no longer exists.
                        msg.channel.send("Your mod log channel no longer exists, resetting.");
                        guildConfig.modlog = "none";
                        return client.guildSettings.set(msg.guild.id, guildConfig);
                    } else { // We can get the mod log.
                        let modlogChannel = client.channels.get(modlog);
                        if (modlogChannel.permissionsFor(msg.guild.me).has([["EMBED_LINKS", "READ_MESSAGES", "SEND_MESSAGES"]])) {
                            let embed = new Discord.RichEmbed();
                            embed = await client.createModlog(msg, embed, memb, reason, "kick");
                            embed.setColor("#FF8C00");
                            await client.channels.get(modlog).send({ embed });
                        } else {
                            return msg.channel.send(`The member has been kicked, but the moderation log has not been set as the bot does not have the appropriate permissions (\`\`EMBED_LINKS\`\`, \`\`READ_MESSAGES\`\`, and \`\`SEND_MESSAGES\`\`).`);
                        }
                    }
                }
            } catch (e) {
                client.logging.logError(`Kick command failed. ${e.stack}`);
                msg.channel.send(`Sorry, an error has occurred.\n\`\`${e.message}\`\``);
            }
        }
    }
}
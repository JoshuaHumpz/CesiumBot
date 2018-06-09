module.exports.help = {
    name: "softban",
    description: "Bans a user and instantly unbans them. Deletes the specified number of days of messages (defaults to 7).",
    usage: "softban <member> <days> <reason>",
    disablable: true
}

const Discord = require('discord.js');

module.exports.run = async (client, msg, args) => {
    try {
        if(client.checks.botHasPerm(msg.guild.me, "BAN_MEMBERS", msg)) {
            if(client.checks.hasPerm(msg.member, "BAN_MEMBERS", msg)) {
                const memb = msg.mentions.members.first();
                if(!memb) return msg.channel.send("You must mention a member to softban them.");
                // If args[1] is not a number, we'll use the default of 7 days, otherwise we'll use args[1].
                let usedDefault = false;
                let days, reason;
                if(args[1] === "0") return msg.channel.send("If you want to softban someone, you need to have a certain number of days of their messages deleted. Otherwise just kick them yourself.");
                if(isNaN(args[1])) {
                    days = 7;
                    usedDefault = true;
                    reason = args.slice(1).join(" ");
                } else {
                    days = parseInt(args[1]);
                    if(days.toString().split(".")[1]) return msg.channel.send("You must provide the number of days to delete the user's messages of as an integer.");
                    reason = args.slice(2).join(" ");
                }

                if(!reason) reason = 'None specified.';
                let membHighestRole = memb.highestRole.position;
                let authHighestRole = msg.member.highestRole.position;
                if (membHighestRole >= authHighestRole && msg.author.id !== msg.guild.ownerID) return msg.channel.send("The user specified has a higher than or equal role compared to you in the role hierarchy.");
                if (memb.id === msg.guild.ownerID) return msg.channel.send("You can't ban the owner of this server.");
                if (msg.author.id === memb.id) return msg.channel.send("You can't ban yourself.");
                if (!memb.bannable) return msg.channel.send("I can't ban this user, they most likely have a higher role than me.");

                await memb.ban({
                    days: days,
                    reason: `${reason} | Softbanned by ${msg.author.tag} (${msg.author.id}) using yzbot, deleting ${days} days of their messages.`
                });

                await msg.guild.unban(memb.id, `Automatically unbanned from the softban command executed by ${msg.author.tag} (${msg.author.id}).`);

                await msg.reply(`user was softbanned successfully. Deleted ${days} day(s) of their messages.`);

                if (!client.checks.isLogDisabled("softban", msg, client)) {
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
                            embed = await client.createModlog(msg, embed, memb, reason, "softban");
                            embed.addField("Days of messages deleted",  usedDefault ? `${days} (default)` : days);
                            embed.setColor("RED");
                            await client.channels.get(modlog).send({ embed });
                        } else {
                            return msg.channel.send(`The member has been softbanned, but the moderation log has not been set as the bot does not have the appropriate permissions (\`\`EMBED_LINKS\`\`, \`\`READ_MESSAGES\`\`, and \`\`SEND_MESSAGES\`\`).`);
                        }
                    }
                }

            }
        }
    } catch (e) {
        client.logging.logError(`softban command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
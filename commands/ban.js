const Discord = require('discord.js');

module.exports.help = {
    name: "ban",
    description: "Bans a member from the server with the reason specified.",
    usage: "ban <member> <reason>",
    disablable: true
}

module.exports.run = async (client, msg, args) => {
    if (client.checks.botHasPerm(msg.guild.me, "BAN_MEMBERS", msg)) { // Check if bot has appropriate perms
        if (client.checks.hasPerm(msg.member, "BAN_MEMBERS", msg)) { // Check if member has appropriate perm
            try {
                let memb = msg.mentions.members.first();
                if (!memb) return msg.channel.send("You must mention a member of this server to ban them. If you want to ban by ID use the hackban command.");
                let reason = args.slice(1).join(" ");
                if (!reason) reason = 'None specified.';
                let membHighestRole = memb.highestRole.position;
                let authHighestRole = msg.member.highestRole.position;
                if (membHighestRole >= authHighestRole && msg.author.id !== msg.guild.ownerID) return msg.channel.send("The user specified has a higher than or equal role compared to you in the role hierarchy.");
                if (memb.id === msg.guild.ownerID) return msg.channel.send("You can't ban the owner of this server.");
                if (msg.author.id === memb.id) return msg.channel.send("You can't ban yourself.");
                if (!memb.bannable) return msg.channel.send("I can't ban this user, they most likely have a higher role than me.");
                const bans = await msg.guild.fetchBans();
                if (bans.has(memb.id)) return msg.channel.send(`This user is already banned, somehow. Unban them by their ID by typing \`${client.guildSettings.get(msg.guild.id).prefix}unban ${memb.id}\`, then reattempt to ban them.`);
                await memb.ban(`${reason} | Banned by ${msg.author.tag} using yzbot.`);
                await msg.reply(`user ${memb} (Tag: ${memb.user.tag}, ID: ${memb.id}) was banned successfully.`);
                if (!client.checks.isLogDisabled("ban", msg, client)) {
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
                            embed = await client.createModlog(msg, embed, memb, reason, "ban");
                            embed.setColor("RED");
                            await client.channels.get(modlog).send({ embed });
                        } else {
                            return msg.channel.send(`The member has been banned, but the moderation log has not been set as the bot does not have the appropriate permissions (\`\`EMBED_LINKS\`\`, \`\`READ_MESSAGES\`\`, and \`\`SEND_MESSAGES\`\`).`);
                        }
                    }
                }
            } catch (e) {
                client.logging.logError(`Ban command failed. ${e.stack}`);
                msg.channel.send(`Sorry, an error occurred.\n\`\`${e.message}\`\``);
            }
        }
    }
}
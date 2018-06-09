module.exports.help = {
    name: "unban",
    description: "Unbans a member from the server by their ID.",
    usage: "unban <id> <reason>",
    disablable: true
}

const Discord = require('discord.js');

module.exports.run = async (client, msg, args) => {
    if (client.checks.botHasPerm(msg.guild.me, "BAN_MEMBERS", msg)) {
        if (client.checks.hasPerm(msg.member, "BAN_MEMBERS", msg)) {
            try {
                let idInfoURL = "https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-";
                let id = args[0];
                if (!id) return msg.channel.send(`You must provide an ID to unban, for example '423205967870820352'. How to get member ID: ${idInfoURL}`);
                if (!await id.isUserID()) return msg.channel.send(`You must provide a valid ID to unban, for example '423205967870820352'. How to get member ID: ${idInfoURL}`);
                let reason = args.slice(1).join(" ");
                if (!reason) reason = "None specified.";
                const bans = await msg.guild.fetchBans();
                if (!bans.get(id)) return msg.channel.send("This user ID is not banned, or it does not belong to a Discord user.");
                const unbanned = await msg.guild.unban(id, `${reason} | Unbanned by ${msg.author.tag} using Eagle`);
                // To be clear, unbanned is a User object representing the user who was unbanned.
                msg.reply(`unbanned ${unbanned.tag} (ID: ${unbanned.id}) successfully.`);
                if (!client.checks.isLogDisabled("unban", msg, client)) {
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
                            embed = await client.createModlog(msg, embed, unbanned, reason, "unban");
                            embed.setColor("GREEN");
                            await client.channels.get(modlog).send({ embed });
                        } else {
                            return msg.channel.send(`The member has been unbanned, but the moderation log has not been set as the bot does not have the appropriate permissions (\`\`EMBED_LINKS\`\`, \`\`READ_MESSAGES\`\`, and \`\`SEND_MESSAGES\`\`).`);
                        }
                    }
                }
            } catch (e) {
                client.logging.logError(`unban command failed. ${e.stack}`);
                msg.channel.send(`Sorry, an error occurred.\n\`${e.message}\``);
            }
        }
    }
}
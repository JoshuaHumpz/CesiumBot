module.exports.help = {
    name: "hackban",
    description: "Bans a user by their ID from the server.",
    usage: "hackban <id> <reason>",
    disablable: true
}

const Discord = require('discord.js');

module.exports.run = async (client, msg, args) => {
    if (client.checks.botHasPerm(msg.guild.me, "BAN_MEMBERS", msg)) {
        if (client.checks.hasPerm(msg.member, "BAN_MEMBERS", msg)) {
            try {
                let id = args[0];
                let prefix = client.guildSettings.get(msg.guild.id).prefix;
                if (!id) return msg.channel.send("Please provide an ID, for example '423205967870820352'."); // Did they supply an ID at all?
                if (!await id.isUserID()) return msg.channel.send("Please provide a valid user ID."); // Is the supplied ID a number? Does it have a length of 18 characters exactly?
                if (id === msg.author.id) return msg.channel.send("You cannot (hack/ID)ban yourself.");
                let gMemb = msg.guild.members.get(id);
                if (gMemb) return msg.channel.send(`This member is already in the server - use ${prefix}ban, here's their user mention to ban with: ${gMemb}.`);
                let reason = args.slice(1).join(" "); // The rest of their argument.
                if (!reason) reason = "None specified."; // Give reason a value so we avoid getting some sort of error.
                const banned = await msg.guild.fetchBans();
                if (banned.get(id)) return msg.channel.send("That user has already been banned.");
                const m = await msg.guild.ban(id, `${reason} | Hackbanned by ${msg.author.tag} using yzbot`);
                await msg.reply(`user ${m.tag} (ID: ${m.id}) was hackbanned successfully.`);
                if (!client.checks.isLogDisabled("hackban", msg, client)) {
                    let guildConfig = client.guildSettings.get(msg.guild.id);
                    let modlog = guildConfig.modlog; // The ID of the Mod Log.
                    if (!client.channels.get(modlog)) { // If the mod log channel no longer exists.
                        guildConfig.modlog = "none";
                        await client.guildSettings.setAsync(msg.guild.id, guildConfig);
                        if (guildConfig.modlog === "none") return msg.channel.send("Your mod log channel no longer exists, so it has been reset.");
                    } else { // We can get the mod log.
                        let modlogChannel = client.channels.get(modlog);
                        if (modlogChannel.permissionsFor(msg.guild.me).has([["EMBED_LINKS", "READ_MESSAGES", "SEND_MESSAGES"]])) {
                            let embed = new Discord.RichEmbed();
                            embed = await client.createModlog(msg, embed, m, reason, "hackban");
                            embed.setColor("RED");
                            await client.channels.get(modlog).send({ embed });
                        } else {
                            return msg.channel.send(`The member has been banned, but the moderation log has not been set as the bot does not have the appropriate permissions (\`\`EMBED_LINKS\`\`, \`\`READ_MESSAGES\`\`, and \`\`SEND_MESSAGES\`\`).`);
                        }
                    }
                }
            } catch (e) {
                if (e.message === "Unknown User") {
                    await msg.channel.send(`That ID does not belong to any Discord user.`);
                } else {
                    client.logging.logError(`Hackban failed. ${e.stack}`);
                    await msg.channel.send(`Sorry, an error occurred.\n\`\`${e.message}\`\``);
                }
            }
        }
    }
}
module.exports.help = {
    name: "mute",
    description: "Mutes the mentioned user for the amount of time specified.",
    usage: "mute <user> <amount> <unit> <reason>",
    disablable: true
}

const Discord = require('discord.js');
const ms = require('ms');
const _ = require('lodash');
const moment = require('moment');
const momentPreciseRangePlugin = require("moment-precise-range-plugin");

module.exports.run = async (client, msg, args) => {
    try {
        if (client.checks.botHasPerm(msg.guild.me, "MANAGE_ROLES", msg)) { // Only start if bot has right permissions.
            if (client.checks.hasPerm(msg.member, "MANAGE_ROLES", msg)) { // and also the user must have appropriate perms.
                const guildConfig = client.guildSettings.get(msg.guild.id);
                const validTimeFormats = client.config.mutetimeformats;
                const memb = msg.mentions.members.first();
                // Set this variable to the current guild config mute role ID
                const muteroleID = guildConfig.muteroleID;

                if (!memb) return msg.channel.send(`You must mention a user to mute.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);

                const amount = args[1];
                if (!amount) return msg.channel.send(`You must provide an amount of time to mute the user for.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);

                const unit = args[2];
                if (!unit) return msg.channel.send(`You must provide a unit of time to mute the user for.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
                const floatAmount = parseFloat(amount).toString().split(".");
                if (isNaN(amount) || floatAmount[1]) return msg.channel.send(`You must provide the amount as an integer.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
                if (!validTimeFormats.includes(unit)) return msg.channel.send(`You must provide a valid time format. List of valid time formats can be found here: https://github.com/yzfire/yzbot-2/blob/master/VALIDTIMEFORMATS.md\n\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);

                let reason = args.slice(3).join(" ");
                if (!reason) reason = 'None specified.';

                const timeString = `${amount} ${unit}`;
                const timeMs = parseInt(ms(timeString)); // Parse as integer, then turn time string into milliseconds.

                // Create a function to log the mute so that we do not have to repeat code.
                const logMute = async () => {
                    // Are mute logs disabled? Only continue if they are not.
                    if(!client.checks.isLogDisabled("mute", msg, client)) {
                        let modlog = guildConfig.modlog;
                        if(modlog === 'none') return;
                        if(!client.channels.get(modlog)){
                            msg.channel.send("Your mod log channel no longer exists, resetting.");
                            guildConfig.modlog = "none";
                            client.guildSettings.set(msg.guild.id, guildConfig);
                            return false;
                        } else {
                            let modlogChannel = client.channels.get(modlog);
                            if (modlogChannel.permissionsFor(msg.guild.me).has([["EMBED_LINKS", "READ_MESSAGES", "SEND_MESSAGES"]])) {
                                const modlogamt = client.incrementModlog(msg.guild.id, client);
                                let embed = new Discord.RichEmbed();
                                embed = await client.createModlog(msg, embed, memb, reason, "mute");
                                embed.addField(`Mute Length`, `${moment.preciseDiff(Date.now(), Date.now() + timeMs)}`);
                                embed.setColor('#FFA500');
                                await client.channels.get(modlog).send({embed});
                            } else {
                                return msg.channel.send(`The member has been muted, but the moderation log has not been set as the bot does not have the appropriate permissions (\`\`EMBED_LINKS\`\`, \`\`READ_MESSAGES\`\`, and \`\`SEND_MESSAGES\`\`).`);
                            }
                        }
                    }
                }

                if (msg.guild.roles.get(muteroleID)) { // Mute role exists.
                    // Security first.
                    let muteRole = msg.guild.roles.get(muteroleID);
                    // Check if the user is the message author, but don't include the server owner - we have special message for them
                    if (memb.id === msg.author.id && msg.author.id !== msg.guild.ownerID) return msg.channel.send("You can't mute yourself.");
                    // Check if the user mentioned has a higher or equal role compared to msg author.
                    if (memb.highestRole.position >= msg.member.highestRole.position && msg.author.id !== msg.guild.ownerID) return msg.channel.send("You can't mute that user. They have a higher role than you.");
                    // A 'just in case' check if the mute role is higher than yzbot.
                    if (muteRole.position >= msg.guild.me.highestRole.position) return msg.channel.send("I can't mute this user as the muted role is higher than my highest role.");
                    // Check if the user is the owner.
                    if (memb.id === msg.guild.ownerID && msg.author.id === msg.guild.ownerID) return msg.channel.send("I can't mute you, you're the server owner.");
                    if (memb.id === msg.guild.ownerID) return msg.channel.send("Neither of us can mute this user as they own the server.");


                    // If the user does not have muted role already, add.
                    if(!memb.roles.get(muteroleID)) await memb.addRole(muteroleID, `Muted by ${msg.author.tag} using yzbot`);

                    // Create a unique, per guild identifier in the DB if user is muted.
                    let id = `${msg.guild.id}-${memb.id}`;

                    // If we are going to be remuting a user, we want to delete the old record.
                    if(client.muteData.has(id)) client.muteData.delete(id); 

                    // Have a few properties.
                    // User ID, Mute Role ID, Server ID, Expiry Date.
                    let obj = {
                        userID: memb.id,
                        muteroleID: muteRole.id,
                        serverID: msg.guild.id,
                        expireTimestamp: Date.now() + timeMs,
                        id: id
                    }

                    // Set the mute data in DB.
                    client.muteData.set(id, obj);

                    // Success.
                    await msg.reply(`user ${memb} (Tag: ${memb.user.tag}, ID: ${memb.id}) was muted successfully.`);

                    // Log it.
                    logMute();

                } else { // Mute role does not exist. We must make it.
                    // Actually make the role, set initial colour and perms.
                    const muteRole = await msg.guild.createRole({
                        name: "YzbotMuted",
                        color: '#808080',
                        permissions: 0
                    }, "Automatic creation of mute role for mute command - yzbot.");

                    // Sort through channels that we can manage the permissions of and inform the user of
                    // which ones that they need to set themselves.
                    let textChannels = msg.guild.channels.filter(c => c.type === 'text');
                    let ableChannels = textChannels.filter(c => c.permissionsFor(msg.guild.me).has("MANAGE_ROLES"));
                    let ableChansNames = ableChannels.map(c => c.name);
                    let textChanNames = textChannels.map(c => c.name);
                    // If the amount of channels it can do it do isn't the same amount as the entire server's channel amount, something is amiss.
                    if (ableChansNames.length !== textChanNames.length) msg.channel.send(`I'm unable to set the mute role permissions for the following channels, you'll need to set them manually:\n${_.difference(textChanNames, ableChansNames).map(c => `• \`#${c}\``).join("\n")}\nApologies if any Staff or private channel names were revealed.`);

                    // Wait for the permissions to be overwritten.
                    await ableChannels.forEach(c => c.overwritePermissions(muteRole, {
                        SEND_MESSAGES: false
                    }, "Automatic mute role overrides for mute command - yzbot."));

                    // Set the mute role ID in database, for future reference. 
                    guildConfig.muteroleID = muteRole.id;
                    client.guildSettings.set(msg.guild.id, guildConfig);

                    // SECURITY CHECKS. We must respect the server heirarchy.
                    // Check if the user is the message author, but don't include the server owner - we have special message for them
                    if (memb.id === msg.author.id && msg.author.id !== msg.guild.ownerID) return msg.channel.send("You can't mute yourself.");
                    // Check if the user mentioned has a higher or equal role compared to msg author.
                    if (memb.highestRole.position >= msg.member.highestRole.position && msg.author.id !== msg.guild.ownerID) return msg.channel.send("You can't mute that user. They have a higher role than you.");
                    // A 'just in case' check if the mute role is higher than yzbot.
                    if (muteRole.position >= msg.guild.me.highestRole.position) return msg.channel.send("I can't mute this user as the muted role is higher than my highest role.");
                    // Check if the user is the owner.
                    if (memb.id === msg.guild.ownerID && msg.author.id === msg.guild.ownerID) return msg.channel.send("I can't mute you, you're the server owner.");
                    if (memb.id === msg.guild.ownerID) return msg.channel.send("Neither of us can mute this user as they own the server.");

                    // Mute user.
                    await memb.addRole(guildConfig.muteroleID, `Muted by ${msg.author.tag} using yzbot`);

                    // Create a unique, per guild identifier in the DB if user is muted.
                    let id = `${msg.guild.id}-${memb.id}`;

                    // Have a few properties.
                    // User ID, Mute Role ID, Server ID, Expiry Date.
                    let obj = {
                        userID: memb.id,
                        muteroleID: muteRole.id,
                        serverID: msg.guild.id,
                        expireTimestamp: Date.now() + timeMs,
                        id: id
                    }

                    // Set the mute data in DB.
                    client.muteData.set(id, obj);

                    // Success message.
                    await msg.reply(`user ${memb} (Tag: ${memb.user.tag}, ID: ${memb.id}) was muted successfully.`);

                    logMute(); // Log the mute.
                }
            }
        }
    } catch (e) {
        client.logging.logError(`mute command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
module.exports.help = {
    name: "info",
    description: "Allows you to obtain information about a variety of things. For user you need to provide a mention, and role you need to provide a role name. and for the rest leave the second part blank.",
    usage: "info <user/server/role/bot> <user mention/role>",
    disablable: true
}

const ordinal = require('ordinal');
const dateFormat = require('dateformat');
const Discord = require('discord.js');
const moment = require('moment');
const momentPreciseRangePlugin = require("moment-precise-range-plugin");
dateFormat.masks.UTCtime = 'UTC: ddd, dS mmmm, yyyy @ h:MM:ss TT "(UTC)"';

module.exports.run = async (client, msg, args) => {
    try {
        let opt = args[0];
        let allowedOpts = ["user", "server", "role", "bot"/*, "channels", "roles"*/];
        if (allowedOpts.includes(opt)) {
            if (client.checks.botHasPerm(msg.guild.me, "EMBED_LINKS", msg)) {
                if (opt === "user") {
                    let memb = msg.mentions.members.first() || msg.member;
                    let userStatus = memb.presence.status;
                    let game = memb.presence.game;
                    if (game) game = memb.presence.game.name;
                    switch (userStatus) {
                        case "online":
                            userStatus = "Online";
                            break;
                        case "offline":
                            userStatus = "Offline/Invisible";
                            break;
                        case "idle":
                            userStatus = "Idle";
                            break;
                        case "dnd":
                            userStatus = "Do not Disturb";
                            break;
                    }

                    // When I figure out how the below works I'll use it but for now I'll leave it.
                    // It's meant to set the field where it says 'Playing' to whatever their playing
                    // status is, and otherwise it will be just 'Playing', as usual.

                    // let gameType;

                    // switch(game.type){
                    //     case 0:
                    //         gameType = "Playing";
                    //         break;
                    //     case 1:
                    //         gameType = "Streaming";
                    //         break;
                    //     case 2:
                    //         gameType = "Watching";

                    // }
                    let highestRoleName = memb.highestRole.name === '@everyone' ? '@ everyone' : memb.highestRole.name;
                    const embed = new Discord.RichEmbed();
                    embed.setColor(memb.highestRole.hexColor !== '#000000' ? memb.highestRole.hexColor : 'GREEN');
                    embed.setTitle(`User info of ${memb.user.tag}`);
                    embed.setThumbnail(memb.user.displayAvatarURL);
                    embed.addField(`Account Created`, `${dateFormat(memb.user.createdAt, "UTCtime")}`);
                    embed.addField(`Avatar URL`, `[Click here](${memb.user.displayAvatarURL})`, true);
                    embed.addField(`Highest Role`, `${highestRoleName}`);
                    embed.addField(`Status`, `${userStatus}`, true);
                    embed.addField(`Playing`, `${game || "No current game."}`, true);
                    embed.addField(`Number of Roles`, `${memb.roles.size - 1}`, true);
                    embed.addField(`Nickname`, `${memb.displayName}`, true);
                    embed.addField(`Joined Server`, `${dateFormat(memb.joinedAt, "UTCtime")}`);
                    embed.setFooter(`User ID: ${memb.id}`);
                    embed.setTimestamp();
                    await msg.channel.send({ embed });
                } else if (opt === "server") {
                    const guild = msg.guild;
                    const embed = new Discord.RichEmbed();
                    const colours = ["GREEN", "BLUE", "GOLD", "PURPLE", "RED"];
                    // This just, works. I don't know why, but it does, so I'll take it.
                    let emotes = msg.guild.emojis.array();
                    let verification_level;
                    switch (guild.verificationLevel) {
                        case 0:
                            verification_level = "None";
                            break;
                        case 1:
                            verification_level = "Low";
                            break;
                        case 2:
                            verification_level = "Medium";
                            break;
                        case 3:
                            verification_level = "High";
                            break;
                        case 4:
                            verification_level = "Very High";
                            break;
                    }
                    embed.setTitle(`Information about the server ${guild.name}`);
                    embed.setThumbnail(guild.iconURL);
                    embed.setColor(`${colours[Math.floor(Math.random() * colours.length)]}`);
                    embed.addField(`Member Amount`, guild.members.size, true);
                    embed.addField(`Owner`, `${guild.owner.user.tag} (${guild.owner})`, true);
                    embed.addField(`Region`, guild.region);
                    embed.addField(`Server Created`, `${dateFormat(guild.createdAt, 'UTCtime')}`);
                    embed.addField(`Verification Level`, verification_level);
                    embed.addField(`Number of Roles`, guild.roles.size);
                    embed.addField(`Emojis`, emotes.join(", "));
                    embed.setFooter(`Server ID: ${guild.id}`);
                    embed.setTimestamp();
                    await msg.channel.send({ embed });
                } else if (opt === "role") {
                    let roleName = args.slice(1).join(" ");
                    if (!roleName) return msg.channel.send("Please provide a role name to get the info of.");

                    // Credits to HyperCoder for the below piece of code, it allows you to get a role
                    // by name - case insensitively.
                    let role = msg.guild.roles.find(r => r.name.toLowerCase() === roleName.toLowerCase());
                    if (!role) return msg.channel.send("You must provide an existing role of this server.");

                    let relativePos = ordinal(msg.guild.roles.size - role.position);
                    relativePos = ` ${relativePos} `;
                    if (relativePos === " 1st ") relativePos = " ";

                    const getRoleMembers = () => {
                        if (role.members.size < 30 && role.members.size > 0) {
                            let membArr = role.members.array().map(m => m.id);
                            let mentionArr = membArr.map(memb => `<@${memb}>`)
                            let finalMentions = mentionArr.join(", ");
                            return finalMentions;
                        } else {
                            return role.members.size;
                        }
                    }


                    const embed = new Discord.RichEmbed();
                    embed.setTitle(role.name);
                    embed.setColor(role.hexColor !== '#000000' ? role.hexColor : 'GREEN');
                    embed.addField(`Role Created`, `${dateFormat(role.createdAt, 'UTCtime')}`);
                    embed.addField(`Permission Number (Use converter to see)`, role.permissions);
                    embed.addField(`Position`, `${parseInt(role.position) + 2}\nThat means this role is the${relativePos}highest role!`);
                    embed.addField(`Members`, `${getRoleMembers()} ${role.members.size !== 0 && role.members.size < 30 ? `(${role.members.size})` : `\u200B`}`);
                    embed.addField(`Colour`, role.hexColor, true);
                    embed.addField(`On Sidebar (Hoisted)`, `${role.hoist ? 'Yes' : 'No'}`, true);
                    embed.addField(`Mentionable`, `${role.mentionable ? 'Yes' : 'No'}`, true);
                    embed.setFooter(`Role ID: ${role.id}`);
                    embed.setTimestamp();

                    await msg.channel.send({ embed });
                } else if (opt === "bot") {
                    let timeStarted = moment(client.readyAt);
                    let currTime = moment(new Date());
                    let currUptime = moment.preciseDiff(timeStarted, currTime);
                    const package = require('../package.json');

                    const embed = new Discord.RichEmbed();
                    embed.setTitle(`Information about Eagle Eye bot!`);
                    embed.setColor("BLUE");
                    embed.setDescription(`Eagle Eye's bot is Created for a ton of task such as moderation.`);
                    embed.addField(`Developer`, `Pooofy#5415 (<@${client.config.devID}>)`, true);
                    embed.addField(`Version`, package.version, true);
                    embed.addField(`Online Since`, dateFormat(client.readyAt, 'UTCtime'));
                    embed.addField(`Servers`, client.guilds.size, true);
                    embed.addField(`Members`, client.users.size, true);
                    embed.addField(`Channels`, client.channels.size, true);
                    embed.addField(`Commands`, client.helpData.size);
                    embed.addField(`Created`, dateFormat(client.user.createdAt, 'UTCtime'));
                    embed.addField(`Uptime`, currUptime);
                    embed.addField(`Discord.js Version`, package.dependencies["discord.js"].split("^").join(""));
                    embed.setFooter(`Bot ID: ${client.user.id}`);
                    embed.setTimestamp();
                    await msg.channel.send({embed});
                }
                // Without the functionality to disable sub-commands, I refuse to go here at present.
                // else if (opt === "channels") {
                //     let channels = msg.guild.channels;
                //     let voiceChannels = channels.filter(c => c.type === 'voice');
                //     let textChannels = channels.filter(c => c.type === 'text');
                //     await msg.member.send(`__Current channels for server **${msg.guild.name}:**__
                //     \n__Text: ${textChannels.size} - Voice ${voiceChannels.size}:__
                //     \n__**List of text channels:**__
                //     \n\n${textChannels.map(c => `${c}`).join(", ")}
                //     \n__**List of voice channels:**__
                //     \n\n${voiceChannels.map(c => `${c}`).join(", ")}`);
                //     msg.reply("info sent to your DMs successfully!");
                // } else if (opt === "roles") {
                //     await msg.member.send(`__Current roles for server **${msg.guild.name}:**__
                //     \n${msg.guild.roles.map(r => r.name).join(", ")}`);
                //     msg.reply("info sent to your DMs successfully!");
                // }
            }
        } else {
            return msg.channel.send(`Please provide a valid first option. Can be one of the following: ${allowedOpts.join(", ")}\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
        }
    } catch (e) {
        if(e.message === "Cannot send messages to this user") return msg.channel.send("I cannot send DMs (Direct Messages) to you.");
        client.logging.logError(`info command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
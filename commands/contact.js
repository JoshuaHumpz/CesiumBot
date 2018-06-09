module.exports.help = {
    name: "contact",
    description: "Use this command to contact the developer and his support team. It can be used for bug reporting, suggestions for Eagle Eye and to obtain support. With the first option I literally mean type 'makerequest'. Do not abuse this or you WILL be blacklisted.",
    usage: "contact <makerequest> <request>",
    disablable: false
}

const Discord = require('discord.js');

module.exports.run = async (client, msg, args) => {
    try {
        if(!client.contactBlacklist.get(msg.author.id)){
            const guildConfig = client.guildSettings.get(msg.guild.id);
            let opt = args[0];
            let allowedOpts = ["makerequest", "reply", "blacklist", "unblacklist"/*, "reopen"*/];
            if(allowedOpts.includes(opt)){
                if(opt === "makerequest"){ // All can use.
                    // contact makerequest <request>
                    let request = args.slice(1).join(" "); // The rest of args. 
                    if(!request) return msg.channel.send("Please provide a request to make.");
                    if (request.length > 1024) return msg.channel.send("The length of the request must be less than 1024 characters in length, for technical reasons. If you wish to make a request longer than this, please label your request in parts. For example, 'Request Part 1: *first 1024 chars here*', and then make another request labeled Part 2, etc.");   
                    let id = client.contactData.size + 1;
                    id = id.toString()

                    let messageID = msg.id;
                    let serverID = msg.guild.id;
                    let authorID = msg.author.id;
                    let channelID = msg.channel.id;

                    let dataObject = {
                        request: request,
                        messageID: messageID,
                        serverID: serverID,
                        authorID: authorID,
                        channelID: channelID
                        // resolved: false I'll trust my Support team to not abuse this.
                        // However if they do I will just set the boolean to true when response 
                        // is made and have them ask me to reopen it if it needs following up
                    }

                    await client.contactData.defer;
                    await client.contactData.setAsync(id, dataObject);
                    msg.reply(`contacted with request ID of ${id} successfully.`);
                    let contactLogID = client.channels.get("445633045253324810");
                    const embed = new Discord.RichEmbed();
                    embed.setTitle(`Contact Request Log #${id}`);
                    embed.addField("User ID and Tag", `ID: ${authorID}, Tag: ${client.users.get(authorID).username}#${client.users.get(authorID).discriminator}`);
                    embed.addField("Server ID and Name", `ID: ${serverID}, Name: ${client.guilds.get(serverID).name}`);
                    embed.addField("Channel ID", channelID);
                    embed.addField("Message ID", messageID);
                    embed.addField("Request Content", request)
                    embed.setColor('RED');
                    embed.setTimestamp();
                    client.channels.get(contactLogID).send({embed});
                }else if(opt === "reply"){ // Support Team and Devs.
                    // Must be in the appropriate guild.
                    if(msg.guild.id !== "445633045253324810") return;
                    // Must have appropriate roles.
                    if(!msg.member.roles.some(r => ["Developer", "Support"].includes(r.name))) return; 
                    // Issue ID to reply to.
                    let id = args[1];
                    if(!id) return msg.channel.send("You must provide an ID to reply to a contact request.");
                    await client.contactData.defer;
                    if(!client.contactData.get(id)) return msg.channel.send("No such request exists. Syntax: contact reply <issue id> <response>.");
                    let response = args.slice(2).join(" ");
                    if(!response) return msg.channel.send("Please provide a response.");
                    if(response.length>1024) return msg.channel.send("Response must be 1024 characters in length or less, apologies - technical reasons.");
                    let issue = client.contactData.get(id);
                    if(!client.channels.get(issue.channelID)) return msg.channel.send("The channel referenced in that request no longer exists.");
                    let title;
                    // See what role they have. If they have Developer then title's 'Developer',
                    // but otherwise if they have Support it's support.
                    if(msg.member.roles.some(r => ["Developer"].includes(r.name))) title = "Developer";
                    if(msg.member.roles.some(r => ["Support"].includes(r.name))) title = "Support";
                    msg.reply(`replied to contact request ID ${id} successfully.`);
                    client.channels.get(issue.channelID).send(`<@${issue.authorID}>, **${title}** ${msg.author.tag} has responded to your request with the ID of ${id} regarding yzbot with the below content:\`\`\`${response}\`\`\``);
                    let contactLogID = client.channels.get("445633045253324810");
                    const embed = new Discord.RichEmbed();
                    embed.setTitle(`Response to Request #${id}`);
                    embed.addField(`Support Member`, `${msg.author.tag} (${msg.author.id})`);
                    embed.addField("Response:", response);
                    embed.setColor('BLUE');
                    embed.setTimestamp();
                    client.channels.get(contactLogID).send({embed});
                }else if(opt === "blacklist"){ // Dev-Only.
                    if(!client.checks.isDev(msg.author)) return;
                    await client.contactBlacklist.defer;
                    let id;
                    if(!msg.mentions.members.isEmpty()){ 
                        id = msg.mentions.members.first().id;
                    } else {
                        id = args[1];
                    }
                    if(!id) return msg.channel.send("Please provide an ID or a user mention to blacklist from using the contact command.");
                    if(!await id.isUserID()) return msg.channel.send("Please provide a valid ID.");
                    let whitelist = ["445633045253324810", client.user.id];
                    if(whitelist.includes(id)) return msg.channel.send("Yzfire, what do you think you're doing? Don't add you or I to my own contact blacklist.");
                    if(client.contactBlacklist.has(id)) return msg.channel.send("That user's already blacklisted.");
                    let reason = args.slice(2).join(" ");
                    if(!reason) reason = "None specified.";
                    let obj = {
                        reason: reason,
                        id: client.contactBlacklist.size + 1
                    }
                    await client.contactBlacklist.setAsync(id, obj);
                    msg.reply(`blacklisted the user with the ID of ${id} from using the contact command successfully.`);
                    let contactLogID = client.channels.get("445633045253324810");
                    const embed = new Discord.RichEmbed();
                    embed.setTitle(`Contact Blacklist Log`);
                    embed.setDescription(`The Developer has blacklisted a user from using the contact command with the ID of ${id} for the following reason:\n${reason}`);
                    embed.setColor('#000000');
                    embed.setTimestamp();
                    client.channels.get(contactLogID).send({embed});
                }else if(opt === "unblacklist"){ // Also Dev-Only.
                    if(!client.checks.isDev(msg.author)) return;
                    await client.contactBlacklist.defer;
                    let id;
                    if(!msg.mentions.members.isEmpty()){ 
                        id = msg.mentions.members.first().id;
                    } else {
                        id = args[1];
                    }                    
                    if(!id) return msg.channel.send("Please provide an ID or a user mention to blacklist from using the contact command.");
                    if(!await id.isUserID()) return msg.channel.send("Please provide a valid ID.");
                    let whitelist = ["445633045253324810", client.user.id];
                    if(whitelist.includes(id)) return msg.channel.send("Yzfire, what do you think you're doing? Of course you and I aren't blacklisted.");
                    if(!client.contactBlacklist.has(id)) return msg.channel.send("That user is not blacklisted.");                    
                    let reason = args.slice(2).join(" ");
                    if(!reason) reason = "None specified.";
                    await client.contactBlacklist.deleteAsync(id);
                    msg.reply(`unblacklisted the user with the ID of ${id} from using the contact command successfully.`);
                    let contactLogID = client.channels.get("445633045253324810");
                    const embed = new Discord.RichEmbed();
                    embed.setTitle(`Contact Unblacklist Log`);
                    embed.setDescription(`The Developer has unblacklisted a user with the ID of ${id} from using the contact command for the following reason:\n${reason}`);
                    embed.setColor('BLUE');
                    embed.setTimestamp();
                    client.channels.get(contactLogID).send({embed});
                }
            }else{
                return msg.channel.send(`You need to type ${guildConfig.prefix}contact makerequest <request> to make a request.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
            }
        }
    } catch (e) {
        client.logging.logError(`contact command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
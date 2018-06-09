const Discord = require('discord.js');

module.exports = async (msg, embed, memb, reason, action) => {
    // Performs the general wanted actions of a mod log.
    let membGM = false;
    if(memb instanceof Discord.GuildMember) membGM = true;
    action = action.charAt(0).toUpperCase() + action.slice(1);
    const client = msg.client;
    const modlogamt = client.incrementModlog(msg.guild.id, client);

    let thumb = membGM ? memb.user.displayAvatarURL : memb.displayAvatarURL;

    embed.setTitle(`Moderation Log #${modlogamt}`);
    embed.setAuthor(`${msg.author.tag} (ID: ${msg.author.id})`, msg.author.displayAvatarURL);
    embed.setThumbnail(thumb); 
    embed.addField("Action", action);
    embed.addField("Moderator", `<@${msg.author.id}> (${msg.author.tag}, ID: ${msg.author.id})`)
    if(membGM) embed.addField("User", `<@${memb.id}> (${memb.user.tag}, ID: ${memb.id})`);
    else embed.addField(`User`, `${memb.tag} (ID: ${memb.id})`);
    embed.addField(`Reason`, reason);
    embed.setFooter(`${action} Log`);
    embed.setTimestamp();
    return embed;
}
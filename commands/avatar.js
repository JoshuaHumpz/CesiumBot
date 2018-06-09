module.exports.help = {
    name: "avatar",
    description: "Displays your avatar picture (or URL), or, if you mentioned someone, theirs.",
    usage: "avatar <mention>",
    disablable: true
}

const Discord = require('discord.js');

module.exports.run = async (client, msg, args) => {
    try {
        const memb = msg.mentions.members.first() || msg.member;
        const url = memb.user.displayAvatarURL;
        if(msg.guild.me.hasPermission('EMBED_LINKS') || msg.guild.me.hasPermission("ADMINISTRATOR")){ // Can post embeds.
            const embed = new Discord.RichEmbed();
            embed.setColor(`${memb.highestRole.hexColor !== '#000000' ? memb.highestRole.hexColor : 'GREEN'}`);
            embed.setAuthor(`Avatar of ${memb.user.tag}`, null, url);
            embed.setImage(url);
            embed.setTimestamp();
            await msg.channel.send({embed});
        }else{ // Cannot post embeds.
            msg.channel.send(`:warning: Yzbot does not have the \`EMBED_LINKS\` permission. This could make a variety of commands not work as intended, so it's recommended to be enabled. :warning:
            \nAvatar URL of ${memb.user.tag}: ${url}`);
        }
    } catch (e) {
        client.logging.logError(`avatar command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
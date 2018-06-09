module.exports.help = {
    name: "invite",
    description: "Posts two invite links: one to yzbot's support server, and one to invite yzbot to your server. Yzbot should have \`EMBED_LINKS\` permissions or it may not work as expected, especially if your server has invite link filtering.",
    usage: "invite",
    disablable: false
}

const Discord = require('discord.js');

module.exports.run = async (client, msg, args) => {
    try {
        if (msg.guild.me.hasPermission("EMBED_LINKS")) {
            const l = await client.generateInvite(402680982);
            const embed = new Discord.RichEmbed();
            embed.setTitle(`Eagle Invite Links`);
            embed.setColor(`GREEN`);
            embed.addField(`Invite to server`, `${l}`);
            embed.addField(`Support Server`, `[Click to join]https://discord.gg/qRhGcJV`);
            embed.setTimestamp();
            embed.setFooter(`Eagle Invite Links - Requested by ${msg.author.tag}.`);
            await msg.channel.send({ embed });
        } else {
            const l = await client.generateInvite(402680982)
            msg.channel.send(":warning: yzbot does not have EMBED_LINKS permissions. :warning:\nAs a result, this will post a Discord server invite directly. If you have invite link filtering enabled, you should give Eagle the EMBED_LINKS permission because it posts the link behind text saying 'Click to join', so that the message isn't deleted.");
            await msg.channel.send(`__**Eagle Eye Invite Links:**__\n\n**Invite to your server:** ${l}\n**Support Server:** https://discord.gg/qRhGcJV`);
        }
    } catch (e) {
        client.logging.logError(`Invite command failed. ${e.stack}`);
        msg.channel.send(`Sorry, an error occurred.\n\`${e.message}\``);
    }
}
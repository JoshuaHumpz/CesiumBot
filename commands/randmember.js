module.exports.help = {
    name: "randmember",
    description: "Gives a random member of the server.",
    usage: "randmember",
    disablable: true
}

const Discord = require('discord.js');

module.exports.run = async (client, msg, args) => {
    try {
        const rand = msg.guild.members.random().user.tag;
        if(msg.guild.me.hasPermission("EMBED_LINKS") || msg.guild.me.hasPermission("ADMINISTRATOR")){
            const embed = new Discord.RichEmbed();
            embed.setTitle(`Random Member Choice`);
            embed.setColor(`BLUE`);
            embed.setDescription(`Chosen Member: \`${rand}\``);
            embed.setTimestamp();
            msg.channel.send({embed});
        } else {
            msg.channel.send(`:warning: Yzbot does not have \`EMBED_LINKS\` permissions. This could cause a number of commands to not function as expected, so it's recommended to be enabled. :warning:
            \nRandom Member: \`${rand}\``);
        }
    } catch (e) {
        client.logging.logError(`randmember command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
module.exports.help = {
    name: "topic",
    description: "Shows the channel topic.",
    usage: "topic",
    disablable: true
}

const Discord = require('discord.js');

module.exports.run = async (client, msg, args) => {
    try {
        if(msg.guild.me.hasPermission("EMBED_LINKS") || msg.guild.me.hasPermission("ADMINISTRATOR")){
            const embed = new Discord.RichEmbed();
            embed.setTitle(`Channel Topic`);
            embed.setColor('BLUE');
            embed.setDescription(msg.channel.topic || 'None');
            embed.setTimestamp();
            embed.setFooter(`Channel ID: ${msg.channel.id}`);
            await msg.channel.send({embed});
        } else {
            return msg.channel.send(`:warning: Yzbot does not have \`EMBED_LINKS\` permissions. This could cause a number of commands to not function as expected, so it's recommended to be enabled. :warning:
            \n__**Channel Topic**:__\`\`\`${msg.channel.topic}\`\`\``);
        }
    } catch (e) {
        client.logging.logError(`topic command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
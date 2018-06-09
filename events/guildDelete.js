const Discord = require('discord.js');

module.exports = async (client, guild) => {
    try {   
        client.setPlayingStatus();
        if (!client.channels.get("454440956033368078")) return;
        const embed = new Discord.RichEmbed();
        embed.setColor("RED");
        embed.setTitle(`Removed from a server.`);
        embed.addField(`Server Name`, `${guild.name}`, true)
        embed.addField(`Server ID`, `${guild.id}`, true);
        embed.addField(`Channel Amount`, `${guild.channels.size}`);
        embed.addField(`Member Amount`, `${guild.members.size}`);
        embed.setFooter("Server Removal Log");
        embed.setTimestamp();
        await client.channels.get("454440956033368078").send({ embed })
    } catch (e) {
        client.logging.logError(e.stack);
    }
}
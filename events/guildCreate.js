const Discord = require('discord.js');

module.exports = async (client, guild) => {
    try {
        client.setPlayingStatus();
        const defaultSettings = client.config.defaultSettings;
        const defaultLoggingBools = client.config.loggingBools;
        const defaultTags = client.config.tags;
        if (!client.guildSettings.get(guild.id)) client.guildSettings.set(guild.id, defaultSettings);
        if (!client.loggingConfig.get(guild.id)) client.loggingConfig.set(guild.id, defaultLoggingBools);
        if (!client.tags.get(guild.id)) client.tags.set(guild.id, defaultTags);
        if (!client.channels.get("454440956033368078")) return;
        const embed = new Discord.RichEmbed();
        embed.setColor("GREEN");
        embed.setTitle(`Added to a server.`);
        embed.addField(`Server Name`, `${guild.name}`, true)
        embed.addField(`Server ID`, `${guild.id}`, true);
        embed.addField(`Channel Amount`, `${guild.channels.size}`);
        embed.addField(`Member Amount`, `${guild.members.size}`);
        embed.setFooter("Server Addition Log");
        embed.setTimestamp();
        await client.channels.get("454440956033368078").send({ embed });
    } catch (e) {
        client.logging.logError(`guildCreate event error in guild of ID ${guild.id}:\n${e.stack}`);
    }
}
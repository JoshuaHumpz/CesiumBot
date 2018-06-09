module.exports.help = {
    name: "serverconfig",
    description: "Allows you to view Eagle's configuration for this server.",
    usage: "serverconfig",
    disablable: false
}

const Discord = require('discord.js');

module.exports.run = async (client, msg, args) => {
    try {
        const guildConfig = client.guildSettings.get(msg.guild.id);
        // Only start if we can EMBED_LINKS.
        if(client.checks.botHasPerm(msg.guild.me, "EMBED_LINKS", msg)){
            if(client.checks.hasPerm(msg.member, "MANAGE_GUILD", msg) || client.checks.isDev(msg.author)){
                let modlog = guildConfig.modlog !== 'none' ? `<#${guildConfig.modlog}>` : 'None.';
                let joinChan = guildConfig.welcChan ? `<#${guildConfig.welcChan}>` : 'None.';
                let byeChan = guildConfig.leaveChan ? `<#${guildConfig.leaveChan}>` : 'None.';
                let banMsgChan = guildConfig.banmessagechannel ? `<#${guildConfig.banmessagechannel}>` : 'None.';
                const embed = new Discord.RichEmbed();
                embed.setTitle(`Server Configuration for ${msg.guild.name}`);
                embed.addField(`Prefix`, guildConfig.prefix);
                embed.addField(`Mod Log`, modlog); 
                embed.addField(`Number of Mod Logs`, guildConfig.amtmodlogs);
                embed.addField(`Disabled Commands`, guildConfig.disabledCommands.join(", ") || 'None.');
                embed.addField(`Join Message`, guildConfig.welcMsg || 'None.');
                embed.addField(`Join Message Channel`, joinChan)
                embed.addField(`Leave Message`, guildConfig.leaveMsg || 'None.');
                embed.addField(`Leave Message Channel`, byeChan);
                embed.addField(`Ban Message`, guildConfig.banmessage || 'None.');
                embed.addField(`Ban Message Channel`, banMsgChan);
                embed.addField(`Autoname`, guildConfig.autoname || 'None.');
                embed.setTimestamp();
                embed.setFooter(`Configuration requested by ${msg.author.tag}`);
                embed.setColor('BLUE');
                msg.channel.send({embed});
            }
        }
    } catch (e) {
        client.logging.logError(`serverconfig command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
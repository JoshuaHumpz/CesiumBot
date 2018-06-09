module.exports.help = {
    name: "reverse",
    description: "Reverses the text that you input.",
    usage: "reverse <text>",
    disablable: true
}

const Discord = require('discord.js');

module.exports.run = async (client, msg, args) => {
    try {
        let input = args.join(" ");
        if(!input) return msg.channel.send("You must provide a piece of text to reverse, like 'yzfire'.");
        let barredWords = ['enoyreve@', 'ereh@'];
        if(barredWords.includes(args)) return msg.channel.send("You may not reverse those mentions.");
        const reversed = input.split("").reverse().join("");
        if(msg.guild.me.hasPermission("EMBED_LINKS") || msg.guild.me.hasPermission("ADMINISTRATOR")){
            const embed = new Discord.RichEmbed();
            embed.setTitle("Reversal");
            embed.addField(`Input :inbox_tray:`, `\`\`\`${input}\`\`\``);
            embed.addField(`Output :outbox_tray:`, `\`\`\`${reversed}\`\`\``);
            embed.setColor('BLUE');
            embed.setFooter(`Text reversed by ${msg.author.tag}`);
            embed.setTimestamp();
            msg.channel.send({embed});
        } else {
            msg.channel.send(`:warning: Yzbot does not have \`EMBED_LINKS\` permissions. This could cause a number of commands to not function as expected, so it's recommended to be enabled. :warning:
            \n**Input :inbox_tray:**\n\`\`\`${input}\`\`\`\n\n**Output :outbox_tray:**\n\`\`\`${reversed}\`\`\``);
        }
    } catch (e) {
        client.logging.logError(`reverse command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
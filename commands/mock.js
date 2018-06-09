module.exports.help = {
    name: "mock",
    description: "Mocks the inputted text in a manner similar to the Spongebob meme.",
    usage: "mock <text>",
    disablable: true
}

const Discord = require('discord.js');

module.exports.run = async (client, msg, args) => {
    try {
        let letters = args.join(" ").split("");
        if(!args) return msg.channel.send("You must provide some input to mock.");
        let modified = [];
        letters.forEach(l => {
            if(Math.random() > 0.5 && /[a-zA-Z]/.test(l.toString())){
                modified.push(l.toUpperCase());
            } else {
                modified.push(l);
            }
            return modified;
        });
        if(args.includes('@everyone') || args.includes('@here')) return msg.channel.send("You can't mock those mentions.");
        let output = modified.join("");
        if(msg.guild.me.hasPermission("EMBED_LINKS") || msg.guild.me.hasPermission("ADMINISTRATOR")){
            const embed = new Discord.RichEmbed();
            embed.setTitle(`Mocking`);
            embed.addField(`Input :inbox_tray:`, `\`\`\`${args.join(" ")}\`\`\``);
            embed.addField(`Output :outbox_tray:`, `\`\`\`${output}\`\`\``);
            embed.setColor('BLUE');
            embed.setTimestamp();
            embed.setFooter(`Text was mocked by ${msg.author.tag}`)
            await msg.channel.send({embed});
        } else {
            return msg.channel.send(`:warning: Yzbot does not have the \`EMBED_LINKS\` permission. This may cause a number of commands to not function as expected, so it is recommended to be enabled. :warning:
            \n**Input :inbox_tray:**\n\`\`\`${args.join(" ")}\`\`\`\n\n**Output :outbox_tray:**\n\`\`\`${output}\`\`\``);
        }
    } catch (e) {
        client.logging.logError(`mock command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
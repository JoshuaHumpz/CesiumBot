const Discord = require('discord.js');

module.exports.help = {
    name: "choose",
    description: "Chooses from one or more options, separated by '|'s.",
    usage: "choose <option one> | <option two> | ...",
    disablable: true
}

module.exports.run = async (client, msg, args) => {
    if (client.checks.botHasPerm(msg.guild.me, "EMBED_LINKS", msg)) {
        try {
            let theirOptions = args.join(" ").split("|");
            if (!theirOptions || theirOptions.length < 2) return msg.channel.send(`You must provide at least two options.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
            let optionsList = theirOptions.map(opt => opt.trim());
            if (optionsList.includes("")) return msg.channel.send("Please do not provide blank spaces as options (putting the | separator and then not typing a character).");
            if (optionsList.includes("@everyone") || optionsList.includes("@here")) return msg.channel.send("You may not choose from those mentions.");
            const m = await msg.channel.send('Please wait. Yzbot is choosing...')
            const embed = new Discord.RichEmbed();
            embed.setColor("#20dcf9")
            embed.setTitle(`Yzbot's Choice`)
            embed.setDescription("Yzbot has made a decision.")
            embed.addField(`Options Provided`, `\`\`\`${optionsList.join(", ")}\`\`\``)
            embed.addField(`Choice`, `${theirOptions.random()}`)
            embed.setFooter(`Response to choose command executed by ${msg.author.tag}`)
            embed.setTimestamp()
            setTimeout(() => m.edit({embed}), 1000)
        } catch (e) {
            client.logging.logError(`Choose command failed. ${e.stack}`);
            msg.channel.send(`Sorry, an error occurred.\n\`\`${e.message}\`\``);
        }
    }
}
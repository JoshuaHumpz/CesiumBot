module.exports.help = {
    name: "ben",
    description: "Fake bans a user from the server.",
    usage: "ben <user> <reason>",
    disablable: true
}

const Discord = require('discord.js');

module.exports.run = async (client, msg, args) => {
    try {
        let memb = msg.mentions.members.first();
        if (!memb) return msg.channel.send("You must mention someone to ben them.");
        let reason = args.slice(1).join(" ");
        if (!reason) reason = 'None specified.';
        const whitelist = ["267670678050832384", "310853886191599616"];
        if (whitelist.includes(memb.id) && !client.checks.isDev(msg.author)) return msg.channel.send("You can't ben this user.");
        if (memb.user.bot) return msg.channel.send("You can't ben bots.");
        const embed = new Discord.RichEmbed()
        embed.setColor("#ff0000");
        embed.setTitle(`You were benned (fake-banned) in server ${msg.guild.name}`);
        embed.addField(`You were benned by ${msg.author.tag} for the reason`, `${reason}`);
        embed.setTimestamp();
        await memb.send(embed);
        if(client.checks.isDev(msg.author)) return msg.reply(`user ${memb} just got SUPER BENNED.`);
        msg.reply(`user ${memb} was benned successfully.`);
    } catch (e) {
        if (e.message === "Cannot send messages to this user") return msg.channel.send(`The user was benned, but I am unable to send a direct message to this user informing them about their ben.`);
        msg.channel.send(`Sorry, an error occurred.\n\`${e.message}\``);
        client.logging.logError(e.stack);
    }
}
module.exports.help = {
    name: "quote",
    description: "Allows you to quote a user based on message ID. The message ID must refer to a message in the current channel.",
    usage: "quote <messageID>",
    disablable: true
}

const Discord = require('discord.js');

module.exports.run = async (client, msg, args) => {
    try {
        let msgID = args[0];
        if (!msgID) return msg.reply(`please provide a message ID to quote.`);
        if (msgID.length !== 18 || isNaN(msgID)) return msg.reply(`please provide a valid message ID to quote.`);
        const m = await msg.channel.fetchMessage(msgID)
        if (client.checks.botHasPerm(msg.guild.me, "EMBED_LINKS", msg)) {
            let attachmentImages, attachmentLinks;
            if(!m.attachments.isEmpty()) {
                attachmentItems = m.attachments.filter(a => a.height !== undefined);
                attachmentImages = attachmentItems.map(a => a.url);
            }
            const embed = new Discord.RichEmbed();
            embed.setColor('GREEN');
            embed.setAuthor(m.author.tag, m.author.displayAvatarURL);
            embed.setDescription(m.content);
            embed.setTimestamp(m.createdAt);
            if(attachmentImages) embed.setImage(attachmentImages[0]);
            if(attachmentImages[1]) embed.setFooter("There were one or more images that could not be attached to the response. Only one image can be attached.");
            await msg.channel.send({ embed });
        }
    } catch (e) {
        if (e.message === "Unknown Message") {
            return msg.channel.send(`That message does not exist, or it does not come from this channel.`);
        } else {
            return msg.channel.send(`Sorry, an error has occurred.\n\`\`${e.message}\`\``);
            client.logging.logError(`Quote command failed: ${e.stack}`);
        }
    }
}

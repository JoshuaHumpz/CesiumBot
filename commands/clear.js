module.exports.help = {
    name: "clear",
    description: "Clears the specified amount of messages from the channel. The number of messages must be between 1 and 100.",
    usage: "clear <amount>",
    disablable: true
}

module.exports.run = async (client, msg, args) => {
    if (client.checks.botHasPerm(msg.guild.me, "MANAGE_MESSAGES", msg)) {
        if (client.checks.hasPerm(msg.member, "MANAGE_MESSAGES", msg)) {
            try {
                let amount = args[0];
                if (!amount) return msg.channel.send(`You must enter a number of messages that is between 1 and 100 to delete.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
                if (isNaN(amount)) return msg.channel.send(`You must enter a valid number of messages to delete.\n\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
                if (parseFloat(amount).toString().split(".")[1]) return msg.channel.send("You must provide an integer for the amount of messages to delete.");
                let amountInteger = parseInt(amount);
                if (amountInteger < 1 || amountInteger > 100) return msg.channel.send(`You must enter a number of messages that is between 1 and 100 to delete.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
                let m = await msg.channel.fetchMessages({ limit: amountInteger + 1 });
                // This section is basically making sure that I handle messages that are older than fourteen days correctly.
                let fourteenDays = Date.now() - 1209600000;
                let mOldSize = m.size; 
                m.forEach((value, key, map) => {
                    // Check if the created timestamp is longer than 14 days ago.
                    if(value.createdTimestamp < fourteenDays) map.delete(key);
                });
                // The secret force behind all of this. TextChannel.bulkDelete().
                let deleted = await msg.channel.bulkDelete(m);
                // Is the size of the original messages the size of the messages now? If not, return with an alternative message compared to usual.
                if(mOldSize !== m.size) return msg.reply(`cleared **${deleted.size - 1} message(s)** successfully! (${mOldSize - deleted.size} message(s) could not be cleared as they must be less than 14 days old).`).then(m => m.delete(3000));
                const rep = await msg.reply(`cleared **${deleted.size - 1} message(s)** successfully!`); // Tell the user that they successfully deleted the wanted messages.
                await rep.delete(1500); // Delete response.
            } catch (e) {
                client.logging.logError(`Clear command failed. ${e.stack}`);
                msg.channel.send(`Sorry, an error occurred.\n\`\`${e.message}\`\``);
            }
        }
    }
}
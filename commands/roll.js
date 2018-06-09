module.exports.help = {
    name: "roll",
    description: "Roll a dice from 1-6.",
    usage: "roll",
    disablable: true
}

module.exports.run = async (client, msg, args) => {
    try {
        msg.reply(`you rolled \`${Math.floor(Math.random() * 6) + 1}\`.`);
    } catch (e) {
        client.logging.logError(`roll command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
module.exports.help = {
    name: "lenny",
    description: "Sends a lenny face to the current channel.",
    usage: "lenny",
    disablable: true
}

module.exports.run = async (client, msg, args) => {
    try {
        await msg.channel.send("( ͡° ͜ʖ ͡°)");
    } catch (e) {
        client.logging.logError(`(Somehow?) Lenny command failed. ${e.stack}`);
        msg.channel.send(`Sorry, an error occurred with this command... (Somehow?) \`${e.message}\``);
    }
}
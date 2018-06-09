module.exports.help = {
    name: "gitbook",
    description: "Provides a link to Eagle Eye's GitBook page. This allows you to read in-depth guides about how to utilise Eagle's numerous features to the best of their ability.",
    usage: "gitbook",
    disablable: true
}

module.exports.run = async (client, msg, args) => {
    try {
        await msg.reply("We have no GitBook page for now! Sorry for any convinience");
    } catch (e) {
        client.logging.logError(`gitbook command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
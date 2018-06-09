module.exports.help = {
    name: "",
    description: "",
    usage: "",
    disablable: true
}

module.exports.run = async (client, msg, args) => {
    try {
        
    } catch (e) {
        client.logging.logError(`COMMANDNAME command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
    // Use the below line of code if you need to say somehow that the user used the command incorrectly:
    // return msg.channel.send(`\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
}
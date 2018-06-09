module.exports.help = {
    name: "membercount",
    description: "Tells you the member count of the server.",
    usage: "membercount",
    disablable: true
}

module.exports.run = async (client, msg, args) => {
    try {
        let bots = msg.guild.members.filter(m => m.user.bot).size;
        let amt = msg.guild.members.size;
        msg.channel.send(`There are currently ${amt} members: ${amt - bots} humans and ${bots} bots.`);
    } catch (e) {
        client.logging.logError(`membercount command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
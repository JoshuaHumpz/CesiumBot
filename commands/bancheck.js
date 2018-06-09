module.exports.help = {
    name: "bancheck",
    description: "Checks if the user ID specified is banned in this server. Credit to ShineyDev for the command idea.",
    usage: "bancheck <id>",
    disablable: true
}

module.exports.run = async (client, msg, args) => {
    try {
        let id = args[0];
        if(!id) return msg.channel.send("You must provide an ID to check if it's banned.");
        if(!await id.isUserID()) return msg.channel.send("You must provide a valid user ID.");
        let bans = await msg.guild.fetchBans();
        let banned = false;
        if(bans.get(id)) banned = true;
        banned ? msg.channel.send(`The user with the ID of ${id} is banned.`) : msg.channel.send(`The user with the ID of ${id} is not banned.`);   
    } catch (e) {
        client.logging.logError(`bancheck command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
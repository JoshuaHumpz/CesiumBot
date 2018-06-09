module.exports.help = {
    name: "pun",
    description: "Gets a random pun. (Disclaimer: I didn't make the puns, they come from an external source, don't blame me for any bad puns).",
    usage: "pun",
    disablable: true
}

// Destructuring and defining constants at top of program
const { get } = require('snekfetch');
const api = 'https://getpuns.herokuapp.com/api/random'; 

module.exports.run = async (client, msg, args) => {
    try {
        const data = await get(api);
        msg.channel.send(`The below pun is going to be very *punny*, I'm sure... ~~ha ha ha~~\n\n${JSON.parse(data.body).Pun}`);
    } catch (e) {
        client.logging.logError(`pun command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
module.exports.help = {
    name: "rate",
    description: "I will rate what you ask me to with this command, on a scale from 0-10.",
    usage: "rate <what you want to rate>",
    disablable: true
}

module.exports.run = async (client, msg, args) => {
    try {
        let item = args.join(" ");
        if(args.includes('@here') || args.includes('@everyone')) return msg.channel.send("You can't rate those mentions.");
        if(!item) return msg.channel.send("Please provide what you want to rate.");
        if(item === "yzfire" || item === "yzbot") return msg.channel.send(`I rate ${item} at 10/10`);
        await msg.channel.send(`I rate \`${item}\` at ${Math.floor(Math.random() * 10)}/10`);
    } catch (e) {
        client.logging.logError(`rate command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
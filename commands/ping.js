module.exports.help = {
    name: "ping",
    description: "Returns the response time of the bot in milliseconds. (ms)",
    usage: "ping",
    disablable: false
}

module.exports.run = async (client, msg, args) => {
    const m = await msg.channel.send(`Ping!...`)
    await m.edit(`:ping_pong: Pong! The ping is currently: **${m.createdTimestamp - msg.createdTimestamp}ms**`);
}
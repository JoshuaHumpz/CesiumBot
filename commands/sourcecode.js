const { readFile } = require("fs");

module.exports.run = async (client, msg, args) => {
    try {
        if (!client.checks.isDev(msg.author)) return;
        const cmd = args[0];
        if (!client.commandNames.includes(cmd)) return msg.reply("That isn't a command.");
        readFile(`./commands/${cmd}.js`, async (err, data) => {
            if (err) return client.logging.logError(err.stack);
            await msg.channel.send(data, {code:'js', split: 2000});
        });
    } catch (e) {
        client.logging.logError(`sourcecode command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
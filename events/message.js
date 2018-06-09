module.exports = async (client, msg) => {
    try {
        if (!msg.guild || msg.author.bot) return; // If the message isn't in a guild, or if the author is a bot, return (stop execution)
        if (!msg.guild.available) return;
        if (client.talkedRecently.has(msg.author.id)) return;
        if (client.blacklist.has(msg.author.id) && msg.author.id !== "445633045253324810") return;
        if (msg.author.id !== "445633045253324810") { // I bypass the rate limit.
            client.talkedRecently.add(msg.author.id);
            setTimeout(() => {
                // Removes the user from the set after 2 seconds
                client.talkedRecently.delete(msg.author.id);
            }, 2000);
        }
        let tags = client.tags.get(msg.guild.id); // Get the tags for the current guild.
        let tName = msg.content.trim().split(/ +/g)[0]; // Trims and splits by space, getting first arg.
        if (tags[tName]) {
            msg.channel.send(tags[tName]);
        }
        const guildConfig = client.guildSettings.get(msg.guild.id); // Define the guild's current configuration.
        const prefix = guildConfig.prefix; // Define the prefix.
        const args = msg.content.slice(prefix.length)/*.trim()*/.split(" "); // Slice the prefix off, trim whitespace and split into an array separated by when the user types a space
        const command = args.shift().toLowerCase(); // get the first argument (the command) and make it lowercase
        if (!client.commandNames.includes(command)) return; // Does the command names include the command? If no, return. This prevents people from loading stuff like etc/passwd into memory because they know Linux.
        if (msg.content.indexOf(prefix) !== 0) return; // No prefix? Return!
        // If the cmd is global disabled and the user isn't support and isn't dev, return.
        if (client.globalDisabledCommands.has("all") && (!client.checks.isSupport(client, msg.author) && !client.checks.isDev(msg.author)) ) return msg.reply(`Sorry, all commands have been disabled by the Developer, for the following reason:\n\`\`\`${client.globalDisabledCommands.get("all").reason}\`\`\`\nSorry if any inconvenience has been caused.`);
        if (client.globalDisabledCommands.has(command) && (!client.checks.isSupport(client, msg.author) && !client.checks.isDev(msg.author)) ) return msg.reply(`Sorry, this command has been disabled by the Developer, for the following reason:\n\`\`\`${client.globalDisabledCommands.get(command).reason}\`\`\`\nSorry if any inconvenience has been caused.`);
        if (!client.checks.isDisabled(command, msg, client)) {
            let commandFile = require(`../commands/${command}.js`);
            await commandFile.run(client, msg, args);
            client.logging.logUse(command, msg);
        }        
    } catch (e) {
        client.logging.logError(`message event failed, msg id ${msg.id} in guild ${msg.guild.id}.\n${e.stack}`);
    }
}
module.exports.help = {
    name: "autoname",
    description: "Allows you to set an autoname for your server. Supports a single placeholder: <USERNAME>, replacing with the user's username. Requires MANAGE_SERVER_ permission.",
    usage: "autoname <set/remove> <name>",
    disablable: false
}

module.exports.run = async (client, msg, args) => {
    try {
        if (client.checks.hasPerm(msg.member, "MANAGE_GUILD", msg)) {
            let opt = args[0];
            const guildConfig = client.guildSettings.get(msg.guild.id);
            if (opt === 'set') {
                const autoname = args.slice(1).join(" ");
                if (!autoname) return msg.channel.send("Please provide an autoname to set.");
                guildConfig.autoname = autoname;
                client.guildSettings.set(msg.guild.id, guildConfig);
                return msg.reply(`autoname set as the following successfully: \`${autoname}\``);    
            } else if (opt === 'remove') {
                guildConfig.autoname = "";
                client.guildSettings.set(msg.guild.id, guildConfig);
                return msg.reply("removed autoname for this server successfully.");
            } else {
                return msg.channel.send(`Invalid option, please specify whether to set or remove the autoname.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
            }
        }
    } catch (e) {
        client.logging.logError(`autoname command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
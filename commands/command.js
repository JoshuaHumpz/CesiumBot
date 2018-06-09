module.exports.help = {
    name: "command",
    description: "Allows you to enable, disable, list the disabled commands for this server, and list the commands that can be disabled. You only need to provide the command for enable and disable. If you type ;command disablable a list of the commands that you can disable will come up.",
    usage: "command <enable/disable/listdisabled/disablable> <command>",
    disablable: false
}
module.exports.run = async (client, msg, args) => {
    if (client.checks.hasPerm(msg.member, "MANAGE_GUILD", msg) || client.checks.isDev(msg.author)) {
        try {
            let opt = args[0];
            let allowedOpts = ["enable", "disable", "listdisabled", "disablable"];
            const guildConfig = client.guildSettings.get(msg.guild.id);
            const prefix = guildConfig.prefix;
            if (allowedOpts.includes(opt)) {
                const commandList = client.disablableCommands;
                if (opt === 'disable') {
                    let toDisable = args.slice(1).join(" ");
                    if (!toDisable) return msg.channel.send(`You need to provide a command to disable. Type ${prefix}command disablable for the list of commands you can disable or enable.\n\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
                    if (!commandList.includes(toDisable)) return msg.channel.send(`The command \`\`${toDisable}\`\` can't be disabled, or it doesn't exist at all. Type ${prefix}command disablable for the list of commands that you can.`);
                    if (guildConfig.disabledCommands.includes(toDisable)) return msg.reply(`that command is already disabled. To get a full list of the disabled commands use the 'command listdisabled' command.`);
                    guildConfig.disabledCommands.push(toDisable);
                    client.guildSettings.set(msg.guild.id, guildConfig);
                    await msg.reply(`the command **${toDisable}** was disabled successfully.`);
                } else if (opt === 'enable') {
                    const toEnable = args.slice(1).join(" ");
                    if (!toEnable) return msg.channel.send(`You need to provide a command to enable. Type ${prefix}command disablable for the list of commands you can disable or enable.\n\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
                    if (!commandList.includes(toEnable)) return msg.channel.send(`The command \`\`${toEnable}\`\` can't be enabled, or it doesn't exist at all. Type ${prefix}command disablable for the list of commands that you can.`);
                    if (!guildConfig.disabledCommands.includes(toEnable)) return msg.reply("that command is not disabled.");
                    let commIndex = guildConfig.disabledCommands.indexOf(toEnable);
                    guildConfig.disabledCommands.splice(commIndex, 1);
                    client.guildSettings.set(msg.guild.id, guildConfig);
                    await msg.reply(`the command **${toEnable}** was reenabled successfully.`);
                } else if (opt === 'listdisabled') {
                    if (guildConfig.disabledCommands.length >= 1) {
                        return msg.channel.send(`The list of disabled commands for the server **${msg.guild.name}** is:\n${guildConfig.disabledCommands.join(", ")}`);
                    } else {
                        return msg.channel.send(`No commands are disabled.`);
                    }
                } else if(opt === 'disablable'){
                    await msg.channel.send(`Here is the full list of commands which can be disabled:\n${commandList.join(", ")}`);
                }
            } else {
                return msg.channel.send(`You have used this command incorrectly.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
            }
        } catch (e) {
            client.logging.logError(`'command' command failed. ${e.stack}`);
            await msg.channel.send(`Sorry, an error occurred. \`${e.message}\``);
        }
    }
}
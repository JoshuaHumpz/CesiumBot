module.exports.help = {
    name: "prefix",
    description: "Allows you to set Eagle's prefix for the current server.",
    usage: "prefix <set> <new prefix>",
    disablable: false
}

module.exports.run = async (client, msg, args) => {
    try {
        if(client.checks.hasPerm(msg.member, "MANAGE_GUILD", msg)){
            const guildConfig = client.guildSettings.get(msg.guild.id);
            let opt = args[0];
            const allowedOpts = ["set"];
            if(allowedOpts.includes(opt)){
                if(opt === "set"){
                    let newP = args[1];
                    if(!newP) return msg.channel.send("You must provide a new prefix to set.");
                    if(args[2]) return msg.channel.send("You can't have spaces in the prefix.");
                    if(newP.length > 8) return msg.channel.send("The length of the new prefix must be 8 characters or less.");
                    guildConfig.prefix = newP;
                    client.guildSettings.set(msg.guild.id, guildConfig);
                    return msg.reply(`set the new prefix as \`${newP}\` successfully.`);
                }
            }else{
                return msg.channel.send(`Type ${guildConfig.prefix}prefix set <new prefix> to set a new prefix.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
            }
        }
    } catch (e) {
        client.logging.logError(`prefix command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
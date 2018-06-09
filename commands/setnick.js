module.exports.help = {
    name: "setnick",
    description: "Sets the nickname of the mentioned user, or yourself if the mention is omitted.",
    usage: "setnick <user> <new nickname>",
    disablable: true
}

module.exports.run = async (client, msg, args) => {
    try {
        if (client.checks.botHasPerm(msg.guild.me, "MANAGE_NICKNAMES", msg)) {
            let memb = msg.mentions.members.first() || msg.member;
            let nick = msg.mentions.members.first() ? args.slice(1).join(" ") : args.join(" "); // If there's a mention, we slice from the first index of args and join, else join it all.
            if (!nick) return msg.channel.send("Please provide a nickname to set.");
            if (nick.length > 32) return msg.channel.send("You must provide a nickname that is less than 32 characters in length.");
            if (memb.id === msg.guild.ownerID && msg.author.id !== msg.guild.ownerID) return msg.channel.send("I can't set the nickname of the server owner, and nor can you.");
            if (memb.id === msg.guild.ownerID && msg.author.id === msg.guild.ownerID) return msg.channel.send("As you're the server owner, I can't set your nickname, sorry.");
            const authorHighRole = msg.member.highestRole.position;
            const membHighRole = memb.highestRole.position;
            // We check if the bot is higher than the user later, and you can
            // obviously set your own nickname, so this is the only check needed.
            if (memb.id !== msg.author.id) {
                if (membHighRole >= authorHighRole) return msg.channel.send("You cannot set the nickname of this user as they have a higher role than you.");
            }
            if (msg.guild.me.highestRole.position <= membHighRole) return msg.channel.send("I could not set the nickname of the specified user as they have a higher or equal role than me.");
            if (memb.id === msg.author.id) { // We're changing our nick.
                if(client.checks.hasPerm(msg.member, "CHANGE_NICKNAME", msg)){ // CHANGE_NICKNAME is required to change our own nick.
                    await memb.setNickname(nick, `setnick command executed by ${msg.author.tag}`);
                    msg.reply(`set your nickname to \`${nick}\` successfully!`);
                }
            } else { // We're changing someone else's nick.
                if(client.checks.hasPerm(msg.member, "MANAGE_NICKNAMES", msg)){ // MANAGE_NICKNAMES is required to change someone else's nick.
                    await memb.setNickname(nick, `setnick command executed by ${msg.author.tag}`);
                    msg.reply(`set the nickname of ${memb} to \`${nick}\` successfully!`);
                }
            }
        }
    } catch (e) {
        client.logging.logError(`setnick command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
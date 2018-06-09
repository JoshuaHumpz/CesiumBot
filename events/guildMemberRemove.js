module.exports = async (client, member) => {
    try {
        let guildConfig = client.guildSettings.get(member.guild.id);
        if (guildConfig.leaveMsg && guildConfig.leaveChan) { // Are both set?
            const substituteValues = (message) => {
                return message.replaceAll("<USER>", `<@${member.id}>`)
                .replaceAll("<SERVERNAME>", member.guild.name)
                .replaceAll("<MEMBERCOUNT>", member.guild.members.size)
                .replaceAll("<MEMBERID>", member.id)
                .replaceAll("<USERTAG>", member.user.tag)
            }
            if (!client.channels.get(guildConfig.leaveChan)) {
                guildConfig.leaveChan = "";
                return client.guildSettings.set(member.guild.id, guildConfig);
            }

            await client.channels.get(guildConfig.leaveChan).send(substituteValues(guildConfig.leaveMsg))
        }
    } catch (e) {
        client.logging.logError(`An error has occured in the guildMemberRemove event in ${member.guild.id}:\n${e.stack}`);
    }
}
module.exports = async (client, member) => {
    try {
        let guildConfig = client.guildSettings.get(member.guild.id);

        if (guildConfig.autoname) {
            console.log("We're in.");
            // Must have appropriate perms.
            if (!member.guild.me.hasPermission("MANAGE_NICKNAMES") && !member.guild.me.hasPermission("ADMINISTRATOR")) return;
            console.log("Got past perm check.");
            const replaceValues = (autoname) => {
                // GuildMember.displayName will be equal to the member's nickname
                // Upon the guild join.
                return autoname.replaceAll("<USERNAME>", member.displayName);
            }

            // Let's ensure that we really do have correct and higher roles.
            if (member.highestRole.position >= member.guild.me.highestRole.position) return;

            const nickname = replaceValues(guildConfig.autoname);
            if (nickname.length > 32) nickname = nickname.substring(0, 31);
            console.log(nickname)
            member.setNickname(nickname, "Autoname, Eagle Eye.");
        }

        if (guildConfig.welcMsg && guildConfig.welcChan) { // Are both set?
            const substituteValues = (message) => {
                return message.replaceAll("<USER>", `<@${member.id}>`)
                .replaceAll("<SERVERNAME>", member.guild.name)
                .replaceAll("<MEMBERCOUNT>", member.guild.members.size)
                .replaceAll("<MEMBERID>", member.id)
                .replaceAll("<USERTAG>", member.user.tag)
            }
            if (!client.channels.get(guildConfig.welcChan)) {
                guildConfig.welcChan = "";
                return client.guildSettings.set(member.guild.id, guildConfig);
            }

            await client.channels.get(guildConfig.welcChan).send(substituteValues(guildConfig.welcMsg));
        }
    } catch (e) {
        client.logging.logError(`An error has occured in the guildMemberAdd event in ${member.guild.id}:\n${e.stack}`);
    }
}
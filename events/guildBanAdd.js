module.exports = async (client, guild, user) => {
    try {
        const gcon = client.guildSettings.get(guild.id);
        if (gcon.banmessage && gcon.banmessagechannel) { // If we have a ban message and a ban message channel.
            if (!client.channels.get(gcon.banmessagechannel)) { // Reset the ban message channel if it exists no longer.
                gcon.banmessagechannel = "";
                return client.guildSettings.set(guild.id, gcon);
            }

            // The bot'll need to have the right perms before proceeding.
            if (!guild.me.hasPermission("VIEW_AUDIT_LOG") && !guild.me.hasPermission("ADMINISTRATOR")) return;

            const audit = await guild.fetchAuditLogs({
                type: 22
            });

            const banData = audit.entries.first(); // The latest ban is always first key.
            const executor = banData.executor;
            const bannedUser = banData.target;
            // Add more stuff to this later.
            const substituteValues = text => {
                // Replace all appropriate values.
                return text.replaceAll("<REASON>", banData.reason)
                    .replaceAll("<EXECUTOR>", `<@${executor.id}>`)
                    .replaceAll("<EXECUTORTAG>", executor.tag)
                    .replaceAll("<EXECUTORID>", executor.id)
                    .replaceAll("<BANNEDUSER>", `<@${bannedUser.id}>`)
                    .replaceAll("<BANNEDUSERTAG>", bannedUser.tag)
                    .replaceAll("<BANNEDUSERID>", bannedUser.id);
            }
            // Send off the message.
            await client.channels.get(gcon.banmessagechannel).send(substituteValues(gcon.banmessage));
        }
    } catch (e) {
        client.logging.logError(`Error occurred in the guildBanAdd event:\n${e.stack}`);
    }
}
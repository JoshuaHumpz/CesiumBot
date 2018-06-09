module.exports = async client => {
    await client.guildSettings.defer;
    client.logging.log(`Loaded ${client.guildSettings.size} keys from client.guildSettings.`);
    await client.contactBlacklist.defer;
    client.logging.log(`Loaded ${client.contactBlacklist.size} keys from client.contactBlacklist.`);
    await client.blacklist.defer;
    client.logging.log(`Loaded ${client.blacklist.size} keys from client.blacklist.`);
    await client.loggingConfig.defer;
    client.logging.log(`Loaded ${client.loggingConfig.size} keys from client.loggingConfig.`);
    await client.tags.defer;
    client.logging.log(`Loaded ${client.tags.size} keys from client.tags.`);
    await client.contactData.defer;
    client.logging.log(`Loaded ${client.contactData.size} keys from client.contactData.`);
    await client.muteData.defer;
    client.logging.log(`Loaded ${client.muteData.size} keys from client.muteData.`);
    client.logging.log(`Logged in as ${client.user.tag}.
    \nServing ${client.users.size} Discord users.
    \nWatching over the ${client.channels.size} combined channels of ${client.guilds.size} servers.`);
    await client.user.setStatus('dnd');
    client.logging.log('Set playing status to Do not Disturb.');
    await client.setPlayingStatus();
    client.logging.log('Set playing status game.');
    // We don't want guilds to be added to and they don't have any settings and my bot crashes when it comes back on
    // Credits to evie.codes for the following code, taken straight from An Idiot's Guide official server and modified
    // to my own purposes.
    setTimeout(() => {
        client.guilds.filter(g => !client.guildSettings.has(g.id)).forEach(g => client.guildSettings.set(g.id, client.config.defaultSettings));
        client.guilds.filter(g => !client.loggingConfig.has(g.id)).forEach(g => client.loggingConfig.set(g.id, client.config.loggingBools));
        client.guilds.filter(g => !client.tags.has(g.id)).forEach(g => client.tags.set(g.id, client.config.tags));
        client.logging.log("Set guild settings for guilds that the bot was potentially added to while it was offline.");
    }, 500);
    const snekfetch = require('snekfetch')

    // DBL Code. When you get the token, uncomment.
    // setInterval(() => {
    // snekfetch.post(`https://discordbots.org/api/bots/stats`)
    //     .set('Authorization', require('../auth.json').dbltoken)
    //     .send({ server_count: client.guilds.size })
    //     .then(() => client.logging.log('Updated discordbots.org stats.'))
    //     .catch(err => client.logging.logError(`Whoops something went wrong: ${err.body}`));
    // }, 3600000);
    client.logging.log("Bot ready.");
}
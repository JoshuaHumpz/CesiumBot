const Discord = require('discord.js');
const fs = require('fs');
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
//const EnmapSQLite = require('enmap-sqlite');

const client = new Discord.Client({
    disableEveryone: true,
    fetchAllMembers: true
});


client.config = require('./config.json');
client.checks = require('./util/checks.js');
client.logging = require('./util/logging.js');
client.incrementModlog = require('./util/incrementModlog.js');
client.createModlog = require('./util/createModlog.js');

// --Start Enmap Declarations.--
// For all by-guild settings.
client.guildSettings = new Enmap({ provider: new EnmapLevel({ name: "guildSettings" }) });
// For contact blacklist.
client.contactBlacklist = new Enmap({ provider: new EnmapLevel({ name: "contactBlacklist" }) });
// For normal blacklist.
client.blacklist = new Enmap({ provider: new EnmapLevel({ name: "blacklistedPeople" }) });
// For logging booleans.
client.loggingConfig = new Enmap({ provider: new EnmapLevel({ name: "loggingBools" }) });
// For tags system.
client.tags = new Enmap({ provider: new EnmapLevel({ name: "tagData" }) });
// For contact data.
client.contactData = new Enmap({ provider: new EnmapLevel({ name: "contactData" }) });
// For mute data.
client.muteData = new Enmap({ provider: new EnmapLevel({ name: "muteData" }) });
// For globally disabled commands list.
client.globalDisabledCommands = new Enmap({provider: new EnmapLevel({ name: "globalDisabledCommands"} )});
// --End Enmap Declarations.--

require('./util/functions.js')(client);

fs.readdir("./events/", (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

client.helpData = new Discord.Collection();
client.disablableCommands = [];

// Read the commands directory into memory.
fs.readdir("./commands", (err, files) => {
    if (err) throw err;
    client.commandNames = files.map(f => f.substring(0, f.length - 3));
    client.logging.log(`Loading a total of ${client.commandNames.length} commands.`);
    client.commandNames.forEach(f => {
        client.logging.log(`Loading command '${f}'...`);
    });

    files.forEach(f => {
        const helpData = require(`./commands/${f}`).help;
        if (!helpData) return;
        client.helpData.set(helpData.name, helpData);
        if(helpData.disablable === true) client.disablableCommands.push(helpData.name);
    });

    client.logging.log(`Successfully set helpData and client.disablableCommands.`);

});

client.setPlayingStatus = () => client.user.setActivity(`;help | ;contact for support, bug reports, suggestions | Currently serving ${client.users.size} members of ${client.guilds.size} servers.`);

client.talkedRecently = new Set();

// Every second, check client.muteData if there is anyone who has been muted and needs to be unmuted (expire time finished).
setInterval(async () => {
    // For every element in client.muteData do this
    for(const m of client.muteData) {
        // If the current timestamp is greater than the set timestamp.
        let log = m[1];
        // This triggers if the user's mute has actually expired.
        if (Date.now() > log.expireTimestamp) {
            client.logging.log(`Mute log of ID ${log.id} has expired`);
            // We want to just straight up delete this guy from DB. Their mute is over and that is that.
            client.muteData.delete(log.id);
            // An object representing the guild that the mute was in.
            let g = client.guilds.get(log.serverID);
            // If the bot is no longer in the guild.
            if (!g) return;
            // If the roles exists no longer.
            if (!g.roles.get(log.muteroleID)) return;

            let memb = g.member(log.userID);

            if (!memb) return;

            // If bot doesn't have permission, return, so we won't get some kind of error
            // if we try to remove the user's role and the bot has not got correct perms
            if (!g.me.hasPermission("MANAGE_ROLES")) return;
            // Remove role, if bot has perms.
            const guildConfig = client.guildSettings.get(g.id);
            if(memb.roles.get(guildConfig.muteroleID)) memb.removeRole(log.muteroleID, "Automatic unmute - yzbot.");
            // Logging the unmute.
            let loggingConfig = client.loggingConfig.get(g.id);
            if (!loggingConfig) {
                client.logging.log(`${msg.guild.name} - Logging config was not found, resetting.`);
                client.loggingConfig.set(g.id, client.config.loggingBools);
            }
            let isDisabled = loggingConfig["unmuteLogDisabled"];
            let logDisabled = isDisabled ? true : false
            if (!logDisabled) {
                let guildConfig = client.guildSettings.get(g.id);
                let modlog = guildConfig.modlog; // The ID of the Mod Log.
                if (modlog === "none") return;
                if (!client.channels.get(modlog)) { // If the mod log channel no longer exists.
                    client.logging.log(`Reset mod log of guild ${g.id}, was not found while attempting to unmute a user`);
                    guildConfig.modlog = "none";
                    return client.guildSettings.set(g.id, guildConfig);
                } else { // We can get the mod log.
                    let modlogChannel = client.channels.get(modlog);
                    if (modlogChannel.permissionsFor(g.me).has([["EMBED_LINKS", "READ_MESSAGES", "SEND_MESSAGES"]])) {
                        let modlogamt = client.incrementModlog(g.id, client);
                        const embed = new Discord.RichEmbed();
                        embed.setTitle(`Moderation Log #${modlogamt}`);
                        embed.setColor("GREEN");
                        embed.setAuthor(`${client.user.tag} (ID: ${client.user.id})`, client.user.displayAvatarURL);
                        embed.setThumbnail(memb.user.displayAvatarURL);
                        embed.addField(`Action`, `Unmute`);
                        embed.addField(`Moderator`, `<@${client.user.id}> (${client.user.tag}, ID: ${client.user.id})`)
                        embed.addField(`User`, `<@${memb.id}> (${memb.user.tag}, ID: ${memb.id})`);
                        embed.addField(`Reason`, "Unmuted automatically by time limit.");
                        embed.setFooter(`Unmute Log`);
                        embed.setTimestamp();
                        await client.channels.get(modlog).send({ embed });
                    }
                }
            }
        }
    }
}, 1000);

process.on('unhandledRejection', err => client.logging.warn(err.stack));

client.login(process.env.BOT_TOKEN);

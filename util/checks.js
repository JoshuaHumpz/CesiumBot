const Discord = require('discord.js');
module.exports.isDev = (user) => {
    if(user instanceof Discord.User){
        if(user.id === user.client.config.devID){
            return true
        } else { 
            return false;
        }
    } else {
        throw new TypeError(`Invalid user passed into isDev`);
    }
}

module.exports.hasPerm = (guildMember, perm, msg) => {
    if(guildMember instanceof Discord.GuildMember) { 
        if(guildMember.hasPermission(perm) || guildMember.hasPermission("ADMINISTRATOR") || guildMember.id === msg.guild.ownerID){
            return true
        } else {
            if(perm === "MANAGE_GUILD") perm = "MANAGE_SERVER";
            msg.channel.send(`You require the \`\`${perm}\`\` permission to use this command.`);
            return false;
        }
    } else {
        throw new TypeError(`Invalid guildMember passed into hasPerm`);
    }
}

module.exports.botHasPerm = (bot, perm, msg) => {
    if(bot instanceof Discord.GuildMember) {
        if(bot.hasPermission(perm) || bot.hasPermission("ADMINISTRATOR")){
            return true;
        } else {
            if(perm === "MANAGE_GUILD") perm = "MANAGE_SERVER";
            msg.channel.send(`I require the \`\`${perm}\`\` permission to perform the actions necessary to this command.`);
            return false;
        }
    } else {
        throw new TypeError(`Invalid bot passed into botHasPerm`);
    }
}

module.exports.isDisabled = (command, msg, client) => {
    let guildConfig = client.guildSettings.get(msg.guild.id);
    if(guildConfig.disabledCommands.includes(command)){
        msg.channel.send(`The \`\`${command}\`\` command has been disabled by an Admin.`);
        return true; // It's disabled.
    } else {
        return false; // It's not disabled.
    }
}


module.exports.botHasPerms = (bot, perms, msg) => {
    if(!bot instanceof Discord.GuildMember) throw new TypeError(`Invalid bot passed into botHasPerms. Must be a guildMember.`);
    if(Array.isArray(perms)){
        if(bot.hasPermission(perms) || bot.hasPermission("ADMINISTRATOR")){ // .hasPermissions is deprecated. You can pass an array into .hasPermission.
            return true;
        } else {
            msg.channel.send(`I require the following permissions in order to perform the actions necessary to this command:\n${perms.map(p => `• \`\`${p}\`\``).join("\n")}`);
            return false;
        }
    } else {
        throw new TypeError("Invalid perms passed into botHasPerms. Must be an array.");
    }
}

module.exports.isLogDisabled = (log, msg, client) => {
    if(!log | !msg | !client) throw new TypeError(`You must provide a log, message and client.`);
    let loggingConfig = client.loggingConfig.get(msg.guild.id);
    if(!loggingConfig){
        msg.channel.send(`Logging config was not found, resetting.`);
        client.loggingConfig.set(msg.guild.id, client.config.loggingBools);
    } 
    let modlogOpts = ["unmute", "ban", "hackban", "kick", "mute", "unban"];
    if(modlogOpts.includes(log)){
        let modlog = client.guildSettings.get(msg.guild.id).modlog;
        if(modlog === "none") return true;
        let isDisabled = loggingConfig[`${log}LogDisabled`];
        if(isDisabled){
            return true;
        } else {
            return false;
        }
    }else { // For other logs. Deal with this at a later stage.

    }
}

module.exports.botChannelPerms = (bot, perms, channelID, msg, client) => {
    if(!bot instanceof Discord.GuildMember) throw new TypeError(`Invalid bot passed into botChannelPerms. Must be a guildMember.`);
    if(Array.isArray(perms)){
        let chan = client.channels.get(channelID);
        if(chan.permissionsFor(bot).has(perms)){
            return true;
        } else {
            return false;
        }
    } else {
        throw new TypeError(`Invalid perms passed into botChannelPerms, must be an array.`);
    }
}

module.exports.isSupport = (client, user) => {
    let g = client.guilds.get("454440956033368078");
    if(!g) return false;
    if(g.roles.find("name", "Support").members.map(m => m.id).includes(user.id)) return true;
    return false;
}



// OUT OF SERVICE UNTIL FURTHER NOTICE.

// // We've got to do away with the error checks for these because for some 
// // unknown reason it keeps throwing TypeErrors.

// module.exports.parseHigher = (authorGM, targetGM, msg) => {
//     // If user who we want to see if they have a higher or equal role than the target 
//     // has a higher role return true, else false.
//     if (authorGM.highestRole.position >= targetGM.highestRole.position && authorGM.id !== msg.guild.ownerID) {
//         return true;
//     } else {
//         msg.channel.send(`You cannot do this to this user - they have a higher or equal role than your highest in the role hierarchy.`);
//         return false;
//     }
// }

// module.exports.parseBotHigher = (bot, targetGM, msg) => {
//     // If user who we want to see if they have a higher or equal role than the target 
//     // has a higher role return true, else false.
//     if(bot.highestRole.position >= targetGM.highestRole.position){ 
//         return true;
//     } else {
//         msg.channel.send(`I cannot do this to this user - they have a higher or equal role than my highest in the role hierarchy.`);
//         return false;
//     }
// }

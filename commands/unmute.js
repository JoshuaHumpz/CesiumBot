module.exports.help = {
    name: "unmute",
    description: "Unmutes the mentioned user.",
    usage: "unmute <user>",
    disablable: true
}

const Discord = require('discord.js');
const _ = require("lodash");

/* 
Because of the way I've set this up, I need to check if the unique ID
consisting of user and server ID is still in DB, and also I need to check
if the user has the role. Also if the mute role even exists.

If the mute role does not exist, create one, overwrite perms, delete record from DB.
If they have the role but are not set in DB,  we'll remove their muted role.
If they are set in DB but don't have the role, we'll remove their record in DB.
If they have a record and the mute role, remove both. 
If they have neither a record or a mute role applied, we need to send an error.
*/

module.exports.run = async (client, msg, args) => {
    try {
        // Appropriate permissions are required.
        if(client.checks.botHasPerm(msg.guild.me, "MANAGE_ROLES", msg)) {
            if(client.checks.hasPerm(msg.member, "MANAGE_ROLES", msg)) {
                const memb = msg.mentions.members.first();
                if(!memb) return msg.channel.send("Please provide a member to unmute.");
                let reason = args.slice(1).join(" ");
                if(!reason) reason = "None specified.";
                // Define constants for easy access.
                const guildConfig = client.guildSettings.get(msg.guild.id);
                const muteroleID = guildConfig.muteroleID;
                // The muted record in the DB.
                const muteRecord = client.muteData.get(`${msg.guild.id}-${memb.id}`);
                
                // The muted role does not exist.
                if(!msg.guild.roles.get(muteroleID) && muteRecord) {
                    // Create a constant original phrase so that we won't have to keep editing our message to this.
                    const newRole = await msg.guild.createRole({
                        name: "YzbotMuted",
                        color: '#808080',
                        permissions: 0
                    }, "Automatic creation of mute role as unmute command was used - yzbot.");
                    guildConfig.muteroleID = newRole.id;
                    // Delete the record from the database.
                    client.muteData.delete(`${msg.guild.id}-${memb.id}`);
                    // Sort through channels that we can manage the permissions of and inform the user of
                    // which ones that they need to set themselves.
                    let textChannels = msg.guild.channels.filter(c => c.type === 'text');
                    let ableChannels = textChannels.filter(c => c.permissionsFor(msg.guild.me).has("MANAGE_ROLES"));
                    let ableChansNames = ableChannels.map(c => c.name);
                    let textChanNames = textChannels.map(c => c.name);
                    // If the amount of channels it can do it do isn't the same amount as the entire server's channel amount, something is amiss.
                    if (ableChansNames.length !== textChanNames.length) await msg.channel.send(`The mute role was created. However, I won't be able to set the mute role permissions for the following channels, you'll need to set them manually:\n${_.difference(textChanNames, ableChansNames).map(c => `• \`#${c}\``).join("\n")}\nApologies if any Staff or private channel names were revealed.`);

                    // Wait for the permissions to be overwritten.
                    await ableChannels.forEach(c => c.overwritePermissions(newRole, {
                        SEND_MESSAGES: false
                    }, "Automatic mute role overrides for mute command - yzbot."));


                    msg.channel.send(`__**Actions completed:**__\n✅ Created mute role.\n✅ Deleted mute record from database.\n✅ Set it as the mute role for this server.\n✅ Set its channel permissions.`);
                    // Set guild settings.
                    return client.guildSettings.set(msg.guild.id, guildConfig);
                } 

                const r = msg.guild.roles.get(muteroleID);
                const membRoles = memb.roles;
                let noRole = false; // Boolean to set if the user has the muted role or not.
                let noRecord = false; // Boolean to set if the user has a DB record or not.

                if(!muteRecord) noRecord = true;
                if(!membRoles.get(muteroleID)) noRole = true;
                // Check if the user is not in DB and has no mute role.
                if(noRole && noRecord) return msg.channel.send("This user is not in the mute database and does not have the muted role.");


                const logUnmute = async () => {
                    let embed = new Discord.RichEmbed();
                    embed = await client.createModlog(msg, embed, memb, reason, "unmute");
                    embed.setColor('GREEN');
                    await client.channels.get(guildConfig.modlog).send(embed);
                }

                // SANITY CHECKS:- Also,
                // We'll log any attempt that was successful. 

                // Check if the user has no role but has record.
                if(noRole && !noRecord) {
                    // We want to delete their entry from DB. Easily accomplished.
                    client.muteData.delete(`${msg.guild.id}-${memb.id}`);
                    await msg.reply(`removed ${memb} from the mute database successfully (please use this command to unmute people, do not do it manually).`);
                    return await logUnmute();
                }   
                
                if(!noRole && noRecord) {
                    await memb.removeRole(muteroleID, `Unmuted by ${msg.author.tag} using yzbot.`);
                    await msg.reply(`removed the muted role from ${memb} successfully.`);
                    return await logUnmute();
                }

                if(!noRole && !noRecord) {
                    await memb.removeRole(muteroleID, `Unmuted by ${msg.author.tag} using yzbot.`);
                    client.muteData.delete(`${msg.guild.id}-${memb.id}`);
                    await msg.reply(`user ${memb} (Tag: ${memb.user.tag}, ID: ${memb.id}) unmuted successfully.`);
                    return await logUnmute();
                }
            }
        } 
    } catch (e) {
        client.logging.logError(`unmute command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
module.exports.help = {
    name: "role",
    description: "Allows you to add or remove roles to or from members, and change their colours. Any inputted role colour must be a valid hexadecimal string, with any missing values padded with 0s. Credits to ShineyDev for the role colour command idea.",
    usage: "role <add/remove/colo(u)r> <actual user mention/colo(u)r> <role>",
    disablable: true
}

module.exports.run = async (client, msg, args) => {
    if (client.checks.botHasPerm(msg.guild.me, "MANAGE_ROLES", msg)) {
        if (client.checks.hasPerm(msg.member, "MANAGE_ROLES", msg)) {
            try {
                let opt = args[0];
                let allowedOpts = ['add', 'remove', 'color', 'colour'];
                if (allowedOpts.includes(opt)) {
                    if (opt === 'add') {
                        if (!client.checks.isDisabled("role add", msg, client)) {
                            // Checks if the user supplied a member and role.
                            let memb = msg.mentions.members.first();
                            if (!memb) return msg.channel.send("Please provide a member to add a role to.");
                            let role = args.slice(2).join(" ");
                            if (!role) return msg.channel.send("You must provide a role to add to the member.");
                            if (role.length > 1000) return msg.channel.send("A role name can only be 999 characters or less in length.");
                            // Credits to HyperCoder for the below piece of code, it allows you to get a role
                            // by name - case insensitively.
                            if (!msg.guild.roles.find(r => r.name.toLowerCase() === role.toLowerCase())) return msg.channel.send(`The role \`${role}\` could not be found.`);
                            const roleObject = msg.guild.roles.find(r => r.name.toLowerCase() === role.toLowerCase());

                            let yzbotHighest = msg.guild.me.highestRole.position; // Gets the position of the highest role of the bot.
                            let rolePos = roleObject.position;
                            let authorHighest = msg.member.highestRole.position;
                            if (rolePos >= yzbotHighest && rolePos >= authorHighest && msg.author.id !== msg.guild.ownerID) return msg.channel.send("The specified role is higher than or equal to both of our highest roles in position.");
                            if (rolePos >= yzbotHighest) return msg.channel.send("The specified role is higher than or equal to my highest role in position.");
                            if (rolePos >= authorHighest && msg.author.id !== msg.guild.ownerID) return msg.channel.send("The specified role is higher than or equal to your highest role in position.");
                            if (memb.roles.some(r => roleObject === r)) return msg.channel.send("The user mentioned already has the role specified.");


                            // Actually add the role if we have managed to pass all of the checks.
                            await memb.addRole(roleObject, `role add command executed by ${msg.author.tag}.`)
                            return msg.reply(`added the \`${roleObject.name}\` role to ${memb} successfully.`);
                        }
                    } else if (opt === 'remove') {
                        if (!client.checks.isDisabled("role remove", msg, client)) {
                            // Checks if the user supplied a member and role.
                            let memb = msg.mentions.members.first();
                            if (!memb) return msg.channel.send("Please provide a member to remove a role from.");
                            let role = args.slice(2).join(" ");
                            if (!role) return msg.channel.send("You must provide a role to remove from the member.");
                            if (role.length > 1000) return msg.channel.send("A role name can only be 999 characters or less in length.");
                            // Credits to HyperCoder for the below piece of code, it allows you to get a role
                            // by name - case insensitively.
                            if (!msg.guild.roles.find(r => r.name.toLowerCase() === role.toLowerCase())) return msg.channel.send(`The role \`${role}\` could not be found.`);
                            const roleObject = msg.guild.roles.find(r => r.name.toLowerCase() === role.toLowerCase())

                            let yzbotHighest = msg.guild.me.highestRole.position; // Gets the position of the highest role of the bot.
                            let rolePos = roleObject.position;
                            let authorHighest = msg.member.highestRole.position;
                            if (rolePos >= yzbotHighest && rolePos >= authorHighest && msg.author.id !== msg.guild.ownerID) return msg.channel.send("The specified role is higher than or equal to both of our highest roles in position.");
                            if (rolePos >= yzbotHighest) return msg.channel.send("The specified role is higher than or equal to my highest role in position.");
                            if (rolePos >= authorHighest && msg.author.id !== msg.guild.ownerID) return msg.channel.send("The specified role is higher than or equal to your highest role in position.");
                            if (!memb.roles.some(r => roleObject === r)) return msg.channel.send("The user mentioned does not have the role specified.");

                            // Actually remove the role if we have managed to pass all of the checks.
                            await memb.removeRole(roleObject, `role remove command executed by ${msg.author.tag}.`);
                            return msg.reply(`removed the \`${roleObject.name}\` role from ${memb} successfully.`);
                        }
                        // Add 'colour' and 'color' for those pesky people who spell it the Americanised way
                    } else if (opt === 'colour' || opt === 'color'){ // Set a role colour. ;role colour COLOURHERE role
                        let colour = args[1];
                        if(!colour) return msg.channel.send("You must provide a hexadecimal colour.");
                        let roleName = args.slice(2).join(" ");
                        if(!roleName) return msg.channel.send("You must provide a role name.");
                        // Credits to HyperCoder for the below piece of code, it allows you to get a role
                        // by name - case insensitively.
                        let role = msg.guild.roles.find(r => r.name.toLowerCase() === roleName.toLowerCase());
                        if(!role) return msg.channel.send("You must provide a name of an existing role in this server.");
                        let lengthLimit;
                        colour.startsWith('#') ? lengthLimit = 7 : lengthLimit = 6;
                        if(colour.length !== lengthLimit) return msg.channel.send("You must provide a hexadecimal colour that is 6 characters long if you don't include '#' and 7 if you do.");
                        const re = /[0-9A-Fa-f]{6}/g;
                        const isHex = (chars) => {
                            let first;
                            if(chars.startsWith("#")){
                                chars = chars.split("");
                                first = chars.deleteElement("#");
                                chars = chars.join("");
                            }
                            if(re.test(chars)){
                                return true;
                            } else {
                                return false;
                            }
                        }
                        if(!isHex(colour)) return msg.channel.send("All characters in the colour must be between 0 and 9, and a to f.");
                        let oldCol = role.hexColor;
                        const r = await role.setColor(colour);
                        return msg.reply(`changed the colour of the role \`${role.name}\`.\n\`${oldCol}\` -> \`${r.hexColor}\``);
                    }
                } else {
                    return msg.channel.send(`You need to specify either add or remove.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
                }
            } catch (e) {
                client.logging.logError(`role command failed. ${e.stack}`);
                msg.channel.send(`Sorry, an error occurred.\`\`${e.message}\`\``);
            }
        }
    }
}
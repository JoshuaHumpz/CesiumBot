module.exports.run = async (client, msg, args) => {
    const Discord = require('discord.js');
    const fs = require('fs');
    const { get } = require('snekfetch');
    const guildConfig = client.guildSettings.get(msg.guild.id);
    if (client.checks.isDev(msg.author)) {
        const clean = text => {
            if (typeof (text) === "string")
                return text.replaceAll(/`/g, "`" + String.fromCharCode(8203)).replaceAll(/@/g, "@" + String.fromCharCode(8203)).replaceAll(client.token, "<REDACTED>");
            else
                return text;
        }

        const evalEmbed = (code, theCode) => {
            const embed = new Discord.RichEmbed();
            embed.setTitle(`Eval.`);
            embed.addField(`Input :inbox_tray:`, `\`\`\`xl\n${code}\`\`\``);
            embed.addField(`Output :outbox_tray:`, `\`\`\`xl\n${theCode}\`\`\``);
            embed.setTimestamp();
            embed.setColor('BLUE');
            return embed.setFooter(`I obey my mighty developer at all costs`);
        }

        const canEmbed = msg.guild.me.hasPermission("EMBED_LINKS") || msg.guild.me.hasPermission("ADMINISTRATOR") ? true : false;
        const code = args.join(" ");

        try {
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            evaled = clean(evaled);
            let attachment, attachmentMessage;
            if(evaled.length > 1024){
                if(evaled.length < 50000){
                    attachment = new Discord.Attachment(Buffer.from(evaled), "output.txt");
                    attachmentMessage = 'Output was longer than 1024 characters, but was not longer than 50,000 characters - attached as text file.';
                } else {
                    attachmentMessage = 'Output was longer than 50,000 characters. No file has been attached.';
                }
            }

            if(canEmbed){ // If we can embed.
                if(attachmentMessage){ // If we have an attachment message.
                    if(attachment){ // If we have an attachment (Output between 1-50k chars).
                        msg.channel.send({
                            embed: evalEmbed(code, attachmentMessage),
                            files: [attachment]
                        });
                    }else{ // If we have an attachment message, but no attachment. (Output too long.)
                        msg.channel.send(evalEmbed(code, attachmentMessage));
                    }
                } else { // If there is no attachment message, send embed as normal.
                    msg.channel.send(evalEmbed(code, evaled));
                }
            // If we can't embed.
            } else {
                if(attachmentMessage){ // If we have an attachment message.
                    if(attachment){ // If we have an attachment (Output between 1-50k chars).
                        msg.channel.send(attachmentMessage, {
                            code: 'xl', 
                            files: [attachment]});
                    }else{ // If we have an attachment message, but no attachment. (Output too long.)
                        msg.channel.send(attachmentMessage, {code: 'xl'});
                    }
                } else { // If there is no attachment message, send message as normal.
                    msg.channel.send(evaled, {code: 'xl'});
                }
            }
        // Not adding file attachments for this because:
        // 1. More recursive code.
        // 2. No error message is 2k characters long
        } catch (err) {
            err = clean(err);
            if(canEmbed){
                await msg.channel.send(evalEmbed(code, err));
                client.logging.logError(err.stack);
            } else {
                await msg.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
                client.logging.logError(err.stack);
            }
        }
    }
}
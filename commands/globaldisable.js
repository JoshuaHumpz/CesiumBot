module.exports.run = async (client, msg, args) => {
    try {
        const opt = args[0];
        const cmd = args[1];
        if(opt === "disable"){
            if(!cmd) return msg.reply("Provide a command to disable.");
            if(!client.commandNames.includes(cmd) && cmd !== 'all') return msg.reply("Invalid command. Try evaling client.commandNames.join(\", \") or retype the command.");
            await client.globalDisabledCommands.defer;
            if(client.globalDisabledCommands.has(cmd)) return msg.reply("Already disabled.");
            const reason = args.slice(2).join(" "); 
            // lol
            if(!reason) return msg.reply("You've got to provide a REASON for this. This is going out PUBLICLY, for ALL users, you NARB, they MUST KNOW.");
            const obj = {
                reason: reason
            }
            client.globalDisabledCommands.set(cmd, obj);
            await msg.reply(`Disabled specified command (${cmd}) successfully.`);
        }else if (opt === "enable"){
            if(!cmd) return msg.reply("Provide a command to enable.");
            if(!client.commandNames.includes(cmd) && cmd !== 'all') return msg.reply("Invalid command. Try evaling client.commandNames.join(\", \") or retype the command.");
            await client.globalDisabledCommands.defer;    
            if(!client.globalDisabledCommands.has(cmd)) return msg.reply("Not disabled.");
            client.globalDisabledCommands.delete(cmd);
            await msg.reply(`Re-enabled specified command (${cmd}) successfully.`);
        }else if(opt === "list"){
            let list = [];
            client.globalDisabledCommands.forEach((val, key) => list.push(key));
            await msg.reply(`Current global disabled commands: ${list.join(" ") || 'No commands are currently disabled globally.'}`);
         }else{
            return msg.reply("Must provide valid option, disable, enable or list.");
        }
    } catch (e) {
        client.logging.logError(`globaldisable command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
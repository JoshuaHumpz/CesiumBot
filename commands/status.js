module.exports.run = async (client, msg, args) => {
    if(client.checks.isDev(msg.author)){
        try {
            // Command to set bot status.
            // Syntax: ;status playing/status Some game here/Some presence here.
            let flag = args[0];
            if(!flag) return msg.channel.send("A flag must be provided.");
            let types = ['PLAYING', 'STREAMING', 'LISTENING', 'WATCHING'];
            let lower = types.map(t => t.toLowerCase());
            if(lower.includes(flag.toLowerCase())){ // We want to set something that isn't the status.
                //let lower = types.map()
                // If the type isn't valid
                if(!lower.includes(flag)) return msg.channel.send(`Not a valid type. Valid flags are: ${types.join(', ')}`);
                let game = args.slice(1).join(' ');
                if(!game) return msg.channel.send("Must provide a game.");
                await client.user.setPresence({game: {name: game, type: flag.toUpperCase()}}); // Set the presence.
                msg.reply('set game and type.');
            } else if(flag === 'set'){ // Otherwise, we want to set the bot's status.
                let statuses = ['online', 'idle', 'invisible', 'dnd'];
                if(!statuses.includes(args[1].toLowerCase())) return msg.channel.send("Must provide a valid status, online, idle, invisible or dnd.");
                await client.user.setPresence({status: args[1].toLowerCase()});
                msg.reply('set status.');
            } else {
                return msg.channel.send("Invalid flag.");
            }
        } catch (e) {
            client.logging.logError(`status command failed ${e.stack}`);
            await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
        }
    }
}
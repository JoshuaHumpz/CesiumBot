const fs = require('fs');
module.exports.run = async (client, msg, args) => {
    if(args[0] === undefined) return msg.reply("you must provide a command name to reload.");
    if(!client.commandNames.includes(args[0])){
        fs.readdir('./commands', (err, files) => {
            client.commandNames = files.map(f => f.substring(0, f.length - 3));
            if(!client.commandNames.includes(args[0])){
                return msg.reply(`the command \`${args[0]}\` doesn't exist.`);
            } else {
                client.logging.log(`Command ${args[0]} was just added to client.commandNames successfully!`);
            }
        })
    }
    // the path is relative to the *current folder*, so just ./filename.js
    delete require.cache[require.resolve(`./${args[0]}.js`)];
    msg.reply(`the command '${args[0]}' has been reloaded.`);
    client.logging.log(`Command '${args[0]}' was reloaded (require cache deleted successfully!)`);
    if(client.helpData.get(args[0])){
        client.helpData.delete(args[0]);
        let helpDt = require(`./${args[0]}.js`).help;
        client.helpData.set(helpDt.name, helpDt);
        client.logging.log(`Command '${args[0]}' was reloaded (help data was set successfully!)`);
    }else{
        try{
            let helpDt = require(`./${args[0]}.js`).help;
            client.helpData.set(helpDt.name, helpDt);
            client.logging.log(`Command '${args[0]}' was reloaded (help data was set successfully!)`);
        }catch(e){
            return client.logging.warn(e.stack);
        }
    }
}
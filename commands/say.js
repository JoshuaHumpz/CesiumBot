module.exports.run = async (client, msg, args) => {
    try{
        if(client.checks.isDev(msg.author)){
            let text = args.join(" ");
            msg.channel.send(text);
            if(msg.guild.me.hasPermission("MANAGE_MESSAGES")){
                await msg.delete();
            } else {
                client.logging.warn(`Attempted to delete original message in say command but missing perms.`);
            }
        }
    }catch(e){
        client.logging.logError(`Error occurred: ${e.stack}`);
    }
}
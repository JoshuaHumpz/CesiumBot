// Credits to https://github.com/zdict/zdict/wiki/Urban-dictionary-API-documentation for helping me to understand how UD API Data is formatted without
// me having to make any more than one request myself, and also for providing me with the correct endpoint to request the data from.

module.exports.help = {
    name: "urban",
    description: "Allows you to obtain the definition of any term from Urban Dictionary.",
    usage: "urban <term>",
    disablable: true
}

// The uh... 'required' requires for this command to work.
const { get } = require('snekfetch');
const Discord = require('discord.js');
const api = "http://api.urbandictionary.com/v0/define?term=";

module.exports.run = async (client, msg, args) => {
    try {
        const word = args.join(" ");
        if(!word) return msg.channel.send("You must provide a term to obtain the definition of.");
        const data = await get(`${api}${word}`);
        const res = data.body;
        if(res.result_type === "no_results") return msg.channel.send("No results found.");
        // res.list is an array of objects of the term data. We just need the first one, 
        // UD automatically sorts it by rating for us.
        let wordData = res.list[0]; 
        if(client.checks.botHasPerm(msg.guild.me, "EMBED_LINKS", msg)){
            const embed = new Discord.RichEmbed();
            embed.setURL(wordData.permalink);
            embed.setColor('BLUE');
            embed.setTitle(word);
            if(wordData.definition.length > 1024 || wordData.example.length > 1024) embed.setDescription("Warning: Some content has been omitted and the rest of it has been replaced with '...'. This is as either the description or example's length has exceeded 1024 characters. Apologies, but that's out of my control.");
            embed.addField("Description", wordData.definition.length > 1024 ? `${wordData.definition.slice(0, 1020)}...` : wordData.definition || 'None.');
            embed.addField("Example", wordData.example.length > 1024 ? `${wordData.example.slice(0, 1020)}...` : wordData.example || 'None.');
            embed.addField("Rating", `${wordData.thumbs_up} 👍/${wordData.thumbs_down} 👎`);
            embed.setFooter(`Definition by ${wordData.author}`);
            embed.setTimestamp();
            await msg.channel.send({embed});
        }
    } catch (e) {
        client.logging.logError(`urban command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
module.exports.help = {
    name: "shortenurl",
    description: "Shorten a URL using bit.ly.",
    usage: "shortenurl <url>",
    disablable: true
}

// Constants. We're destructuring the get method from snekfetch module, just taking it out so we don't have to qualify it as 'snekfetch.get'. 
const { get } = require('snekfetch');
// Base URL that we can make requests from. We can share this code safely online because I'm requiring a separate file where I've defined the token.
const endpoint = `https://api-ssl.bitly.com/v3/shorten?access_token=${require('../auth.json').bitlytoken}`;

module.exports.run = async (client, msg, args) => {
    try {
        // Define empty variable.
        let url;
        // If the user has already used the http or https prefix just do it as args.join
        if(args[0].startsWith("http://" || "https://")) url = args.join(" ");
        // Otherwise they haven't. Use http:// protocol.
        else url = `http://${args.join(" ")}`;
        // There's no URL.
        if(!url) return msg.channel.send("Please provide a valid URL to shorten.");
        // Encode it as URI so we can use it in the API request.
        let trueUrl = encodeURI(url);
        // We're sending a GET request using Snekfetch to the requested endpoint, with the URL we want to shorten.
        let res = await get(`${endpoint}&longUrl=${trueUrl}`);
        // We use this quite a lot, so it's good to have it as a variable to shorten code.
        let dt = res.body;
        // Invalid URL was entered.
        if(dt.status_txt === "INVALID_URI") {  
            client.logging.log(`Invalid use of shortenurl command in guild ${msg.guild.id}`); 
            return msg.channel.send("Please provide a valid URL to shorten."); 
        } 
        // If status text is not OK.
        if(dt.status_txt !== 'OK') return msg.reply(`An error has occurred. Sorry. You should probably report this to the developer. Here's the error: \`\`\`${dt.status_txt}\`\`\``);
        // The request made its way through A-OK. 
        if(dt.status_txt === 'OK') return msg.reply(`here's your shortened URL: ${dt.data.url}`);
        // Else something unknown has occurred.
        const gCon = client.guildSettings.get(msg.guild.id);
        return msg.reply(`Sorry. An unknown error has occurred. Please report this to the developer by using ${gCon.prefix}contact makerequest <Your issue here>, or alternatively join the support server found in the ${gCon.prefix}invite command. Thank you.`);
    } catch (e) {
        client.logging.logError(`shortenurl command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
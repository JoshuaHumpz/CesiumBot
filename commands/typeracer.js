module.exports.help = {
    name: "typeracer",
    description: "Gets TypeRacer statistics of the specified username.",
    usage: "typeracer <username>",
    disablable: true
}

const { get } = require('snekfetch');
const Discord = require('discord.js');
const dateFormat = require('dateformat');
const api = "http://typeracerdata.com/api?username";
dateFormat.masks.UTCtime = 'UTC: ddd, dS mmmm, yyyy @ h:MM:ss TT "(UTC)"';

module.exports.run = async (client, msg, args) => {
    try {
        if(client.checks.botHasPerm(msg.guild.me, "EMBED_LINKS", msg)){
            const username = args.join(" ").toLowerCase();
            if (!username) return msg.channel.send("Please provide a username to obtain the TypeRacer statistics of.");
            const res = await get(`${api}=${username}`);
            if (String(res.body).length < 1) return msg.reply("no stats were found for the provided user.");
            const data = JSON.parse(res.body.toString()).account;
            const lastRace = JSON.parse(res.body.toString()).recent_races[0];
            const embed = new Discord.RichEmbed();
            embed.setDescription(`This service is powered by the typeracerdata.com API. Click [here](http://www.typeracerdata.com/profile?username=${username}) to go to this user's typeracerdata.com page.`);
            embed.setTitle(`Typeracer.com Statistics for ${data.username}`);
            embed.setColor("BLUE");
            embed.addField("Races", data.races);
            embed.addField("Best Race", `${Number(data.wpm_highest).toFixed(2)} WPM`);
            embed.addField("Wins", data.wins);
            embed.addField("Win Percentage", `${Number(data.win_pct).toFixed(2)}%`);
            embed.addField("All-Time Average Speed", `${Number(data.wpm_life).toFixed(2)} WPM`);
            embed.addField("Texts Raced", data.texts_raced);
            embed.addField("Last 10 Races Average", `${Number(data.wpm_last10).toFixed(2)} WPM`);
            embed.addField("Last Race", `${Number(lastRace.wpm).toFixed(2)} WPM, Race #${lastRace.game}, Ranked ${lastRace.rank} of ${lastRace.players} players.`);
            embed.setImage(`http://data.typeracer.com/misc/badge?user=${username}`);
            await msg.channel.send({embed});
        }
    } catch (e) {
        client.logging.logError(`typeracer command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}
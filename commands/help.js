module.exports.help = {
    name: "help",
    description: "Typing (prefix)help displays the first page of help. To navigate through pages use (prefix)help (page), and for more info on a specific command use (prefix)help (command). Pages are arranged in alphabetical order, with 10 commands per page.",
    usage: "help <command/page>",
    disablable: false
}

// Use the below line of code if you need to say somehow that the user used the command incorrectly:
// return msg.channel.send(`\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);

const paginate = require('paginate-array');

module.exports.run = async (client, msg, args) => {
    try {
        const guildConfig = client.guildSettings.get(msg.guild.id);
        const prefix = guildConfig.prefix;
        // Credit to https://github.com/AnIdiotsGuide/guidebot/blob/master/commands/help.js#L18 for below line
        const longest = client.commandNames.reduce((long, str) => Math.max(long, str.length), 0);
        if (!isNaN(args[0]) || !args[0]) { // If args[0] is a number, or they haven't provided a first argument.
            let page = parseInt(args[0]) || 1;
            let helpDataArr = client.helpData.map(d => `${prefix}${d.name}${' '.repeat(longest - d.name.length)} ::  ${d.description}`).sort(); // An array of the help data, sorted alphabetically.
            let currPg = paginate(helpDataArr, page, 10);
            if (currPg.data.length < 1) return msg.channel.send(`This page does not exist. There are currently ${paginate(helpDataArr, 1, 10).totaPages} pages. Type ${prefix}help <page> to go to a specific page.`);
            // No, totaPages isn't an error on my behalf. I analysed an object output from when I was testing the module and the key was called 'totaPages'.
            await msg.channel.send(`= Yzbot Help - Page ${currPg.currentPage}/${currPg.totaPages}, ${helpDataArr.length} Total Commands: =\n${currPg.data.join("\n")}\n= Type ${prefix}help <command> for more info on a specific command, and ${prefix}help <page> to go to a specific page. =`, { code: 'asciidoc' });
        } else {
            let cmd = args[0];
            if (!client.commandNames.includes(cmd)) return msg.channel.send(`That's not a valid command. Type ${prefix}help for all the commands you can get help on.`);
            let helpData = client.helpData.get(cmd);
            await msg.channel.send(`== Help for command \'${helpData.name}\': ==\n
            \nUsage :: \n${prefix}${helpData.usage}
            \nDescription :: \n${helpData.description}`, {code:'asciidoc'});
        }
    } catch (e) {
        client.logging.logError(`Help command failed: ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}   
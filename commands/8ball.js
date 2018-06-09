const Discord = require('discord.js');

module.exports.help = {
    name: "8ball",
    description: "Magic 8 Ball command to allow the Magic 8 Ball's wisdom to answer any questions of yours.",
    usage: "8ball <question>",
    disablable: true
}

module.exports.run = async (client, msg, args) => {
    try {
        const answers = client.config.magicballanswers;
        let question = args.join(" ");
        if (!question || question.length < 3) return msg.channel.send(`Invalid question, try again.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
        if (question.charAt(question.length - 1) !== "?") return msg.channel.send(`Invalid question, try again.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
        const waitReps = ["Waiting for the Magic 8 Ball to give an answer...", "Thinking about your question...", "Allowing time for the wisdom of the Magic 8 Ball to provide an answer..."];
        const randColours = ["GREEN", "YELLOW", "BLUE"];
        const randDescs = ["The wisdom of the Magic 8 Ball shall guide you.", "The Magic 8 Ball has made its choice.", "The Magic 8 Ball has seen the right path for you, and chosen it."];
        if (client.checks.botHasPerm(msg.guild.me, "EMBED_LINKS", msg)) {
            const message = await msg.channel.send(waitReps.random());
            const embed = new Discord.RichEmbed();
            embed.setColor(randColours.random());
            if(isNaN(embed.color)) embed.setColor('RED');
            embed.setTitle("Magic :8ball: Ball");
            embed.setDescription(randDescs.random());
            embed.addField(`Question`, `:question: ${question}`);
            embed.addField(`Answer`, `:8ball: ${answers.random()}`);
            embed.setTimestamp();
            await message.edit({ embed });
        }
    } catch (e) {
        client.logging.logError(`8ball command failed. ${e.stack}`);
        msg.channel.send(`Sorry, an error occurred.\n\`\`${e.message}\`\``);
    }
}
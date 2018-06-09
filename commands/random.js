module.exports.help = {
    name: "random",
    description: "Random number generator, provide two numbers separated with a comma to get a random value between them. Please make sure you specify only integers. If you accidentally type the higher number before the lower number it will still generate a number between the two values specified.",
    usage: "random <low>, <high>",
    disablable: true
}

const _ = require('lodash');

module.exports.run = async (client, msg, args) => {
    try {
        if(!args) return msg.channel.send("Please must provide two or more numbers to get a random value from, separated with commas. (For example: random 51, 663 will generate a random number between 51 and 663).");
        let minMax = args.join(" ").trim().split(",");
        if(!minMax[1]) return msg.channel.send("Please provide two or more numbers to get a random value from, separated with commas. (For example: random 51, 663 will generate a random number between 51 and 663).");
        if(isNaN(minMax[0]) || isNaN(minMax[1])) return msg.channel.send("You must provide two numbers to get a random value from.");
        // check if the numbers supplied are too high or low.
        if(parseInt(minMax[0]) < Number.MIN_SAFE_INTEGER || parseInt(minMax[0]) > Number.MAX_SAFE_INTEGER) return msg.channel.send("First number is too low or high.");
        if(parseInt(minMax[1]) > Number.MAX_SAFE_INTEGER || parseInt(minMax[1]) < Number.MIN_SAFE_INTEGER) return msg.channel.send("Second number is too low or high.");        
        if(parseFloat(minMax[0]).toString().split(".")[1] || parseFloat(minMax[1]).toString().split(".")[1]) return msg.channel.send("One or both of the specified numbers is not an integer. You may only generate random numbers between two integers.");
        let min = parseInt(minMax[0]);
        let max = parseInt(minMax[1]);
        // If the minimum number is greater than the maximum number
        if(min > max)  {
            min = parseInt(minMax[1]);
            max = parseInt(minMax[0]);
        }
        msg.channel.send(`Your chosen random number is: ${_.random(min, max)}`);
    } catch (e) {
        client.logging.logError(`random command failed ${e.stack}`);
        await msg.channel.send(`Sorry, an error occurred.\n${e.message}`);
    }
}

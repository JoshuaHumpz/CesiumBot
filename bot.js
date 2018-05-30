const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = 'c!';  

client.on('message', message => {
    if (message.content.startsWith(prefix + 'help')) {

      const embed = new Discord.RichEmbed()
           .setTitle("Help")
           .setColor("#0e5293")
           .setDescription("**You want help? You get help.**\n **Here are all my commands!** **Do c! before every command!!!**\n ```Ban``` **Bans a person!** ```Kick``` **Kicks a Person!**\n```Say``` **Say something that Cesium will also say!**\n ```Agree``` **You will regret it.**\n ```Pizza``` **Gives you a pizza**\n ```Baby Chicken``` **Picture of a baby chicken.**\n ```Chicken``` **Gives you a picture of a chicken.**\n ```Parrot``` **Picture of a parrot.**\n ```Elephant``` **Picture of a elephant.**```Horse``` **Picture Of a horse**```Kick (user)```**Kicks a user.```Ban (user) ``` **Bans a user**")
           .setFooter("CesiumBot :robot: ")
      message.channel.send({embed});
    }
});
client.on('message', message => {
    if (message.content.split(' ')[0] == prefix + "kick") {
        var user = message.mentions.users.first();
        var member = message.guild.member(user);
        if(message.member.hasPermission('KICK_MEMBERS')){
           member.kick().then((member) => {
            
                message.channel.send(":wave: " + member.displayName + " has been successfully kicked :clipboard: . See logs at bot console!");
            }).catch(() => {
             
                message.channel.send("You Have kicked the person!");
            });
        }
        else{
            message.channel.send("You need to permission to use Cesium only Mr.Pooof Can use me!");
        }
    }
  
});

client.on('message', message => {
    if (message.content.startsWith(prefix + "say")) {
        var word = message.content.substr(6);
        
        if(word.includes("@everyone") | word.includes("@here")){
           message.delete(1000);
           message.channel.send("Not today! :robot: ");
           
        }  
    
        else{
            message.delete(1000);
            message.channel.send(word);
        }
    }
  
});
client.on('message', message => {
    if (message.content.split(' ')[0] == prefix + "ban") {
        var user = message.mentions.users.first();
        var member = message.guild.member(user);
        if(message.member.hasPermission('BAN_MEMBERS')){
           member.ban().then((member) => {
            
                message.channel.send(":wave: " + member.displayName + " has been successfully Banned :no_entry_sign: . ");
            }).catch(() => {
             
                message.channel.send("You Have Banned the person.");
            });
        }
        else{
            message.channel.send("You need to permission to use Cesium only Mr.Pooof can use me!");
        }
    }
});
client.on('message', message => {
    if (message.content === prefix + 'agree') {
    	message.reply('I agree!');
      message.delete(1000);
  	}
});

client.login(process.env.BOT_TOKEN);

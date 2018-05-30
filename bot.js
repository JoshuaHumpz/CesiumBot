const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';  

var index = 0;
var index2 = 0;
var index3 = 0;
var index4 = 0;
var index5 = 0;
var index6 = 0;
var index7 = 0;
var index8 = 0;
var stuff = ["cool"]
var meme = ["https://pics.me.me/he-has-a-diary-voldemort-is-like-a-teenage-girl-15022304.png","https://static0.srcdn.com/wordpress/wp-content/uploads/2018/02/18.jpg?q=50&fit=crop&w=738&dpr=1.5","https://static1.srcdn.com/wordpress/wp-content/uploads/2018/02/16.jpg?q=50&fit=crop&w=738&dpr=1.5","https://static0.srcdn.com/wordpress/wp-content/uploads/2018/02/11.png?q=50&fit=crop&w=738&dpr=1.5","https://static1.srcdn.com/wordpress/wp-content/uploads/2018/02/12.jpg?q=50&fit=crop&w=738&dpr=1.5","https://i.pinimg.com/originals/e3/ee/f5/e3eef5e7b444d1208b8c52e5dc742bdd.jpg","http://data.whicdn.com/images/37878509/tumblr_manrfsi72M1rd9rg0o1_400_large.jpg","https://i.pinimg.com/236x/4d/66/4e/4d664ee6e2198d1f6234d8cb6346f0b1--asdf-movie-movie-memes.jpg","https://lh3.googleusercontent.com/-vvIe3Dx7X4k/WuVIkG4nO0I/AAAAAAAAHhE/QtptKbJKODYjWtXavWbFuAKzrtDbQ7sWQCJoC/w994-h947-n-rw/IMG_20180429_095223.jpg","data:image/jpeg;base64,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"  ]; 
var names = ["bob", "fluffy", "peanut", "zackslash", "eh", "fSf", "big t", "ureen", "feestes", "asee"];
var namesdog = ["Nietzsche","Baldwin","woof","pupper","doge", "woofer", "arf"];
var dogpics = ["https://i.ytimg.com/vi/-OSSDuMkk70/hqdefault.jpg","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiLjH5U5QUf8tpKJy0NNS30s38KygCCVRjnPDGYvtLVGRla_DvTw","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyWQF5m76rp-3JHlWDpaJZ2HiD4Peb4nAFJUHbN7rOc8v6ri2TEw",];
var horsepics = ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGJ2inXtd7SY7MC5-LtuQIShAUdoZlIUvYV-N2lhM_RH5ao4og","https://images.theconversation.com/files/54927/original/x9hcc6pc-1406298853.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1012&h=668&fit=crop","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW6lux53TZ59yHZBfyQcKbHoA_Zz4wC7XyibVHAQWac05WX9ib",];
var horsenames = ["neigh","hoof","banana"];
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

shuffle(meme);
shuffle(stuff);
shuffle(names);
shuffle(namesdog);
shuffle(dogpics);
shuffle(horsepics);
shuffle(horsenames);


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


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
           message.channel.send("0_0");
           
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
    if (message.content.startsWith(prefix + 'hpmeme')) {
    if(index == meme.length - 1){
          shuffle(meme);
          index2 = 0;
      } 
      const embed = new Discord.RichEmbed()
           .setTitle("Harry Potter Meme")
           .setColor(getRandomColor())
           .setDescription("Here is your Harry Potter meme! :smile: :fire:")
           .setImage(meme[index2])
           .setFooter("PizzaBot", "http://thecookielife.com/wp-content/uploads/2018/04/pizza-cartoon-cute-pizza-stickers-detourshirts-redbubble-space-clipart.jpg")
      message.channel.send({embed});
      index2++;
    }
});
client.on('message', message => {
    if (message.content.startsWith(prefix + 'hamster')) { 
      if(index4 == names.length - 1){
          shuffle(names);
          index4 = 0;
      } 
      const embed = new Discord.RichEmbed()
           .setTitle("Hamster")
           .setColor(getRandomColor())
           .setDescription("Heres your Hamster named " + names[index4])
           .setImage("cool")
           .setFooter("PizzaBot", "http://thecookielife.com/wp-content/uploads/2018/04/pizza-cartoon-cute-pizza-stickers-detourshirts-redbubble-space-clipart.jpg")
      message.channel.send({embed});
      index4++;
     }
});
client.on('message', message => {
    if (message.content.startsWith(prefix + 'horse')) { 
      if(index7 == horsepics.length - 1){
          shuffle(horsepics);
          index7 = 0;
      } 
       if(index8 == horsenames.length - 1){
          shuffle(horsenames);
          index8 = 0;
      } 
      const embed = new Discord.RichEmbed()
           .setTitle("Horse")
           .setColor(getRandomColor())
           .setDescription("Heres your Horse named " + horsenames[index8])
           .setImage(horsepics[index7])
           .setFooter("PizzaBot", "http://thecookielife.com/wp-content/uploads/2018/04/pizza-cartoon-cute-pizza-stickers-detourshirts-redbubble-space-clipart.jpg")
      message.channel.send({embed});
      index7++;
      index8++;  
    }
});
client.on('message', message => {
    if (message.content.startsWith(prefix + 'pizza')) {
    if(index2 == stuff.length - 1){
          shuffle(stuff);
          index2 = 0;
      } 
      const embed = new Discord.RichEmbed()
           .setTitle("Here's your Pizza :pizza:")
           .setColor(getRandomColor())
           .setDescription("☆☆☆-Pizza-☆☆☆")
           .setImage(stuff[index2])
           .setFooter("PizzaBot", "http://thecookielife.com/wp-content/uploads/2018/04/pizza-cartoon-cute-pizza-stickers-detourshirts-redbubble-space-clipart.jpg")
      message.channel.send({embed});
      index2++;
    }
});
client.on('message', message => {
    if (message.content.startsWith(prefix + 'dog')) {
        
      if(index5 == namesdog.length - 1){
          shuffle(namesdog);
          index5 = 0;
      } 
       if(index6 == dogpics.length - 1){
          shuffle(dogpics);
          index6 = 0;
      } 
      const embed = new Discord.RichEmbed()
           .setTitle("dog")
           .setColor(getRandomColor())
           .setDescription("Heres your Dog named " + namesdog[index5])
           .setImage(dogpics[index6])
           .setFooter("PizzaBot", "http://thecookielife.com/wp-content/uploads/2018/04/pizza-cartoon-cute-pizza-stickers-detourshirts-redbubble-space-clipart.jpg")
      message.channel.send({embed});
      index5++;
      index6++;
    }
});
client.on('message', message => {
    if (message.content === prefix + 'baby chicken') {
    	message.channel.send('https://www.walldevil.com/wallpapers/a82/chicken-chick-daffodil.jpg');
  	}
});
client.on('message', message => {
    if (message.content === prefix + 'parrot') {
    	message.channel.send('https://i.ytimg.com/vi/8uXrgv1xIFk/maxresdefault.jpg');
  	}
});
client.on('message', message => {
    if (message.content === prefix + 'elephant') {
    	message.channel.send('https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/MA_00077427_yjtgnj.jpg');
  	}
});
client.on('message', message => {
    if (message.content === prefix + 'bunny') {
    	message.channel.send('https://pbs.twimg.com/profile_images/447374371917922304/P4BzupWu.jpeg');
  	}
});
client.on('message', message => {
    if (message.content === prefix + 'agree') {
    	message.reply('I agree!');
      message.delete(1000);
  	}
});

client.login(process.env.BOT_TOKEN);

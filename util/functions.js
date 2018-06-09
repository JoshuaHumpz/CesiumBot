// Credit to https://github.com/AnIdiotsGuide/guidebot-class for showing me how to do this
// (I looked at the code itself)

/*
This file contains a number of useful functions that are used repeatedly
in yzbot. I've been on the quest to abstract a lot of code into separate 
files so that I can reduce the amount of checks that I always have to make.

For example, I recently created the createModlog.js file which I soon hope
to turn into a handleModlog.js file. But maybe not, since I don't think after
softban that I'm going to add any more moderation commands. But anyway, the point
of that file is to handle the creation of moderation log embeds. The populating
of moderation log embeds with fields, footers, titles etc., was quite annoying
and once I got everything working, the amount of code in every moderation command's 
moderation log handling section was reduced by about 10 lines. This is the sort of
change I'm looking for, and possibly more in the future. I hope. 

This file, once again, aims to abstract code so I don't have to perform
the same simple checks or annoyingly difficult(/easy?) tasks every single time I
want to do something. Also yes I know this is a long comment, which takes up 
more lines than the code itself. lol.

-yzfire, 16/5/18
*/

const Discord = require("discord.js");

// Here be bad practices 

module.exports = (client) => {
    /* 
    EXTREMELY useful function. Lets you replace ALL instances of find,
    in the string, with replace. THIS IS BAD PRACTICE THOUGH.
    Don't extend native prototypes unless you have a real reason to
    or code could conflict with newer additions to JavaScript itself.
    */
    String.prototype.replaceAll = function (find, replace) {
        if(!find || !replace) throw new TypeError("You have not provided either a find or a replace parameter for .replaceAll (strings).");
        return this.split(find).join(replace);
    };

    // Check if a string is a valid Discord user ID.
    String.prototype.isUserID = async function() {
        try { 
            let id = this.toString();
            if(isNaN(id)) return false;
            const m = await client.fetchUser(id, false);
            return true;    
        } catch (e) { 
            return false;
        }
    }

    // Function to delete a single element from an array.
    Array.prototype.deleteElement = function(element) {
        if(!element) throw new TypeError("You must provide an element for Array.prototype.deleteElement().");
        if(!this.includes(element)) throw new TypeError("You must provide an element that is in the array.");
        return this.splice(this.indexOf(element), 1);
    }
    
    Discord.Collection.prototype.isEmpty = function() {
        // This checks if there is a key, and obviously if there's a key then there's a value,
        // and, hurr durr, the collection is therefore NOT EMPTY.
        if(this.array()[0]){ 
            return false;
        }

        return true;
    }

    // Useful for obtaining a random element from an array.
    Array.prototype.random = function () {
        return this[Math.floor(Math.random() * this.length)];
    }
}
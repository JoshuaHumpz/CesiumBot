module.exports.help = {
    name: "tag",
    description: "Create or delete tags. A tag name can be one word only. No need for tag name in list, and no need for content in delete. You also need to provide a new, different name for rename. However for create and update you need to use all of the parameters.",
    usage: "tag <create/add/delete/list/edit/rename> <tag name> <content (create only)/new tag name>",
    disablable: false
}

module.exports.run = async (client, msg, args) => {
    if (args[0] === "list") { // tag list
        if(!client.checks.isDisabled("tag list", msg, client)){
            let tags = client.tags.get(msg.guild.id); // This returns an object of all the tags in the guild.
            return msg.channel.send(`__**Current tags for server ${msg.guild.name}**__:\n${Array.from(Object.keys(tags)).join(", ") || "No tags have been currently created. Use tag create <tagname> <content> to create one."}`);    
        }
    }
    let allowedOpts = ["create", "delete", "edit", "rename", "add"];
    let opt = args[0];
    if(!allowedOpts.includes(opt)) return msg.channel.send(`Please provide a valid option, create, delete, update or list.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
    if (msg.member.hasPermission("MANAGE_MESSAGES") || msg.member.hasPermission("ADMINISTRATOR") || msg.member.id === msg.guild.ownerID) { // MANAGE_MESSAGES perm is required.
        let tags = client.tags.get(msg.guild.id); // This returns an object of all the tags in the guild.
        if (!opt) return msg.channel.send(`Please provide a valid first option.\`\`\`Usage:\n${this.help.usage}\n\n${this.help.description}\`\`\``);
        if (opt === "create" || opt === "add") { // tag create
            let tagName = args[1]; // tag create <TAGNAME> 
            if (!tagName) return msg.channel.send(`Please provide a tag name to create.`);
            if (tagName.length > 100) return msg.channel.send(`Your tag name must be 100 characters or less in length.`);
            if (tags[tagName]) return msg.channel.send(`A tag with the name of \`${tagName}\` already exists. If you want to update it, use tag update.`);
            let content = args.slice(2).join(" "); // tag create <TAGNAME> <CONTENT>.
            if (!content) return msg.channel.send(`Please provide content for the tag.`);
            if (content.length > 1700) return msg.channel.send(`Your tag content must be 1700 characters or less in length.`);
            tags[tagName] = content;
            client.tags.set(msg.guild.id, tags);
            return msg.reply(`added the tag \`${tagName}\` with content \`${content}\` successfully.`);
        } else if (opt === "delete") { // tag delete
            let tagName = args[1]; // tag delete <TAGNAME> 
            if (!tagName) return msg.channel.send(`Please provide a tag name to delete.`);
            if (!tags[tagName]) return msg.channel.send(`A tag with the name \`${tagName}\` does not exist, use tag list to list all of the tags.`);
            delete tags[tagName];
            client.tags.set(msg.guild.id, tags);
            return msg.reply(`deleted the tag \`${tagName}\` successfully.`);
        } else if (opt === "edit") { // tag edit
            let tagName = args[1];
            let content = args.slice(2).join(" ");
            if (!tagName) return msg.channel.send("Please provide a tag name to edit.");
            if (!tags[tagName]) return msg.channel.send(`A tag with the name \`${tagName}\` does not exist, use tag list to list all of the tags, and tag create <name> <content> to create one.`);
            if (!content) return msg.channel.send("Please provide new content for this tag.");
            if (content.length > 1700) return msg.channel.send(`Your tag content must be 1700 characters or less in length.`);
            tags[tagName] = content;
            client.tags.set(msg.guild.id, tags);
            return msg.reply(`edited the tag \`${tagName}\` with new content of \`${content}\` successfully.`);
        } else if(opt === "rename"){
            let tagName = args[1];
            if(!tagName) return msg.channel.send("You must provide a tag name to rename.");
            if(!tags[tagName]) return msg.channel.send("That tag does not exist.");
            let newName = args[2];
            if(!newName) return msg.channel.send("You must provide a new name for the tag.");
            if(tagName === newName) return msg.channel.send("You must provide a different new name for the tag.");
            tags[newName] = tags[tagName];
            delete tags[tagName];
            client.tags.set(msg.guild.id, tags);
            return msg.reply(`changed the name of \`${tagName}\` to \`${newName}\` successfully.`);
        }
    } else {
        return msg.channel.send(`You require the \`MANAGE_MESSAGES\` permission to use this command.`);
    }
}
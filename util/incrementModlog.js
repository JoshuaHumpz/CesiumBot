module.exports = (guildID, client) => {
    let guildConfig = client.guildSettings.get(guildID); 
    guildConfig.amtmodlogs += 1;
    client.guildSettings.set(guildID, guildConfig);
    let amountmodlogs = guildConfig.amtmodlogs;
    return amountmodlogs;
}
const discord = require("discord.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");

module.exports = async(client, guild, user) => {
    const banEmbed = new discord.MessageEmbed()
        .setColor(globals.colors.red)
        .addField(`${globals.emotes.ban} ${user.tag} Has been banned from the server!`, `**User ID:** ${user.id}`)
        .setFooter(client.user.username, client.user.displayAvatarURL({}))
        .setTimestamp();

    client.channels.fetch(server.text_channels.bot_logs).then(channel => channel.send(banEmbed));
};
const discord = require("discord.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");

module.exports = (client, messageDelete) => {
    if (messageDelete.author.bot) { return; }
    if (server.log_blacklist.includes(messageDelete.channel.id)) { return; }
    if (!messageDelete.content) { return; }

    const deleteEmbed = new discord.MessageEmbed()
        .setColor(globals.colors.orange)
        .setAuthor(messageDelete.author.tag, messageDelete.author.displayAvatarURL({}))
        .setDescription(`A message by ${messageDelete.author.username} was deleted in ${messageDelete.channel}`)
        .addField("Content", messageDelete.content)
        .setFooter(`Message ID: ${messageDelete.id}`)
        .setTimestamp();

    client.channels.fetch(server.text_channels.bot_logs).then(channel => channel.send(deleteEmbed));
};
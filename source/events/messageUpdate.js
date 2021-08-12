const discord = require("discord.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");

module.exports = (client, oldMessage, newMessage) => {
    if (oldMessage.author.bot) { return; }
    if (server.log_blacklist.includes(oldMessage.channel.id)) { return; }
    if (!oldMessage && !newMessage) { return; }
    if (oldMessage.content === newMessage.content) { return; }

    const updateEmbed = new discord.MessageEmbed()
        .setColor(globals.colors.yellow)
        .setAuthor(oldMessage.author.tag, oldMessage.author.displayAvatarURL({}))
        .setDescription(`${oldMessage.author.username} modified their [message](${oldMessage.url}) in ${oldMessage.channel}.`)
        .addField("Before", oldMessage.content)
        .addField("After", newMessage.content)
        .setFooter(`Message ID: ${oldMessage.id}`)
        .setTimestamp();

    client.channels.fetch(server.text_channels.bot_logs).then(channel => channel.send(updateEmbed));
};
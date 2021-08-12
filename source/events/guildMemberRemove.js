const discord = require("discord.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");

module.exports = async(client, guildMember) => {
    const leaveEmbed = new discord.MessageEmbed()
        .setColor(globals.colors.orange)
        .setAuthor(`${guildMember.user.tag} Has left the server.`, guildMember.user.displayAvatarURL({}))
        .setFooter(`User ID: ${guildMember.user.id}`)
        .setTimestamp();

    client.channels.fetch(server.text_channels.bot_logs).then(channel => channel.send(leaveEmbed));
};
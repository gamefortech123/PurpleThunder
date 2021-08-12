const discord = require("discord.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");

module.exports = async(client, oldMember, newMember) => {
    if (oldMember.displayName !== newMember.displayName)
    {
        const updateEmbed = new discord.MessageEmbed()
            .setColor(globals.colors.blue)
            .setAuthor(newMember.user.tag, newMember.user.displayAvatarURL({}))
            .setDescription(`${newMember.user.username} had their name changed.`)
            .addField("Before", oldMember.displayName)
            .addField("After", newMember.displayName)
            .setFooter(`User ID: ${newMember.user.id}`)
            .setTimestamp();

        client.channels.fetch(server.text_channels.bot_logs).then(channel => channel.send(updateEmbed));
    }
};
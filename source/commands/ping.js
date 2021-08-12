const discord = require("discord.js");
const config = require("../modules/config.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");

module.exports.execute = async(client, message, args) => {
    if (this.command.isPermitted(message.member))
    {
        const pingMessage = await message.channel.send('Pinging...');
        pingMessage.edit(`${this.command.emote} **Pong!**\n**VPS Latency:** ${Math.round(client.ws.ping)}ms.\n**API Latency:** ${Date.now() - pingMessage.createdTimestamp}ms.`);
    }
    else
    {
        this.command.printPerms(client, message.channel);
    }
};

module.exports.command = {
    name: "ping",
    description: "Check the latency of the bots VPS and the Discords API.",
    usage: "ping",
    emote: globals.emotes.ping,

    isPermitted: function(guildMember) {
        if (guildMember.roles.cache.has(server.roles.member))
        {
            return true;
        }

        return false;
    },

    printUsage: function(client, channel) {
        const usageEmbed = new discord.MessageEmbed()
            .setColor(globals.colors.white)
            .addField(`Command Usage:`, `\`${config.prefix}${this.usage}\``)
            .setFooter(client.user.username, client.user.displayAvatarURL({}))
            .setTimestamp();

        channel.send(usageEmbed);
    },

    printPerms: function(client, channel) {
        const permsEmbed = new discord.MessageEmbed()
            .setColor(globals.colors.red)
            .setDescription(`${globals.emotes.warning} **You do not have the required permissions to use this command!**`)
            .setFooter(client.user.username, client.user.displayAvatarURL({}))
            .setTimestamp();

        channel.send(permsEmbed);
    }
};
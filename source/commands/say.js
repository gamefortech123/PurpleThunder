const discord = require("discord.js");
const config = require("../modules/config.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");

module.exports.execute = (client, message, args) => {
    if (this.command.isPermitted(message.member))
    {
        if (args.length > 0)
        {
            let sendChannel = message.channel;
            let sayMessage = "";

            if (client.channels.cache.has(args[0]))
            {
                sendChannel = client.channels.cache.get(args.shift());
            }

            sayMessage = args.join(" ");
            sendChannel.send(sayMessage)
            message.delete();
        }
        else
        {
            this.command.printUsage(client, message.channel);
        }
    }
    else
    {
        this.command.printPerms(client, message.channel);
    }
};

module.exports.command = {
    name: "say",
    description: "Send a message through the bot to a specific channel.",
    usage: "say <channel-optional> <message>",
    roles: [server.roles.bot, server.roles.codered, server.roles.administrator, server.roles.moderator],
    emote: globals.emotes.megaphone,

    isPermitted: function(guildMember) {
        var hasRole = false;

        this.roles.forEach(role => {
            if (guildMember.roles.cache.has(role)) {
                hasRole = true;
            }
        });

        return hasRole;
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
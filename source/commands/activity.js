const discord = require("discord.js");
const config = require("../modules/config.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");
const record = require("../databases/record.json");

module.exports.execute = (client, message, args) => {
    if (this.command.isPermitted(message.member))
    {
        if (args.length == 1)
        {
            let userStatus = args[0].toLowerCase();

            if (userStatus === "online"
                || userStatus === "idle"
                || userStatus === "invisible"
                || userStatus === "dnd")
            {
                client.user.setStatus(userStatus);
            }
            else
            {
                this.command.printUsage(client, message.channel);
            }
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
    name: "activity",
    description: "Set the bots current online status.",
    usage: "activity <online-idle-invisible-dnd>",
    roles: [server.roles.bot, server.roles.codered, server.roles.administrator],
    emote: globals.emotes.server,

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
const discord = require("discord.js");
const config = require("../modules/config.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");

module.exports.execute = (client, message, args) => {
    if (this.command.isPermitted(message.member))
    {
        if (args.length > 0)
        {
            let urlMessage = "";
            let urlFormat = "";

            if (message.mentions.users.size > 0)
            {
                urlMessage = args.join(" ");
                urlMessage = urlMessage.substring(urlMessage.indexOf(" ") + 1);
                urlFormat = urlMessage.split(" ").join("+");
                message.channel.send(`${message.mentions.users.first()}\nhttps://lmgtfy.com/?q=${urlFormat}`);
            }
            else
            {
                sendChannel = message.channel;
                urlMessage = args.join(" ");
                urlFormat = urlMessage.split(" ").join("+");
                message.channel.send(`https://lmgtfy.com/?q=${urlFormat}`);
            }

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
    name: "lmgtfy",
    description: "Generates a Let Me Google That For You link with given arguments.",
    usage: "lmgtfy <user-to-mention-optional> <phrase-to-google>",
    roles: [server.roles.member],
    emote: globals.emotes.google,

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
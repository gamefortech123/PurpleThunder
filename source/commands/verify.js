const discord = require("discord.js");
const fs = require("fs");
const config = require("../modules/config.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");
const verification = require("../databases/verification.json");

module.exports.execute = async(client, message, args) => {
    if (this.command.isPermitted(message.member))
    {
        if (args.length < 1) { return this.command.printUsage(client, message.channel); }

        if (verification[message.member.id] && verification[message.member.id].code === args[0])
        {
            if (!message.member.roles.cache.has(server.roles.member))
            {
                message.member.roles.add(server.roles.member);
            }

            delete verification[message.member.id];
            fs.writeFile("./databases/verification.json", JSON.stringify(verification), (e) => { if (e) console.log(e) });
        }
        else
        {
            message.member.kick("User failed verification code, kicking to prevent possible brute force attack.");
        }
    }
    else
    {
        this.command.printPerms(client, message.channel);
    }
};

module.exports.command = {
    name: "verify",
    description: "Verify that a user is not a bot with a given verification code.",
    usage: "verify <code>",
    roles: [server.roles.member],
    emote: globals.emotes.robot,

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
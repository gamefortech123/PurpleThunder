const discord = require("discord.js");
const fs = require("fs");
const config = require("../modules/config.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");
const record = require("../databases/record.json");

module.exports.execute = (client, message, args) => {
    if (this.command.isPermitted(message.member))
    {
        if (args.length > 1 && message.mentions.members.size > 0)
        {
            let member = message.mentions.members.first();
            let warnReason = args.slice(1).join(" ");

            if (!record[member.id])
            {
                record[member.id] = {
                    history: [""],
                    warnings: 1,
                    mutes: 0,
                    kicks: 0,
                    bans: 0
                };

                record[member.id].history.push(warnReason);
            }
            else
            {
                record[member.id].history.push(warnReason);
                record[member.id].warnings++;
            }

            fs.writeFile("./databases/record.json", JSON.stringify(record), (e) => { if (e) console.log(e) });

            const warnEmbed = new discord.MessageEmbed()
                .setColor(globals.colors.purple)
                .addField(`${this.command.emote} ${member.user.tag} Has been warned by ${message.author.tag}!`, `**Reason:** ${warnReason}`)
                .setFooter(`User ID: ${member.user.id}`)
                .setTimestamp();

            message.channel.send(warnEmbed);
            client.channels.fetch(server.text_channels.bot_logs).then(channel => channel.send(warnEmbed));
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
    name: "warn",
    description: "Warn a user for a specific reason.",
    usage: "warn <user> <reason>",
    roles: [server.roles.bot, server.roles.codered, server.roles.administrator, server.roles.moderator],
    emote: globals.emotes.warning,

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
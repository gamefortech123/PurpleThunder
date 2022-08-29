const discord = require("discord.js");
const fs = require("fs");
const config = require("../modules/config.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");
const record = require("../databases/record.json");

module.exports.execute = (client, message, args) => {
    if (this.command.isPermitted(message.member))
    {
        if (args.length > 0 && message.mentions.members.size > 0)
        {
            let member = message.mentions.members.first();

            if (!record[member.id])
            {
                record[member.id] = {
                    history: [""],
                    warnings: 0,
                    mutes: 0,
                    kicks: 0,
                    bans: 1
                };
            }
            else
            {
                record[member.id].bans++;
            }

            fs.writeFile("./databases/record.json", JSON.stringify(record), (e) => { if (e) console.log(e) });

            if (args.length > 1)
            {
                let banMessage = args.slice(1).join(" ");
                record[member.id].history.push(banMessage);
                fs.writeFile("./databases/record.json", JSON.stringify(record), (e) => { if (e) console.log(e) });
                
                try
                {
                    const banEmbed = new discord.MessageEmbed()
                        .setColor(globals.colors.purple)
                        .addFields({ name: `You have been banned from the CodeRed Discord server!`, value: `**Reason:** ${banMessage}` })
                        .setFooter(client.user.username, client.user.displayAvatarURL({}))
                        .setTimestamp();

                    member.user.createDM().then(channel => channel.send(banEmbed));
                }
                catch (e)
                {
                    console.log(e.stack);
                }

                try
                {
                    member.ban({ days: 7, reason: `Banned by: ${message.author.tag}, Reason: ${banMessage}` });
                }
                catch (e)
                {
                    console.log(e.stack);
                }
            }
            else
            {
                try
                {
                    member.ban({ days: 7, reason: `Banned without reason by: ${message.author.tag}` });
                }
                catch (e)
                {
                    console.log(e.stack);
                }
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
    name: "ban",
    description: "Permanently bans a user from the server with an optional message.",
    usage: "ban <user> <message-optional>",
    roles: [server.roles.bot, server.roles.codered, server.roles.administrator],
    emote: globals.emotes.ban,

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
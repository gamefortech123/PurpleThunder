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
                    kicks: 1,
                    bans: 0
                };
            }
            else
            {
                record[member.id].kicks++;
            }

            fs.writeFile("./databases/record.json", JSON.stringify(record), (e) => { if (e) console.log(e) });

            const logEmbed = new discord.MessageEmbed()
                .setColor(globals.colors.orange)
                .addField(`${this.command.emote} ${member.user.tag} Has been kicked from the server by ${message.author.tag}!`, `**User ID:** ${member.user.id}`)
                .setFooter(client.user.username, client.user.displayAvatarURL({}))
                .setTimestamp();

            if (args.length > 1)
            {
                let kickMessage = args.slice(1).join(" ");
                record[member.id].history.push(kickMessage);
                fs.writeFile("./databases/record.json", JSON.stringify(record), (e) => { if (e) console.log(e) });

                try
                {
                    const kickEmbed = new discord.MessageEmbed()
                        .setColor(globals.colors.orange)
                        .addFields({ name: `You have been kicked from the CodeRed Discord server!`, value: `**Reason:** ${kickMessage}` })
                        .setFooter(client.user.username, client.user.displayAvatarURL({}))
                        .setTimestamp();

                    member.user.createDM().then(channel => channel.send(kickEmbed));
                }
                catch (e)
                {
                    console.log(e.stack);
                }

                try
                {
                    member.kick(`Kicked by: ${message.author.tag}, Reason: ${kickMessage}.`);
                    client.channels.fetch(server.text_channels.bot_logs).then(channel => channel.send(logEmbed));
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
                    member.kick(`Kicked without reason by: ${message.author.tag}.`);
                    client.channels.fetch(server.text_channels.bot_logs).then(channel => channel.send(logEmbed));
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
    name: "kick",
    description: "Kicks a user from the server with an optional message.",
    usage: "kick <user> <message-optional>",
    emote: globals.emotes.kick,

    isPermitted: function(guildMember) {
        if (guildMember.roles.cache.has(server.roles.bot)
            || guildMember.roles.cache.has(server.roles.codered)
            || guildMember.roles.cache.has(server.roles.administrator)
            || guildMember.roles.cache.has(server.roles.moderator))
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
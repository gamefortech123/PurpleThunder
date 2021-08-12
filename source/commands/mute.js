const discord = require("discord.js");
const fs = require("fs");
const config = require("../modules/config.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");
const mutes = require("../databases/mutes.json");
const record = require("../databases/record.json");

module.exports.execute = (client, message, args) => {
    if (this.command.isPermitted(message.member))
    {
        if (args.length > 1 && message.mentions.members.size > 0)
        {
            let member = message.mentions.members.first();
            let muteReason = args.slice(1).join(" ");

            var now = new Date;
            var timestamp = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());

            mutes[member.id] = {
                mute_reason: muteReason,
                utc_timestamp: timestamp
            };

            if (!record[member.id])
            {
                record[member.id] = {
                    history: [""],
                    warnings: 0,
                    mutes: 1,
                    kicks: 0,
                    bans: 0
                };

                record[member.id].history.push(muteReason);
            }
            else
            {
                record[member.id].history.push(muteReason);
                record[member.id].mutes++;
            }

            if (!member.roles.cache.has(server.roles.muted))
            {
                member.roles.add(server.roles.muted);
            }

            if (member.roles.cache.has(server.roles.member))
            {
                member.roles.remove(server.roles.member);
            }

            const muteEmbed = new discord.MessageEmbed()
                .setColor(globals.colors.red)
                .setDescription(`${this.command.emote} Successfully muted <@${member.user.id}>.`)
                .setFooter(client.user.username, client.user.displayAvatarURL({}))
                .setTimestamp();

            message.channel.send(muteEmbed).then(msg => msg.delete({ timeout: 5000 }).then(message.delete({ timeout: 5000 })));

            const logEmbed = new discord.MessageEmbed()
                .setColor(globals.colors.red)
                .setAuthor(message.author.tag, message.author.displayAvatarURL({}))
                .setDescription(`${this.command.emote} Just muted <@${member.user.id}>.`)
                .addField("Reason", muteReason)
                .setFooter(`User ID: ${member.user.id}`)
                .setTimestamp();
    
            client.channels.fetch(server.text_channels.bot_logs).then(channel => channel.send(logEmbed));

            fs.writeFile("./databases/mutes.json", JSON.stringify(mutes), (e) => { if (e) console.log(e) });
            fs.writeFile("./databases/record.json", JSON.stringify(record), (e) => { if (e) console.log(e) });
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
    name: "mute",
    description: "Prevent a user from talking in text chat and joining voice channels.",
    usage: "mute <user> <reason>",
    emote: globals.emotes.mute,

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
const discord = require("discord.js");
const config = require("../modules/config.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");
const record = require("../databases/record.json");

module.exports.execute = (client, message, args) => {
    if (this.command.isPermitted(message.member))
    {
        if (message.mentions.members.size > 0)
        {
            let member = message.mentions.members.first();

            if (record[member.id])
            {
                let warnings = record[member.id].warnings;
                let mutes = record[member.id].mutes;
                let kicks = record[member.id].kicks;
                let bans = record[member.id].bans;

                let historyString = "";
                record[member.id].history.forEach(history => historyString += `${history}\n`);

                const recordEmbed = new discord.MessageEmbed()
                    .setColor(globals.colors.purple)
                    .setTitle(`User Record for ${member.user.tag}`)
                    .setDescription(`**Warnings:** ${warnings}
                    **Mutes:** ${mutes}
                    **Kicks:** ${kicks}
                    **Bans:** ${bans}
                    **History:**
                    \`\`\`${(historyString.length > 1 ? historyString : "No History Found")}\`\`\``)
                    .setFooter(client.user.username, client.user.displayAvatarURL({}))
                    .setTimestamp();
        
                message.channel.send(recordEmbed);
            }
            else
            {
                const recordEmbed = new discord.MessageEmbed()
                    .setColor(globals.colors.purple)
                    .setDescription(`No record found, user \`${member.user.tag}\` is squeaky clean!`)
                    .setFooter(client.user.username, client.user.displayAvatarURL({}))
                    .setTimestamp();
        
                message.channel.send(recordEmbed);
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
    name: "record",
    description: "Displays a full record of warnings, mutes, kicks, and bans for a given user.",
    usage: "record <user>",
    roles: [server.roles.bot, server.roles.codered, server.roles.administrator, server.roles.moderator],
    emote: globals.emotes.list,

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
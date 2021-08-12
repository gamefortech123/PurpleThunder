const discord = require("discord.js");
const config = require("../modules/config.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");

module.exports.execute = async(client, message, args) => {
    if (this.command.isPermitted(message.member))
    {
        if (args.length > 1 && message.mentions.members.size > 0)
        {
            let member = message.mentions.members.first();
            let messageContent = args.slice(1).join(" ");

            const logEmbed = new discord.MessageEmbed()
                .setColor(globals.colors.cyan)
                .setAuthor(message.author.tag, message.author.displayAvatarURL({}))
                .addField(`${this.command.emote} Just sent ${member.user.tag} a message`, messageContent)
                .setFooter(`User ID: ${member.user.id}`)
                .setTimestamp();

            const messageEmbed = new discord.MessageEmbed()
                .setColor(globals.colors.red)
                .setDescription(`${this.command.emote} ${messageContent}`)
                .setFooter(client.user.username, client.user.displayAvatarURL({}))
                .setTimestamp();

            const failedEmbed = new discord.MessageEmbed()
                .setColor(globals.colors.white)
                .setDescription(`${this.command.emote} ${member.user.tag} does not have dm's enabled, failed to send message!`)
                .setFooter(client.user.username, client.user.displayAvatarURL({}))
                .setTimestamp();
    
                try
                {
                    member.user.createDM().then(channel => {
                        channel.send(messageEmbed);
                        client.channels.fetch(server.text_channels.bot_logs).then(channel => channel.send(logEmbed));
                    });
                }
                catch (e)
                {
                    message.channel.send(failedEmbed);
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
    name: "dm",
    description: "Direct message a user from the bot.",
    usage: "dm <user> <message>",
    emote: globals.emotes.chat,

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
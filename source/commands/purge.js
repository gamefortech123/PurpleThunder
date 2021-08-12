const discord = require("discord.js");
const config = require("../modules/config.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");

module.exports.execute = async(client, message, args) => {
    if (this.command.isPermitted(message.member))
    {
        if (args.length < 1) { return this.command.printUsage(client, message.channel); }
        if (args[0] < 1 || args[0] > 100) { return this.command.printUsage(client, message.channel); }

        const msgs = await message.channel.messages.fetch({ limit: args[0] });
        message.channel.bulkDelete(msgs)
        .then(msg => {
            const purgeEmbed = new discord.MessageEmbed()
            .setColor(globals.colors.red)
            .setDescription(`${globals.emotes.success} Successfully purged **${msg.size}/${args[0]}** messages.`)
            .setFooter(client.user.username, client.user.displayAvatarURL({}))
            .setTimestamp();

            message.channel.send(purgeEmbed).then(msg => msg.delete({ timeout: 5000 }))
        });
    
        const logEmbed = new discord.MessageEmbed()
            .setColor(globals.colors.red)
            .setAuthor(message.author.tag, message.author.displayAvatarURL({}))
            .setDescription(`Just purged ${args[0]} messages in ${message.channel}.`)
            .setFooter(`User ID: ${message.author.id}`)
            .setTimestamp();
    
        client.channels.fetch(server.text_channels.bot_logs).then(channel => channel.send(logEmbed));
    }
    else
    {
        this.command.printPerms(client, message.channel);
    }
};

module.exports.command = {
    name: "purge",
    description: "Purge a desired amount of messages from a channel.",
    usage: "purge <1-100> <channel-optional>",
    emote: globals.emotes.trash,

    isPermitted: function(guildMember) {
        if (guildMember.roles.cache.has(server.roles.bot)
            || guildMember.roles.cache.has(server.roles.codered)
            || guildMember.roles.cache.has(server.roles.administrator))
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
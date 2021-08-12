const discord = require("discord.js");
const config = require("../modules/config.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");

module.exports.execute = (client, message, args) => {
    if (this.command.isPermitted(message.member))
    {
        try
        {
            delete require.cache[require.resolve(`./${args[0]}.js`)];

            const reloadEmbed = new discord.MessageEmbed()
                .setColor(globals.colors.red)
                .setDescription(`${globals.emotes.success} Successfully reloaded the file: \`${args[0]}.js\`!`)
                .setFooter(client.user.username, client.user.displayAvatarURL({}))
                .setTimestamp();

            message.channel.send(reloadEmbed);
        }
        catch (e)
        {
            const reloadEmbed = new discord.MessageEmbed()
                .setColor(globals.colors.red)
                .setDescription(`${globals.emotes.error} Failed to reload the file: \`${args[0]}.js\`!`)
                .setFooter(client.user.username, client.user.displayAvatarURL({}))
                .setTimestamp();

            message.channel.send(reloadEmbed);
            console.log(e.stack);
        }
    }
    else
    {
        this.command.printPerms(client, message.channel);
    }
};

module.exports.command = {
    name: "reload",
    description: "Deletes a commands resolved cache.",
    usage: "reload <command-name>",
    emote: globals.emotes.reload,

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
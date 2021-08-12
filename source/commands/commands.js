const discord = require("discord.js");
const fs = require("fs");
const config = require("../modules/config.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");

module.exports.execute = (client, message, args) => {
    if (this.command.isPermitted(message.member))
    {
        let helpString = ``;
        const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

        for (const file of commandFiles)
        {
            const cmd = require(`./${file}`);
            helpString += `${cmd.command.emote} **${config.prefix}${cmd.command.usage}**\n${cmd.command.description}\n`;
        }
        
        const helpEmbed = new discord.MessageEmbed()
            .setColor(globals.colors.red)
            .setTitle(`${this.command.emote} Commands`)
            .setDescription(helpString)
            .setFooter(client.user.username, client.user.displayAvatarURL({}))
            .setTimestamp();

        message.channel.send(helpEmbed);
    }
    else
    {
        this.command.printUsage(client. message.channel);
    }
};

module.exports.command = {
    name: "help",
    description: "Kicks a user from the server with a message.",
    usage: "help",
    emote: globals.emotes.info,

    isPermitted: function(guildMember) {
        if (guildMember.roles.cache.has(server.roles.member))
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
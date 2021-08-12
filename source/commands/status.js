const discord = require("discord.js");
const config = require("../modules/config.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");

module.exports.execute = async(client, message, args) => {
    if (this.command.isPermitted(message.member))
    {
        let status = args[0];

        if (status === "normal"
            || status ==="testing"
            || status === "outdated")
        {
            client.channels.fetch(server.text_channels.status).then(channel => {
                channel.messages.fetch({ limit: 50 }).then(messages => {
                    messages.some(message => { if (message.author.bot) { message.delete(); }
                })})
            });

            if (status === "normal")
            {
                const normalEmbed = new discord.MessageEmbed()
                    .setColor(globals.colors.green)
                    .setAuthor("Up to Date", "https://i.imgur.com/0B4J12c.png")
                    .setTitle("CodeRed is Currently Up To Date!")
                    .setDescription("If you are getting an out of date message with the mod, click the `Check For Updates` button in the injectors settings to download the latest version!")
                    .setFooter(client.user.username, client.user.displayAvatarURL({}))
                    .setTimestamp();

                client.channels.fetch(server.text_channels.status).then(channel => channel.send(normalEmbed));
            }
            else if (status === "testing")
            {
                const testingEmbed = new discord.MessageEmbed()
                    .setColor(globals.colors.orange)
                    .setAuthor("Looking For Testers", "https://i.imgur.com/rhZijtq.png")
                    .setTitle("CodeRed is Being Tested!")
                    .setDescription(`An update is being worked on but is not yet final, if you would like to help out check off the \`Use Experimental Versions\` checkbox in the injectors settings and please report any bugs in <#${server.text_channels.bugs}>.`)
                    .setFooter(client.user.username, client.user.displayAvatarURL({}))
                    .setTimestamp();

                client.channels.fetch(server.text_channels.status).then(channel => channel.send(testingEmbed));
            }
            else if (status === "outdated")
            {
                const outdatedEmbed = new discord.MessageEmbed()
                    .setColor(globals.colors.red)
                    .setAuthor("Out of Date", "https://i.imgur.com/gHHRcbw.png")
                    .setTitle("CodeRed is Currently Outdated!")
                    .setDescription("The current mod is not compatible with the latest Rocket League version, we are actively working on an update so please be patient!")
                    .setFooter(client.user.username, client.user.displayAvatarURL({}))
                    .setTimestamp();

                client.channels.fetch(server.text_channels.status).then(channel => channel.send(outdatedEmbed));
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
    name: "status",
    description: "Sets the update status message for CodeRed.",
    usage: "say <normal-testing-outdated>",
    emote: globals.emotes.megaphone,

    isPermitted: function(guildMember) {
        if (guildMember.roles.cache.has(server.roles.bot)
            || guildMember.roles.cache.has(server.roles.codered))
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
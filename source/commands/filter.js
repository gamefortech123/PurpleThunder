const discord = require("discord.js");
const fs = require("fs");
const config = require("../modules/config.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");
const filter = require("../databases/filter.json");

module.exports.execute = (client, message, args) => {
    if (this.command.isPermitted(message.member))
    {
        if (args.length < 2) { return this.command.printUsage(client, message.channel); }
        if (args[0] !== "add" && args[0] !== "remove" && args[0] !== "view") { return this.command.printUsage(client, message.channel); }
        if (args[1] !== "username" && args[1] !== "phrase") { return this.command.printUsage(client, message.channel); }
        
        let table = args[1] === "username" ? "usernames" : "phrases";
        let shouldView = args[0] === "view" ? true : false;

        if (shouldView)
        {
            let viewStrings = "";
            filter[table].some(str => { viewStrings += str + "\n" });

            const filterEmbed = new discord.MessageEmbed()
                .setColor(globals.colors.red)
                .setTitle(`Filter Database`)
                .setDescription(`\`\`\`\n${viewStrings}\`\`\``)
                .setFooter(client.user.username, client.user.displayAvatarURL({}))
                .setTimestamp();

            message.channel.send(filterEmbed);
        }
        else
        {
            let shouldAdd = args[0] === "add" ? true : false;
            let textToFilter = args.slice(2).join(" ");
    
            if (shouldAdd)
            {
                if (!filter[table].includes(textToFilter))
                {
                    filter[table].push(textToFilter);

                    const filterEmbed = new discord.MessageEmbed()
                        .setColor(globals.colors.red)
                        .setDescription(`${globals.emotes.success} Successfully added \`${textToFilter}\` to the blacklisted ${table} database.`)
                        .setFooter(client.user.username, client.user.displayAvatarURL({}))
                        .setTimestamp();

                    message.channel.send(filterEmbed);
                }
            }
            else
            {
               if (filter[table].includes(textToFilter))
               {
                    filter[table].splice(filter[table].indexOf(textToFilter), 1);

                    const filterEmbed = new discord.MessageEmbed()
                        .setColor(globals.colors.red)
                        .setDescription(`${globals.emotes.success} Successfully removed \`${textToFilter}\` from the blacklisted ${table} database.`)
                        .setFooter(client.user.username, client.user.displayAvatarURL({}))
                        .setTimestamp();

                    message.channel.send(filterEmbed);
               }
            }
    
            fs.writeFile("./databases/filter.json", JSON.stringify(filter), (e) => { if (e) console.log(e) });
        }
    }
    else
    {
        this.command.printPerms(client, message.channel);
    }
};

module.exports.command = {
    name: "filter",
    description: "Add or remove words to the text filter.",
    usage: "filter <add-remove-view> <username-phrase> <words>",
    emote: globals.emotes.list,

    isPermitted: function(guildMember) {
        if (guildMember.roles.cache.has(server.roles.bot)
            || guildMember.roles.cache.has(server.roles.codered)
            || guildMember.roles.cache.has(server.roles.administrator)
            || guildMember.roles.cache.has(server.roles.moderator)
            || guildMember.roles.cache.has(server.roles.support))
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
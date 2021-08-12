const discord = require("discord.js");
const config = require("../modules/config.js");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");
const filter = require("../databases/filter.json");

module.exports = async(client, message) =>
{
    if (message.author.bot) { return; }

    if (message.channel.type === "dm")
    {
        const messageEmbed = new discord.MessageEmbed()
            .setColor(globals.colors.cyan)
            .setAuthor(message.author.tag, message.author.displayAvatarURL({}))
            .addField(`${globals.emotes.chat} Just sent me a private message`, message.content)
            .setFooter(`User ID: ${message.author.id}`)
            .setTimestamp();

        client.channels.fetch(server.text_channels.bot_logs).then(channel => {
            channel.send(messageEmbed);

            if (message.content.includes("!partner"))
            {
                channel.send(`<@${server.members.itsbrank}> Partner program message detected!`);
                message.reply("Your partner message has been recieved! We will get back to you as soon as we can.");
            }
        });

        return;
    }

    let args = message.content.slice(1).trim().split(" ");
    let command = args.shift().toLowerCase();

    if (message.content.startsWith(config.prefix))
    {
        if (!server.command_channels.includes(message.channel.id)
            && (!message.member.roles.cache.has(server.roles.codered)
            && !message.member.roles.cache.has(server.roles.administrator)
            && !message.member.roles.cache.has(server.roles.moderator)
            && !message.member.roles.cache.has(server.roles.support)))
        {
            client.channels.fetch(server.text_channels.commands).then(channel => channel.send(`Hey, ${message.author}. Use this channel for bot commands please!`));
            message.delete();
            return;
        }

        try
        {
            let commandFile = require(`../commands/${command}.js`);
            delete require.cache[require.resolve(`../commands/${command}.js`)];
            commandFile.execute(client, message, args);
        }
        catch (e)
        {
            console.log(e.stack);
        }
    }
    else
    {
        let content = message.content.toLowerCase();
        content = content.replace(" ", "");

        if (filter["phrases"].some(word => content.includes(word)))
        {
            const filterEmbed = new discord.MessageEmbed()
                .setColor(globals.colors.red)
                .setAuthor(message.author.tag, message.author.displayAvatarURL({}))
                .setDescription(`Blacklisted phrase detected in ${message.channel}!`)
                .setFooter(`User ID: ${message.author.id}`)
                .setTimestamp();
    
            client.channels.fetch(server.text_channels.bot_logs).then(channel => channel.send(filterEmbed));
            message.delete();
        }
    }
};
const discord = require("discord.js");
const fs = require("fs");
const globals = require("../modules/globals.js");
const server = require("../modules/server.js");
const filter = require("../databases/filter.json");
const verification = require("../databases/verification.json");

module.exports = async(client, guildMember) => {
    let accountAge = (Date.now() - guildMember.user.createdAt) / 1000 / 60 / 60 / 24;

    if (accountAge < 28)
    {
        guildMember.user.kick("Possible spam bot, account age is under minimum requirement!");
    }
    else
    {
        let username = guildMember.displayName.toLowerCase();
        username = username.replace(" ", "");
    
        if (filter["usernames"].some(name => username.includes(name)))
        {
            guildMember.kick("Blacklisted username detected, possible spam bot!");
        }
        else
        {
            const joinEmbed = new discord.MessageEmbed()
                .setColor(globals.colors.green)
                .setAuthor(`${guildMember.user.tag} Has joined the server.`)
                .setFooter(`User ID: ${guildMember.user.id}`, guildMember.user.displayAvatarURL({}))
                .setTimestamp();
        
            client.channels.fetch(server.text_channels.bot_logs).then(channel => channel.send(joinEmbed));

            if (accountAge < 365 || filter["avatars"].some(avatar => guildMember.user.displayAvatarURL({}).includes(avatar)))
            {
                let verifyCode = "";
                const codeChars = "1234567890abcdejghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321";

                for (let i = 0; i < (codeChars.length / 4); i++)
                {
                    verifyCode += codeChars.charAt(Math.floor(Math.random() * codeChars.length));
                }

                verification[guildMember.user.id] = { code: verifyCode };
                fs.writeFile("./databases/verification.json", JSON.stringify(verification), (e) => { if (e) console.log(e) });

                const verifyEmbed = new discord.MessageEmbed()
                    .setColor(globals.colors.red)
                    .setTitle(`${globals.emotes.robot} User Verification`)
                    .setDescription(`Hey **${guildMember.user.tag}**, your account has been marked as suspicious, please type \`!verify ${verifyCode}\` to verify you are not a bot to proceed.`, "You have 24 hours to complete this action or you will be automatically banned.")
                    .setFooter(client.user.username, client.user.displayAvatarURL({}))
                    .setTimestamp();

                client.channels.fetch(server.text_channels.verify).then(channel => channel.send(verifyEmbed));
            }
            else
            {
                if (!guildMember.roles.cache.has(server.roles.member))
                {
                    guildMember.roles.add(server.roles.member);
                }
            }    
        }
    }
};
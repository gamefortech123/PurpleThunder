const fs = require("fs");
const discord = require("discord.js");
const client = new discord.Client();
const config = require("./modules/config.js");

const Init = async() =>
{
    let totalCommands = 0;
    let totalEvents = 0;

    const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

    for (const file of commandFiles)
    {
        let fileName = file.split(".")[0];
        console.log(`[${Date(Date.now()).toString()}]: Loading command \"${fileName}\".`);
        totalCommands++;
    }

    const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

    for (const file of eventFiles)
    {
        let fileName = file.split(".")[0];
        const event = require(`./events/${file}`);
        client.on(fileName, event.bind(null, client));
        console.log(`[${Date(Date.now()).toString()}]: Loading event '${fileName}'.`);
        totalEvents++;
    }

    console.log(`[${Date(Date.now()).toString()}]: Loaded a total of ${totalCommands} commands.`);
    console.log(`[${Date(Date.now()).toString()}]: Loaded a total of ${totalEvents} events.`);

    client.login(config.auth_token);
};

Init();
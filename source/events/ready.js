const discord = require("discord.js");

module.exports = async(client) => {
    console.log(`[${Date(Date.now()).toString()}]: Logged into Discord as ${client.user.tag} (${client.user.id}).`);
};
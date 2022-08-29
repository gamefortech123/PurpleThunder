const discord = require("discord.js");

module.exports = async(client) => {
    console.log(`[${Date(Date.now()).toString()}]: Logged into Discord as ${client.user.tag} (${client.user.id}).`);
    //client.user.setStatus("dnd");
    client.user.setActivity("berry plum flavor", {
  	type: "STREAMING",
 	 url: "https://www.twitch.tv/itsbrank"
    });
};
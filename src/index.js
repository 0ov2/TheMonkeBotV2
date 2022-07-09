//
// M O N K E  B O T  V 2
//

//  :packages:
const discord = require('discord.js');
require('dotenv').config();



//  :code:
const { getDiscordChannelObject, sendMessageToChannel } = require("./js/helpers/channelHelpers.js")


//  :statics:
const client = new discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION", "USER"], intents: ["GUILD_VOICE_STATES"]});



//  runtime
(() => {

  //  :step 1:
  //  Login to MonkeBotV2
  client.login(process.env.TOKEN)

  //  :step 2:
  //  listen for bot online
  client.on("ready", () => {
    console.log("Monke Bot V2 Ready")
    sendMessageToChannel(client, "monke-bot", "Monke Bot V2 Ready")
  })

})()


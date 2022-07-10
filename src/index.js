//
//     M O N K E  B O T  V 2
//

//  :packages:
const { Client } = require('discord.js');
require('dotenv').config();



//  :code:
const { sendMessageToChannel } = require("./js/helpers/channelHelpers.js")
const { createMonkeCommandsbutton } = require("./js/buttons/monke-commands");
const { handleSlowModeSelectMenuInteration, handleClearSlowModeInteraction } = require('./js/buttons/handler/button-interactions-handler.js');

//  :statics:
const client = new Client({ partials: ["MESSAGE", "CHANNEL", "REACTION", "USER"], intents: ["GUILD_VOICE_STATES", "GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]});



//  runtime
(() => {

  //  :step 1:
  //  Login to MonkeBotV2
  client.login(process.env.TOKEN)

  //  :step 2:
  //  listen for bot online
  client.on("ready", () => {
    //  monke online message
    sendMessageToChannel(client, "monke-bot", "Monke Bot V2 Ready")


    //  Set up button commands in monke-commands channel
    createMonkeCommandsbutton(client)
  })

  //  Initialise CRON jobs



  // Handle Button interations
  client.on('interactionCreate', interaction => {
    if (interaction.isSelectMenu()){
      handleSlowModeSelectMenuInteration(client, interaction)
    }

    if (interaction.isButton() && interaction.customId === "clear-slow-mode"){
      handleClearSlowModeInteraction(client, interaction)
    }
  })

})()


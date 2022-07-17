//
//     M O N K E  B O T  V 2
//

//  :packages:
const { Client } = require('discord.js');
require('dotenv').config();

//  :code:
const { sendMessageToChannel } = require("./js/helpers/channelHelpers.js")
const { createMonkeCommandsbutton, createMoveOctaneButton } = require("./js/buttons/monke-commands");
const { handleSlowModeSelectMenuInteration, handleClearSlowModeInteraction, moveOctaneInteraction } = require('./js/buttons/handler/button-interactions-handler.js');
const { setUpAvailabilityCronJobs } = require('./js/cron-jobs/cronJobs.js');

//  :statics:
const client = new Client({ partials: ["MESSAGE", "CHANNEL", "REACTION", "USER"], intents: ["GUILD_VOICE_STATES", "GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"]});



//  runtime
(() => {

  //  Login to MonkeBotV2
  client.login(process.env.TOKEN)

  //  listen for bot online
  client.on("ready", () => {

    //  monke online message
    sendMessageToChannel(client, "monke-bot", "Monke Bot V2 Ready")


    //  Set up button commands in monke-commands channel
    createMonkeCommandsbutton(client)
    createMoveOctaneButton(client)
    
    //  Initialise CRON jobs
    setUpAvailabilityCronJobs(client)


  })


  // Handle Button interations
  client.on('interactionCreate', interaction => {

    //  Slow mode interactions
    if (interaction.isSelectMenu() && interaction.customId === "slow-mode"){
      handleSlowModeSelectMenuInteration(client, interaction)
    }

    if (interaction.isButton() && interaction.customId === "clear-slow-mode"){
      handleClearSlowModeInteraction(client, interaction)
    }
    
    if (interaction.isButton() && interaction.customId === "move-octane"){
      moveOctaneInteraction(client, interaction)
    }

  })


client.on("messageReactionAdd", async (reaction, user) => { 

  //  availability
  const message = await reaction.message.fetch()
  console.log(message);
})


})()


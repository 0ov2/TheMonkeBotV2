//
//
//          █▀▄▀█   █▀█   █▄░█   █▄▀   █▀▀       █▄▄   █▀█   ▀█▀     █░█   ▀█
//          █░▀░█   █▄█   █░▀█   █░█   ██▄       █▄█   █▄█   ░█░     ▀▄▀   █▄ 🦧
//                             ( 🇼​​​​​ 🇴​​​​​ 🇷​​​​​ 🇰​​​​​  🇮​​​​​🇳​​​​​  🇵​​​​​ 🇷​​​​​ 🇴​​​​​ 🇬​​​​​ 🇷​​​​​ 🇪​​​​​ 🇸​​​​​ 🇸​​​​​ )
//
//

//  :packages:
const { Client, EmbedBuilder } = require('discord.js');
require('dotenv').config();

//  :code:
const { sendMessageToChannel, getDiscordChannelID } = require("./js/helpers/channelHelpers.js")
const { createMonkeCommandsbutton, requestTeamStatsDropdown } = require("./js/buttons/monke-commands");
const { handleSlowModeSelectMenuInteration, handleClearSlowModeInteraction, getHistoricalMatchStatsInteraction } = require('./js/buttons/handler/button-interactions-handler.js');
const { setUpAvailabilityCronJobs } = require('./js/cron-jobs/cronJobs.js');
const { avavilabilityReactionsHandler } = require('./js/helpers/reactionCountHelper.js');
const { DTAvailabilityLogging, logDeletedMessage } = require('./js/logging.js');
const { getLatestDTAvailabilityMessageObject } = require('./js/helpers/getMessageIdFromContent.js');
const { randomEmote } = require('./js/custom-emotes/emotes.js');

//  :statics:
const client = new Client({ partials: ["MESSAGE", "CHANNEL", "REACTION", "USER"], intents: ["GUILD_VOICE_STATES", "GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] });
const knownAvailbilityChannels = ["op-availability", "dt-availability", "octane-avilability"];

//  runtime
(() => {
  
  //  Login to MonkeBotV2
  client.login(process.env.TOKEN);

  //  listen for bot online
  client.on("ready", () => {

    //  monke online message
    sendMessageToChannel(client, "monke-bot", `Monke Bot V2 Ready ${randomEmote()}`)

    //  Set up button commands in monke-commands channel
    // createMonkeCommandsbutton(client)

    //
    //  content needs to be < 2000 in length, maybe split the content in half if length > 2000
    // requestTeamStatsDropdown(client)

    //  Initialise CRON jobs
    setUpAvailabilityCronJobs(client)

    //  :TODO: set up cron job if OP match is today
    // oldPepleMatchAnnouncement(client)

  })


  // Handle Button interations
  client.on('interactionCreate', async (interaction) => {
    const userObject = interaction.user
    const interactionValue = interaction.values[0]

    //  Slow mode interactions
    if (interaction.isSelectMenu() && interaction.customId === "slow-mode") {
      handleSlowModeSelectMenuInteration(client, interaction)
    }

    if (interaction.isButton() && interaction.customId === "clear-slow-mode") {
      handleClearSlowModeInteraction(client, interaction)
    }

    //  Match stats
    if (interaction.customId === "match-stats-eu" || interaction.customId === "match-stats-na") {
      console.log(`[TALK] ${userObject.username} Requested Match Stats for ${interactionValue}`);
      await getHistoricalMatchStatsInteraction(interaction)
    }
  })

  //  handle message reactions
  client.on("messageReactionAdd", async (reaction, user) => {
    
    //  availability
    if (knownAvailbilityChannels.includes(reaction.message.channel.name)) {
      avavilabilityReactionsHandler(reaction, user)
    }
    
    //  logging DT sign up
    const DTAvailabilitMessage = await getLatestDTAvailabilityMessageObject(client)
    const DTAvailabilityChannelID = await getDiscordChannelID(client, "dt-availability")

    if (reaction.message.channel.id === DTAvailabilityChannelID && !user.bot){
      if (reaction.message.id === DTAvailabilitMessage.id){
        await DTAvailabilityLogging(client, reaction, user, "reaction")
      } else if (reaction.message.id != DTAvailabilitMessage.id){
        await DTAvailabilityLogging(client, reaction, user, "custom")
      }
    }
  })

  client.on("messageReactionRemove", async (reaction, user) => {

    //  logging DT sign up
    const DTAvailabilitMessage = await getLatestDTAvailabilityMessageObject(client)
    const DTAvailabilityChannelID = await getDiscordChannelID(client, "dt-availability")

    if (reaction.message.channel.id === DTAvailabilityChannelID && !user.bot){
      if (reaction.message.id === DTAvailabilitMessage.id){
        await DTAvailabilityLogging(client, reaction, user, "remove_reaction")
      } else if (reaction.message.id != DTAvailabilitMessage.id){
        await DTAvailabilityLogging(client, reaction, user, "remove_custom")
      }
    }
  })

  client.on("messageDelete", async (message) => {
    logDeletedMessage(message, client)
  })
})()




// ( ͡° ͜ʖ ͡°( ಠ ͜ʖ ಠ ) ͡° ͜ʖ ͡°)

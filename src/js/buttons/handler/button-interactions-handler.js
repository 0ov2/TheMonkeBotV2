
//  :code:
const { getDiscordChannelObject, getListOfServerChannels } = require("../../helpers/channelHelpers")
const { formatHistoricalMapStats } = require("../../helpers/messageFormatting")
const { getHistoricalMatchStatsforSpecificTeam, getSpecifcTeamID } = require("../../apis")


const handleSlowModeSelectMenuInteration = (client, interaction) => {
  //  :step 1:
  //  get the channel object
  const channelObject = getDiscordChannelObject(client, interaction.values[0])

  //  :step 2:
  //  set the 1 minute slow mode 
  channelObject.setRateLimitPerUser(60)

  //  :step 3:
  //  respond to the interaction
  interaction.deferUpdate("true")
  interaction.user.send(`slow mode set for ${interaction.values[0]}`)

  //  TODO:
  //  Log interaction
  //  Reset the select menu value to placeholder
}


const handleClearSlowModeInteraction = (client, interaction) => {

  let rateLimitRemovedCount = 0

  //  :step 1:
  //  get list of server channels
  const serverChannelsList = getListOfServerChannels(client)

  //  :step 2:
  //  Remove every rate limit
  serverChannelsList.map(channel => {
    if (channel.type === "GUILD_TEXT"){
      if (channel.rateLimitPerUser > 0){
        channel.setRateLimitPerUser(0)
        rateLimitRemovedCount++
      }
    }
  })

  //  :step 3:
  //  handle interaction
  interaction.deferUpdate("true")
  interaction.user.send(`${rateLimitRemovedCount} channel rate limits were removed`)


  //  TODO:
  //  Log interaction

}

const moveOctaneInteraction = (client, interaction) => {
  //  :step 1:
  //  Get the channel objects for octane vs and fam 2
  const famTwoHiddenChannelObject = getDiscordChannelObject(client, "fam-2 (Hidden)")
  const octaneVCChannelObject = getDiscordChannelObject(client, "octane")


  //  :step 2:
  //  map through users in voice channel and set their active channel to fam2 hidden
  if (octaneVCChannelObject){
    octaneVCChannelObject.members.map(userObject => {
      userObject.voice.setChannel(famTwoHiddenChannelObject)
    })
  }

  interaction.deferUpdate("true")


  //  TODO: log interaction
}

const getHistoricalMatchStatsInteraction = async (interaction) => {
  const user = interaction.user
  const teamToSearchFor = interaction.values[0]
  
  console.log("[TALK] Getting Team ID");
  const teamID = await getSpecifcTeamID(teamToSearchFor)

  console.log("[TALK] Getting Historical Match Stats");
  const historicalMatchStats = await getHistoricalMatchStatsforSpecificTeam(teamID)

  console.log("[TALK] Formatting Historical Match Stats");
  const formattedHistoricalMapStats = formatHistoricalMapStats(historicalMatchStats, teamToSearchFor)

  console.log(`[TALK] Now Sending ${teamToSearchFor} Historical Match Stats To ${user.username}`);
  user.send(formattedHistoricalMapStats)

  interaction.deferUpdate("true")
}


module.exports = { handleSlowModeSelectMenuInteration, handleClearSlowModeInteraction, moveOctaneInteraction, getHistoricalMatchStatsInteraction }
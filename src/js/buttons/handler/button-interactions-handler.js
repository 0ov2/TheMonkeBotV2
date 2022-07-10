
//  :code:
const { getDiscordChannelObject, getListOfServerChannels } = require("../../helpers/channelHelpers")


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

module.exports = { handleSlowModeSelectMenuInteration, handleClearSlowModeInteraction }
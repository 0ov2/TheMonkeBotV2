
//  :packages:
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');


//  :code:
const { getDiscordChannelObject, getListOfServerChannels } = require("../helpers/channelHelpers");
const { getCurrentListOfVrmlTeams } = require('../vrml-api');


const createMonkeCommandsbutton = async (client) => {

  //  :step 1;
  //  Check if the commands message already exists 
  const monkeCommandChannel = getDiscordChannelObject(client, "monke-commands")
  const pinnedMessages = await monkeCommandChannel.messages.fetchPinned()

  if (pinnedMessages.size > 1) {

    return console.log("Command button already exists");

  } else {
    // :step 1:
    //  Get the list of server channels
    const serverChannelList = getListOfServerChannels(client)

    let serverChannelsOptionsArray = []

    //  :step 2:
    //  form the options array object from the server channels list
    serverChannelList.map(channel => {
      if (channel.type === "GUILD_TEXT") {
        serverChannelsOptionsArray.push({ label: channel.name, value: channel.name })
      }
    })

    //  :step 3:
    //  Create the button components 
    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('slow-mode')
          .setPlaceholder('Slow Mode')
          .addOptions(serverChannelsOptionsArray)
      )

    const clearSlowModeButton = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('clear-slow-mode')
          .setLabel('Clear All Slow Modes')
          .setStyle('DANGER')
      )

    const commandEmbed = new MessageEmbed()
      .setColor("ORANGE")
      .setTitle("Slow Mode")
      .setDescription("Set a 1 minute slow mode for a specific channel")

    //  :step 4:
    //  Send the embed with the button components
    await monkeCommandChannel.send({ embeds: [commandEmbed], components: [row, clearSlowModeButton] }).then(msg => msg.pin())
  }

}


const createMoveOctaneButton = async (client) => {

  //  :step 1;
  //  Check if the commands message already exists 
  const monkeCommandChannel = getDiscordChannelObject(client, "monke-commands")
  const pinnedMessages = await monkeCommandChannel.messages.fetchPinned()

  if (pinnedMessages.size > 1) {

    return console.log("Move Octane command already exists");

  } else {

    const moveOctaneButton = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('move-octane')
          .setLabel('Move Octane')
          .setStyle('PRIMARY')
      )

    const commandEmbed = new MessageEmbed()
      .setColor("ORANGE")
      .setTitle("Move Octane")
      .setDescription("Move anyone in Octane VC to fam-2 (Hidden)")

    //  :step 4:
    //  Send the embed with the button components
    await monkeCommandChannel.send({ embeds: [commandEmbed], components: [moveOctaneButton] }).then(msg => msg.pin())

  }
}

const requestTeamStatsDropdown = async (client) => {
  const monkeCommandChannel = getDiscordChannelObject(client, "monke-commands")
  const pinnedMessages = await monkeCommandChannel.messages.fetchPinned()

  if (pinnedMessages.size > 2) {return;}

  const getListOfVrmlTeams = await getCurrentListOfVrmlTeams()
  const naTeamList = [...getListOfVrmlTeams["America East"], ...getListOfVrmlTeams["America West"]]

  let formattedTeamArrayNa = []
  let formattedTeamArrayEu = []

  naTeamList.map(team => {
    formattedTeamArrayNa.push({ label: team, value: team })
  })

  getListOfVrmlTeams["Europe"].map(team => {
    formattedTeamArrayEu.push({ label: team, value: team })
  })


  const euTeamStatsDropdown = new MessageActionRow()
    .addComponents(
      new MessageSelectMenu()
        .setCustomId('match-stats-eu')
        .setPlaceholder('match-stats-eu')
        .addOptions(formattedTeamArrayEu)
    )

  const naTeamStatsDropdown = new MessageActionRow()
    .addComponents(
      new MessageSelectMenu()
        .setCustomId('match-stats-na')
        .setPlaceholder('match-stats-na')
        .addOptions(formattedTeamArrayNa)
    )

  const commandEmbed = new MessageEmbed()
    .setColor("ORANGE")
    .setTitle("Team Match Stats")
    .setDescription("Get historical match stats for a specific team")

  await monkeCommandChannel.send({ embeds: [commandEmbed], components: [euTeamStatsDropdown, naTeamStatsDropdown] }).then(msg => msg.pin())

}

module.exports = { createMonkeCommandsbutton, createMoveOctaneButton, requestTeamStatsDropdown }
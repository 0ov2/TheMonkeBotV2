
//  :packages:
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');


//  :code:
const { getDiscordChannelObject, getListOfServerChannels } = require("../helpers/channelHelpers")


const createMonkeCommandsbutton = async (client) => {

  //  :step 1;
  //  Check if the commands message already exists 
  const monkeCommandChannel = getDiscordChannelObject(client, "monke-commands")
  const pinnedMessages = await monkeCommandChannel.messages.fetchPinned()

  if (pinnedMessages.first()){

    return console.log("Command button already exists");

  } else {
    // :step 1:
    //  Get the list of server channels
    const serverChannelList = getListOfServerChannels(client)

    let serverChannelsOptionsArray = []
    
    //  :step 2:
    //  form the options array object from the server channels list
    serverChannelList.map(channel => {
      if(channel.type === "GUILD_TEXT"){
        serverChannelsOptionsArray.push({label: channel.name, value: channel.name})
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
        await monkeCommandChannel.send({embeds: [commandEmbed], components: [row, clearSlowModeButton]}).then(msg => msg.pin())
      }
    
}

module.exports = {createMonkeCommandsbutton}
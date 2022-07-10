
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

    //  :step 2:
    //  form the options array object from the server channels list
    let serverChannelsOptionsArray = []
    serverChannelList.map(item => {
      if(item.type === "GUILD_TEXT"){
        serverChannelsOptionsArray.push({label: item.name, value: item.name})
      }
    })


    //  :step 3:
    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('slow-mode')
          .setPlaceholder('Slow Mode')
          .addOptions(serverChannelsOptionsArray)
      )

    const commandEmbed = new MessageEmbed()
        .setColor("ORANGE")
        .setTitle("Commands")
        .setDescription("Slow mode - Set the message timeout for a specific channel")
    
        await monkeCommandChannel.send({embeds: [commandEmbed], components: [row]})
      }
    
}

module.exports = {createMonkeCommandsbutton}
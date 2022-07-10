
//  :packages:
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');


//  :code:
const { getDiscordChannelObject } = require("../helpers/channelHelpers")


const createMonkeCommandsbutton = async (client, Discord) => {

  //  :step 1;
  //  Check if the commands message already exists 
  const monkeCommandChannel = getDiscordChannelObject(client, "monke-commands")
  const pinnedMessages = await monkeCommandChannel.messages.fetchPinned()
  if (pinnedMessages.first()){
    return console.log("Command button already exists");
  } else {
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('slow-mode')
          .setLabel('Slow Mode')
          .setStyle('PRIMARY')
      )

    const commandEmbed = new MessageEmbed()
        .setColor("ORANGE")
        .setTitle("Commands")
        .setDescription("Slow mode - Set the message timeout for a specific channel")
    
        await monkeCommandChannel.send({embeds: [commandEmbed], components: [row]})
      }
    
}

module.exports = {createMonkeCommandsbutton}
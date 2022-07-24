
//  :code:
const { getDiscordChannelObject } = require("./channelHelpers");

const getLatestDTAvailabilityMessageObject = async (client) => {

  let DTChannelObject = await getDiscordChannelObject(client, 'dt-availability')
  let DTMessages = await DTChannelObject.messages.fetch();
 
  let DTAvailabilityMessage = DTMessages.find(msg => msg.content.includes('A - Monday night') && msg.author.bot == true);
  return DTAvailabilityMessage;

}

module.exports = { getLatestDTAvailabilityMessageObject }
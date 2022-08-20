

//  :packages:
const spacetime = require("spacetime");

//  :code:
const { sendMessageToChannel } = require("./helpers/channelHelpers");
const { reactionToDay } = require("./helpers/reactionToDay");


const DTAvailabilityLogging = async (client, reaction, user, option) => {

  await reaction.fetch();

  //  :step 1:
  //  get the current time in new york
  let NewYorkTimezone = spacetime(spacetime.now).goto('America/New_York');

  const KNOWN_MESSAGE_OPTIONS = {
    availability: `**A new week ${NewYorkTimezone.date()}/${NewYorkTimezone.format('iso-month')}/${NewYorkTimezone.year()}**\n`,
    reaction: `**AV** ${user.username} Added their reaction to ${await reactionToDay(reaction)} - ${NewYorkTimezone.date()}/${NewYorkTimezone.format('iso-month')}/${NewYorkTimezone.year()}/${NewYorkTimezone.time()}\n`,
    custom: `**CUSTOM** ${user.username} Added their reaction ${reaction.emoji.name} to ${reaction.message.content.toString()} - ${NewYorkTimezone.date()}/${NewYorkTimezone.format('iso-month')}/${NewYorkTimezone.year()}/${NewYorkTimezone.time()}\n`,
    remove_reaction: `**AV** ${user.username} Removed their reaction to ${await reactionToDay(reaction)} - ${NewYorkTimezone.date()}/${NewYorkTimezone.format('iso-month')}/${NewYorkTimezone.year()}/${NewYorkTimezone.time()}\n`,
    remove_custom: `**CUSTOM** ${user.username} Removed their reaction ${reaction.emoji.name} to ${reaction.message.content.toString()} - ${NewYorkTimezone.date()}/${NewYorkTimezone.format('iso-month')}/${NewYorkTimezone.year()}/${NewYorkTimezone.time()}\n`,
  }

  //  :step 2:
  //  send the message 
  sendMessageToChannel(client, "dt-logs", KNOWN_MESSAGE_OPTIONS[option])

}

//  :TODO: Needs more testing
//  No message content for older messages
const logDeletedMessage = async (message, client) => {

  const messageDeletedAt = spacetime.now('America/New_York').unixFmt('yyyy.MM.dd h:mm a');
  const deletedMessageCreatedAt = spacetime(message.createdAt).goto('America/New_York').unixFmt('yyyy.MM.dd h:mm a');

  const auditLogs = await message.guild.fetchAuditLogs()
    .then(deletedMessage => deletedMessage.entries.first())
    .catch(error => console.log(error))
    //  :TODO: better error handling
  
  const executor = auditLogs.executor.username || "No executor found"
  const deletedMessageAuthor = auditLogs.target.username || "No author found"
  const channel = auditLogs.extra.channel.name || "No channel found"
  const messageContent = message.content || "No message content"
  const attachments = []

  if (message.attachments){
    message.attachments.map(attachment => attachments.push(attachment.url))
  }

  const deletedMessageEmebed = {
    title: "DELETED MESSAGE",
    color: "ORANGE",
    fields: [
      { name: 'Message Content', value: messageContent },
      { name: 'Message Author', value: deletedMessageAuthor },
      { name: 'Channel', value: channel },
      { name: 'Deleted By', value: executor },
      { name: 'Attachments (click at your own risk)', value: getAttachments(attachments) },
      { name: 'Message Created', value: deletedMessageCreatedAt},
      { name: 'Message Deleted', value: messageDeletedAt}
    ]
  }

  sendMessageToChannel(client, "monke-deleted-messages", {embeds: [deletedMessageEmebed]})
}

//  :helper:
const getAttachments = (array) => {
  if (!array.length > 0) {return "No attachments"}

  let attachmentsMessage = ""

  array.map(attachment => attachmentsMessage = attachmentsMessage + `${attachment}, `)

  return attachmentsMessage;
}

module.exports = { DTAvailabilityLogging, logDeletedMessage }
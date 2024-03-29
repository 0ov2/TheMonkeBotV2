

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

  await sleep(3000);
  const auditLogs = await getAuditlogs(message)
  
  let executor = "No executor found"
  let deletedMessageAuthor = "No author found"
  let deletedFromChannel = "No channel found"
  let messageContent = "No message content"
  let attachments = []
  
  // super safe 
  // audit logs
  if (auditLogs){
    if (auditLogs.executor){
      if (auditLogs.executor.username){
        executor = auditLogs.executor.username;
      }
    }
  }

  // message
  if (message){
    if (message.content){
      messageContent = message.content;
    }
    if (message.attachments.length > 0){
      message.attachments.map(attachment => attachments.push(attachment.url))
    }
    if (message.author){
      if (message.author.username){
        deletedMessageAuthor = message.author.username;
      }
    }
    if (message.channelId){
      await client.channels.fetch(message.channelId)
      .then(channel => deletedFromChannel = channel.name)
      .catch(console.error);
    }
  }

  const deletedMessageEmebed = {
    title: "DELETED MESSAGE",
    color: "ORANGE",
    fields: [
      { name: 'Message Content', value: messageContent },
      { name: 'Message Author', value: deletedMessageAuthor },
      { name: 'Channel', value: deletedFromChannel },
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

const getAuditlogs = async (message) => {
  return new Promise((resolve) => {
    message.guild.fetchAuditLogs({limit: 1, type: "MESSAGE_DELETE"})
      .then(deletedMessage => resolve(deletedMessage.entries.first()))
      .catch(error => console.log(error))
      //  :TODO: better error handling
  })
}

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
}

module.exports = { DTAvailabilityLogging, logDeletedMessage }
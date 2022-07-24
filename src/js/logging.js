

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
    reaction: `**AV** ${user.username} Added their reaction to ${reactionToDay(reaction)} - ${NewYorkTimezone.date()}/${NewYorkTimezone.format('iso-month')}/${NewYorkTimezone.year()}/${NewYorkTimezone.time()}\n`,
    custom: `**CUSTOM** ${user.username} Added their reaction ${reaction.emoji.name} to ${reaction.message.content.toString()} - ${NewYorkTimezone.date()}/${NewYorkTimezone.format('iso-month')}/${NewYorkTimezone.year()}/${NewYorkTimezone.time()}\n`
  }

  //  :step 2:
  //  send the message 
  sendMessageToChannel(client, "dt-logs", KNOWN_MESSAGE_OPTIONS[option])

}

module.exports = { DTAvailabilityLogging }
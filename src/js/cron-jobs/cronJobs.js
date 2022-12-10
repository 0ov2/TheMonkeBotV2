
//  :packages:
const schedule = require('node-schedule');
const { sendMessageToChannel } = require('../helpers/channelHelpers');

//  :code:
const { OPAvailabilityMessage, DTAvailabilityMessage, OctaneAvailabilityMessage } = require('./availabilities-messages/availabilities');

const setUpAvailabilityCronJobs = (client) => {

  //  OP availability
  schedule.scheduleJob('0 18 * * 0', () => {
    OPAvailabilityMessage(client)
  })

  //  DT availability
  schedule.scheduleJob('0 23 * * 0', () => { // '0 23 * * 0
    DTAvailabilityMessage(client)
  })
}

// const matchAnnouncementCronJob = async (client, message, channel) => {
//   schedule.scheduleJob('0 9 * * *', () => {
//     sendMessageToChannel(client, channel, message)
//   })
// }

module.exports = { setUpAvailabilityCronJobs }
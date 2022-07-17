
//  :packages:
const schedule = require('node-schedule');

//  :code:
const { OPAvailabilityMessage, DTAvailabilityMessage, OctaneAvailabilityMessage } = require('./availabilities-messages/availabilities');



const setUpAvailabilityCronJobs = (client) => {

  //  OP availability
  schedule.scheduleJob('0 18 * * 0', () => {

    OPAvailabilityMessage(client)

  })

  //  DT availability
  schedule.scheduleJob('0 23 * * 0', () => {

    DTAvailabilityMessage(client)

    //  TODO: logging

  })

  //  Octane availability
  schedule.scheduleJob('0 23 * * 0', () => {

    OctaneAvailabilityMessage(client)

  })

}

module.exports = { setUpAvailabilityCronJobs }
//  :packages:
const spacetime = require('spacetime');

//  :code:
const { getDiscordChannelObject } = require('../../helpers/channelHelpers');
const { getSpecificRoleByName } = require('../../helpers/roleHelpers');

const OPAvailabilityMessage = async (client) => {

    const OPChannelObject = getDiscordChannelObject(client, "op-availability")
    const OPRolesObject = getSpecificRoleByName(client, "op")

    //  :step 1:
    //  get all epoch times for the week
    let epochArray = [];
    let spaceTimeDate = spacetime().time('7:00pm').goto('Europe/London');

    for (let i = 1; i < 8; i++){
        let date = spaceTimeDate.add(i, 'day');
        epochArray.push({'epoch': date.epoch / 1000, 'day': date.format('day')});
    }

    //  :step 2:
    //  build and send the availability message with local time syntax 
    await OPChannelObject.send("<@&" + OPRolesObject + ">\n" +
    `A - ${epochArray[0].day} <t:${epochArray[0].epoch}:t> \n` +
    `B - ${epochArray[1].day} <t:${epochArray[1].epoch}:t> \n` +
    `C - ${epochArray[2].day} <t:${epochArray[2].epoch}:t> \n` +
    `D - ${epochArray[3].day} <t:${epochArray[3].epoch}:t> \n` +
    `E - ${epochArray[4].day} <t:${epochArray[4].epoch}:t> \n` +
    `F - ${epochArray[5].day} <t:${epochArray[5].epoch}:t> \n` +
    `G - ${epochArray[6].day} <t:${epochArray[6].epoch}:t>`).then(async (message) => {
        await message.react('🇦'),
        await message.react('🇧'),
        await message.react('🇨'),
        await message.react('🇩'),
        await message.react('🇪'),
        await message.react('🇫'),
        await message.react('🇬');
    })
}


const DTAvailabilityMessage = async (client) => {

    const DTChannelObject = getDiscordChannelObject(client, "dt-availability")
    const DTRolesObject = getSpecificRoleByName(client, "dream")

    await DTChannelObject.send("<@&" + DTRolesObject + ">\n" + 
    `A - Monday night 8pm ish \n` +
    `B - Tuesday night 8pm ish \n` +
    `C - Wednesday night 8pm ish \n` +
    `D - Thursday night 8pm ish \n` +
    `E - Friday night 8pm ish \n` +
    `F - Saturday afternoon 3pm ish \n` +
    `G - Saturday night 8pm ish \n` +
    `H - Sunday afternoon 3pm ish \n` +
    `I - Sunday night 8pm ish`).then(async (message) => {
        await message.react('🇦'),
        await message.react('🇧'),
        await message.react('🇨'),
        await message.react('🇩'),
        await message.react('🇪'),
        await message.react('🇫'),
        await message.react('🇬'),
        await message.react('🇭'),
        await message.react('🇮');
    })
}

const OctaneAvailabilityMessage = async (client) => {

    const OctaneChannelObject = getDiscordChannelObject(client, "octane-availability")
    const OctaneRolesObject = getSpecificRoleByName(client, "octane")

    await OctaneChannelObject.send("<@&" + OctaneRolesObject + ">\n" + 
    'Monday').then(async (message) => {

        await message.react('8️⃣'),
        await message.react('9️⃣'),
        await message.react('🔟');

    })

    OctaneChannelObject.send( 
    'Tuesday').then(async (message) => {

        await message.react('8️⃣'),
        await message.react('9️⃣'),
        await message.react('🔟');

    })

    OctaneChannelObject.send( 
    'Wednesday').then(async (message) => {

        await message.react('8️⃣'),
        await message.react('9️⃣'),
        await message.react('🔟');

    })

    OctaneChannelObject.send( 
        'Thursday').then(async (message) => {

        await message.react('8️⃣'),
        await message.react('9️⃣'),
        await message.react('🔟');

    })

    OctaneChannelObject.send( 
    'Friday').then(async (message) => {

        await message.react('8️⃣'),
        await message.react('9️⃣'),
        await message.react('🔟');

    })

    OctaneChannelObject.send( 
    'Saturday').then(async (message) => {

        await message.react('8️⃣'),
        await message.react('9️⃣'),
        await message.react('🔟');

    })

    OctaneChannelObject.send(
    'Sunday').then(async (message) => {

        await message.react('8️⃣'),
        await message.react('9️⃣'),
        await message.react('🔟');

    })
}



module.exports = { OPAvailabilityMessage, DTAvailabilityMessage, OctaneAvailabilityMessage }
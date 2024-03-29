//
// Channel Helpers

const getDiscordChannelObject = (client, channelName) => {
    const channelObject = client.channels.cache.find(channel => channel.name === channelName)
    if (channelObject){
        return channelObject
    } else {
        return console.log("Cannot find channel: ", channelName)
    }
}

const getDiscordChannelID = (client, channelName) => {
    const channelObject = client.channels.cache.find(channel => channel.name === channelName)
    if (channelObject){
        return channelObject.id
    } else {
        return console.log("Cannot find channel: ", channelName)
    }
}

const sendMessageToChannel = (client, channelName, message) => {
    const channelObject = client.channels.cache.find(channel => channel.name === channelName)
    if (channelObject){
        channelObject.send(message)
    } else {
        return console.log("Cannot find channel: ", channelName)
    }
}

const getListOfServerChannels = (client) => {
    return client.channels.cache
}

module.exports = { getDiscordChannelObject, sendMessageToChannel, getListOfServerChannels, getDiscordChannelID }
//https://api.vrmasterleague.com/#teams

//
//  :packages:
const axios = require("axios").default
const spacetime = require('spacetime');
const { MessageEmbed } = require('discord.js');


//  
//  :code:
const { getDiscordChannelObject } = require("../helpers/channelHelpers");
const { getSpecificRoleByName } = require("../helpers/roleHelpers");

const fetchUpcomingMatches = async (client) => {
  const oldPeopleAnnouncementsChannel = getDiscordChannelObject(client, "op-match-announcements")
  const OPRolesObject = getSpecificRoleByName(client, "op")

  const teamToSearchFor = "Pixel"
  let upcomingMatchesResponse = null
  let matchObject = null
  let opponentTeamId = null
  let seasonStatsMaps = null
  let mapStatsMessage = "OPPONENT MAP STATS: \n"
  let matchStructuredObject = {
    matchDate: "",
    homeTeam: {
      teamName: "",
      teamLogo: "",
      teamID: ""
    },
    awayTeam: {
      teamName: "",
      teamLogo: "",
      teamID: ""
    }
  }

  //  request upcoming matches from VRML api
  await axios.get("https://api.vrmasterleague.com/pavlov/matches/upcoming")
    .then((response) => upcomingMatchesResponse = response.data)
    .catch((error) => console.log(error))


  //  form our data structure with relevent information for later use
  upcomingMatchesResponse.every(object => {
    if (object.homeTeam.teamName === teamToSearchFor || object.awayTeam.teamName === teamToSearchFor) {
      matchObject = object // need?
      matchStructuredObject.matchDate = object.dateScheduledUTC

      matchStructuredObject.homeTeam.teamName = object.homeTeam.teamName
      matchStructuredObject.homeTeam.teamLogo = object.homeTeam.teamLogo
      matchStructuredObject.homeTeam.teamID = object.homeTeam.teamID

      matchStructuredObject.awayTeam.teamName = object.awayTeam.teamName
      matchStructuredObject.awayTeam.teamLogo = object.awayTeam.teamLogo
      matchStructuredObject.awayTeam.teamID = object.awayTeam.teamID

      if (object.homeTeam.teamName === teamToSearchFor) {
        opponentTeamId = object.awayTeam.teamID
      } else {
        opponentTeamId = object.homeTeam.teamID
      }

      return false;
    }
    return true;
  });

  //  request opponent stats
  await axios.get(`https://api.vrmasterleague.com/Teams/${opponentTeamId}`)
    .then((response) => upcomingMatchesResponse = seasonStatsMaps = response.data.seasonStatsMaps)
    .catch((error) => console.log(error))

  if (!matchStructuredObject) { return; }
  const convertedMatchDateTime = spacetime(matchStructuredObject.matchDate, "UTC").goto('Europe/London').epoch / 1000
  const s = spacetime(matchStructuredObject.matchDate, "UTC").goto('Europe/London').hour(9)

  seasonStatsMaps.every(object => {
    mapStatsMessage += `
    **${object.mapName}** Amount Played - ${object.played} Wins - ${object.win} Win Percentage - ${object.winPercentage} Round Win Percentage - ${object.roudsWinPercentage || object.roundsWinPercentage}`
    return true
  })

  //  TODO: form a structure object so we can easily use it here, must include the oppoents team id and map states
  // const opponentMapStatsEmbed = new MessageEmbed()
  // .setColor("ORANGE")
  // .setTitle("Slow Mode")
  // .setDescription("**OPPONENT MAP STATS**")

  //  Send the embed
  // await oldPeopleAnnouncementsChannel.send({embeds: [opponentMapStatsEmbed]})



  const messageToSend = `
  ${OPRolesObject} **MATCH DAY** ${matchStructuredObject.homeTeam.teamName} VS ${matchStructuredObject.awayTeam.teamName}, Starting - <t:${convertedMatchDateTime}:R> <t:${convertedMatchDateTime}:t>`


  await oldPeopleAnnouncementsChannel.send(messageToSend)

}


module.exports = { fetchUpcomingMatches }
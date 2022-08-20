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

//
//  :statics:
const teamToSearchFor = "Compashka"

const fetchUpcomingMatches = async (client) => {
  const oldPeopleAnnouncementsChannel = getDiscordChannelObject(client, "op-match-announcements")
  const OPRolesObject = getSpecificRoleByName(client, "op")

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
  let opponentMatchHistory = {}

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

  if (!matchStructuredObject) { return; }


  // https://api.vrmasterleague.com/Teams/TSLIf5IOwq3I---30lwUJw2/Matches/History/Detailed
  await axios.get(`https://api.vrmasterleague.com/Teams/${opponentTeamId}/Matches/History/Detailed`)
    .then((response) => {
      response.data.every(matchObject => {
        if (matchObject.seasonName.includes('Season 10')) {
          if (!opponentMatchHistory[matchObject.dateScheduledUTC]) {
            opponentMatchHistory[matchObject.dateScheduledUTC] = {}
          }

          //  initalise the objects we are going to use
          opponentMatchHistory[matchObject.dateScheduledUTC].homeTeam = {}
          opponentMatchHistory[matchObject.dateScheduledUTC].awayTeam = {}
          opponentMatchHistory[matchObject.dateScheduledUTC].homeTeam.picks = {}
          opponentMatchHistory[matchObject.dateScheduledUTC].awayTeam.picks = {}

          //  team names
          opponentMatchHistory[matchObject.dateScheduledUTC].homeTeam.team = matchObject.homeTeam.teamName
          opponentMatchHistory[matchObject.dateScheduledUTC].awayTeam.team = matchObject.awayTeam.teamName

          //  team picks
          opponentMatchHistory[matchObject.dateScheduledUTC].homeTeam.picks[matchObject.mapsSet[0].mapName] = {
            homeScore: matchObject.mapsSet[0].homeScore,
            awayScore: matchObject.mapsSet[0].awayScore
          }
          opponentMatchHistory[matchObject.dateScheduledUTC].homeTeam.picks[matchObject.mapsSet[2].mapName] = {
            homeScore: matchObject.mapsSet[2].homeScore,
            awayScore: matchObject.mapsSet[2].awayScore
          }
          opponentMatchHistory[matchObject.dateScheduledUTC].awayTeam.picks[matchObject.mapsSet[1].mapName] = {
            homeScore: matchObject.mapsSet[1].homeScore,
            awayScore: matchObject.mapsSet[1].awayScore
          }
        }
        return true;
      })

    }).catch((err) => console.log(err))

  console.log(opponentMatchHistory);


  //  request opponent stats
  // await axios.get(`https://api.vrmasterleague.com/Teams/${opponentTeamId}`)
  //   .then((response) => upcomingMatchesResponse = seasonStatsMaps = response.data.seasonStatsMaps)
  //   .catch((error) => console.log(error))

  // if (!matchStructuredObject) { return; }
  // const convertedMatchDateTime = spacetime(matchStructuredObject.matchDate, "UTC").goto('Europe/London').epoch / 1000
  // const s = spacetime(matchStructuredObject.matchDate, "UTC").goto('Europe/London').hour(9)

  // seasonStatsMaps.every(object => {
  //   mapStatsMessage += `
  //   **${object.mapName}** Amount Played - ${object.played} Wins - ${object.win} Win Percentage - ${object.winPercentage} Round Win Percentage - ${object.roudsWinPercentage || object.roundsWinPercentage}`
  //   return true
  // })

  //  TODO: form a structure object so we can easily use it here, must include the oppoents team id and map states
  // const opponentMapStatsEmbed = new MessageEmbed()
  // .setColor("ORANGE")
  // .setTitle("Slow Mode")
  // .setDescription("**OPPONENT MAP STATS**")

  //  Send the embed
  // await oldPeopleAnnouncementsChannel.send({embeds: [opponentMapStatsEmbed]})



  // const messageToSend = `
  // ${OPRolesObject} **MATCH DAY** ${matchStructuredObject.homeTeam.teamName} VS ${matchStructuredObject.awayTeam.teamName}, Starting - <t:${convertedMatchDateTime}:R> <t:${convertedMatchDateTime}:t>\n${mapStatsMessage}`


  // await oldPeopleAnnouncementsChannel.send(messageToSend)

}

const getCurrentListOfVrmlTeams = async () => {

  let vrmlStandings = {
    "Europe": [],
    "America West": [],
    "America East": [],
    "Oceania/Asia": []
  }

  // https://apiignite.vrmasterleague.com/Pavlov/Standings
  await axios.get('https://apiignite.vrmasterleague.com/Pavlov/Standings')
    .then((response) => {
      const standings = response.data

      standings.every((team) => {
        if (team.mmr > 0) {
          vrmlStandings[team.region].push(team.name)
        }

        return true;
      })
    }).then((err) => console.log(err))

  return vrmlStandings;
}

const getSpecifcTeamID = async (teamToSearchFor) => {

  let teamID = null

  console.log("[TALK] requesting pavlov standings");
  // https://apiignite.vrmasterleague.com/Pavlov/Standings
  await axios.get('https://apiignite.vrmasterleague.com/Pavlov/Standings')
    .then((response) => {
      const standings = response.data

      standings.every((team) => {
        if (team.name === teamToSearchFor) {
          console.log("[TALK] Team found");
          teamID = team.id
          return false
        }

        return true;
      })
    }).then((err) => console.log(err))

  return teamID;
}

const getHistoricalMatchStatsforSpecificTeam = async (teamId) => {

  if (!teamId) { return; }

  let opponentMatchHistory = {}

  await axios.get(`https://api.vrmasterleague.com/Teams/${teamId}/Matches/History/Detailed`)
    .then((response) => {
      response.data.every(matchObject => {
        if (matchObject.seasonName.includes('Season 10')) {
          if (!opponentMatchHistory[matchObject.dateScheduledUTC]) {
            opponentMatchHistory[matchObject.dateScheduledUTC] = {}
          }

          //  initalise the objects we are going to use
          opponentMatchHistory[matchObject.dateScheduledUTC].homeTeam = {}
          opponentMatchHistory[matchObject.dateScheduledUTC].awayTeam = {}
          opponentMatchHistory[matchObject.dateScheduledUTC].homeTeam.picks = {}
          opponentMatchHistory[matchObject.dateScheduledUTC].awayTeam.picks = {}

          //  team names
          opponentMatchHistory[matchObject.dateScheduledUTC].homeTeam.team = matchObject.homeTeam.teamName
          opponentMatchHistory[matchObject.dateScheduledUTC].awayTeam.team = matchObject.awayTeam.teamName

          //  team picks
          opponentMatchHistory[matchObject.dateScheduledUTC].homeTeam.picks[matchObject.mapsSet[0].mapName] = {
            homeScore: matchObject.mapsSet[0].homeScore,
            awayScore: matchObject.mapsSet[0].awayScore
          }
          opponentMatchHistory[matchObject.dateScheduledUTC].homeTeam.picks[matchObject.mapsSet[2].mapName] = {
            homeScore: matchObject.mapsSet[2].homeScore,
            awayScore: matchObject.mapsSet[2].awayScore
          }
          opponentMatchHistory[matchObject.dateScheduledUTC].awayTeam.picks[matchObject.mapsSet[1].mapName] = {
            homeScore: matchObject.mapsSet[1].homeScore,
            awayScore: matchObject.mapsSet[1].awayScore
          }
        }
        return true;
      })

    }).catch((err) => console.log(err))

  return opponentMatchHistory;
}


module.exports = { fetchUpcomingMatches, getCurrentListOfVrmlTeams, getSpecifcTeamID, getHistoricalMatchStatsforSpecificTeam }
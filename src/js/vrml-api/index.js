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
const { matchAnnouncementCronJob } = require("../cron-jobs/cronJobs");

//
//  :statics:
const teamToSearchFor = "PLants"

const oldPepleMatchAnnouncement = async (client) => {
  const OPRolesObject = getSpecificRoleByName(client, "op")
  let matchDate = null
  let opponentID = null
  let homeTeamName = null
  let awayTeamName = null
  //
  //  :step 1:
  //  request the upcoming VRML matches
  const upcomingMatchesArray = await fetchUpcomingMatches()
  if (!upcomingMatchesArray) { return console.log("[oldPepleMatchAnnouncement][TALK] Could not get upcoming matches"); }
  //  
  //  :step 2:
  //  loop through the upcoming matches array
  upcomingMatchesArray.every((match) => {
    homeTeamName = match.homeTeam.teamName
    awayTeamName = match.awayTeam.teamName
    if (homeTeamName === teamToSearchFor || awayTeamName === teamToSearchFor) {
      matchDate = match.dateScheduledUTC
      //  
      //  :step 3:
      //  if we find the team we are looking for, store the opponents team id for later use
      if (homeTeamName === teamToSearchFor) {
        opponentID = match.awayTeam.teamID
        return false
      }
      if (awayTeamName === teamToSearchFor) {
        opponentID = match.homeTeam.teamID
        return false
      }
      
    }
    return true;
  })

  if (!opponentID) { return console.log("[TALK] No upcoming match for the specific team"); }

  //  
  //  :step 4:
  //  get the historical match stats for the opponent team
  const historicalMatchStatsForOpponentTeam = await getHistoricalMatchStatsforSpecificTeam(opponentID)
  if (!historicalMatchStatsForOpponentTeam) { return console.log(`[TALK] Could not get historical match stats for team ID ${opponentID}`); }

  //  
  //  :step 5:
  //  convert the match time to the format we need
  //  :TODO: convert the milliseconds epoch time to epoch seconds 
  const convertedMatchDateTime = spacetime(matchDate, "UTC").goto('Europe/London').epoch / 1000

  //  
  //  :step 6:
  //  for the message we will send
  const messageToSend = `
  ${OPRolesObject} **MATCH DAY** ${homeTeamName} VS ${awayTeamName}, Starting - <t:${convertedMatchDateTime}:R> <t:${convertedMatchDateTime}:t>`

  //
  //  :step 7:
  //  send the message
  matchAnnouncementCronJob(client, messageToSend, "op-match-announcements")

}

const fetchUpcomingMatches = async () => {
  return new Promise((resolve, reject) => {
    axios.get("https://api.vrmasterleague.com/pavlov/matches/upcoming")
      .then((response) => resolve(response.data))
      .catch((error) => reject(error))
  })
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


module.exports = { fetchUpcomingMatches, getCurrentListOfVrmlTeams, getSpecifcTeamID, getHistoricalMatchStatsforSpecificTeam, oldPepleMatchAnnouncement }



const formatHistoricalMapStats = (JsonMapStats, teamToSearchFor) => {
    let messageToSend = ["```fix\n"]
    let commonPicks = {}
    
    messageToSend.push(`Historical Map Stats For ${teamToSearchFor}\n`)

    for (let key in JsonMapStats){
        const object = JsonMapStats[key]
        const homeTeamPicks = object.homeTeam.picks
        const awayTeamPicks = object.awayTeam.picks
        const homeTeamName = object.homeTeam.team
        const awayTeamName = object.awayTeam.team

        messageToSend.push(`\n${key} (UTC)\nHome Team - ${homeTeamName}\nAway Team - ${awayTeamName}\n`)
    
        for (let homePick in homeTeamPicks){
            messageToSend.push(`(H) ${homePick}: ${homeTeamPicks[homePick].homeScore} - ${homeTeamPicks[homePick].awayScore}\n`)
            if (homeTeamName === teamToSearchFor){
                if (!commonPicks[homePick]) {commonPicks[homePick] = 0}
                commonPicks[homePick] += 1
            }
        }

        for (let awayPick in awayTeamPicks){
            messageToSend.push(`(A) ${awayPick}: ${awayTeamPicks[awayPick].homeScore} - ${awayTeamPicks[awayPick].awayScore}\n`)
            if (awayTeamName === teamToSearchFor){
                if (!commonPicks[awayPick]) {commonPicks[awayPick] = 0}
                commonPicks[awayPick] += 1
            }
        }
    }

    messageToSend.push(`\n${teamToSearchFor} Common Picks\n`)

    let commonPicksArray = []
    for (let pick in commonPicks){
        commonPicksArray.push([`${pick} - `, commonPicks[pick]])
    }
    
    commonPicksArray.sort((a, b) => {return b[1] - a[1]})

    commonPicksArray.forEach((pick) => {
        messageToSend.push(`${pick.join('')}\n`)
    })

    messageToSend.push('\n```')
    return messageToSend.join('');
}

module.exports = {formatHistoricalMapStats}
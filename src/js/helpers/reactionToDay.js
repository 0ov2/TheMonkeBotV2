
//  :statics:
const REACTION_TO_DAY = {
  "🇦": "Monday",
  "🇧": "Tuesday",
  "🇨": "Wednesday",
  "🇩": "Thursday",
  "🇪": "Friday",
  "🇫": "Saturday Afternoon",
  "🇬": "Saturday Night",
  "🇭": "Sunday Afternoon",
  "🇮": "Sunday Night"
}

const reactionToDay = async (reaction) => {

  await reaction.fetch();

  return REACTION_TO_DAY[reaction.emoji.name]

}

module.exports = { reactionToDay }


const avavilabilityReactionsHandler = async (reaction, user) => {
    //  :step 1:
    //  fetch the message, so we can access the reactions
    await reaction.message.fetch();

    //  :step 2:
    //  get the amount of reactions for the specifiv reaction
    let reactionCount = await reaction.message.reactions.cache.get(reaction.emoji.name).count; 

    //  :step 3:
    //  remove the bots reaction if the number of reactions exceeds 2
    if (reactionCount > 2) {
        await reaction.message.reactions.resolve(reaction.emoji.name).users.remove(user.bot.id);
    }
}

module.exports = { avavilabilityReactionsHandler }
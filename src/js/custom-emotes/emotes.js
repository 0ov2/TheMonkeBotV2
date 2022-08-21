

const randomEmote = () => {

    const STATIC_EMOTES = ["( ͡👁️ ͜ʖ ͡👁️)", "( ͡👁️ ‿‿͡👁️ )✌", "(っ ͡O ‿‿͡o )っ🎔", "( ͡°( ͡° ͜ʖ ͡°( ͡👁️ ‿‿͡👁️ ) ͡° ͜ʖ ͡°) ͡°)", "( ͡👁️ ‿‿͡👁️ )┌∩┐"]

    let emote = STATIC_EMOTES[Math.floor(Math.random() * 10)]

    while(emote === undefined){
        emote = STATIC_EMOTES[Math.floor(Math.random() * 5)]
    }

    return emote;
}

module.exports = {
    randomEmote
}






// ──────▄▀▄─────▄▀▄
// ─────▄█░░▀▀▀▀▀░░█▄
// ─▄▄──█░░░░░░░░░░░█──▄▄
// █▄▄█─█░░▀░░┬░░▀░░█─█▄▄█

//
//  :statics
const TYPE_TAGS = {
    error: "[ERROR]",
    warning: "[WARNING]"
}

const talk = (type, content, data) => {
    return console.log(`${TYPE_TAGS[type]} : ${content}\n${data}`)
}

module.exports = {
    talk
}
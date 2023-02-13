///
///   M O N K E B O T
///      C l a s s
///         v1.0
///


/*



    Class includes 
    . Logging into Discord cient
    . Getting client/server related data
    . Event logging
    . . .



*/

//
// ENV
require('dotenv').config();

//
// :code:
const { Client } = require('discord.js');
const { DISCORD_CLIENT_OPTIONS_MAP } = require('./js/statics');
const { talk } = require('./Talk');

class MonkeBot extends Client {
  constructor(props) {
    super(discordClientOptions);
    this.client = null;
    this.token = process.env.TOKEN
    this.discordClientOptions = DISCORD_CLIENT_OPTIONS_MAP[props.discordClientOptions] || DISCORD_CLIENT_OPTIONS_MAP["default"]
  }

  get discordClient() {
    const client = null;
    try {
      client = new Client(this.discordClientOptions);
    } catch (error) {
      talk("error", "Failed to login", error)
    }

    if (!client) { return talk("warning", "Client is invalid, we will not attempt login", client) }

    client.login(this.token);
    return client;
  }

  get DiscordUserObject() {

  }
}

module.exports = { MonkeBot }
const Config = require('../config.json');
const Commando = require('discord.js-commando');

function run() {
  const Bot = new Commando.Client({
    owner: Config.BOT_OWNER_ID,
  });

  Bot.registry
    .registerGroup('wow', 'WoW')
    .registerDefaults()
    .registerCommandsIn(`${__dirname}/../commands`);

  Bot
    .on('ready', () => {
      console.log('Blizzbot ready!')
    })
    .on('error', console.error);

  return Bot.login(Config.DISCORD_TOKEN);
}

module.exports = {
  run,
};

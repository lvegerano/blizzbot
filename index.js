const Config = require('./config.json');
const Client = require('./lib');


const discordToken = Config.DISCORD_TOKEN || null;
const battlenetKey = Config.BATTLENET_KEY || null;
const owner = Config.BOT_OWNER_ID || null;

if (!owner || !discordToken || !battlenetKey) {
  console.error('Missing arguments! Terminating BOT.');
  process.exit();
}

Client.run();



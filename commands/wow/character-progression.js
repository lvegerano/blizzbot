const Config = require('../../config.json');
const Commando = require('discord.js-commando');
const Blizzard = require('blizzard.js').initialize({ apikey: Config.BATTLENET_KEY });

class ProgressionCommand  extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'prog',
      group: 'wow',
      memberName: 'prog',
      description: 'Send character current progression for latest raid.',
      details: 'This command sends character progression data for the most current raid available. You must pass the character name, realm, and region',
    });
  }

  async run(message, args) {
    const msg = args.trim();
    const [name, realm, origin ] = msg.split(' ');


    Blizzard.wow.character(['progression'], {
      name,
      realm,
      origin,
    }).then((response) => {
      const raids = response.data.progression.raids;
      const latestRaid = raids[raids.length - 1];
      const embed = {};

      embed.title = latestRaid.name;
      embed.description = `Raid progression for ${response.name}`;
      embed.fields = latestRaid.bosses.map((boss) => {
        const fieldObj = {};
        fieldObj.name = boss.name;
        fieldObj.value = `Normal: ${boss.normalKills}\nHeroic: ${boss.heroicKills}\nMythic: ${boss.mythicKills}`;
        fieldObj.inline = true;
        return fieldObj;
      });

      message.channel
        .sendEmbed(embed)
        .catch(console.error);
    }).catch((err) => {
      message.reply('An unknown error has occurred whild looking up progression data. Please try again');
      console.error(err);
    })
  }
}

module.exports = ProgressionCommand;

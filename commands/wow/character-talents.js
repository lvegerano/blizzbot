const _ = require('lodash');

const Config = require('../../config.json');
const Commando = require('discord.js-commando');
const Blizzard = require('blizzard.js').initialize({ apikey: Config.BATTLENET_KEY });

class TalentsCommand  extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'tals',
      group: 'wow',
      memberName: 'tals',
      description: 'Display character talents per spec.',
      details: 'This command sends character talent data for all specs. You must pass the character name, realm, and region',
    });
  }

  async run(message, args) {
    const msg = args.trim();
    const [name, realm, origin ] = msg.split(' ');

    Blizzard.wow.character(['talents'], {
      name,
      realm,
      origin,
    }).then((response) => {
      const embed = {};

      const talentTrees = response.data.talents.reduce(function (seed, o) {
        if (!o.talents.length) {
          return seed;
        }
        const specObj = {};
        specObj.active = o.selected;
        specObj.name = o.spec.name;

        specObj.talents = _.sortBy(o.talents, ['tier']).map(function (tier) {
          return `Tier ${tier.tier + 1} ${tier.spell.name}`;
        });
        seed.push(specObj);
        return seed;
      }, []);

      embed.title = `*${response.data.name}*`;
      embed.description = `Talent trees for ${response.data.name}`;
      embed.fields = talentTrees.map((talentTree) => {
        let name = `${talentTree.name}`;
        if (talentTree.active) {
          name += ' (active)';
        }
        return {
          name,
          value: talentTree.talents.join('\n'),
          inline: true,
        }
      });

      message.channel
        .sendEmbed(embed)
        .catch(console.error);
    }).catch((err) => {
      message.reply('An unknown error has occurred whild looking up talents data. Please try again');
      console.error(err);
    });
  }
}

module.exports = TalentsCommand;

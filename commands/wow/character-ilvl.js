const _ = require('lodash');

const Config = require('../../config.json');
const Commando = require('discord.js-commando');
const Blizzard = require('blizzard.js').initialize({ apikey: Config.BATTLENET_KEY });

class IlvlCommand  extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'ilvl',
      group: 'wow',
      memberName: 'ilvl',
      description: 'Display character item level and equiped items.',
      details: 'This command sends character item data. You must pass the character name, realm, and region',
    });
  }

  async run(message, args) {
    const msg = args.trim();
    const [name, realm, origin ] = msg.split(' ');

    Blizzard.wow.character(['items'], {
      name,
      realm,
      origin,
    }).then((response) => {
      const embed = {};

      const mainHandTraits = response.data.items.mainHand.artifactTraits.reduce(function (seed, trait) {
        seed += trait.rank;
        return seed;
      }, 0);

      const offHandTraits = response.data.items.offHand.artifactTraits.reduce(function (seed, trait) {
        seed += trait.rank;
        return seed;
      }, 0);

      embed.title = `${response.data.name}`;
      embed.description = `Average ilvl: ${response.data.items.averageItemLevel} - Equiped ilvl: ${response.data.items.averageItemLevelEquipped} - Traits ${mainHandTraits || offHandTraits}`;

      const keys = Object.keys(response.data.items);
      const lvls = [];
      const slots = [];
      const things = _.reduce(keys, function (seed, slot) {
        if (!response.data.items[slot].name) {
          return seed;
        }
        slots.push(`${slot}`);
        seed.push(`${response.data.items[slot].name}  `);
        lvls.push(`${response.data.items[slot].itemLevel}  `);
        return seed;
      }, []);

      embed.fields = [{
        name: 'Slot',
        value: slots.join('\n'),
        inline: true,
      }, {
        name: 'Item',
        value: things.join('\n'),
        inline: true,
      }, {
        name: 'Level',
        value: lvls.join('\n'),
        inline: true,
      }];

      message.channel
        .sendEmbed(embed)
        .catch(console.error);
    }).catch((err) => {
      message.reply('An unknown error has occurred whild looking up item data. Please try again');
      console.error(err);
    });
  }
}

module.exports = IlvlCommand;

module.exports = async function (_log, _db, _guild, msg) {
  const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

  try {
    _log.debug('test init...');

    // Create bootins.
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('primary')
          .setLabel('Do Not Press')
          .setStyle('DANGER')
      );
    await msg.reply({
      content: 'Hey... that\'s not supposed to show..',
      components: [row]
    });
  } catch (e) { throw `|cmdTest: ${e}|` }
}
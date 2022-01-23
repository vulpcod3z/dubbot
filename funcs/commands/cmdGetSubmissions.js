module.exports = async function (_log, _db, _guild, msg) {
  const { MessageActionRow, MessageButton } = require('discord.js');

  try {
    _log.debug('cmdGetSubmissions init...');

    // Check if user is of mod team.
    if (!msg.member.roles.cache.has(process.env.ROLEID_MODS)) {
      await msg.reply('you don\'t have access to that command. Beeboop.');
      await msg.delete();
      return false;
    }

    // Gather all entries in in collection.
    let current_entries = await _db.GameSignup.find({});

    // Send each entry to DM with download button.
    for (let i = 0; i < current_entries.length; i++) {
      let content = `**UserId:** ${current_entries[i].user_id}\n`
        + `**User:** ${current_entries[i].user_name}#${current_entries[i].user_hash}\n`
        + `**Artist Name:** ${current_entries[i].artist_name}\n`
        + `**Song Link:** <${current_entries[i].song_link}>\n`
        + `**Filename:** ${current_entries[i].file_name}`;
      let row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId(`trackdl_${current_entries[i]._id}`)
            .setLabel('Download Track')
            .setStyle('PRIMARY')
        );
      await msg.member.send({ content, components: [row] });
    }

    // Cleanup.
    await msg.reply('submissions sent to your DMs.');
    await msg.delete();
    return true;

  } catch (e) {
    await msg.delete();
    throw `|cmdGetSubmissions: ${e}|`
  }
}
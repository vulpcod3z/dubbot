module.exports = async function (_log, _db, _guild, intact, intact_customId, timestamp) {
  const { MessageAttachment } = require('discord.js');

  try {
    _log.debug('intactDlTrack init...');

    // Check if user is of mod team.
    let member = await _guild.members.fetch(`${intact.user.id}`);
    if (!member.roles.cache.has(process.env.ROLEID_MODS)) {
      await member.send('you don\'t have access to that interaction. Beeboop. BOPPPPPPP.');
      return false;
    }

    // Find filename in db.
    let { file_name } = await _db.GameSignup.findOne({ _id: intact_customId });

    // Build path and create message attachment.
    let file_path = `${process.env.DOWNLOAD_PATH}/${file_name}`;
    let attachment = new MessageAttachment(file_path);

    // Return with download attached.
    await intact.reply({ files: [attachment] });

  } catch (e) { throw `|intactDlTrack: ${e}|` }
}
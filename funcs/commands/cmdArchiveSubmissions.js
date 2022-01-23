module.exports = async function (_log, _db, _guild, msg) {

  try {
    _log.debug('cmdArchiveSubmissions init...');

    // Check if user is of mod team.
    if (!msg.member.roles.cache.has(process.env.ROLEID_MODS)) {
      await msg.reply('you don\'t have access to that command. Beeboop.');
      await msg.delete();
      return false;
    }

    // Gather all entries in in collection.
    let current_entries = await _db.GameSignup.find({});

    // Copy current entries to archive.
    for (let i = 0; i < current_entries.length; i++) {
      let new_record = await (new _db.GameSignupArchive({
        user_id: current_entries[i].user_id,
        user_name: current_entries[i].user_name,
        user_hash: current_entries[i].user_hash,
        artist_name: current_entries[i].artist_name,
        song_link: current_entries[i].song_link,
        file_name: current_entries[i].file_name,
        date_submitted: `${parseInt(current_entries[i]._id.toString().substring(0, 8), 16)}`
      })).save();
      _log.info('Submission archived!');
    }

    // Delete current pool.
    await _db.GameSignup.deleteMany({});

    await msg.reply('Submissions succesfully archived. Current pool has been cleared.')
    await msg.delete();
    return true;

  } catch (e) {
    await msg.delete();
    throw `|cmdArchiveSubmissions: ${e}|`
  }
}
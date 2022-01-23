module.exports = async function (_log, _db, _guild, intact, timestamp) {
  try {
    _log.debug('test init...');

    await intact.reply('What did I say?! DO. NOT. PRESS.');
  } catch (e) { throw `|cmdTest: ${e}|` }
}
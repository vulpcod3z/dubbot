module.exports = class {

  // Init.
  async init() {
    try {

      // Load command functions.
      this.cmdTest = require('./commands/cmdTest');
      this.cmdSignup = require('./commands/cmdSignup');
      this.cmdArchiveSubmissions = require('./commands/cmdArchiveSubmissions');
      this.cmdGetSubmissions = require('./commands/cmdGetSubmissions');

      // Create lookup keys using command prefix.
      let p_test = `${process.env.CMD_PREFIX}test`;
      let p_signup = `${process.env.CMD_PREFIX}signup`;
      let p_submit = `${process.env.CMD_PREFIX}submit`;
      let p_archivesubs = `${process.env.CMD_PREFIX}archivesubmissions`;
      let p_getsubs = `${process.env.CMD_PREFIX}getsubmissions`;

      // Command lookup.
      this.cmdLookup = {

        // Test.
        [p_test]: this.cmdTest,

        // Signup/submit in channel; various systems use this.
        [p_signup]: this.cmdSignup,
        [p_submit]: this.cmdSignup,
        [p_archivesubs]: this.cmdArchiveSubmissions,
        [p_getsubs]: this.cmdGetSubmissions,
      };
    } catch (e) { throw `| new catchCommand() | ${e}`; }
  }

  // Parse string (msg) for command keywords.
  async parseString(_log, _db, _guild, msg, content, timestamp) {

    // Don't check if bot.
    if (msg.author.id === process.env.ID_BOT) return false;
    try {
      _log.debug('parsing command from message...');

      // Catch any prefixed command, cap or not.
      let normalized_content = content.toLowerCase();

      // Filter out just the command from text.
      let cmd_string = (normalized_content.split(' '))[0];

      // Use lookup table for command function.
      if (Object.keys(this.cmdLookup).some(c => c === cmd_string)) {
        _log.info(`${msg.author} used the ${cmd_string} command.`);

        // Run command found.
        await (this.cmdLookup[cmd_string])(_log, _db, _guild, msg, content, timestamp);
      }
      return true;
    } catch (e) { throw `| catchCommand | ${e}`; }
  }
}

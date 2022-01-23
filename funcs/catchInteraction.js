module.exports = class {

  async init() {
    try {

      // Load interaction functions.
      this.intactDlTrack = require('./interactions/intactDlTrack');

      // Interaction lookup.
      this.intactLookup = {

        // Test.
        'trackdl': this.intactDlTrack,
      };

      // // Slash command lookup.
      // this.cmdLookup = {

      //   // Submit.
      //   'submit': this.intactSubmit,
      // }
    } catch (e) { throw `| new catchInteraction() | ${e}|`; }
  }

  // Parse interaction for func keywords.
  async parseInteraction(_log, _db, _guild, intact, timestamp) {

    try {
      _log.debug('parsing interaction function...');

      // Button/message interaction.
      if (intact.isMessageComponent()) {

        // Extract interaction message string and command prefix.
        let intact_string = intact.customId;
        let intact_cmd = intact_string.substring(0, intact_string.indexOf('_'));
        let intact_customId = intact_string.substring(intact_string.indexOf('_') + 1)

        // Utilize lookup table for proper interaction.
        if (Object.keys(this.intactLookup).some(i => i === intact_cmd)) {

          // Execute interaction function.
          await (this.intactLookup[intact_cmd])(_log, _db, _guild, intact, intact_customId, timestamp);
        }
      }

      // // Slash command.
      // if (intact.isCommand()) {

      //   // Extract interation command.
      //   let intact_string = intact.commandName;

      //   // Utilize lookup table for proper interaction.
      //   if (Object.keys(this.cmdLookup).some(i => i === intact_string)) {
      //     _log.info(`${(intact.member.nickname === null)
      //       ? intact.member.user.username
      //       : intact.member.nickname} has called the ${intact_string} slash command.`);

      //     // Execute interaction function.
      //     await (this.cmdLookup[intact_string])(_log, _db, _guild, intact, timestamp);
      //   }
      // }
    } catch (e) { throw `| new catchInteraction() | ${e}`; }
  }
}

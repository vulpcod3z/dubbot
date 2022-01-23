module.exports = async function (_log, _db, _guild, msg) {

  // Import downloader lib.
  // const Downloader = require('download-file');
  const Downloader = require('nodejs-file-downloader');

  // Async delay func; very useful.
  const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

  try {
    _log.debug('cmdSignup init...');

    // Extract vars.
    let ch = msg.channel;
    let member = await _guild.members.fetch(`${msg.author.id}`);

    // User record for db.
    let user_record = {
      user_id: member.id,
      user_name: member.displayName,
      user_hash: member.user.discriminator,
    };

    // Ask first question: artist's name.
    _log.debug('Setup first question..');
    user_record.artist_name = await qAndR(_log, ch, member, 'please enter your artist name', 'string');

    // Ask second question: song link.
    _log.debug('Setup second question..');
    user_record.song_link = await qAndR(_log, ch, member, 'please enter the song link', 'string');

    // Ask final question: file upload.
    _log.debug('Setup third question..');
    user_record.file_name = await qAndR(_log, ch, member, 'please upload your track now', 'download');

    // Save to db.
    let new_record = await (new _db.GameSignup({
      user_id: user_record.user_id,
      user_name: user_record.user_name,
      user_hash: user_record.user_hash,
      artist_name: user_record.artist_name,
      song_link: user_record.song_link,
      file_name: user_record.file_name
    })).save();

    // Reply to user and clean up.
    _log.info(`Submission was created for ${member.displayName}.`);
    await msg.reply(`Submission was made by ${member.displayName}.`);
    await msg.delete();
    return true;
  } catch (e) {
    await msg.reply('there was an error. Please try again.');
    await msg.delete();
    throw `|cmdSignup: ${e}|`;
  }

  // Question/response setup.
  function qAndR(_log, ch, member, message, type) {
    return new Promise(async (res, rej) => {
      try {

        // Create message filter and options for members answering the bot.
        let opts = {
          filter: m => m.author.id === member.id,
          max: 1,
          time: 300000,
          errors: ['time']
        };

        // Ask first question: artist's name.
        _log.debug('Asking question..');
        let q = await ch.send(`${member}, ${message}:`);
        await delay(1500);
        _log.debug('Waiting for reply..');
        let r = await ch.awaitMessages(opts);

        // Timeout check.
        _log.debug('Checking if response was a timeout..');
        await questionTimeout(q, r);

        // String-type question returns input.
        if (type === 'string') {
          _log.debug('Response was NOT a timeout!');

          // Return response.
          let data = r.first().content;
          await delay(1500);
          await q.delete();
          await r.first().delete();
          res(data);
        }

        // Else, fire the downloader and return filename and directory.
        else if (type === 'download' && r.first().attachments.size > 0) {
          _log.debug("response was NOT a timeout; attachment..")

          // Get filename and url of attachment.
          let { name, url } = r.first().attachments.first();

          // // Setup download and save file.
          // let save_opts = {
          //   directory: process.env.DOWNLOAD_PATH,
          //   file_name: `${member.displayName}--${name}`
          // };

          // Downloader(url, save_opts, async function (err) {
          //   if (err) { throw 'DOWNLOAD_ERR'; }
          //   await delay(1500);
          //   await q.delete();
          //   await r.first().delete();
          //   res(save_opts.file_name);
          // });

          let fileName = `${member.displayName}--${name}`;

          let downloader = new Downloader({
            url,
            directory: process.env.DOWNLOAD_PATH,
            fileName
          })

          try {
            await downloader.download();
            await delay(1500);
            await q.delete();
            await r.first().delete();
            res(fileName);
          } catch (e) {
            await q.delete();
            await r.first().delete();
            throw 'DOWNLOAD_ERR';
          }
        }
      }
      catch (e) { throw `|qAndR: ${e}|`; }
    });
  }

  // Timeout func.
  function questionTimeout(question, response) {
    return new Promise(async (res, rej) => {
      try {
        if (response.first() === undefined) {
          await question.delete();
          throw 'OUT_OF_TIME';
        }
        res(true);
      } catch (e) { throw 'NOT_TIME_BUT_SOMETHING' };
    });
  }
}
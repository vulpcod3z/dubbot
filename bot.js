/**
 * yesbot - a goodboi, Discord bot.
 * @author  vulpcod3z
 * @version 0.1
 * @license whatever
*/

(async function () {
  // Set up env.
  require('dotenv').config();

  // Create logger.
  const _log = require('./tools/Logger')();

  // Load db classes
  const DataBase = require('./db');
  let _db;

  // Load Discordjs client.
  const { Client, Intents } = require('discord.js');

  // Bot client.
  const _bot = new Client({
    intents: [
      'GUILDS',
      'GUILD_MEMBERS',
      'GUILD_BANS',
      'GUILD_EMOJIS_AND_STICKERS',
      'GUILD_INVITES',
      'GUILD_PRESENCES',
      'GUILD_MESSAGES',
      'GUILD_MESSAGE_REACTIONS',
      'DIRECT_MESSAGES',
      'DIRECT_MESSAGE_REACTIONS'
    ]
  });

  // Cached guild object.
  let _guild;

  // Const values from env.
  const GUILD_ID = process.env.ID_GUILD;
  const BOT_TOKEN = process.env.BOT_TOKEN;

  // Import command and interaction catch systems.
  const CmdCatcher = new (require('./funcs/catchCommand'))();
  const IntactCatcher = new (require('./funcs/catchInteraction'))();
  try {
    await CmdCatcher.init();
    await IntactCatcher.init();
  } catch (e) { _log.error(`| CmdCatcher init error: ${e}`) }

  // Message events.
  _bot.on('messageCreate', async msg => {

    // Gather message data.
    let ch = msg.channel;
    let user = msg.author;
    let content = msg.content;
    let timestamp = (new Date(msg.createdTimestamp)).toString().slice(0, 21);
    try {

      // Send for command parsing.
      if (msg.content.startsWith(`${process.env.CMD_PREFIX}`)) {
        _log.debug('command prefix spotted!');
        await CmdCatcher.parseString(_log, _db, _guild, msg, content, timestamp);
      }
    } catch (e) {
      _log.error(`| BOT_EVENT message ${e}`);
      await ch.send(`${user}, there was an error with your request.`);
    }
  });

  // Message interaction events (neeeeew... o_o).
  _bot.on('interactionCreate', async intact => {

    // Gather message data.
    let timestamp = (new Date(intact.createdTimestamp)).toString().slice(0, 21);
    try {

      _log.debug('component interaction spotted!');
      await IntactCatcher.parseInteraction(_log, _db, _guild, intact, timestamp);

    } catch (e) {
      _log.error(`| BOT_EVENT interaction ${e}`);
    }
  });

  // Config on 'ready' state.
  _bot.on('ready', async () => {
    try {
      _log.info('Bot up...');

      // Create db connection.
      _db = await new DataBase();
      _log.info('Database up...');

      // Set bot status.
      _bot.user.setActivity("for chances to steal your identity!", { type: "WATCHING" });
      _log.info('Activity set...');

      // Cache the guild obj.
      _guild = await _bot.guilds.cache.get(GUILD_ID);
      _log.info('Guild object cached...');

      _log.info('All systems ready...');
    } catch (e) { _log.error(`| BOT_EVENT ready ${e}`); }
  });

  // Login.
  try { _bot.login(BOT_TOKEN) }
  catch (e) { _log.error('Dude, login not working...tf?..') }
})();

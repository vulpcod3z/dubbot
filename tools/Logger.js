module.exports = function () {
  let winston = require('winston');
  require('winston-daily-rotate-file');

  let file_transport = new winston.transports.DailyRotateFile({
    level: 'info',
    filename: `logs/%DATE%__${process.env.BOT_NAME}.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m'
  });

  return winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.printf(info => {
        return (info.level === 'debug')
          ? `${info.message}`
          : `${info.level} || ${info.timestamp} || ${process.env.BOT_NAME} || ${info.message}`
      })
    ),
    transports: [
      new winston.transports.Console({ level: `${process.env.DEBUG_LVL}` }),
      file_transport
    ]
  });
}

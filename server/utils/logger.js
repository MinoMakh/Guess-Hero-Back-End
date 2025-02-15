const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
  },
};

// Ensure the 'logs' folder exists
const logsDirectory = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, { recursive: true });
}

const logger = winston.createLogger({
  levels: logLevels.levels,
  transports: [
    new DailyRotateFile({
      filename: path.join(logsDirectory, '%DATE%-app.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      level: 'debug',
    }),
  ],
  exitOnError: false,
});

module.exports = logger;

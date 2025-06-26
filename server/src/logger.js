const winston = require("winston");
const path = require("path");
require("winston-daily-rotate-file");

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Enhanced log format with error stack traces
const logFormat = printf(({ level, message, timestamp, stack }) => {
  // If there's a stack trace, append it to the message
  return stack 
    ? `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`
    : `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create separate transports for different log levels
const infoRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(__dirname, "logs", "app-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  zippedArchive: true,
  level: 'info'
});

const errorRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(__dirname, "logs", "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  zippedArchive: true,
  level: 'error'
});

const consoleTransport = new winston.transports.Console({ 
  format: combine(colorize(), logFormat),
});

// Create Winston logger with enhanced error handling
const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // Include error stack traces
    logFormat
  ),
  transports: [
    infoRotateTransport,
    errorRotateTransport,
    consoleTransport
  ]
});

module.exports = logger;
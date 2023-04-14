import winston from "winston";
import { Request } from "express";

class Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          level: "http",
        }),
      ],
    });
  }

  public error = (
    msg: string,
    req?: Request | undefined,
    callback?: Function
  ): winston.Logger => {
    const logMsg = req
      ? `Endpoint: ${req.method} ${req.originalUrl}: ${msg}`
      : msg;
    return this.logger.error(logMsg, callback);
  };

  public info = (
    msg: string,
    req?: Request | undefined,
    callback?: Function
  ): winston.Logger => {
    const logMsg = req
      ? `Endpoint: ${req.method} ${req.originalUrl}: ${msg}`
      : msg;
    return this.logger.info(logMsg, callback);
  };
}

export default new Logger();

export const FormatMessageByCode = (code: string, message: string) => {
  return code + " -- " + message;
};

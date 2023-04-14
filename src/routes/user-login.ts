import { checkLogin } from "../utils/helpers";
import logger, { FormatMessageByCode } from "../utils/logger";
import { CODE_NOT_FOUND } from "../constants/httpStatus";
import { getCurrentTime } from "../utils/date-helpers";
import { GameCode } from "../models/game-code";
import { Request, Response, NextFunction } from "express";

const userLogin = async (req: Request, res: Response) => {
  const mongodbUri = "mongodb://localhost/Virtual-Trivial";

  logger.info(
    FormatMessageByCode(req.params.uniqueCode, "Login - Connecting To DB")
  );

  try {
    const uniqueCode = req.params.uniqueCode;
    const gameCodeCollection = await GameCode.find({
      uniqueCode: uniqueCode,
    });

    let filter = gameCodeCollection[0];
    if (!filter) {
      const errorResponse = {
        ...CODE_NOT_FOUND,
        currentTime: getCurrentTime(),
      };
      res.status(400).send(errorResponse).end();
      logger.error(
        FormatMessageByCode(
          req.params.uniqueCode,
          "Login - Game Code Not Found"
        )
      );
    } else {
      logger.info(
        FormatMessageByCode(
          req.params.uniqueCode,
          "Login - Game Code Found - " + filter.gameType
        )
      );
      await checkLogin(filter, req, res);
    }
  } catch (error) {}
};
export default userLogin;

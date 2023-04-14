import jwt from "jsonwebtoken";
import { INVALID_UNIQUE_CODE } from "../constants/httpStatus";
import { JWT_SECRET } from "../constants/app-constants";
import logger, { FormatMessageByCode } from "./logger";
import { Request, Response, NextFunction } from "express";
import { getCurrentTime } from "./date-helpers";
import { GameCode } from "../models/game-code";

export const setAuthenticatedSession = (
  uniqueCode: string,
  res: Response,
  gameType: string
) => {
  const jwtKey = JWT_SECRET;
  const jwtExpirySeconds = 86400;
  const token = jwt.sign({ uniqueCode }, jwtKey, {
    algorithm: "HS256",
    expiresIn: jwtExpirySeconds,
  });
  logger.info(FormatMessageByCode(uniqueCode, "Login - Token Retrieved"));

  console.log("\n Token is:  ", token, "\n");

  const presentedEntries = {
    code: "API-200",
    token: token,
    currentTime: getCurrentTime(),
    gameType: gameType,
  };

  res.status(200).send(presentedEntries).end();
};

export const checkLogin = async (
  filter: any,
  req: Request,
  res: Response
): Promise<void> => {
  const uniqueCode = req.params.uniqueCode;

  console.log("\n filter is:  ", filter, "\n");

  if (filter) {
    if (filter.dateActivated === "") {
      try {
        logger.info(FormatMessageByCode(uniqueCode, "Login - New Game Code"));
        let updatedData = filter;
        const currentDate = getCurrentTime();
        console.log("\n current  date is:  ", currentDate, "\n");
        console.log("\n updated data before is:  ", updatedData, "\n");
        updatedData = {
          ...updatedData,
          dateActivated: currentDate,
        };
        console.log("\n updated data after is:  ", updatedData, "\n");
        const doc = await GameCode.findOneAndUpdate(
          { uniqueCode: req.params.uniqueCode },
          { dateActivated: "2023-04-14T02:33:49+05:00" },
          { new: true, lean: true }
        );
        console.log("\nupdated doc is :  ", doc, "\n");

        setAuthenticatedSession(uniqueCode, res, filter.gameType);
        logger.info(FormatMessageByCode(uniqueCode, "Login - Data Updated"));
        return;
      } catch (err: any) {
        logger.error(
          FormatMessageByCode(
            uniqueCode,
            "Login - New Game Error:" + err.message
          )
        );
        throw err;
      }
    }
    logger.info(
      FormatMessageByCode(uniqueCode, "Login - Game Code Already Activated")
    );
    setAuthenticatedSession(uniqueCode, res, filter.gameType);
    return;
  }
  const errorResponse = {
    ...INVALID_UNIQUE_CODE,
    currentTime: getCurrentTime(),
  };

  res.status(400).send(errorResponse).end();

  logger.error(
    FormatMessageByCode(uniqueCode, "Login - Code not exist in Database")
  );
};

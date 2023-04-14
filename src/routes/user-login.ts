import { checkLogin } from "../utils/helpers";
import logger, { FormatMessageByCode } from "../utils/logger";
import { CODE_NOT_FOUND } from "../constants/httpStatus";
// import { MongoClient } from "mongodb";
// import { MongoClient } from "mongodb";
// import { MongoClient } from "mongodb";
// import { MongoClient, } from "mongodb";
import { MongoClient, MongoClientOptions } from "mongodb";
import { LOCAL_MONGODB_URI } from "../constants/app-constants";
import { getCurrentTime } from "../utils/date-helpers";
import { GameCode } from "../models/game-code";
import { Request, Response, NextFunction } from "express";

const userLogin = async (req: Request, res: Response) => {
  // const mongodbUri = LOCAL_MONGODB_URI;
  const mongodbUri = "mongodb://localhost/Virtual-Trivial";

  logger.info(
    FormatMessageByCode(req.params.uniqueCode, "Login - Connecting To DB")
  );
  // const client = new MongoClient(mongodbUri, { useNewUrlParser: true });

  try {
    const uniqueCode = req.params.uniqueCode;
    console.log("\nGameCode Collection is:   ", GameCode, "\n");
    const gameCodeCollection = await GameCode.find({
      uniqueCode: uniqueCode,
    });
    // const AllGameCodes= GameCodes.toArray();
    console.log("\n Here is Req parameters:   ", req.params, "\n");
    console.log("\n Here is ALL GameCode:   ", gameCodeCollection, "\n");

    let filter = gameCodeCollection[0];
    console.log("\n filter is:   ", filter, "\n");

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

    // res.status(200).send(gameCodeCollection);
  } catch (error) {}
};
export default userLogin;

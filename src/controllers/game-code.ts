import { GameCode } from "../models/game-code";
import { Request, Response } from "express";
import { validateGameCode } from "../validation/game-code";

export const getAllGameCodes = async (req: Request, res: Response) => {
  const gameCodes = await GameCode.find().sort("uniqueCode");

  if (gameCodes.length === 0) {
    res.send("No GameCode Found!!!");
  } else {
    res.send(gameCodes);
  }
};

export const generateGameCode = async (req: Request, res: Response) => {
  const { error } = validateGameCode(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const gameCodes = await GameCode.find({
    uniqueCode: req.body.uniqueCode,
  });

  if (gameCodes.length > 0) {
    res.send("Dupilcate GameCodes are Not Allowed");
  } else {
    let newGameCode = new GameCode({
      uniqueCode: req.body.uniqueCode,
      dateCreated: req.body.dateCreated,
      gameType: req.body.gameType,
      dateActivated: req.body.dateActivated,
      dateExpired: req.body.dateExpired,
    });

    newGameCode = await newGameCode.save();
    res.send(newGameCode);
  }
};

import Joi from "joi";

export function validateGameCode(gameCode: object) {
  const gameCodeSchema = Joi.object().keys({
    uniqueCode: Joi.string().min(8).max(8).required(),
    dateCreated: Joi.string(),
    gameType: Joi.string().required(),
    dateActivated: Joi.string(),
    dateExpired: Joi.string(),
  });
  Joi.valid;
  return gameCodeSchema.validate(gameCode);
}

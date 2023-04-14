import Joi from "joi";

export function validateGenerateGameCode(gameCode: object) {
  const generateGameCodeSchema = Joi.object().keys({
    noOfGameCodes: Joi.number().integer().min(1).max(100).required(),
    gameType: Joi.string()
      .min(1)
      .max(10)
      .pattern(/^(TT|tt|TTJR|ttjr|BBH|bbh|JH|jh|MAYDAY|mayday|bt|BT)$/)
      .required(),
    companyName: Joi.string().max(15),
    reseller: Joi.string(),
  });
  Joi.valid;
  return generateGameCodeSchema.validate(gameCode);
}

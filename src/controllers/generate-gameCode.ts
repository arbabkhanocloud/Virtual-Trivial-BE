import { Request, Response } from "express";
import { getCurrentTime } from "../utils/date-helpers";
import { validateGenerateGameCode } from "../validation/generate-gameCode";
import { generateGameCodeModel } from "../models/generate-gameCode";
import logger from "../utils/logger";

interface IGameCode {
  uniqueCode: string;
  gameType: string;
  dateCreated: string;
  dateActivated: string;
  dateExpired: string;
  reseller?: string;
  companyName?: string;
}

export const getAllGameCodes = async (req: Request, res: Response) => {
  const gameCodes = await generateGameCodeModel.find().sort("uniqueCode");

  if (gameCodes.length === 0) {
    res.send("No GameCode Found!!!");
  } else {
    res.send(gameCodes);
  }
};

const newGameCodes = async function (req: Request, res: Response) {
  const { error } = validateGenerateGameCode(req.body);
  if (error) {
    res.status(400).send(error.details[0].message).end();
    logger.error("Invalid Request body");
    return;
  }

  const { noOfGameCodes, gameType, reseller, companyName } = req.body;
  const actualGameType = gameType ? gameType.toUpperCase() : "";
  const actualReseller = reseller ? reseller.toUpperCase() : "";

  let codes = await getUniqueCodes(
    noOfGameCodes,
    actualGameType,
    actualReseller,
    companyName
  );
  res.status(200).send({ codes }).end();
};

const getUniqueCodes = (
  noOfGameCodes: number,
  actualGameType: string,
  actualReseller: string,
  companyName: string
): Promise<Array<string>> => {
  let previousCodes = new Set<string>();
  return new Promise(async (res, err) => {
    try {
      const allEntries = await generateGameCodeModel.find({});
      const codes = allEntries.map((x) => {
        return x.uniqueCode;
      });
      previousCodes = new Set<string>(codes);
      const { gameCodeArray, uniqueCode } = generateUniqueCodes(
        previousCodes,
        noOfGameCodes,
        actualGameType,
        actualReseller,
        companyName
      );
      try {
        await generateGameCodeModel.insertMany(gameCodeArray);
        res(uniqueCode);
      } catch (error) {}
    } catch (error) {
      err(new Array<string>());
    }
  });
};

const generateUniqueCodes = (
  previousCodes: any,
  length: number,
  gameType: string,
  reseller: string,
  companyName: string
) => {
  let duplicationCount = 0;
  let uniqueCode = new Set<string>();
  let gameCodeArray = new Array<IGameCode>();
  let codeCount = 0;
  let codeGenerationString = getAlphanumericShuffleString();
  while (codeCount < length && duplicationCount < length) {
    const code = getAlphaNumericCode(codeGenerationString, 8);
    if (uniqueCode.has(code) || previousCodes.has(code)) {
      duplicationCount = duplicationCount + 1;
    } else {
      uniqueCode.add(code);
      gameCodeArray.push({
        uniqueCode: code,
        gameType: gameType,
        // reseller: reseller,
        // companyName: companyName,
        dateCreated: getCurrentTime(),
        dateActivated: "",
        dateExpired: "",
      });
      codeCount++;
    }
  }
  return { gameCodeArray: gameCodeArray, uniqueCode: Array.from(uniqueCode) };
};

const getAlphaNumericCode = (
  codeGenerationString: string,
  length: number
): string => {
  let result: string = "";
  const characters: string = codeGenerationString;
  const charactersLength: number = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
const getRandomInt = (number: number): number => {
  return Math.floor(Math.random() * number);
};
const getAlphanumericShuffleString = (): string => {
  let codeString: string =
    "AaBbCcDdEeFfGgHhJjKkLMmNnPpQqRrSsTtUuVvWwXxYyZz23456789";
  let arr: string[] = codeString.split(""); // Convert String to array
  const arrayLength: number = arr.length; // Length of the array

  for (let i = 0; i < arrayLength - 1; ++i) {
    let j = getRandomInt(arrayLength); // Get random of [0, n-1]

    let temp = arr[i]; // Swap arr[i] and arr[j]
    arr[i] = arr[j];
    arr[j] = temp;
  }

  codeString = arr.join(""); // Convert Array to string
  return codeString;
};

export default newGameCodes;

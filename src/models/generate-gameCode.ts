import mongoose from "mongoose";
import { IGAMECODEDTO } from "../dto/game-code.dto";

const generaGameCodeSchema = new mongoose.Schema<IGAMECODEDTO>({
  uniqueCode: {
    type: String,
    required: true,
  },
  gameType: { type: String, required: true },
  dateCreated: {
    type: String,
  },
  dateActivated: {
    type: String,
  },
  dateExpired: {
    type: String,
  },
  reseller: {
    type: String,
  },
  companyName: {
    type: String,
  },
});

export const generateGameCodeModel = mongoose.model(
  "GameCode",
  generaGameCodeSchema
);

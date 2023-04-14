import mongoose from "mongoose";
import { GAMECODEDTO } from "../dto/game-code.dto";

const gameCodeSchema = new mongoose.Schema<GAMECODEDTO>({
  uniqueCode: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: String,
    required: true,
    default: Date.now,
    ge: "date Created must be valid date or empty",
  },
  gameType: { type: String, required: true },
  dateActivated: {
    type: String,
    default: "",
  },
  dateExpired: {
    type: String,
    default: "",
  },
});

export const GameCode = mongoose.model("GameCode", gameCodeSchema);

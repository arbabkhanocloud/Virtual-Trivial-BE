import { asyncMiddleware } from "../middleware/async-middleware";

import generateNewGameCodes from "../controllers/generate-gameCode";
import { getAllGameCodes } from "../controllers/generate-gameCode";
import express from "express";

const router = express.Router();

router.get("/allGameCodes", asyncMiddleware(getAllGameCodes));
router.post("/newGameCodes", asyncMiddleware(generateNewGameCodes));

export default router;

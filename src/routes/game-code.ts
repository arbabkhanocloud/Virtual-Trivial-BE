import { asyncMiddleware } from "../middleware/async-middleware";
import { generateGameCode, getAllGameCodes } from "../controllers/game-code";
import express from "express";

const router = express.Router();

router.get("/AllGameCodes", asyncMiddleware(getAllGameCodes));
router.post("/generateGameCode", asyncMiddleware(generateGameCode));

export default router;

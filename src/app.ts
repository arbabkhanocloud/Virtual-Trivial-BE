import cors from "cors";
import userLogin from "./routes/user-login";
import generateNewGameCodes from "./routes/generate-gameCode";
import { HEALTHCHECK_OK } from "./constants/httpStatus";
import { databseConnection } from "./config/database-connection";
import express from "express";

const app = express();
import { errorHandler } from "./middleware/error";

//Requests Origins
app.use(cors());
app.use(express.json());

//API End Points
app.get("/api/healthcheck", async (req, res) => {
  res.status(200).send(HEALTHCHECK_OK);
});
app.use("/api/generate", generateNewGameCodes);
app.use("/api/login/:uniqueCode", userLogin);

app.use(errorHandler);

const port = 5000;
app.listen(port, async () => {
  try {
    await databseConnection();
    console.log(`listening on port ${port}...`);
  } catch (error) {
    console.error("Could not connect to MongoDb...", error);
  }
});

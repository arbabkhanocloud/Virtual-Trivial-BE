import cors from "cors";
import GameCode from "./routes/game-code";
import userLogin from "./routes/user-login";
import { HEALTHCHECK_OK } from "./constants/httpStatus";
import { databseConnection } from "./config/database-connection";
import express from "express";
const app = express();
import { errorHandler } from "./middleware/error";

//Requests Origins
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3000",
    ],
  })
);

app.use(express.json());

app.get("/api/healthcheck", async (req, res) => {
  console.log(" healthCheck endpoint hitt");
  res.status(200).send(HEALTHCHECK_OK);
});
app.use("/api/gameCode", GameCode);
app.use(
  "/api/login/:uniqueCode",
  userLogin
  // async (req, res) => {
  //   console.log("Unique End Point Hitt");
  //   res.status(200).send("UserLogin EndPoint Hitt");
  // }
);
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

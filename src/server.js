import express from "express";
import { paginatedUsersRouter } from "./action/getPaginatedUsers";
import { getUsersByRadiusRouter } from "./action/getUsersByRadius";
import { actionRouter } from "./action/login";
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use("/login", actionRouter);
app.use("/getPaginatedUsers", paginatedUsersRouter);
app.use("/getUsersByRadius", getUsersByRadiusRouter);

app.post("/hello", async (req, res) => {
  return res.json({
    hello: "world",
  });
});

app.listen(PORT);

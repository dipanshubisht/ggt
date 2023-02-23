import express from "express";
const jwt = require("jsonwebtoken");

const jwtKey = "dipanshu's-random-secretKey"; //ideally should be coming from a .env file, but hardcoded here for simplpicity
const jwtExpirySeconds = 300;

const users = {
  admin: "password",
  user: "password",
};
const actionRouter = express.Router();
actionRouter.post("", async (req, res) => {
  // Get credentials from JSON body
  const { username, password } = req.body.input;
  if (!username || !password || users[username] !== password) {
    return res.status(401).end();
  }

  const token = jwt.sign({ username }, jwtKey, {
    algorithm: "HS256",
    expiresIn: jwtExpirySeconds,
  });
  return res.json({
    AccessToken: token,
  });
});
export { actionRouter };

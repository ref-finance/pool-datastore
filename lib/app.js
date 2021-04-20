import express from "express";
import db from "./db.js";
import { storePools } from "./store.js";

const app = express();

app.get("/pools", async (req, res, next) => {
  const { token, limit = 20 } = req.query;

  const params = [limit];
  if (token) params.push(token);

  const { rows } = await db.query(
    `SELECT * FROM pools ${
      token ? "WHERE token_id_1 = $2 OR token_id_2 = $2" : ""
    } LIMIT $1`,
    params
  );

  res.send(rows);
});

app.get("/check", (req, res) => {
  storePools()
    .then(() => res.send("done"))
    .catch((err) => res.send(err.message));
});

export default app;

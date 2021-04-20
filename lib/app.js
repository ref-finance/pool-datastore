import express from "express";
import db from "./db.js";
import { storePools, storeVolume } from "./store.js";

const app = express();

app.get("/pools", async (req, res, next) => {
  const { token, limit = 20 } = req.query;

  const params = [limit];
  if (token) params.push(token);

  const { rows } = await db.query(
    `SELECT
    pools.*,
    volumes.token_1_input,
    volumes.token_2_input,
    volumes.token_1_output,
    volumes.token_2_output
  FROM
    pools
  INNER JOIN (SELECT DISTINCT ON (pool_id) * FROM volumes ORDER BY pool_id, created_at DESC) volumes
  ON pools.id = volumes.pool_id
  ${token ? "WHERE token_1_id = $2 OR token_2_id = $2" : ""}
  ORDER BY shares DESC
  LIMIT $1
  `,
    params
  );

  res.send(rows);
});

app.get("/check", (req, res) => {
  storePools()
    .then(() => storeVolume())
    .then(() => res.send("done"))
    .catch((err) => res.send(err.message));
});

export default app;

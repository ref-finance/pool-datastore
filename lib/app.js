import express from "express";
import db from "./db.js";
import { storePools, storeVolume } from "./store.js";

const app = express();

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","GET");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get("/pools", async (req, res, next) => {
  const { token, isUnique = false, limit = 20, currentPage = 1 } = req.query;

  const params = [limit,(currentPage-1) * limit];
  if (token) params.push(token);
  
  const { rows } = await db.query(
    `SELECT
    ${isUnique ? "DISTINCT ON (pools.token_1_id,pools.token_2_id) *,pools.id," : "pools.*," }
    volumes.token_1_input,
    volumes.token_2_input,
    volumes.token_1_output,
    volumes.token_2_output
  FROM
    pools
  LEFT JOIN (SELECT DISTINCT ON (pool_id) * FROM volumes ORDER BY pool_id, created_at DESC) volumes
  ON pools.id = volumes.pool_id
  ${token ? "WHERE token_1_id like '%' || $3 || '%' or token_2_id like '%' || $3 || '%'" : ""}
  ORDER BY ${isUnique ? "pools.token_1_id, pools.token_2_id," : ""} shares DESC
  LIMIT $1 OFFSET $2
  `,
    params
  );

  res.send(rows);
});

export default app;

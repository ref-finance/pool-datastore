import db from "./lib/db.js";

db.query(`
CREATE TABLE pools (
  id BIGINT PRIMARY KEY,
  token_1_id TEXT,
  token_2_id TEXT,
  token_1_amount TEXT,
  token_2_amount TEXT,
  fee INT,
  shares TEXT,
  last_update TIMESTAMP
);

CREATE TABLE volumes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  pool_id BIGINT REFERENCES pools(id),
  token_1_input TEXT,
  token_2_input TEXT,
  token_1_output TEXT,
  token_2_output TEXT,
  created_at TIMESTAMP
);
`);

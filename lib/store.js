import db from "./db.js";
import {
  getPools,
  getPoolsPages,
  getVolume,
  MAX_POOLS_PER_PAGE,
} from "./near.js";

export const storePools = async () => {
  const total = await getPoolsPages();

  for (let i = 1; i <= total; i++) {
    const pools = await getPools(i);
    const insertArgs = pools.flatMap((pool, poolI) => [
      (i - 1) * MAX_POOLS_PER_PAGE + poolI,
      pool.token_account_ids[0],
      pool.token_account_ids[1],
      pool.amounts[0],
      pool.amounts[1],
      pool.total_fee,
      pool.shares_total_supply,
    ]);

    await db.query(
      `INSERT INTO pools (id, token_1_id, token_2_id, token_1_amount, token_2_amount, fee, shares) VALUES ${pools
        .map(
          (_, i) =>
            `(\$${i * 7 + 1}, \$${i * 7 + 2}, \$${i * 7 + 3}, \$${
              i * 7 + 4
            }, \$${i * 7 + 5}, \$${i * 7 + 6}, \$${i * 7 + 7})`
        )
        .join(
          ","
        )} ON CONFLICT (id) DO UPDATE SET token_1_amount = EXCLUDED.token_1_amount, token_2_amount = EXCLUDED.token_2_amount, shares = EXCLUDED.shares, last_update = NOW()`,
      insertArgs
    );
  }
};

export const storeVolume = async () => {
  const { rows } = await db.query("SELECT * FROM pools WHERE shares != '0'");

  const volumes = [];
  for (let i = 0; i < rows.length; i++) {
    const [token1, token2] = await getVolume(rows[i].id);
    volumes.push([
      rows[i].id,
      token1.input,
      token2.input,
      token1.output,
      token2.output,
    ]);
  }

  await db.query(
    `INSERT INTO volumes (pool_id, token_1_input, token_2_input, token_1_output, token_2_output, created_at) VALUES ${volumes
      .map(
        (_, i) =>
          `(\$${i * 5 + 1}, \$${i * 5 + 2}, \$${i * 5 + 3}, \$${i * 5 + 4}, \$${
            i * 5 + 5
          }, NOW())`
      )
      .join(",")}`,
    volumes.flat()
  );
};

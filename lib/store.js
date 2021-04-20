import db from "./db.js";
import { getPools, getPoolsPages, MAX_POOLS_PER_PAGE } from "./near.js";

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
      `INSERT INTO pools (id, token_id_1, token_id_2, token_1_amount, token_2_amount, fee, shares) VALUES ${pools
        .map(
          (_, i) =>
            `(\$${i * 7 + 1}, \$${i * 7 + 2}, \$${i * 7 + 3}, \$${
              i * 7 + 4
            }, \$${i * 7 + 5}, \$${i * 7 + 6}, \$${i * 7 + 7})`
        )
        .join(",")}`,
      insertArgs
    );
  }
};

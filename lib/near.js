import { Near, keyStores } from "near-api-js";

const REF_FINANCE_CONTRACT_ID =
  process.env.REF_FINANCE_CONTRACT_ID || "ref-finance.testnet";
const NETWORK_ID = process.env.NETWORK_ID || "testnet";

export const MAX_POOLS_PER_PAGE = 100;

const near = new Near({
  keyStore: new keyStores.InMemoryKeyStore(),
  networkId: NETWORK_ID,
  nodeUrl: `https://rpc.${NETWORK_ID}.near.org`,
});

export const getPoolsPages = async () => {
  const { result } = await near.connection.provider.query({
    request_type: "call_function",
    finality: "final",
    account_id: REF_FINANCE_CONTRACT_ID,
    method_name: "get_number_of_pools",
    args_base64: "",
  });

  const total = JSON.parse(Buffer.from(result).toString());
  console.log(total);
  return Math.ceil(total / MAX_POOLS_PER_PAGE);
};

export const getPools = async (page = 1) => {
  const start = (page - 1) * MAX_POOLS_PER_PAGE;
  const { result } = await near.connection.provider.query({
    request_type: "call_function",
    finality: "final",
    account_id: REF_FINANCE_CONTRACT_ID,
    method_name: "get_pools",
    args_base64: Buffer.from(
      JSON.stringify({
        from_index: start,
        limit: MAX_POOLS_PER_PAGE,
      })
    ).toString("base64"),
  });

  return JSON.parse(Buffer.from(result).toString());
};

export const getVolume = async (poolId) => {
  const { result } = await near.connection.provider.query({
    request_type: "call_function",
    finality: "final",
    account_id: REF_FINANCE_CONTRACT_ID,
    method_name: "get_pool_volumes",
    args_base64: Buffer.from(
      JSON.stringify({
        pool_id: Number(poolId),
      })
    ).toString("base64"),
  });

  return JSON.parse(Buffer.from(result).toString());
};

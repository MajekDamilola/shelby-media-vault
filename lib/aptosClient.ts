import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const networkMap: Record<string, Network> = {
  testnet: Network.TESTNET,
  mainnet: Network.MAINNET,
  devnet: Network.DEVNET,
};

const network =
  networkMap[process.env.NEXT_PUBLIC_NETWORK ?? "testnet"] ?? Network.TESTNET;

export const aptosClient = new Aptos(
  new AptosConfig({
    network,
    clientConfig: {
      API_KEY: process.env.NEXT_PUBLIC_APTOS_API_KEY,
    },
  })
);

export { network };
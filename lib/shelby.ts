import { ShelbyClient } from "@shelby-protocol/sdk";

let client: ShelbyClient | null = null;

export function getShelbyClient(): ShelbyClient {
  if (!client) {
    client = new ShelbyClient({
      rpcNode: process.env.SHELBY_RPC_NODE || "https://rpc.shelby.xyz",
      network: (process.env.APTOS_NETWORK as "devnet" | "mainnet") || "devnet",
    });
  }
  return client;
}

export function getShelbyClientForAccount(
  privateKey: string
): ShelbyClient {
  return new ShelbyClient({
    rpcNode: process.env.SHELBY_RPC_NODE || "https://rpc.shelby.xyz",
    network: (process.env.APTOS_NETWORK as "devnet" | "mainnet") || "devnet",
    privateKey,
  });
}

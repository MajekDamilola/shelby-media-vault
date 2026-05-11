// Shelby SDK stub — replace with real implementation once early access is granted
// import { ShelbyClient } from "@shelby-protocol/sdk";

export function getShelbyClient() {
  return {
    upload: async ({ blobName, data, storageDuration }: { blobName: string; data: Buffer; storageDuration: number }) => {
      console.log("Shelby upload stub:", blobName, storageDuration);
      return { merkleRoot: "0x" + Math.random().toString(16).slice(2) };
    },
    listBlobs: async ({ account }: { account: string }) => {
      console.log("Shelby listBlobs stub:", account);
      return [];
    },
    download: async ({ blobName }: { blobName: string }) => {
      console.log("Shelby download stub:", blobName);
      return { data: Buffer.from(""), mimeType: "application/octet-stream" };
    },
  };
}

export function getShelbyClientForAccount(_privateKey: string) {
  return getShelbyClient();
}
"use client";

import "./globals.css";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShelbyClientProvider } from "@shelby-protocol/react";
import { ShelbyClient } from "@shelby-protocol/sdk/browser";
import { Network } from "@aptos-labs/ts-sdk";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const [shelbyClient] = useState(
    () => new ShelbyClient({ network: Network.TESTNET })
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryClientProvider client={queryClient}>
          <AptosWalletAdapterProvider
            autoConnect={false}
            dappConfig={{
              network: Network.TESTNET,
              aptosApiKeys: {
                testnet: process.env.NEXT_PUBLIC_APTOS_API_KEY,
              },
            }}
            onError={(error) => console.error("[Wallet]", error)}
          >
            <ShelbyClientProvider client={shelbyClient}>
              {children}
            </ShelbyClientProvider>
          </AptosWalletAdapterProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
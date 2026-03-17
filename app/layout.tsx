"use client";

import "./globals.css";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShelbyClientProvider } from "@shelby-protocol/react";
import { ShelbyClient } from "@shelby-protocol/sdk/browser";
import { Network } from "@aptos-labs/ts-sdk";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  const [shelbyClient] = useState(
    () =>
      new ShelbyClient({
        network: Network.TESTNET,
      })
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryClientProvider client={queryClient}>
          <ShelbyClientProvider client={shelbyClient}>
            {children}
          </ShelbyClientProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
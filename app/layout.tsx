"use client";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Shelby Media Vault</title>
        <meta name="description" content="Decentralized media storage powered by Shelby network" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <AptosWalletAdapterProvider
            autoConnect={true}
            dappConfig={{ network: Network.TESTNET }}
            optInWallets={["Petra", "Nightly", "Pontem Wallet", "Martian"]}
            onError={(error) => console.error("Wallet error:", error)}
          >
            <ToastProvider>
              {children}
            </ToastProvider>
          </AptosWalletAdapterProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

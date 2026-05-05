import type { Metadata } from "next";
import { WalletProvider } from "@/hooks/useWallet";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shelby Media Vault",
  description:
    "Decentralized media storage and management powered by Shelby network",
  openGraph: {
    title: "Shelby Media Vault",
    description: "Upload, organize, and share media on Shelby's decentralized network",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}

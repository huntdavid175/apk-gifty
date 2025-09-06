import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import JotaiProvider from "@/components/Providers/JotaiProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "APK Gifty",
  description: "Your one-stop shop for digital gifts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <JotaiProvider>{children}</JotaiProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GridBackground } from "@/components/ui/GridBackground";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pong 3D",
  description: "Made by @Anarbb, @abdelmottalib, @ybenlafk and @Mohamed-JJ on Github",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    {children}

  );
}
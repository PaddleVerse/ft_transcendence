import React from "react";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import ContentWrapper from "./ContentWrapper";
import { Toaster } from "react-hot-toast";
import Popup from "../components/Dashboard/Settings/Popup";
import InviteComponent from "../components/Dashboard/Chat/GameInvite/InviteComponent";
import TestWrapper from "./testWrapper" // Import with correct casing

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PongPing",
  description: "NN PongPing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className={`${inter.className} w-screen h-screen bg-[#15202E] bg-fixed bg-center bg-no-repeat bg-cover overflow-y-hidden`}
    >
      <ContentWrapper>
        <TestWrapper> 
          <InviteComponent />
          <Popup />
          {children}
          <Toaster position="top-right" />
        </TestWrapper>
      </ContentWrapper>
    </section>
  );
}
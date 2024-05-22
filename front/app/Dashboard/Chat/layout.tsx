"use client";
import React, { ReactNode, use, useEffect, useState } from "react";
import ChatLayout from "./npn";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const RootLayout = (props: any) => {
  return (
    <QueryClientProvider client={queryClient}>
      <>
        <ChatLayout>{props.children}</ChatLayout>
      </>
    </QueryClientProvider>
  );
};

export default RootLayout;

"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import Navbar from "./Navbar"; // Import the Navbar component

type Props = {
  children: ReactNode;
};

export default function SessionWrapper({ children }: Props) {
  return (
    <SessionProvider>
      <Navbar /> {/* Include the Navbar component */}
      {children}
    </SessionProvider>
  );
}
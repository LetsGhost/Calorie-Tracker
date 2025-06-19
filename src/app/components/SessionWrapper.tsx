"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import Navbar from "./Navbar"; // Import the Navbar component
import { usePathname } from "next/navigation"; // Import usePathname to check the current route

type Props = {
  children: ReactNode;
};

export default function SessionWrapper({ children }: Props) {
  const pathname = usePathname(); // Get the current route

  // Define routes where the Navbar should be excluded
  const excludeNavbarRoutes = ["/auth/login", "/auth/register"];

  return (
    <SessionProvider>
      {/* Conditionally render Navbar */}
      {!excludeNavbarRoutes.includes(pathname) && <Navbar />}
      {children}
    </SessionProvider>
  );
}
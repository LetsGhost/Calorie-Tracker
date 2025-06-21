"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";
import AuthWrapper from "./AuthWrapper"; // Import AuthWrapper

type Props = {
  children: ReactNode;
};

export default function SessionWrapper({ children }: Props) {
  const pathname = usePathname();

  // Define routes where the Navbar should be excluded
  const excludeNavbarRoutes = ["/auth/login", "/auth/register"];

  return (
    <SessionProvider>
      {/* Wrap children with AuthWrapper */}
      <AuthWrapper>
        {!excludeNavbarRoutes.includes(pathname) && <Navbar />}
        {children}
      </AuthWrapper>
    </SessionProvider>
  );
}
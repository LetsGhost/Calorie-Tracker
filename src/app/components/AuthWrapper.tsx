"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function AuthWrapper({ children }: Props) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Define public routes that don't require authentication
  const publicRoutes = ["/auth/login", "/auth/register"];

  useEffect(() => {
    if (!session && status !== "loading" && !publicRoutes.includes(pathname)) {
      redirect("/auth/login");
    }
  }, [session, status, pathname]);

  if (status === "loading") {
    return (
      <div className="loading-screen">
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
        <p>Loading your experience...</p>
      </div>
    );
  }

  if (!session && !publicRoutes.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
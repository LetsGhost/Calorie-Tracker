import { redirect } from "next/navigation";

export default function Home() {
  redirect("/auth/login");
  return null; // This line is never reached, but TypeScript requires a return value
}

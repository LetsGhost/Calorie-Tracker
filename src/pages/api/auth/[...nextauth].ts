import NextAuth from "next-auth";
import { authOptions } from "@/pages/api/auth/signIn";

export default NextAuth(authOptions);
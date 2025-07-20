import NextAuth from "next-auth";
import type { NextAuthConfig } from 'next-auth/';
import CredentialsProvider from "next-auth/providers/credentials";
import { Session } from "next-auth";
import dbConnect from '@/lib/mongodb';
import { UserModel } from "@/models/user";
import compare from "bcrypt";
import { JWT } from "next-auth/jwt";
import { rateLimit } from "@/middleware/rateLimiter";
import { NextApiRequest, NextApiResponse } from "next";

// Logic to find the user in the db
async function findUserByEmail(email: string) {
  try{
    await dbConnect();
    const user = await UserModel.find({ email }).exec();

    return user.length > 0 ? user[0] : null;
  } catch(err) {
    console.error("Error finding user by email:", err);
  }
}

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try{
          // Compare the credentials with the database
          const user = await findUserByEmail(credentials.email.toString());
          if (!user) {
            console.error("No user found with the given email");
            throw new Error("No user found with the given email");
          }

          const isPasswordValid = await compare.compare(
            credentials.password.toString(),
            user.password!
          );

          if (!isPasswordValid) {
            console.error("Invalid password for user:");
            throw new Error("Invalid password");
          }

          // If everything is fine, return the user object
          return {
            id: user._id.toString(),
            email: user.email,
          }
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
  async jwt({ token, user }) {
    if (user && "_id" in user && user._id) {
      token.id = user._id.toString();
    } else if (user?.id) {
      token.id = user.id;
    }
    return token;
  },
  async session({ session, token }: { session: Session, token: JWT }) {
    if (token?.id && session.user) {
      session.user.id = token.id as string;
    }
    return session;
  }
},

};

export default NextAuth(authOptions);

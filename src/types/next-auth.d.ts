import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    _id?: string; // Add your custom `_id` property
  }

  interface Session {
    user: User; // Ensure the session user matches the extended User type
  }
}
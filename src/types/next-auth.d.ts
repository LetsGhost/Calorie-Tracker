import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    _id?: string; // Add your custom `_id` property
    //role?: string; // Add a custom `role` property
  }

  interface Session {
    user: User;
  }
}
import { getServerSession as nextAuthGetServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/signIn";
import { NextApiRequest, NextApiResponse } from "next";

export const getServerSession = (req: NextApiRequest, res: NextApiResponse) => nextAuthGetServerSession(req, res, authOptions);
export { authOptions };
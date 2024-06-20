// pages/api/auth/signup.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, role } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res
          .status(409)
          .json({ error: "User with this email already exists" });
      }

      // Create new user in Prisma
      const user = await prisma.user.create({
        data: {
          email,
          role,
        },
      });

      // Create associated role-specific user
      if (role === "LESSER") {
        await prisma.lesserUser.create({
          data: {
            email,
            user: {
              connect: { id: user.id },
            },
          },
        });
      } else if (role === "RENTER") {
        await prisma.renterUser.create({
          data: {
            email,
            user: {
              connect: { id: user.id },
            },
          },
        });
      }

      // Redirect to custom success page
      res
        .status(201)
        .json({
          message: "User created successfully",
          redirect: "/signup-success",
        });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred during the sign-up process" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

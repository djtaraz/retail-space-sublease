import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, description, role } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res
          .status(409)
          .json({ error: "User with this email already exists" });
      }

      const user = await prisma.user.create({
        data: {
          email,
          role,
        },
      });

      if (role === "LESSER") {
        await prisma.lesserUser.create({
          data: {
            id: user.id,
            name,
            email,
            description,
            user: {
              connect: { id: user.id },
            },
          },
        });
      } else if (role === "RENTER") {
        await prisma.renterUser.create({
          data: {
            id: user.id,
            name,
            email,
            description,
            user: {
              connect: { id: user.id },
            },
          },
        });
      }

      res.status(201).json({
        message: "User created successfully",
        redirect: "/signup-success",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred during the sign-up process" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

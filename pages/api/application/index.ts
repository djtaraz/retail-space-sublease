import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { postId, userId } = req.body;

    if (!postId) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    try {
      const application = await prisma.application.create({
        data: {
          postId,
          applicantId: userId,
          status: "PENDING",
        },
      });

      return res.status(201).json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
};

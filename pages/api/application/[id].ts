import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PATCH") {
    const { status } = req.body;
    const { id } = req.query;

    if (!status || !id) {
      return res.status(400).json({ error: "Status and ID are required" });
    }

    try {
      const application = await prisma.application.update({
        where: { id: String(id) },
        data: { status },
        include: {
          post: {
            include: {
              author: true,
            },
          },
        },
      });

      return res.status(200).json(application);
    } catch (error) {
      console.error("Error updating application status:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
};

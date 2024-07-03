import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { user, title, description, address, fileUrl } = req.body;

    try {
      const lesserUser = await prisma.lesserUser.findUnique({
        where: { id: user.id },
      });

      if (!lesserUser) {
        return res.status(404).json({ error: "LesserUser not found" });
      }

      const newPost = await prisma.lesserPost.create({
        data: {
          title,
          description,
          address,
          photos: [fileUrl],
          author: {
            connect: { id: lesserUser.id },
          },
        },
      });

      return res.status(200).json({ newPost });
    } catch (error) {
      console.error("Error creating listing:", error);
      return res.status(500).json({ error: "Error creating listing" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
};

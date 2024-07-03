import { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { name, type } = req.body;
    const key = `${uuidv4()}-${name}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: type,
      Expires: 60,
    };

    s3.getSignedUrl("putObject", params, (err, url) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Error generating signed URL" });
      } else {
        res.status(200).json({ url, key });
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

/** This api endpoint generates a signed url for uploading files.
 *
 * NOTE: this logic will always create a new UUID for the file, if you wish to
 * overwrite your files you will need to implement some other logic
 */

import { NextApiRequest, NextApiResponse } from "next";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../../env/server.mjs";
import { randomUUID } from "crypto";

// CHANGE THIS
const bucketName = "dos-upload-test";

// Init client
const s3Client = new S3Client({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: env.SPACES_API_ENDPOINT,
  // CHANGE THIS
  region: "fra1",
  credentials: {
    accessKeyId: env.SPACES_API_KEY,
    secretAccessKey: env.SPACES_API_SECRET,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fileType = (req?.body?.fileType ?? "") as string;
  // fileType should be like image/jpg
  const fileExtension = fileType?.split("/")?.[1];

  // key for S3 where to upload {..path to folder}/fileName.fileType
  // we take the file extension and generate a random UUID for the image, cuz
  // otherwise images might overwrite themselves
  // images/ is a folder named images inside my bucket
  // CHANGE THE DIRECTORY
  const key = `images/${randomUUID()}.${fileExtension}`;

  // Generate presigned url for PUT method (upload or overwrite of file)
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
    // CHANGE THIS IF YOU WANT OTHERWISE LEAVE IT
    ACL: "public-read",
  });

  // generate presigned url
  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  // return presignedUrl and method so that the AWSS3 plugin knows which method to use
  return res.status(200).json({ url: presignedUrl, method: "PUT" });
}

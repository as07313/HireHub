// lib/r2-client.ts
import { S3Client } from "@aws-sdk/client-s3";

const R2_ENDPOINT = process.env.A_R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.A_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.A_R2_SECRET_ACCESS_KEY;
const R2_REGION = "apac"; // R2 typically uses "auto"

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.warn("R2 environment variables not fully configured. R2 client might not work.");
}

export const r2Client = new S3Client({
  endpoint: R2_ENDPOINT,
  region: R2_REGION,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || "",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true, // Usually required for S3-compatible services
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "";

if (!R2_BUCKET_NAME) {
    console.warn("R2_BUCKET_NAME environment variable not set.");
}
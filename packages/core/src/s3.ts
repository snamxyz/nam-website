import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

function getS3Config() {
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_S3_BUCKET;
  const publicUrl = process.env.AWS_S3_PUBLIC_URL?.replace(/\/$/, "");

  if (!region || !bucket || !publicUrl) {
    throw new Error(
      "Missing S3 configuration. Set AWS_REGION, AWS_S3_BUCKET, and AWS_S3_PUBLIC_URL.",
    );
  }

  return { region, bucket, publicUrl };
}

function getS3Client(region: string) {
  return new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });
}

function extensionFromContentType(contentType: string): string {
  switch (contentType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/svg+xml":
      return "svg";
    default:
      return "bin";
  }
}

export async function uploadToS3(
  key: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const { region, bucket, publicUrl } = getS3Config();
  const client = getS3Client(region);

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  return `${publicUrl}/${key}`;
}

export async function uploadBlogImage(
  buffer: Buffer,
  contentType: string,
  folder: "cover" | "content" = "cover",
): Promise<string> {
  const ext = extensionFromContentType(contentType);
  const prefix = folder === "cover" ? "blog" : "blog/content";
  const key = `${prefix}/${randomUUID()}.${ext}`;
  return uploadToS3(key, buffer, contentType);
}

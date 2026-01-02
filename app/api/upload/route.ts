// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: process.env.R2_REGION || "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// File type configurations
const FILE_CONFIGS = {
  gallery: {
    folder: "kcf-images/",
    allowedTypes: ["image/"],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  sermons: {
    folder: "sermons/",
    allowedTypes: ["image/", "video/", "audio/", "application/pdf"],
    maxSize: 100 * 1024 * 1024, // 100MB for videos
  },
  events: {
    folder: "events/",
    allowedTypes: ["image/", "video/", "audio/", "application/pdf"],
    maxSize: 50 * 1024 * 1024, // 50MB
  },
} as const;

type UploadType = keyof typeof FILE_CONFIGS;
type FileConfig = (typeof FILE_CONFIGS)[UploadType];

function validateFile(file: File, config: FileConfig): string | null {
  // Check file size
  if (file.size > config.maxSize) {
    return `File ${file.name} is too large (max ${config.maxSize / (1024 * 1024)}MB)`;
  }

  // Check file type
  const isAllowedType = config.allowedTypes.some((type) =>
    file.type.startsWith(type)
  );
  if (!isAllowedType) {
    return `File ${file.name} has unsupported type. Allowed: ${config.allowedTypes.join(", ")}`;
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const uploadType = (formData.get("type") as UploadType) || "gallery";

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const config = FILE_CONFIGS[uploadType];
    if (!config) {
      return NextResponse.json(
        { error: "Invalid upload type" },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file
      const validationError = validateFile(file, config);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }

      // Generate unique filename
      const fileExtension = file.name.split(".").pop();
      const uniqueName = `${config.folder}${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

      // Upload to R2
      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: uniqueName,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
        ACL: "public-read", // Make files publicly accessible
      });

      await s3Client.send(uploadCommand);

      // Generate public URL
      const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL}/${uniqueName}`;
      uploadedUrls.push(publicUrl);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}

// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

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

export async function GET() {
  try {
    console.log("Testing R2 connection...");

    // Validate required environment variables
    const requiredEnvVars = {
      R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
      R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
      R2_ENDPOINT: process.env.R2_ENDPOINT,
    };

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      return NextResponse.json({
        status: "error",
        message: "Missing environment variables",
        missing: missingVars,
        nodeEnv: process.env.NODE_ENV,
      }, { status: 500 });
    }

    // Test connection by listing objects
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME!,
      MaxKeys: 1,
    });

    console.log("Testing R2 list operation...");
    const listResult = await s3Client.send(listCommand);

    return NextResponse.json({
      status: "success",
      message: "R2 connection successful",
      bucket: process.env.R2_BUCKET_NAME,
      objectCount: listResult.KeyCount || 0,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("R2 connection test failed:", error);
    return NextResponse.json({
      status: "error",
      message: "R2 connection failed",
      error: error instanceof Error ? error.message : 'Unknown error',
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log("Upload API called with method:", request.method);

  try {
    // Validate required environment variables
    const requiredEnvVars = {
      R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
      R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
      R2_ENDPOINT: process.env.R2_ENDPOINT,
    };

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      console.error("Missing R2 configuration:", {
        missing: missingVars,
        available: Object.fromEntries(
          Object.entries(requiredEnvVars).map(([key, value]) => [key, !!value])
        ),
        nodeEnv: process.env.NODE_ENV,
      });
      return NextResponse.json(
        { error: `R2 configuration incomplete. Missing: ${missingVars.join(", ")}` },
        { status: 500 }
      );
    }

    console.log("R2 configuration validated successfully");

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const uploadType = (formData.get("type") as UploadType) || "gallery";

    console.log(`Processing upload request: ${files.length} files, type: ${uploadType}`);

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
      console.log(`Processing file: ${file.name}, size: ${file.size}, type: ${file.type}`);

      // Validate file
      const validationError = validateFile(file, config);
      if (validationError) {
        console.error(`File validation failed: ${validationError}`);
        return NextResponse.json({ error: validationError }, { status: 400 });
      }

      // Generate unique filename with folder prefix
      const fileExtension = file.name.split(".").pop();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const keyWithFolder = `${config.folder}${uniqueName}`;

      console.log(`Generated key: ${keyWithFolder}`);

      try {
        // Convert file to buffer
        console.log("Converting file to buffer...");
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        console.log(`File buffer created, size: ${fileBuffer.length} bytes`);

        // Upload to R2
        const uploadCommand = new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: keyWithFolder,
          Body: fileBuffer,
          ContentType: file.type,
          // Note: Cloudflare R2 doesn't support ACLs - bucket must be configured for public access
        });

        console.log(`Sending upload command to R2: Bucket=${process.env.R2_BUCKET_NAME}, Key=${keyWithFolder}, ContentType=${file.type}`);

        const uploadStartTime = Date.now();
        const uploadResult = await s3Client.send(uploadCommand);
        const uploadDuration = Date.now() - uploadStartTime;

        console.log(`Successfully uploaded file: ${keyWithFolder} in ${uploadDuration}ms`);
        console.log("Upload result:", uploadResult);

      } catch (uploadError) {
        console.error(`Failed to upload file ${file.name}:`, uploadError);
        return NextResponse.json(
          { error: `Failed to upload ${file.name}: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}` },
          { status: 500 }
        );
      }

      // Generate public URL - use custom domain if available, otherwise standard R2 URL
      let publicUrl: string;
      if (process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL) {
        publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL}/${keyWithFolder}`;
      } else {
        // Fallback to standard R2 URL
        const accountId = process.env.R2_ACCOUNT_ID;
        const bucketName = process.env.R2_BUCKET_NAME;
        publicUrl = `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${keyWithFolder}`;
      }
      console.log(`Generated public URL: ${publicUrl}`);
      uploadedUrls.push(publicUrl);
    }

    console.log(`Upload completed successfully. Total files: ${uploadedUrls.length}`);

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (error) {
    console.error("Upload API error:", {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: "Failed to upload files",
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

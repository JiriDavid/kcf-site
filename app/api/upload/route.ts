// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: process.env.R2_REGION || "auto",
  endpoint: process.env.R2_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

function normalizeBaseUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

function isS3ApiEndpoint(urlString: string) {
  try {
    const { hostname } = new URL(urlString);
    return hostname.endsWith(".r2.cloudflarestorage.com");
  } catch {
    return false;
  }
}

function getPublicBaseUrl() {
  const candidates = [
    normalizeBaseUrl(process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL),
    normalizeBaseUrl(process.env.R2_PUBLIC_BASE_URL),
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    if (!isS3ApiEndpoint(candidate)) {
      return candidate;
    }
  }

  return candidates[0] ?? null;
}

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
    file.type.startsWith(type),
  );
  if (!isAllowedType) {
    return `File ${file.name} has unsupported type. Allowed: ${config.allowedTypes.join(", ")}`;
  }

  return null;
}

export async function GET() {
  try {
    console.log("=== R2 CREDENTIALS DIAGNOSTIC ===");

    // Log the actual credentials being used (first/last 4 chars only for security)
    const accessKey = process.env.R2_ACCESS_KEY_ID;
    const secretKey = process.env.R2_SECRET_ACCESS_KEY;

    console.log(
      "Access Key ID:",
      accessKey
        ? `${accessKey.substring(0, 4)}...${accessKey.substring(accessKey.length - 4)}`
        : "NOT SET",
    );
    console.log(
      "Secret Key:",
      secretKey
        ? `${secretKey.substring(0, 4)}...${secretKey.substring(secretKey.length - 4)}`
        : "NOT SET",
    );
    console.log("Bucket Name:", process.env.R2_BUCKET_NAME);
    console.log("Endpoint:", process.env.R2_ENDPOINT);
    console.log("Node Environment:", process.env.NODE_ENV);

    console.log("R2 configuration check:", {
      hasAccessKey: !!process.env.R2_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.R2_SECRET_ACCESS_KEY,
      bucketName: process.env.R2_BUCKET_NAME,
      endpoint: process.env.R2_ENDPOINT,
      region: process.env.R2_REGION || "auto",
      customDomain: process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL,
      nodeEnv: process.env.NODE_ENV,
    });

    // Validate required environment variables
    const publicBaseUrl = getPublicBaseUrl();

    const requiredEnvVars = {
      R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
      R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
      R2_ENDPOINT: process.env.R2_ENDPOINT,
      R2_PUBLIC_BASE_URL: publicBaseUrl,
    };

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      console.error("Missing environment variables:", missingVars);
      return NextResponse.json(
        {
          status: "error",
          message: "Missing environment variables",
          missing: missingVars,
          nodeEnv: process.env.NODE_ENV,
          diagnostic: {
            accessKeyPrefix: accessKey ? accessKey.substring(0, 8) : null,
            hasSecretKey: !!secretKey,
            bucketName: process.env.R2_BUCKET_NAME,
            endpoint: process.env.R2_ENDPOINT,
          },
        },
        { status: 500 },
      );
    }

    if (publicBaseUrl && isS3ApiEndpoint(publicBaseUrl)) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Invalid public base URL. Do not use the S3 API endpoint (*.r2.cloudflarestorage.com) as asset URL. Use your R2 public domain (e.g. *.r2.dev or custom domain).",
          configuredPublicBaseUrl: publicBaseUrl,
        },
        { status: 500 },
      );
    }

    // Test connection by trying to upload a tiny test file
    console.log("Testing R2 upload capability...");
    let uploadTestPassed = false;
    let bucketAccessible = false;

    try {
      const testKey = `test-connection-${Date.now()}.txt`;
      const testContent = "connection test";

      const testUploadCommand = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: testKey,
        Body: testContent,
        ContentType: "text/plain",
      });

      console.log(
        `Attempting test upload to: ${process.env.R2_BUCKET_NAME}/${testKey}`,
      );
      await s3Client.send(testUploadCommand);
      console.log("Test upload successful - R2 write access confirmed");
      uploadTestPassed = true;
      bucketAccessible = true;

      // Try to verify the upload by attempting to access it
      try {
        const publicBaseUrl = getPublicBaseUrl();
        const publicTestUrl = publicBaseUrl
          ? `${publicBaseUrl}/${testKey}`
          : `MISSING_PUBLIC_BASE_URL/${testKey}`;

        console.log(`Test file should be accessible at: ${publicTestUrl}`);
      } catch (verifyError) {
        console.log("Could not verify test file URL, but upload succeeded");
      }
    } catch (uploadError: any) {
      console.log("Upload test failed:", uploadError);

      // Determine the type of error
      if (
        uploadError.Code === "NoSuchBucket" ||
        uploadError.name === "NoSuchBucket"
      ) {
        return NextResponse.json(
          {
            status: "error",
            message: "R2 bucket does not exist",
            bucket: process.env.R2_BUCKET_NAME,
            error: uploadError.message,
            nodeEnv: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
          },
          { status: 500 },
        );
      }

      if (
        uploadError.Code === "AccessDenied" ||
        uploadError.name === "AccessDenied"
      ) {
        bucketAccessible = true; // We can reach the bucket but can't write
        return NextResponse.json(
          {
            status: "error",
            message: "R2 bucket exists but upload access denied",
            bucket: process.env.R2_BUCKET_NAME,
            bucketAccessible: true,
            uploadAllowed: false,
            error: uploadError.message,
            nodeEnv: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
            recommendation:
              "API token lacks write permissions. Images may be served via different credentials.",
          },
          { status: 500 },
        );
      }

      // Other errors
      return NextResponse.json(
        {
          status: "error",
          message: "R2 upload test failed",
          bucket: process.env.R2_BUCKET_NAME,
          error: uploadError.message,
          nodeEnv: process.env.NODE_ENV,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      status: "success",
      message: "R2 connection and upload capability verified",
      bucket: process.env.R2_BUCKET_NAME,
      bucketAccessible,
      uploadTestPassed,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      note: "If images display but uploads fail, check API token permissions vs custom domain access",
      diagnostic: {
        accessKeyPrefix: accessKey ? accessKey.substring(0, 8) : null,
        secretKeyPrefix: secretKey ? secretKey.substring(0, 8) : null,
        endpoint: process.env.R2_ENDPOINT,
        customDomain: process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL,
      },
    });
  } catch (error) {
    console.error("R2 connection test failed:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "R2 connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  console.log("Upload API called with method:", request.method);

  try {
    // Validate required environment variables
    const publicBaseUrl = getPublicBaseUrl();

    const requiredEnvVars = {
      R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
      R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
      R2_ENDPOINT: process.env.R2_ENDPOINT,
      R2_PUBLIC_BASE_URL: publicBaseUrl,
    };

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      console.error("Missing R2 configuration:", {
        missing: missingVars,
        available: Object.fromEntries(
          Object.entries(requiredEnvVars).map(([key, value]) => [key, !!value]),
        ),
        nodeEnv: process.env.NODE_ENV,
      });
      return NextResponse.json(
        {
          error: `R2 configuration incomplete. Missing: ${missingVars.join(", ")}`,
        },
        { status: 500 },
      );
    }

    if (publicBaseUrl && isS3ApiEndpoint(publicBaseUrl)) {
      return NextResponse.json(
        {
          error:
            "Invalid public base URL. Use your R2 public domain (*.r2.dev or custom domain), not the S3 API endpoint (*.r2.cloudflarestorage.com).",
          configuredPublicBaseUrl: publicBaseUrl,
        },
        { status: 500 },
      );
    }

    console.log("R2 configuration validated successfully");

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (formDataError) {
      return NextResponse.json(
        {
          error:
            "Failed to parse upload payload. If this only fails in production, the file is likely too large for your hosting request-body limit.",
          details:
            formDataError instanceof Error
              ? formDataError.message
              : "Unknown form parsing error",
        },
        { status: 400 },
      );
    }

    const files = formData.getAll("files") as File[];
    const uploadType = (formData.get("type") as UploadType) || "gallery";

    console.log(
      `Processing upload request: ${files.length} files, type: ${uploadType}`,
    );

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const config = FILE_CONFIGS[uploadType];
    if (!config) {
      return NextResponse.json(
        { error: "Invalid upload type" },
        { status: 400 },
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      console.log(
        `Processing file: ${file.name}, size: ${file.size}, type: ${file.type}`,
      );

      // Validate file
      const validationError = validateFile(file, config);
      if (validationError) {
        console.error(`File validation failed: ${validationError}`);
        return NextResponse.json({ error: validationError }, { status: 400 });
      }

      // Generate unique filename with folder prefix
      const fileExtension = file.name.includes(".")
        ? file.name.split(".").pop()
        : "bin";
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

        console.log(
          `Sending upload command to R2: Bucket=${process.env.R2_BUCKET_NAME}, Key=${keyWithFolder}, ContentType=${file.type}`,
        );

        const uploadStartTime = Date.now();
        const uploadResult = await s3Client.send(uploadCommand);
        const uploadDuration = Date.now() - uploadStartTime;

        console.log(
          `Successfully uploaded file: ${keyWithFolder} in ${uploadDuration}ms`,
        );
        console.log("Upload result:", uploadResult);
      } catch (uploadError) {
        console.error(`Failed to upload file ${file.name}:`, uploadError);
        return NextResponse.json(
          {
            error: `Failed to upload ${file.name}: ${uploadError instanceof Error ? uploadError.message : "Unknown error"}`,
          },
          { status: 500 },
        );
      }

      if (!publicBaseUrl) {
        return NextResponse.json(
          {
            error:
              "Missing public R2 base URL. Set NEXT_PUBLIC_R2_PUBLIC_BASE_URL or R2_PUBLIC_BASE_URL in production.",
          },
          { status: 500 },
        );
      }

      const publicUrl = `${publicBaseUrl}/${keyWithFolder}`;
      console.log(`Generated public URL: ${publicUrl}`);
      uploadedUrls.push(publicUrl);
    }

    console.log(
      `Upload completed successfully. Total files: ${uploadedUrls.length}`,
    );

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (error) {
    console.error("Upload API error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: "Failed to upload files",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

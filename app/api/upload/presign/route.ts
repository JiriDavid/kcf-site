import { NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const runtime = "nodejs";

type UploadType = "gallery" | "sermons" | "events";

const FILE_CONFIGS: Record<
  UploadType,
  { folder: string; allowedTypes: string[]; maxSize: number }
> = {
  gallery: {
    folder: "kcf-images/",
    allowedTypes: ["image/"],
    maxSize: 10 * 1024 * 1024,
  },
  sermons: {
    folder: "sermons/",
    allowedTypes: ["image/", "video/", "audio/", "application/pdf"],
    maxSize: 100 * 1024 * 1024,
  },
  events: {
    folder: "events/",
    allowedTypes: ["image/", "video/", "audio/", "application/pdf"],
    maxSize: 50 * 1024 * 1024,
  },
};

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

function normalizeR2Endpoint(value?: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.origin;
  } catch {
    return trimmed;
  }
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

function validateFile(
  fileType: string,
  fileSize: number,
  uploadType: UploadType,
) {
  const config = FILE_CONFIGS[uploadType];

  if (fileSize > config.maxSize) {
    return `File is too large (max ${config.maxSize / (1024 * 1024)}MB)`;
  }

  const isAllowedType = config.allowedTypes.some((type) =>
    fileType.startsWith(type),
  );
  if (!isAllowedType) {
    return `Unsupported file type for ${uploadType}`;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const uploadType = (body.uploadType as UploadType) || "gallery";
    const fileName = String(body.fileName || "file.bin");
    const fileType = String(body.fileType || "application/octet-stream");
    const fileSize = Number(body.fileSize || 0);

    const config = FILE_CONFIGS[uploadType];
    if (!config) {
      return NextResponse.json(
        { error: "Invalid upload type" },
        { status: 400 },
      );
    }

    const validationError = validateFile(fileType, fileSize, uploadType);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const bucket = process.env.R2_BUCKET_NAME;
    const endpoint = normalizeR2Endpoint(process.env.R2_ENDPOINT);
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const publicBaseUrl = getPublicBaseUrl();

    if (
      !bucket ||
      !endpoint ||
      !accessKeyId ||
      !secretAccessKey ||
      !publicBaseUrl
    ) {
      return NextResponse.json(
        { error: "R2 configuration incomplete for presigned upload" },
        { status: 500 },
      );
    }

    if (isS3ApiEndpoint(publicBaseUrl)) {
      return NextResponse.json(
        {
          error:
            "Invalid public base URL. Use your public R2 domain (*.r2.dev/custom domain), not *.r2.cloudflarestorage.com.",
        },
        { status: 500 },
      );
    }

    const extension = fileName.includes(".")
      ? fileName.substring(fileName.lastIndexOf("."))
      : "";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}${extension}`;
    const key = `${config.folder}${uniqueName}`;

    const s3Client = new S3Client({
      region: process.env.R2_REGION || "auto",
      endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 10 * 60,
    });

    return NextResponse.json({
      uploadUrl,
      publicUrl: `${publicBaseUrl}/${key}`,
      key,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create upload URL",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

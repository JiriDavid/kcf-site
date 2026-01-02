import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const FOLDERS = ["kcf-images/", "sermons/", "events/"] as const;
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];

type Folder = (typeof FOLDERS)[number];

type GalleryResponseItem = {
  id: string;
  src: string;
  folder: Folder;
  title: string;
};

const bucket = process.env.R2_BUCKET_NAME;
const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const publicBase =
  process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL ?? process.env.R2_PUBLIC_BASE_URL;

if (!bucket || !accountId || !accessKeyId || !secretAccessKey) {
  console.warn(
    "[gallery api] R2 credentials are missing; gallery listing will return 500."
  );
}

const s3 =
  bucket && accountId && accessKeyId && secretAccessKey
    ? new S3Client({
        region: "auto",
        endpoint: `https://3a65eb39ad373f08e94df357a504b981.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      })
    : null;

function isImage(key: string | undefined | null) {
  if (!key) return false;
  return IMAGE_EXTENSIONS.some((ext) => key.toLowerCase().endsWith(ext));
}

function asTitle(key: string) {
  const name = key.split("/").pop() || key;
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\.[^.]+$/, "")
    .trim();
}

async function listFolder(prefix: Folder): Promise<GalleryResponseItem[]> {
  if (!s3 || !bucket || !publicBase) return [];

  const items: GalleryResponseItem[] = [];
  let continuationToken: string | undefined;

  do {
    const res = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );

    const contents = res.Contents ?? [];
    for (const entry of contents) {
      if (!isImage(entry.Key)) continue;
      const key = entry.Key!;
      items.push({
        id: key,
        src: `${publicBase.replace(/\/$/, "")}/${encodeURI(key)}`,
        folder: prefix.replace(/\/$/, "") as Folder,
        title: asTitle(key),
      });
    }

    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (continuationToken);

  return items;
}

export async function GET() {
  if (!s3 || !bucket || !publicBase) {
    return NextResponse.json(
      {
        error:
          "R2 is not configured. Set R2_BUCKET_NAME, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and NEXT_PUBLIC_R2_PUBLIC_BASE_URL.",
      },
      { status: 500 }
    );
  }

  try {
    const folderResults = await Promise.all(
      FOLDERS.map((folder) => listFolder(folder))
    );
    const items = folderResults.flat();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("[gallery api] failed to list R2 objects", error);
    return NextResponse.json(
      { error: "Failed to load gallery items" },
      { status: 500 }
    );
  }
}

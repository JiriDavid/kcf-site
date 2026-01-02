// app/api/gallery-metadata/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { GalleryItem } from "@/types";

export async function GET() {
  try {
    const db = await getDb();
    const galleryItems = await db
      .collection<GalleryItem>("gallery")
      .find({})
      .toArray();
    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const body = await request.json();

    // Check if it's a bulk insert (array of items) or single item
    if (body.items && Array.isArray(body.items)) {
      // Bulk insert
      const galleryItems: GalleryItem[] = body.items.map(
        (item: Omit<GalleryItem, "id" | "_id">) => ({
          ...item,
          id: crypto.randomUUID(),
        })
      );

      const result = await db
        .collection<GalleryItem>("gallery")
        .insertMany(galleryItems);

      const insertedItems = galleryItems.map((item, index) => ({
        ...item,
        _id: result.insertedIds[index],
      }));

      return NextResponse.json(insertedItems, { status: 201 });
    } else {
      // Single item insert (backward compatibility)
      const galleryItem: Omit<GalleryItem, "id"> = body;

      const newItem: GalleryItem = {
        ...galleryItem,
        id: crypto.randomUUID(),
      };

      const result = await db
        .collection<GalleryItem>("gallery")
        .insertOne(newItem);
      return NextResponse.json(
        { ...newItem, _id: result.insertedId },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error creating gallery item(s):", error);
    return NextResponse.json(
      { error: "Failed to create gallery item(s)" },
      { status: 500 }
    );
  }
}

// app/api/gallery-metadata/[id]/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { GalleryItem } from "@/types";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const updates: Partial<GalleryItem> = await request.json();

    // Remove id from updates as it shouldn't be changed
    const { id, ...updateData } = updates;

    const result = await db
      .collection<GalleryItem>("gallery")
      .updateOne({ id: params.id }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating gallery item:", error);
    return NextResponse.json(
      { error: "Failed to update gallery item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();

    const result = await db.collection<GalleryItem>("gallery").deleteOne({
      id: params.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery item" },
      { status: 500 }
    );
  }
}

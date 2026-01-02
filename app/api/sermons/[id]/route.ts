// app/api/sermons/[id]/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { Sermon } from "@/types";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const updates: Partial<Sermon> = await request.json();

    // Remove id from updates as it shouldn't be changed
    const { id, ...updateData } = updates;

    const result = await db
      .collection<Sermon>("sermons")
      .updateOne({ id: params.id }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Sermon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating sermon:", error);
    return NextResponse.json(
      { error: "Failed to update sermon" },
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

    const result = await db.collection<Sermon>("sermons").deleteOne({
      id: params.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Sermon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting sermon:", error);
    return NextResponse.json(
      { error: "Failed to delete sermon" },
      { status: 500 }
    );
  }
}

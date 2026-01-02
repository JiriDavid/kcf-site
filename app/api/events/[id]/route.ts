// app/api/events/[id]/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { Event } from "@/types";
import { ObjectId } from "mongodb";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const updates: Partial<Event> = await request.json();

    // Remove id from updates as it shouldn't be changed
    const { id, ...updateData } = updates;

    const result = await db
      .collection<Event>("events")
      .updateOne({ id: params.id }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
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

    const result = await db.collection<Event>("events").deleteOne({
      id: params.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}

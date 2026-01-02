// app/api/sermons/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { Sermon } from "@/types/index";

export async function GET() {
  try {
    const db = await getDb();
    const sermons = await db.collection<Sermon>("sermons").find({}).toArray();
    return NextResponse.json(sermons);
  } catch (error) {
    console.error("Error fetching sermons:", error);
    return NextResponse.json(
      { error: "Failed to fetch sermons" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const sermon: Omit<Sermon, "id"> = await request.json();

    // Generate a unique ID
    const newSermon: Sermon = {
      ...sermon,
      id: crypto.randomUUID(),
    };

    const result = await db.collection<Sermon>("sermons").insertOne(newSermon);
    return NextResponse.json(
      { ...newSermon, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating sermon:", error);
    return NextResponse.json(
      { error: "Failed to create sermon" },
      { status: 500 }
    );
  }
}

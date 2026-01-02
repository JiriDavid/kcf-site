// app/api/events/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { Event } from "@/types";

export async function GET() {
  try {
    const db = await getDb();
    const events = await db.collection<Event>("events").find({}).toArray();
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const event: Omit<Event, "id"> = await request.json();

    // Generate a unique ID
    const newEvent: Event = {
      ...event,
      id: crypto.randomUUID(),
    };

    const result = await db.collection<Event>("events").insertOne(newEvent);
    return NextResponse.json(
      { ...newEvent, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

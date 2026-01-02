// lib/seed.ts
import { config } from "dotenv";
import path from "path";
import { getDb } from "./mongodb";
import { events, sermons, galleryItems } from "./data";

// Load environment variables
config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

export async function seedDatabase() {
  try {
    const db = await getDb();

    // Seed events
    const eventsCollection = db.collection("events");
    const existingEvents = await eventsCollection.countDocuments();
    if (existingEvents === 0) {
      await eventsCollection.insertMany(events);
      console.log("Seeded events collection");
    } else {
      console.log("Events collection already has data");
    }

    // Seed sermons
    const sermonsCollection = db.collection("sermons");
    const existingSermons = await sermonsCollection.countDocuments();
    if (existingSermons === 0) {
      await sermonsCollection.insertMany(sermons);
      console.log("Seeded sermons collection");
    } else {
      console.log("Sermons collection already has data");
    }

    // Seed gallery
    const galleryCollection = db.collection("gallery");
    const existingGallery = await galleryCollection.countDocuments();
    if (existingGallery === 0) {
      await galleryCollection.insertMany(galleryItems);
      console.log("Seeded gallery collection");
    } else {
      console.log("Gallery collection already has data");
    }

    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

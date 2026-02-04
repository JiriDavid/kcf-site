// lib/data.ts - Database functions and fallback data
import { getDb } from "./mongodb";
import { Event, Sermon, GalleryItem } from "@/types";

// Database fetch functions
export async function getEvents(): Promise<Event[]> {
  try {
    const db = await getDb();
    return await db.collection<Event>("events").find({}).toArray();
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    const db = await getDb();
    return await db.collection<Event>("events").findOne({ id });
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export async function getSermons(): Promise<Sermon[]> {
  try {
    const db = await getDb();
    return await db.collection<Sermon>("sermons").find({}).toArray();
  } catch (error) {
    console.error("Error fetching sermons:", error);
    return [];
  }
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const db = await getDb();
    return await db.collection<GalleryItem>("gallery").find({}).toArray();
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return [];
  }
}

// Fallback static data (for development or if DB is not available)
export const sermons: Sermon[] = [
  {
    id: "s1",
    title: "To Us a Child is Born",
    date: "2025-12-25",
    description:
      "Why we celebrate the birth of Christ and its eternal significance.",
    category: "2025 Christmas Service",
    speaker: "Br. Keith.",
    videoUrl:
      "https://pub-c71ef7045fff4c60aeb28ca64b9a6508.r2.dev/sermons/christmas-service-sermon.MOV",
    audioUrl: `https://r2.example.com/kcf-media/audio/anchored.mp3`,
    notesUrl: `https://r2.example.com/kcf-media/notes/anchored.pdf`,
    thumbnail:
      "https://pub-c71ef7045fff4c60aeb28ca64b9a6508.r2.dev/kcf-images/brother-keith-teaching-2.jpg",
  },
  {
    id: "s2",
    title: "The World against Me",
    date: "2025-12-21",
    description:
      "The world against me, me against the world: standing firm in faith.",
    category: "Sunday Service",
    speaker: "Media Director. Sir Lyton.",
    videoUrl:
      "https://pub-c71ef7045fff4c60aeb28ca64b9a6508.r2.dev/sermons/21-12-25-sermon.MOV",
    audioUrl: `https://r2.example.com/kcf-media/audio/revive-city.mp3`,
    notesUrl: `https://r2.example.com/kcf-media/notes/revive-city.pdf`,
    thumbnail:
      "https://pub-c71ef7045fff4c60aeb28ca64b9a6508.r2.dev/sermons/media-director-ministering.jpg",
  },
  {
    id: "s3",
    title: "Set Your Heart On Things Above",
    date: "2025-12-14",
    description: "What you think of consistently is stored in your heart.",
    category: "Sunday Service",
    speaker: "Admin Collete.",
    videoUrl:
      "https://pub-c71ef7045fff4c60aeb28ca64b9a6508.r2.dev/sermons/admin-sis-collete-sermon(14-12-2025).mp4",
    audioUrl: `https://r2.example.com/kcf-media/audio/youth-commission.mp3`,
    thumbnail:
      "https://pub-c71ef7045fff4c60aeb28ca64b9a6508.r2.dev/sermons/admin-collete-teaching.jpg",
  },
];

export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    title: "Open Heaven",
    category: "Events",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    description: "Corporate worship during revival night.",
  },
  {
    id: "g2",
    title: "Leaders Circle",
    category: "Leaders",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "g3",
    title: "Youth Fire",
    category: "Fellowship",
    image:
      "https://images.unsplash.com/photo-1515162305281-9efbe3e5d0e1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "g4",
    title: "Commissioned",
    category: "Conferences",
    image:
      "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "g5",
    title: "Prayer Walk",
    category: "Events",
    image:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "g6",
    title: "Worship Night",
    category: "Fellowship",
    image:
      "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=900&q=80",
  },
];

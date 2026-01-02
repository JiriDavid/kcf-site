// types/index.ts
export type MediaType = "image" | "video";

export type Sermon = {
  id: string;
  _id?: string; // MongoDB ObjectId as string
  title: string;
  date: string;
  description: string;
  category:
    | "Sunday Service"
    | "Youth Service"
    | "Conferences"
    | "Special Sermons"
    | "2025 Christmas Service";
  speaker: string;
  videoUrl: string;
  audioUrl: string;
  notesUrl?: string;
  thumbnail: string;
};

export type Event = {
  id: string;
  _id?: string; // MongoDB ObjectId as string
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  category: string;
};

export type GalleryItem = {
  id: string;
  _id?: string; // MongoDB ObjectId as string
  title: string;
  category: "Events" | "Fellowship" | "Leaders" | "Conferences";
  image: string;
  description?: string;
};

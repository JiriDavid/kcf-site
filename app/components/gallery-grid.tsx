"use client";

import { useEffect, useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import GalleryCard, { GalleryMedia } from "./gallery-card";
import Loading from "./ui/loading";
import { Button } from "@/app/components/ui/button";
import { Images } from "lucide-react";

type GalleryItem = GalleryMedia & { folder: Folder; title: string };
type ApiResponse = {
  items: { id: string; src: string; folder: Folder; title: string }[];
};

const categories = ["All", "kcf-images", "sermons", "events"] as const;
type Category = (typeof categories)[number];
type Folder = Exclude<Category, "All">;

const categoryLabels: Record<Category, string> = {
  All: "All Moments",
  "kcf-images": "Fellowship",
  sermons: "Sermons",
  events: "Events",
};

export default function GalleryGrid() {
  const [category, setCategory] = useState<Category>("All");
  const [visible, setVisible] = useState(9);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/gallery");
        if (!res.ok) {
          throw new Error(`Request failed with ${res.status}`);
        }
        const data = (await res.json()) as ApiResponse;
        if (!cancelled) {
          setItems(
            (data.items ?? []).map((item) => ({
              id: item.id,
              image: item.src,
              folder: item.folder,
              title: item.title,
            })),
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load gallery from Cloudflare R2.");
        }
        console.error("[gallery] failed to load", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (category === "All") return items;
    return items.filter((item) => item.folder === category);
  }, [category, items]);

  const itemsToShow = filtered.slice(0, visible);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
        {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-foreground/70">
        No media found in your bucket yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-white">
            <Images className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {filtered.length} item{filtered.length === 1 ? "" : "s"} in{" "}
              {categoryLabels[category]}
            </span>
          </div>
          <p className="text-xs text-white/60">
            Click any image to open the immersive viewer.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={cat === category ? "secondary" : "outline"}
              size="sm"
              onClick={() => {
                setCategory(cat);
                setVisible(9);
                setActiveIndex(null);
              }}
              className={cat === category ? "text-white" : "text-white/85"}
            >
              {categoryLabels[cat]}
            </Button>
          ))}
        </div>
      </div>

      <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 [&>*]:mb-4 text-white">
        {itemsToShow.map((item, idx) => (
          <GalleryCard
            key={item.id}
            item={item}
            onClick={() => setActiveIndex(idx)}
          />
        ))}
      </div>

      {visible < filtered.length ? (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setVisible((v) => v + 6)}
            className="text-white"
          >
            Load more moments
          </Button>
        </div>
      ) : null}

      <Lightbox
        open={activeIndex !== null}
        close={() => setActiveIndex(null)}
        index={activeIndex ?? 0}
        slides={itemsToShow.map((item) => ({
          src: item.image,
          description: item.title,
        }))}
      />
    </div>
  );
}

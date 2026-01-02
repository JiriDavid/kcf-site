"use client";

import Image from "next/image";
import { Sermon } from "@/types";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { CalendarDays, FileText, Music2, Play } from "lucide-react";
import Link from "next/link";

type Props = {
  sermon: Sermon;
  onWatch?: (id: string) => void;
};

export default function SermonCard({ sermon, onWatch }: Props) {
  const handleWatch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onWatch) onWatch(sermon.id);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-card transition hover:-translate-y-2 hover:shadow-glow">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={sermon.thumbnail}
          alt={sermon.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute left-4 top-4 space-y-2">
          <Badge variant="default">{sermon.category}</Badge>
          <div className="flex items-center gap-2 text-xs text-white">
            <CalendarDays className="h-4 w-4 text-primary" />{" "}
            {new Date(sermon.date).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col space-y-3 p-6">
        <div>
          <h3 className="text-xl font-semibold text-white">{sermon.title}</h3>
          <p className="text-sm text-white/70">{sermon.description}</p>
          <p className="text-xs uppercase tracking-[0.15em] text-white mt-2">
            {sermon.speaker}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="inline-flex items-center gap-2"
            onClick={handleWatch}
          >
            <Play className="h-4 w-4" /> Watch
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={sermon.audioUrl}>
              <Music2 className="h-4 w-4" /> Listen
            </Link>
          </Button>
          {sermon.notesUrl ? (
            <Button asChild variant="ghost" size="sm">
              <Link href={sermon.notesUrl}>
                <FileText className="h-4 w-4" /> Notes
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

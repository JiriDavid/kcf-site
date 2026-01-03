"use client";

import React from "react";
import ReactPlayer from "react-player/lazy";
import { Sermon } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Download, Music2, Pause, Play } from "lucide-react";

type Props = {
  sermon: Sermon;
  isActive?: boolean;
  playSignal?: number;
  onPlayPause?: () => void;
};

export default function SermonPlayer({
  sermon,
  isActive = false,
  playSignal,
  onPlayPause,
}: Props) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  // Auto-play when this player becomes active and playSignal changes
  React.useEffect(() => {
    if (isActive) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [isActive, playSignal]);

  const handlePlayPause = () => {
    if (onPlayPause) {
      onPlayPause();
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  return (
    <Card id={`video-${sermon.id}`} className="w-full space-y-4">
      <CardHeader>
        <CardTitle className="flex flex-col gap-1">
          <span className="text-sm uppercase tracking-[0.2em] text-white">
            {sermon.category}
          </span>
          {sermon.title}
        </CardTitle>
        <p className="text-sm text-white">{sermon.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/60">
          <ReactPlayer
            url={sermon.videoUrl}
            width="100%"
            height="100%"
            controls
            light={!isPlaying ? sermon.thumbnail : false}
            playing={isPlaying}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handlePlayPause}
            className="inline-flex items-center gap-2"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isPlaying ? "Pause video" : "Play video"}
          </Button>
          <Button asChild variant="secondary">
            <a
              href={sermon.audioUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2"
            >
              <Music2 className="h-4 w-4" /> Play audio
            </a>
          </Button>
          {sermon.notesUrl ? (
            <Button asChild variant="outline">
              <a
                href={sermon.notesUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Download className="h-4 w-4" /> Download notes
              </a>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

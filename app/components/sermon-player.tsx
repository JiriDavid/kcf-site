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
  audioActive?: boolean;
  audioPlaySignal?: number;
  onPlayPause?: () => void;
};

export default function SermonPlayer({
  sermon,
  isActive = false,
  playSignal,
  audioActive = false,
  audioPlaySignal,
  onPlayPause,
}: Props) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);
  const [audioReplayKey, setAudioReplayKey] = React.useState(0);

  // Auto-play when this player becomes active and playSignal changes
  React.useEffect(() => {
    if (isActive) {
      setIsPlaying(true);
      setIsAudioPlaying(false);
    } else {
      setIsPlaying(false);
    }
  }, [isActive, playSignal]);

  React.useEffect(() => {
    if (audioActive) {
      setIsPlaying(false);
      setIsAudioPlaying(true);
      setAudioReplayKey((prev) => prev + 1);
    }
  }, [audioActive, audioPlaySignal]);

  const handlePlayPause = () => {
    setIsAudioPlaying(false);
    if (onPlayPause) {
      onPlayPause();
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const handlePlayAudio = () => {
    setIsPlaying(false);
    setIsAudioPlaying(true);
    setAudioReplayKey((prev) => prev + 1);
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
          <Button
            type="button"
            variant="secondary"
            onClick={handlePlayAudio}
            className="inline-flex items-center gap-2"
          >
            <Music2 className="h-4 w-4" />
            {isAudioPlaying ? "Replay audio" : "Play audio"}
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
        {isAudioPlaying ? (
          <div className="rounded-xl border border-white/10 bg-black/40 p-3">
            <audio
              key={`${sermon.id}-${audioReplayKey}`}
              src={sermon.audioUrl}
              controls
              autoPlay
              className="w-full"
              onEnded={() => setIsAudioPlaying(false)}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

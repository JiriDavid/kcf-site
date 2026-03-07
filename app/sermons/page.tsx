// app/sermons/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../components/section-header";
import SermonCard from "../components/sermon-card";
import SermonPlayer from "../components/sermon-player";
import Loading from "../components/ui/loading";
import { Sermon } from "@/types";

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string>("");
  const [activeMode, setActiveMode] = useState<"watch" | "listen">("watch");
  const [playSignal, setPlaySignal] = useState(0);
  const [audioPlaySignal, setAudioPlaySignal] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function fetchSermons() {
      try {
        const response = await fetch("/api/sermons");
        const data: Sermon[] = await response.json();
        setSermons(data);
        if (data.length > 0) {
          setActiveId(data[0].id);
          setActiveMode("watch");
        }
      } catch (error) {
        console.error("Error fetching sermons:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSermons();
  }, []);

  const activeSermon = useMemo(
    () => sermons.find((s) => s.id === activeId) ?? sermons[0],
    [activeId, sermons],
  );

  const handleWatch = (id: string) => {
    setActiveId(id);
    setActiveMode("watch");
    setIsPlaying(true);
    setPlaySignal((n) => n + 1);
    const target = document.getElementById("featured-player");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleListen = (id: string) => {
    setActiveId(id);
    setActiveMode("listen");
    setIsPlaying(false);
    setAudioPlaySignal((n) => n + 1);
    const target = document.getElementById("featured-player");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handlePlayPause = () => {
    setActiveMode("watch");
    setIsPlaying((prev) => !prev);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-14 lg:space-y-20">
      <section className="section-shell">
        <div className="container space-y-10 pt-8 lg:pt-0">
          <SectionHeader
            eyebrow="Sermons"
            title="Watch, listen, revisit"
            description="A curated archive of teachings across Sunday, Youth, Conferences, and Specials."
            align="center"
          />

          {activeSermon ? (
            <div id="featured-player">
              <SermonPlayer
                sermon={activeSermon}
                isActive={isPlaying}
                playSignal={playSignal}
                audioActive={!isPlaying}
                audioPlaySignal={audioPlaySignal}
                onPlayPause={handlePlayPause}
              />
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-3">
            {sermons.map((sermon) => (
              <SermonCard
                key={sermon.id}
                sermon={sermon}
                onWatch={handleWatch}
                onListen={handleListen}
                isWatchActive={sermon.id === activeId && activeMode === "watch"}
                isListenActive={
                  sermon.id === activeId && activeMode === "listen"
                }
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// app/sermons/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../components/section-header";
import SermonCard from "../components/sermon-card";
import SermonPlayer from "../components/sermon-player";
import { Sermon } from "@/types";

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string>("");
  const [playSignal, setPlaySignal] = useState(0);

  useEffect(() => {
    async function fetchSermons() {
      try {
        const response = await fetch("/api/sermons");
        const data: Sermon[] = await response.json();
        setSermons(data);
        if (data.length > 0) {
          setActiveId(data[0].id);
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
    [activeId, sermons]
  );

  const handleWatch = (id: string) => {
    setActiveId(id);
    setPlaySignal((n) => n + 1);
    const target = document.getElementById("featured-player");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (loading) {
    return <div>Loading sermons...</div>;
  }

  return (
    <div className="space-y-14 lg:space-y-20">
      <section className="section-shell">
        <div className="container space-y-10">
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
                isActive
                playSignal={playSignal}
              />
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-3">
            {sermons.map((sermon) => (
              <SermonCard
                key={sermon.id}
                sermon={sermon}
                onWatch={handleWatch}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

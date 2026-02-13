import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import SectionHeader from "@/app/components/section-header";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { getEventById } from "@/lib/data";
import { EyeOff, CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEventById(params.id);

  if (!event) {
    notFound();
  }

  const isMysterious = event.reviewed === false;
  const eventDate = new Date(event.date);

  if (isMysterious) {
    return (
      <div className="section-shell">
        <div className="container space-y-10 pt-8 lg:pt-0">
          <SectionHeader
            eyebrow="Mysterious Event"
            title="Something Special is Coming"
            description="We're planning something exciting for this date. Stay tuned for more details!"
            align="left"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-black/90 to-indigo-900/80 flex items-center justify-center z-10">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <EyeOff className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white">
                      Top Secret
                    </h3>
                    <p className="text-white/80">
                      Details will be revealed soon
                    </p>
                  </div>
                </div>
              </div>
              <Image
                src={event.image}
                alt="Mysterious event"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover filter blur-sm"
              />
            </div>

            <div className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge variant="subtle" className="text-white bg-purple-500/30">
                  <EyeOff className="w-3 h-3 mr-1" />
                  Coming Soon
                </Badge>
                <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
                  {eventDate.toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-white/70">Date</p>
                <p className="text-lg font-semibold text-white flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  {eventDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-white/70">Location</p>
                <p className="text-lg font-semibold text-white">???</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-white/70">About this event</p>
                <p className="text-sm text-white/90 leading-relaxed">
                  We&apos;re putting together something special for our
                  community. More details will be shared as we get closer to the
                  date. Keep an eye on our announcements!
                </p>
              </div>

              <Button asChild variant="outline" className="w-full">
                <Link href="/events">Back to events</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-shell">
      <div className="container space-y-10 pt-8 lg:pt-0">
        <SectionHeader
          eyebrow="Event"
          title={event.title}
          description={event.description}
          align="left"
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/10">
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge variant="subtle" className="text-white bg-green-500/30">
                {event.category}
              </Badge>
              <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
                {eventDate.toLocaleDateString()}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-white/70">Location</p>
              <p className="text-lg font-semibold text-white">
                {event.location}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-white/70">About this event</p>
              <p className="text-sm text-white/90 leading-relaxed">
                {event.description}
              </p>
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link href="/events">Back to events</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

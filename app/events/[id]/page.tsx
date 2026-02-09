import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import SectionHeader from "@/app/components/section-header";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { getEventById } from "@/lib/data";

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

  const eventDate = new Date(event.date);

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

import SectionHeader from "../components/section-header";
import { getEvents } from "@/lib/data";
import EventCard from "../components/event-card";
import { Badge } from "../components/ui/badge";

export default async function EventsPage() {
  const upcoming = await getEvents();

  return (
    <div className="space-y-16 lg:space-y-20">
      <section className="section-shell">
        <div className="container space-y-10">
          <SectionHeader
            eyebrow="Events"
            title="Gatherings that shape us"
            description="Mark your calendar for revival nights, youth fire gatherings, leadership labs, and citywide prayer walks."
            align="center"
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell bg-black/30">
        <div className="container space-y-8">
          <SectionHeader
            eyebrow="Roadmap"
            title="The journey ahead"
            description="A simple horizon view of what's coming next."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {upcoming.map((event, idx) => (
              <div
                key={event.id}
                className="relative rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="mb-3 flex items-center justify-between text-white">
                  <Badge variant="subtle" className="text-white">
                    {event.category}
                  </Badge>
                  <div className="text-xs text-white">Q{idx + 1}</div>
                </div>
                <p className="text-sm uppercase tracking-[0.14em] text-primary font-bold">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <h3 className="text-lg font-semibold text-white">
                  {event.title}
                </h3>
                <p className="text-sm text-white line-clamp-3">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

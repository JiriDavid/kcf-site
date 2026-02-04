import SectionHeader from "../components/section-header";
import { getEvents } from "@/lib/data";
import EventCard from "../components/event-card";

// Force dynamic rendering to ensure fresh data on each request
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const allEvents = await getEvents();
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

  const futureEvents = allEvents.filter((event) => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate > currentDate;
  });

  const pastEvents = allEvents.filter((event) => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate <= currentDate;
  });

  futureEvents.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  pastEvents.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-16 lg:space-y-20">
      <section className="section-shell">
        <div className="container space-y-10 pt-8 lg:pt-0">
          <SectionHeader
            eyebrow="Events"
            title="Future events"
            description="Plan ahead for what's coming next."
            align="center"
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {futureEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell bg-black/30">
        <div className="container space-y-10">
          <SectionHeader
            eyebrow="Events"
            title="Past events"
            description="Snapshots of recent gatherings and milestones."
            align="center"
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

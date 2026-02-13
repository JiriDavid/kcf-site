import Image from "next/image";
import Link from "next/link";
import { Event } from "@/types";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { CalendarDays, MapPin, Eye, EyeOff } from "lucide-react";

export default function EventCard({ event }: { event: Event }) {
  const isMysterious = event.reviewed === false;

  if (isMysterious) {
    return (
      <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-card transition hover:-translate-y-2 hover:shadow-glow relative">
        {/* Mysterious overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-black/90 to-indigo-900/80 z-10 flex items-center justify-center">
          <div className="text-center space-y-4 p-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
              <EyeOff className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Mysterious Event
              </h3>
              <p className="text-sm text-white/80">Details coming soon...</p>
            </div>
          </div>
        </div>

        {/* Blurred background */}
        <div className="relative h-52 w-full overflow-hidden filter blur-sm">
          <Image
            src={event.image}
            alt="Mysterious event"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        <div className="space-y-3 p-6">
          <div className="flex items-center gap-2">
            <Badge variant="subtle" className="text-white bg-purple-500/30">
              <Eye className="w-3 h-3 mr-1" />
              Coming Soon
            </Badge>
          </div>
          <h3 className="text-xl font-semibold text-white">???</h3>
          <p className="text-sm text-white/60 line-clamp-2">
            Something exciting is planned for this date. Stay tuned for more
            details!
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              {new Date(event.date).toLocaleDateString()}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-white/60" />
              ???
            </span>
          </div>
          <div className="pt-1">
            <Button
              disabled
              variant="outline"
              className="w-full justify-center text-white/60 cursor-not-allowed"
            >
              Details Hidden
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-card transition hover:-translate-y-2 hover:shadow-glow">
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute left-4 top-4 text-white">
          <Badge variant="subtle" className="text-white bg-green-500/30">
            {event.category}
          </Badge>
        </div>
      </div>
      <div className="space-y-3 p-6">
        <h3 className="text-xl font-semibold text-white">{event.title}</h3>
        <p className="text-sm text-white line-clamp-2">{event.description}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-white">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            {new Date(event.date).toLocaleDateString()}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-white" />
            {event.location}
          </span>
        </div>
        <div className="pt-1">
          <Button
            asChild
            variant="outline"
            className="w-full justify-center text-white"
          >
            <Link href={`/events/${event.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

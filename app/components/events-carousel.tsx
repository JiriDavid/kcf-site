"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { events as staticEvents } from "@/lib/static-data";
import EventCard from "./event-card";
import { useState, useEffect } from "react";
import { Event } from "@/types";

export default function EventsCarousel() {
  const [isMobile, setIsMobile] = useState(false);
  const [events, setEvents] = useState<Event[]>(staticEvents);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        // Fallback to static events if API fails
        setEvents(staticEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-white">Loading events...</div>
      </div>
    );
  }

  if (isMobile) {
    // Static grid layout for mobile - no carousel
    return (
      <div className="grid gap-4 sm:hidden">
        {events.slice(0, 3).map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    );
  }

  return (
    <Swiper
      modules={[Autoplay, Navigation]}
      slidesPerView={1.1}
      spaceBetween={12}
      loop
      autoplay={{
        delay: 4200,
        disableOnInteraction: true,
        pauseOnMouseEnter: true,
      }}
      breakpoints={{
        480: { slidesPerView: 1.2, spaceBetween: 16 },
        640: { slidesPerView: 2.1, spaceBetween: 18 },
        768: { slidesPerView: 2.1 },
        1024: { slidesPerView: 3.1 },
      }}
      className="!overflow-visible"
      grabCursor={true}
      touchEventsTarget="container"
      simulateTouch={true}
    >
      {events.map((event) => (
        <SwiperSlide key={event.id} className="pb-10">
          <EventCard event={event} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

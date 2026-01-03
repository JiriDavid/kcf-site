"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { events } from "@/lib/static-data";
import EventCard from "./event-card";
import { useState, useEffect } from "react";

export default function EventsCarousel() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

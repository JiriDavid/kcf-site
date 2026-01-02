"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { events } from "@/lib/static-data";
import EventCard from "./event-card";

export default function EventsCarousel() {
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

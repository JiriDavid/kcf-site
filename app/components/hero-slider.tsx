"use client";

import { heroSlides } from "@/lib/static-data";
import { Button } from "@/app/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function HeroSlider() {
  return (
    <div className="relative min-h-[80vh] overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl">
      <Swiper
        modules={[EffectFade, Autoplay, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        slidesPerView={1}
        loop
        speed={700}
        autoplay={{ delay: 5800, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="hero-swiper h-full"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[80vh] w-full">
              {slide.mediaType === "video" ? (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={slide.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <Image
                  src={slide.src}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-black/80" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(13,173,141,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(17,100,180,0.32),transparent_32%)]" />
              <div className="relative z-10 flex h-full items-center">
                <div className="container">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-2xl space-y-6"
                  >
                    <div className="pill text-white">KCF Fellowship</div>
                    <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                      <span className="text-white">{slide.title}</span>
                    </h1>
                    <p className="max-w-xl text-lg text-white">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {slide.cta?.map((cta, idx) => (
                        <Button
                          key={cta.href}
                          asChild
                          variant={idx === 0 ? "secondary" : "outline"}
                          size="lg"
                          className={cn(
                            idx === 0 ? "shadow-glow" : "text-white"
                          )}
                        >
                          <Link href={cta.href}>{cta.label}</Link>
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      />
    </div>
  );
}

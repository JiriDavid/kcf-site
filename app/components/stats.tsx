"use client";

import React, { useEffect } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { stats } from "@/lib/static-data";

function AnimatedNumber({ value }: { value: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 120, damping: 20 });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, motionValue, value]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toString();
      }
    });
  }, [spring]);

  return <span ref={ref}>0</span>;
}

export default function Stats() {
  return (
    <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-3 w-full">
      {stats.map((item) => (
        <div
          key={item.label}
          className="glass-card flex min-h-[140px] flex-col gap-3 rounded-2xl border border-white/10 p-6 text-left"
        >
          <div className="text-4xl font-semibold leading-none text-white">
            <AnimatedNumber value={item.value} />
          </div>
          <p className="text-sm font-medium leading-snug text-white break-words">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}

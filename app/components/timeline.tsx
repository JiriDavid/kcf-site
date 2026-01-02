"use client";

import { milestones } from "@/lib/static-data";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Timeline() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="relative pl-4 sm:pl-6">
      <div className="absolute left-1 sm:left-2 top-0 h-full w-px bg-gradient-to-b from-primary/50 via-white/10 to-transparent" />
      <div className="space-y-6 sm:space-y-10">
        {milestones.map((item, idx) => (
          <motion.div
            key={item.year}
            initial={isMobile ? { opacity: 0 } : { opacity: 0, x: -20 }}
            whileInView={isMobile ? { opacity: 1 } : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: isMobile ? 0.3 : 0.4,
              delay: isMobile ? 0 : idx * 0.05,
            }}
            className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6"
          >
            <div className="absolute -left-[30px] sm:-left-[38px] top-4 sm:top-6 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-primary shadow-glow text-white" />
            <p className="text-xs uppercase tracking-[0.2em] text-white mb-1">
              {item.year}
            </p>
            <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">
              {item.title}
            </h4>
            <p className="text-sm text-white/90">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { milestones } from "@/lib/static-data";
import { motion } from "framer-motion";

export default function Timeline() {
  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-0 h-full w-px bg-gradient-to-b from-primary/50 via-white/10 to-transparent" />
      <div className="space-y-10">
        {milestones.map((item, idx) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="relative rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="absolute -left-[38px] top-6 h-3 w-3 rounded-full bg-primary shadow-glow text-white" />
            <p className="text-xs uppercase tracking-[0.2em] text-white">
              {item.year}
            </p>
            <h4 className="text-xl font-semibold text-white">{item.title}</h4>
            <p className="text-sm text-white">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

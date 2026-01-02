import Image from "next/image";
import SectionHeader from "../components/section-header";
import Timeline from "../components/timeline";
import Stats from "../components/stats";
import {
  DEFAULT_R2_BASE_URL,
  milestones,
  R2_PLACEHOLDER,
} from "@/lib/static-data";

export default function AboutPage() {
  return (
    <div className="space-y-12 sm:space-y-20 lg:space-y-28">
      <section className="section-shell">
        <div className="container section-grid">
          <div className="space-y-4 sm:space-y-6">
            <SectionHeader
              eyebrow="About"
              title="The story of KCF Fellowship"
              description="Born on campus, grown across cities, carrying a mandate to worship, disciple, and send."
            />
            <p className="text-base sm:text-lg text-white">
              We are a multi-campus fellowship centered on the presence of
              Jesus, the authority of Scripture, and the empowerment of the Holy
              Spirit. Our teams craft immersive worship spaces, mentor students
              and young professionals, and champion prayer-led mission.
            </p>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <div className="glass-card rounded-2xl p-4 sm:p-6">
                <h4 className="text-lg sm:text-xl font-semibold text-white pb-2">
                  Mission
                </h4>
                <p className="text-sm text-white/70">
                  To host God&apos;s presence, form resilient disciples, and
                  commission leaders for every sphere.
                </p>
              </div>
              <div className="glass-card rounded-2xl p-4 sm:p-6">
                <h4 className="text-lg sm:text-xl font-semibold text-white pb-2">
                  Vision
                </h4>
                <p className="text-sm text-white/70">
                  A worshiping family multiplying Kingdom influence across
                  campuses, cities, and nations.
                </p>
              </div>
            </div>
          </div>
          <div className="relative h-[300px] sm:h-[420px] overflow-hidden rounded-3xl border border-white/10 mt-8 sm:mt-0">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={`${R2_PLACEHOLDER}/kcf-images/2023-kcf-video.MOV`}
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/10 to-black/70" />
            <div className="absolute bottom-6 left-6 space-y-2">
              <p className="pill text-white">Since 2022</p>
              <h3 className="text-2xl font-semibold text-white">
                Moments of awakening, decades of faithfulness.
              </h3>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shel">
        <div className="container section-grid">
          <div className="space-y-4">
            <SectionHeader
              eyebrow="Milestones"
              title="From small circles to global streams"
              description="A timeline of God's faithfulness in the KCF story."
            />
            <p className="text-sm text-white">
              Each marker is a reminder of presence-led risk, community, and
              obedience.
            </p>
          </div>
          <Timeline />
        </div>
      </section>

      <section className="section-shel">
        <div className="container space-y-8 mb-4 lg:mb-16">
          <SectionHeader
            eyebrow="Impact"
            title="The numbers only hint at the lives transformed"
            description="Behind every metric is a name, a story, a transformed future."
            align="center"
          />
          <Stats />
        </div>
      </section>
    </div>
  );
}

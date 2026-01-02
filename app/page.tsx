import Image from "next/image";
import HeroSlider from "./components/hero-slider";
import SectionHeader from "./components/section-header";
import EventsCarousel from "./components/events-carousel";
import { DEFAULT_R2_BASE_URL, R2_PLACEHOLDER } from "@/lib/static-data";
import { getSermons } from "@/lib/data";
import SermonCard from "./components/sermon-card";
import Stats from "./components/stats";
import Link from "next/link";
import { Button } from "./components/ui/button";

export default async function Home() {
  const allSermons = await getSermons();
  const latestSermons = allSermons.slice(0, 3);

  return (
    <div className="space-y-4 sm:space-y-8 lg:space-y-1 pt-16 sm:pt-20">
      <section className="section-shell pt-2 sm:pt-6">
        <div className="container">
          <HeroSlider />
        </div>
      </section>

      <section className="section-shell pb-8 sm:pb-10 lg:pb-10">
        <div className="container section-grid">
          <div className="space-y-4 sm:space-y-2">
            <SectionHeader
              eyebrow="Who we are"
              title="A fellowship marked by presence, formation, and sending"
              description="We gather around Jesus' presence, practice the way of the Kingdom, and release leaders to campuses, cities, and the nations."
            />
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              {[
                "Presence-led worship",
                "Biblical discipleship",
                "Spirit-filled leadership",
                "Kingdom impact",
              ].map((item) => (
                <div
                  key={item}
                  className="glass-card flex items-center gap-3 rounded-xl p-4 sm:p-6"
                >
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-primary to-secondary" />
                  <p className="text-sm font-semibold text-white">{item}</p>
                </div>
              ))}
            </div>
            <Stats />
          </div>
          <div className="relative h-full min-h-[300px] sm:min-h-[380px] overflow-hidden rounded-3xl border border-white/10 mt-8 sm:mt-0">
            <Image
              src={`${R2_PLACEHOLDER}/kcf-images/kcf-1.jpg`}
              alt="Fellowship"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/10 to-black/80" />
            <div className="absolute bottom-6 left-6 right-6 space-y-3">
              <p className="pill w-max text-white">Presence</p>
              <h3 className="text-2xl font-semibold text-white">
                Moments that become movements.
              </h3>
              <p className="max-w-lg text-sm text-foreground/75 text-white">
                Expect warmth, family, and hunger for the Spirit at every
                gathering.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell bg-black/30">
        <div className="container space-y-10">
          <SectionHeader
            eyebrow="Mission & Vision"
            title="Jesus at the center — every generation on mission"
            description="Our dream is to see disciples who worship deeply, think biblically, and love boldly across campuses and cities."
            align="center"
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {["Worship", "Formation", "Sending"].map((title, idx) => (
              <div
                key={title}
                className="glass-card h-full space-y-3 rounded-2xl"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-white">
                  0{idx + 1}
                </p>
                <h4 className="text-xl font-semibold text-white">{title}</h4>
                <p className="text-sm text-white">
                  {title === "Worship"
                    ? "Curating atmospheres of adoration, creativity, and encounter."
                    : title === "Formation"
                      ? "Building resilient disciples through Scripture, community, and practice."
                      : "Equipping leaders to plant, serve, and influence every sphere."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell" id="events">
        <div className="container space-y-6">
          <SectionHeader
            eyebrow="Upcoming"
            title="Events that gather, train, and send"
            description="From revival nights to leadership labs, discover what is next."
          />
          <EventsCarousel />
          <div className="text-right">
            <Button asChild variant="outline">
              <Link href="/events">View all events</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-shell" id="sermons">
        <div className="container space-y-6">
          <SectionHeader
            eyebrow="Latest sermons"
            title="Teachings for the journey"
            description="Watch, listen, and download notes from the latest series across our gatherings."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {latestSermons.map((sermon) => (
              <SermonCard key={sermon.id} sermon={sermon} />
            ))}
          </div>
          <div className="text-right">
            <Button asChild variant="secondary">
              <Link href="/sermons">Explore all sermons</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="container section-grid">
          <div className="space-y-4">
            <SectionHeader
              eyebrow="Fellowship moments"
              title="Photos that carry the atmosphere"
              description="Sneak peeks from gatherings, retreats, and conferences."
            />
            <p className="text-sm text-white">
              Dive into the gallery for more stories from worship nights, youth
              fire sessions, and leadership gatherings.
            </p>
            <Button asChild variant="outline">
              <Link href="/gallery" className="text-white">
                Open gallery
              </Link>
            </Button>
          </div>
          <div className="relative h-[360px] overflow-hidden rounded-3xl border border-white/10">
            <Image
              src="https://pub-c71ef7045fff4c60aeb28ca64b9a6508.r2.dev/kcf-images/congregation-christmas.jpg"
              alt="Gallery highlight"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/20 to-black/70" />
          </div>
        </div>
      </section>
    </div>
  );
}

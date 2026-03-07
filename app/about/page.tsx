import Image from "next/image";
import SectionHeader from "../components/section-header";
import Timeline from "../components/timeline";
import Stats from "../components/stats";
import { R2_PLACEHOLDER } from "@/lib/static-data";

const patrons = [
  {
    name: "Pastor Mohanty",
    title: "Spiritual and Advisory Patron",
    description:
      "Provides prayer covering, spiritual direction, and mentorship for the fellowship body.",
    image: `/patron.jpeg`,
  },
  
];

const foundingFathers = [
  {
    name: "Founding Father 01",
    year: "2022",
    contribution: "Led the first prayer and worship circles that formed KCF.",
    image: `${R2_PLACEHOLDER}/kcf-images/praise.jpg`,
  },
  {
    name: "Founding Father 02",
    year: "2022",
    contribution:
      "Established discipleship rhythms and community fellowship structure.",
    image: `${R2_PLACEHOLDER}/kcf-images/intercession-2.jpg`,
  },
  {
    name: "Founding Father 03",
    year: "2023",
    contribution:
      "Championed outreach and mission efforts across campuses and neighborhoods.",
    image: `${R2_PLACEHOLDER}/kcf-images/kcf-group-photo.jpg`,
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-8 sm:space-y-10 lg:space-y-12 pb-12">
      <section className="section-shell">
        <div className="container space-y-6 pt-8 lg:pt-0">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 space-y-5">
              <SectionHeader
                eyebrow="About"
                title="KIIT Christian Fellowship (KCF)"
                description="A Christ-centered student body at KIIT University gathered to worship, grow, and impact lives together."
              />
              <p className="text-base sm:text-lg text-white">
                KCF is governed by Jesus Christ as Head and welcomes students
                from different Christian traditions. We cultivate a culture of
                authentic worship, biblical discipleship, and practical love on
                campus and beyond.
              </p>
              <p className="text-base sm:text-lg text-white">
                Our fellowship framework keeps ministry orderly, inclusive, and
                mission-focused while helping students mature in faith and
                leadership.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h4 className="text-lg font-semibold text-white pb-1">
                    Our Vision
                  </h4>
                  <p className="text-sm text-white/70">
                    Raising true worshipers who worship the Father in spirit and
                    truth (John 4:23–24).
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h4 className="text-lg font-semibold text-white pb-1">
                    Our Mission
                  </h4>
                  <p className="text-sm text-white/70">
                    Nurture believers, spread the Gospel, and develop student
                    leaders for kingdom impact.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:grid-rows-2 h-full">
              <div className="relative h-44 sm:h-52 overflow-hidden rounded-2xl border border-white/10 sm:col-span-2">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={`${R2_PLACEHOLDER}/kcf-images/2023-kcf-video.MOV`}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/10 to-black/70" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <p className="pill text-white">Since 2022</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                    Worship • Discipleship • Mission
                  </p>
                </div>
              </div>
              <div className="relative h-36 sm:h-40 overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={`${R2_PLACEHOLDER}/kcf-images/praise.jpg`}
                  alt="KCF worship moments"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative h-36 sm:h-40 overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={`${R2_PLACEHOLDER}/kcf-images/teaching.jpg`}
                  alt="KCF discipleship sessions"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">
                Identity
              </p>
              <p className="mt-2 text-sm text-white/80">
                One fellowship family rooted in Christ and united across
                denominations.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">
                Formation
              </p>
              <p className="mt-2 text-sm text-white/80">
                Weekly rhythms of prayer, teaching, and accountable
                discipleship.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">
                Impact
              </p>
              <p className="mt-2 text-sm text-white/80">
                Raising worshipers who honor the Lord in spirit and in truth,
                while equipping and mentoring leaders to serve and influence the
                campus and community.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shel">
        <div className="container grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
            <SectionHeader
              eyebrow="History"
              title="Our foundation and guiding heartbeat"
              description="The journey and principles that continue to shape KCF's culture and mission."
            />
            <p className="text-base sm:text-lg text-white">
              KIIT Christian Fellowship began as a small student gathering for
              prayer and worship and has grown into a vibrant community for
              discipleship, evangelism, and service. Our commitment remains the
              same: to glorify God and build people.
            </p>
            <p className="text-base sm:text-lg text-white">
              We stay grounded in Scripture, practice servant leadership, and
              cultivate spiritual maturity through fellowship, teaching, and
              mission.
            </p>
            
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative h-60 sm:h-72 overflow-hidden rounded-2xl border border-white/10 sm:col-span-2">
              <Image
                src={`${R2_PLACEHOLDER}/kcf-images/kcf-group-photo.jpg`}
                alt="KCF Fellowship gathering"
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/10 to-black/70" />
              <div className="absolute bottom-4 left-4 space-y-1">
                <p className="pill text-white">Our Story</p>
                <h3 className="text-xl font-semibold text-white">
                  Rooted on campus, growing in Christ.
                </h3>
              </div>
            </div>
            <div className="relative h-40 overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={`${R2_PLACEHOLDER}/kcf-images/intercession-2.jpg`}
                alt="Intercession moments"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative h-40 overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={`${R2_PLACEHOLDER}/kcf-images/teaching.jpg`}
                alt="Teaching moments"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-shel">
        <div className="container space-y-5">
          <SectionHeader
            eyebrow="Patrons"
            title="Patrons and spiritual covering"
            description="Honoring those who provide guidance, counsel, and intercessory support for KCF."
            align="center"
          />

          <div className="grid gap-4 md:grid-cols-2">
            {patrons.map((patron) => (
              <article
                key={patron.name}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <div className="relative h-52">
                  <Image
                    src={patron.image}
                    alt={patron.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
                <div className="space-y-2 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-primary">
                    {patron.title}
                  </p>
                  <h3 className="text-xl font-semibold text-white">
                    {patron.name}
                  </h3>
                  <p className="text-sm text-white/70">{patron.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shel">
        <div className="container space-y-5">
          <SectionHeader
            eyebrow="Founding Fathers"
            title="Founding fathers of the fellowship"
            description="Celebrating the pioneers whose obedience and sacrifice laid the foundation of KCF."
            align="center"
          />

          <div className="grid gap-4 lg:grid-cols-3">
            {foundingFathers.map((founder) => (
              <article
                key={founder.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="relative h-40 overflow-hidden rounded-xl">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-primary">
                    Since {founder.year}
                  </p>
                  <h3 className="text-lg font-semibold text-white">
                    {founder.name}
                  </h3>
                  <p className="text-sm text-white/70">
                    {founder.contribution}
                  </p>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* <section className="section-shell">
        <div className="container grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-3">
            <SectionHeader
              eyebrow="Milestones"
              title="Journey timeline"
              description="Snapshots that mark God's faithfulness in our fellowship story."
            />
            <p className="text-sm text-white/70">
              From first gatherings to major worship and outreach moments, each
              milestone reflects a growing student community rooted in Christ.
            </p>
          </div>
          <Timeline />
        </div>
      </section> */}

      <section className="section-shell">
        <div className="container space-y-5 mb-2 lg:mb-8">
          <SectionHeader
            eyebrow="Impact"
            title="Impact on our campus community"
            description="Every number represents students learning to worship, grow, and lead."
            align="center"
          />
          <Stats />
        </div>
      </section>
    </div>
  );
}

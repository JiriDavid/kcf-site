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
          <div className="space-y-4 sm:space-y-6 pt-8 lg:pt-0">
            <SectionHeader
              eyebrow="About"
              title="KIIT Christian Fellowship (KCF)"
              description="A Christian student body using facilities at KIIT University, Bhubaneswar, Odisha, India—gathered to worship, grow, and serve together."
            />
            <p className="text-base sm:text-lg text-white">
              KCF is governed by Jesus Christ as Head and is committed to
              welcoming students from across Christian denominations. We exist
              to worship the Father in spirit and truth, encourage believers on
              campus, and share the Gospel in ways that foster unity and
              spiritual growth.
            </p>
            <p className="text-base sm:text-lg text-white">
              We organize ourselves with simple guidelines that keep things
              orderly, safeguard everyone&apos;s freedom, and let us partner
              kindly with the broader Church while serving on campus.
            </p>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <div className="glass-card rounded-2xl p-4 sm:p-6">
                <h4 className="text-lg sm:text-xl font-semibold text-white pb-2">
                  Our Vision
                </h4>
                <p className="text-sm text-white/70">
                  Raising true worshipers who worship the Father in spirit and
                  truth (John 4:23–24).
                </p>
              </div>
              <div className="glass-card rounded-2xl p-4 sm:p-6">
                <h4 className="text-lg sm:text-xl font-semibold text-white pb-2">
                  Our Mission
                </h4>
                <p className="text-sm text-white/70">
                  To nurture believers, spread the Gospel, promote spiritual
                  growth, and develop leaders within our campus community.
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
              <p className="pill text-white">KCF (2022)</p>
              <h3 className="text-2xl font-semibold text-white">
                Rooted on campus, united in Christ.
              </h3>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shel">
        <div className="container section-grid">
          <div className="space-y-4 sm:space-y-6">
            <SectionHeader
              eyebrow="History"
              title="Fellowship History"
              description="The foundation and guiding principles of KIIT Christian Fellowship."
            />
            <p className="text-base sm:text-lg text-white">
              KIIT Christian Fellowship (KCF) gathers as a Christian student
              body using facilities located in KIIT University, Bhubaneswar,
              Odisha, India. We exist to worship God, nurture believers on
              campus, and serve our wider community under the headship of Jesus
              Christ.
            </p>
            <p className="text-base sm:text-lg text-white">
              Our shared framework calls us to minister to Christian students,
              lead the lost to Christ, promote spiritual growth through teaching
              and fellowship, and develop leaders who can carry the mission
              forward. It also keeps us orderly while we collaborate with
              students from diverse Christian backgrounds.
            </p>
            <div className="glass-card rounded-2xl p-4 sm:p-6">
              <h4 className="text-lg sm:text-xl font-semibold text-white pb-2">
                Our Objectives
              </h4>
              <ul className="text-sm text-white/70 space-y-2">
                <li>• Worship God through prayer, praise, and devotion</li>
                <li>
                  • Minister to Christian students and the broader community
                </li>
                <li>
                  • Lead the lost to Christ through evangelism and outreach
                </li>
                <li>
                  • Nurture growth through preaching, teaching, and fellowship
                </li>
                <li>
                  • Develop and nurture ministry leaders for future service
                </li>
              </ul>
            </div>
            <p className="text-sm text-white/70 italic">
              Our fellowship follows a simple student constitution so we stay
              orderly, united, and welcoming.
            </p>
          </div>
          <div className="relative h-[300px] sm:h-[420px] overflow-hidden rounded-3xl border border-white/10 mt-8 sm:mt-0">
            <Image
              src={`${R2_PLACEHOLDER}/kcf-images/kcf-group-photo.jpg`}
              alt="KCF Fellowship gathering"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/10 to-black/70" />
            <div className="absolute bottom-6 left-6 space-y-2">
              <p className="pill text-white">Community</p>
              <h3 className="text-2xl font-semibold text-white">
                United in faith, growing together.
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
              title="Snapshots from our fellowship journey"
              description="Moments that reflect worship, discipleship, and service on campus."
            />
            <p className="text-sm text-white">
              Each marker highlights how our campus community has gathered to
              worship, grow, and serve together.
            </p>
          </div>
          <Timeline />
        </div>
      </section>

      <section className="section-shel">
        <div className="container space-y-8 mb-4 lg:mb-16">
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

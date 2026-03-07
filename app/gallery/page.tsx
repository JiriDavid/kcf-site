import SectionHeader from "../components/section-header";
import GalleryGrid from "../components/gallery-grid";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { ArrowUpRight, Send } from "lucide-react";

export default function GalleryPage() {
  const telegramUrl =
    process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL ||
    "https://t.me/kiitchristianfellowship";

  return (
    <div className="section-shell pb-16">
      <div className="container space-y-10 pt-8 lg:pt-0">
        <SectionHeader
          eyebrow="Gallery"
          title="Stories in color and light"
          description="Moments from gatherings, prayer walks, celebrations, and sunday services."
          align="center"
        />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">
              Complete archive
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              View every fellowship moment on Telegram
            </h3>
            <p className="mt-2 text-sm text-white/70">
              The full image archive and latest media updates are published on
              our channel first.
            </p>
            <div className="mt-4">
              <Button asChild variant="secondary" className="inline-flex gap-2">
                <Link href={telegramUrl} target="_blank" rel="noreferrer">
                  <Send className="h-4 w-4" /> Open Telegram Channel
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">
              Curated here
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              Handpicked highlights
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Explore featured images below by category with a refined, faster
              browsing experience.
            </p>
          </div>
        </div>

        <GalleryGrid />
      </div>
    </div>
  );
}

import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, Youtube, Send } from "lucide-react";
const socials = [
  { href: "https://instagram.com", icon: <Instagram className="h-4 w-4" />, label: "Instagram" },
  { href: "https://telegram.org", icon: <Send className="h-4 w-4" />, label: "Telegram" },
  { href: "mailto:hello@kcf.org", icon: <Mail className="h-4 w-4" />, label: "Email" },
  { href: "tel:+15551213344", icon: <Phone className="h-4 w-4" />, label: "Phone" },
 
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="container grid gap-10 py-10 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-primary">KCF Fellowship</p>
          <h3 className="text-2xl font-semibold text-white">Worship. Grow. Impact.</h3>
          <p className="text-sm text-white">
            A worship-inspired community practicing presence, building disciples, and sending leaders to every sphere.
          </p>
          <div className="flex gap-3">
            {socials.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:-translate-y-1 hover:border-primary hover:text-primary"
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3 space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Navigate</h4>
          <div className="flex flex-col gap-2 text-sm text-white">
            {[
              ["About", "/about"],
              ["Sermons", "/sermons"],
              ["Events", "/events"],
              ["Gallery", "/gallery"],
              ["Contact", "/contact"]
            ].map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-primary text-white">
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Visit</h4>
          <p className="text-sm text-white">
            Sundays · 09:30 AM<br />
            D Block · Campus 3
          </p>
          <p className="text-sm text-white">
            Midweek Intercession · Wednesdays 5:00 PM
          </p>
          <p className="text-xs text-foreground/50">Cloudflare R2 placeholders for all media links are configured for future integration.</p>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-white">© {new Date().getFullYear()} KCF Fellowship. All rights reserved.</div>
    </footer>
  );
}

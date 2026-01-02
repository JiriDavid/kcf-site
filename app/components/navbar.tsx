"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/sermons", label: "Sermons" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" }
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all",
        scrolled ? "bg-black/80 shadow-2xl backdrop-blur-xl" : "bg-transparent"
      ) }
    >
      <div className="container flex items-center justify-between py-4 text-white">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold uppercase tracking-[0.25em]">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary shadow-glow" >
            <img src="/kcf-logo.jpeg" alt="kcf logo" className="rounded-full" />
          </div>
          <span className="text-sm">KCF Fellowship</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm uppercase tracking-[0.18em] transition hover:text-primary",
                pathname === link.href ? "text-primary" : "text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button variant="outline" size="sm" asChild>
            <Link href="/contact" className="text-white bg-gradient-to-br from-primary to-secondary hover:from-secondary hover:to-primary" >Reach Out</Link>
          </Button>
        </nav>
        <Button variant="subtle" size="icon" className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10"
          >
            <div className="container flex flex-col gap-3 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "py-2 text-base font-semibold uppercase tracking-[0.15em]",
                    pathname === link.href ? "text-primary" : "text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild variant="secondary" className="w-full">
                <Link href="/events">Upcoming Events</Link>
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

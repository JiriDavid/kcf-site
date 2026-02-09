import SectionHeader from "../components/section-header";
import ContactForm from "../components/contact-form";
import { leaders } from "@/lib/static-data";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Mail, MapPin, Phone, Send, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="space text-white">
      <section className="section-shell">
        <div className="container space-y-10 pt-8 lg:pt-0">
          <SectionHeader
            eyebrow="Contact"
            title="Reach out to KCF Fellowship"
            description="Reach our leaders, request prayer, or explore how to serve."
            align="center"
          />
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-white">
                    <Send className="h-5 w-5 text-primary" /> Send us a note
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-white">
                    <MapPin className="h-5 w-5 text-primary" /> Find us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-white">
                    Sundays 09:30 AM · D Block, Campus 3 · KIIT University
                  </p>
                  <div className="aspect-video overflow-hidden rounded-xl border border-white/10">
                    <iframe
                      title="KCF Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.730811692929!2d85.81362127523832!3d20.352736281132792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909eea94231f1%3A0x75bb3c9bf6ae2e29!2sKiit%20campus-3%20D-Block!5e0!3m2!1sen!2sin!4v1766055990490!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Leaders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-white">
                  {leaders.map((leader) => (
                    <div
                      key={leader.email}
                      className="rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <p className="text-sm uppercase tracking-[0.16em] text-primary">
                        {leader.role}
                      </p>
                      <h4 className="text-lg font-semibold text-white">
                        {leader.name}
                      </h4>
                      <div className="mt-3 space-y-2 text-sm text-foreground/70">
                        <a
                          className="flex items-center gap-2 hover:text-primary"
                          href={`tel:${leader.phone}`}
                        >
                          <Phone className="h-4 w-4" /> {leader.phone}
                        </a>
                        <a
                          className="flex items-center gap-2 hover:text-primary"
                          href={`mailto:${leader.email}`}
                        >
                          <Mail className="h-4 w-4" /> {leader.email}
                        </a>
                        <a
                          className="flex items-center gap-2 hover:text-primary"
                          href={`https://wa.me/${leader.phone.slice(1).replace(/\s+/g, '')}`} // Assuming phone is in format "+1234567890" 
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle className="h-4 w-4" /> WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Fellowship Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-white">
                    kiitchristianfellowship@gmail.com
                  </p>
                  <Button asChild variant="secondary" className="w-full">
                    <a href="mailto:kiitchristianfellowship@gmail.com">
                      Email us
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "KCF Fellowship | Worship. Grow. Impact.",
  description:
    "KCF Fellowship — Worship, Word, and Impact. Experience immersive sermons, events, and stories of faith.",
  openGraph: {
    title: "KCF Fellowship | Worship. Grow. Impact.",
    description:
      "A worship-inspired hub for sermons, gallery moments, and events.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "KCF Fellowship",
      },
    ],
  },
  metadataBase: new URL("https://kcf-fellowship.example"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} ${playfair.variable}`}
        suppressHydrationWarning
      >
        <body className="text-foreground">
          <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden>
            <BackgroundGradientAnimation
              interactive={false}
              containerClassName="h-full w-full"
            />
          </div>
          <Navbar />
          <main className="">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}

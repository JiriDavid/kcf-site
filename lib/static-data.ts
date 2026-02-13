// lib/static-data.ts - Static data that can be safely imported in client components
export type MediaType = "image" | "video";

export const DEFAULT_R2_BASE_URL = "https://r2.example.com/kcf-media";

export const R2_PLACEHOLDER =
  process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL ??
  process.env.R2_PUBLIC_BASE_URL ??
  DEFAULT_R2_BASE_URL;

export const heroSlides: {
  id: string;
  title: string;
  subtitle: string;
  mediaType: MediaType;
  src: string;
  cta?: { label: string; href: string }[];
}[] = [
  {
    id: "revival",
    title: "Worship That Moves Heaven",
    subtitle:
      "A community pursuing God's heart with passion, excellence, and unity.",
    mediaType: "image",
    src: `${R2_PLACEHOLDER}/kcf-images/praise.jpg`,
    cta: [
      { label: "About Us", href: "/about" },
      { label: "Latest Sermons", href: "/sermons" },
    ],
  },
  {
    id: "gathering",
    title: "Gather. Grow. Go.",
    subtitle:
      "Deep teaching, authentic community, and bold mission across campuses.",
    mediaType: "image",
    src: `${R2_PLACEHOLDER}/kcf-images/teaching.jpg`,
    cta: [
      { label: "Upcoming Events", href: "/events" },
      { label: "Join a Team", href: "/contact" },
    ],
  },
  {
    id: "prayer",
    title: "Prayer-Fueled Impact",
    subtitle: "Intercession that transforms hearts, cities, and the nations.",
    mediaType: "image",
    src: `${R2_PLACEHOLDER}/kcf-images/intercession-2.jpg`,
    cta: [{ label: "See the Gallery", href: "/gallery" }],
  },
];

export const stats = [
  { label: "Years of discipleship", value: 4 },
  { label: "Nationalities represented", value: 13 },
  { label: "Average monthly new members", value: 5 },
];

export const milestones = [
  {
    year: "2022",
    title: "KCF launches",
    description:
      "A handful of students gathering on campus for prayer and worship.",
  },
  {
    year: "2023",
    title: "First conference",
    description:
      "Regional convergence sparked a citywide discipleship movement.",
  },
  {
    year: "2024",
    title: "Media & missions",
    description: "Online streams and missions trips multiply the reach.",
  },
  {
    year: "2025",
    title: "R2 cloud media",
    description:
      "Cloud-native distribution for sermons, worship, and resources.",
  },
];

export const events = [
  {
    id: "e1",
    title: "Orphanage Visitation",
    date: "2025-01-12",
    location: "Living Hope Orphanage",
    description:
      "A day of joy, games, and sharing God's love with the children.",
    image:
      "https://pub-c71ef7045fff4c60aeb28ca64b9a6508.r2.dev/events/2025-orphanage-visit.jpg",
    category: "Charity",
    reviewed: true,
  },
  {
    id: "e2",
    title: "Open Sky Gathering",
    date: "2025-07-02",
    location: "Garden Library, KIIT University",
    description:
      "Joyous picnic, engaging games, and inspiring talks under the open sky.",
    image:
      "https://pub-c71ef7045fff4c60aeb28ca64b9a6508.r2.dev/events/open-sky-gathering.jpg",
    category: "Picnic",
    reviewed: true,
  },
  {
    id: "e3",
    title: "Zoo tour",
    date: "2025-08-09",
    location: "Nandankanan Zoo",
    description:
      "Exploring God's creation together with fun activities and fellowship.",
    image:
      "https://pub-c71ef7045fff4c60aeb28ca64b9a6508.r2.dev/events/zoo-tour-2.jpg",
    category: "Adventure",
    reviewed: true,
  },
  {
    id: "e4",
    title: "Christmas Celebration",
    date: "2025-12-25",
    location: "KIIT Campus 6, Banquet Hall",
    description:
      "Festive gathering with carols, drama, and a special message of hope.",
    image:
      "https://pub-c71ef7045fff4c60aeb28ca64b9a6508.r2.dev/events/congregation-christmas-4.jpg",
    category: "Christmas",
    reviewed: true,
  },
  {
    id: "e5",
    title: "Special Guest Speaker Event",
    date: "2026-03-15",
    location: "KIIT Auditorium",
    description: "An inspiring session with a special guest speaker.",
    image:
      "https://pub-c71ef7045fff4c60aeb28ca64b9a6508.r2.dev/events/1768492132020-q2ek6sh0h3.jpg",
    category: "Special Event",
    reviewed: false, // Mysterious event
  },
];

export const leaders = [
  {
    name: "Joysline Nchebi.",
    role: "Chairperson",
    phone: "+91 760 898 3468",
    email: "joaza600@gmail.com",
  },
  {
    name: "Collete.",
    role: "Administrator",
    phone: "+91 760 591 2067",
    email: " etampicollete@gmail.com",
  },
  {
    name: "Fully Johnson.",
    role: "Secretary General",
    phone: "+231 886 679 469",
    email: "fullyjohnsons19@gmail.com",
  },
];

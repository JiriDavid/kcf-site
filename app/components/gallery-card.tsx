import Image from "next/image";
import { Expand } from "lucide-react";

export type GalleryMedia = {
  id: string;
  image: string;
  title?: string;
  folder?: string;
  description?: string;
};

export default function GalleryCard({
  item,
  onClick,
}: {
  item: GalleryMedia;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative h-64 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
    >
      <Image
        src={item.image}
        alt={item.title || item.folder || "Gallery image"}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(13,173,141,0.18),transparent_40%)] opacity-0 transition group-hover:opacity-100" />
      <div className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white/90 opacity-0 backdrop-blur transition group-hover:opacity-100">
        <Expand className="h-4 w-4" />
      </div>
      <div className="absolute bottom-4 left-4 right-4 space-y-1">
        {item.folder ? (
          <p className="text-xs uppercase tracking-[0.18em] text-primary">
            {item.folder}
          </p>
        ) : null}
        {item.title ? (
          <h3 className="text-lg font-semibold text-foreground">
            {item.title}
          </h3>
        ) : null}
        {item.description ? (
          <p className="text-xs text-foreground/70 line-clamp-2">
            {item.description}
          </p>
        ) : null}
      </div>
    </button>
  );
}

import Image from "next/image";

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
      className="group relative h-64 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left shadow-card transition hover:-translate-y-2 hover:shadow-glow"
    >
      <Image
        src={item.image}
        alt={item.title || item.folder || "Gallery image"}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(13,173,141,0.18),transparent_40%)] opacity-0 transition group-hover:opacity-100" />
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

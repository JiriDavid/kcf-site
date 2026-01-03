import SectionHeader from "../components/section-header";
import GalleryGrid from "../components/gallery-grid";

export default function GalleryPage() {
  return (
    <div className="section-shell">
      <div className="container space-y-10 pt-8 lg:pt-0">
        <SectionHeader
          eyebrow="Gallery"
          title="Stories in color and light"
          description="Moments from gatherings, prayer walks, celebrations, and sunday services."
          align="center"
        />
        <GalleryGrid />
      </div>
    </div>
  );
}

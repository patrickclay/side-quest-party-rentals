import Image from "next/image";
import { ImageIcon } from "./ui/Icons";

interface GalleryImage {
  src: string;
  alt: string;
  label?: string;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
}

export function PhotoGallery({ images }: PhotoGalleryProps) {
  if (images.length === 0) return null;

  const [hero, ...thumbnails] = images;

  return (
    <div className="flex flex-col gap-3">
      {/* Hero image — full width */}
      <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden shadow-[var(--card-shadow)]">
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {hero.label && (
          <span className="absolute bottom-3 left-3 bg-navy/70 text-white text-xs font-body px-3 py-1 rounded-lg backdrop-blur-sm">
            {hero.label}
          </span>
        )}
      </div>

      {/* Thumbnail row */}
      <div className="grid grid-cols-3 gap-3">
        {thumbnails.map((img, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-[14px] overflow-hidden shadow-[var(--card-shadow)] hover:-translate-y-1 transition-transform duration-200 cursor-pointer"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 16vw"
            />
            {img.label && (
              <span className="absolute bottom-2 left-2 bg-navy/70 text-white text-[11px] font-body px-2 py-0.5 rounded-md backdrop-blur-sm">
                {img.label}
              </span>
            )}
          </div>
        ))}

        {/* More Photos placeholder */}
        <div className="relative aspect-square rounded-[14px] border-2 border-dashed border-border-light flex flex-col items-center justify-center gap-2 text-text-secondary hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
          <ImageIcon className="w-6 h-6" />
          <span className="text-[11px] font-body">More Photos</span>
        </div>
      </div>
    </div>
  );
}

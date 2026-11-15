import Image from "next/image";
import { altOf, type Dict } from "@/lib/i18n";
import { has, img } from "@/lib/media";
import { Egg } from "@/components/Doodles";

/**
 * Photo de public/media, recadrée dans son cadre. Si le fichier n'existe pas encore (photo à prendre sur place,
 * voir assets/A-PHOTOGRAPHIER.md), un œuf au trait tient la place : aucune fausse photo.
 */
export function Pic({ src, d, sizes, className = "", priority = false, position = "center", alt }: { src: string; d: Dict; sizes: string; className?: string; priority?: boolean; position?: string; alt?: string }) {
  if (!src || !has(src))
    return (
      <div className={`flex items-center justify-center bg-pink-soft text-violet ${className}`} data-photo-slot={src || "vide"} aria-hidden="true">
        <Egg className="h-1/3 max-h-24 w-auto opacity-80" />
      </div>
    );
  const i = img(src);
  return (
    <div className={`zoom ${className}`}>
      <Image src={i.src} alt={alt ?? altOf(d, i.src)} width={i.width} height={i.height} sizes={sizes} quality={80} priority={priority} fetchPriority={priority ? "high" : undefined} className="h-full w-full object-cover" style={{ objectPosition: position }} />
    </div>
  );
}

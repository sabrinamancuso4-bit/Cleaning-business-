import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

/**
 * Wrapper around next/image. SVG placeholders are served as-is; real
 * photographs (jpg/png/webp/avif) automatically go through Next's optimiser.
 */
export function SiteImage({ className, src, alt, ...props }: ImageProps) {
  const isSvg = typeof src === "string" && src.endsWith(".svg");
  return <Image src={src} alt={alt} unoptimized={isSvg} className={cn("img-treatment object-cover", className)} {...props} />;
}

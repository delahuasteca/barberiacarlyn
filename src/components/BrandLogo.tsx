import Image from "next/image";

export default function BrandLogo({ className = "", preload = false }: { className?: string; preload?: boolean }) {
  return <Image src="/logo-rojo-carlyn.png" alt="Carlyn Barbería" width={395} height={101} preload={preload} className={`h-auto object-contain ${className}`} />;
}

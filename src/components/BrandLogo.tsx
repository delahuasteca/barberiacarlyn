import Image from "next/image";

export default function BrandLogo({ className = "", preload = false }: { className?: string; preload?: boolean }) {
  return <Image src="/carlyn-logo.png" alt="Carlyn Barbería" width={383} height={101} preload={preload} className={`h-auto object-contain ${className}`} />;
}

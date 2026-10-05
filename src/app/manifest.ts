import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Barbería Carlyn",
    short_name: "Carlyn",
    description: "Barbería Carlyn en Huejutla de Reyes, Hidalgo.",
    start_url: "/",
    display: "standalone",
    background_color: "#16110D",
    theme_color: "#C8A45A",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

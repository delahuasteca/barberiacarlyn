import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: "https://www.barberiacarlyn.com",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.barberiacarlyn.com/barberia-huejutla-aviacion-civil",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://www.barberiacarlyn.com/barberia-huejutla-ex-glorieta",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://www.barberiacarlyn.com/barber-studio-jacarandas-huejutla",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}

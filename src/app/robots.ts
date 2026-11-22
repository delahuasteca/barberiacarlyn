import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/propietario"],
    },
    sitemap: "https://www.barberiacarlyn.com/sitemap.xml",
  };
}

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/home/", "/api/"],
    },
    sitemap: "https://reverienote.vercel.app/sitemap.xml",
  };
}
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://reverienote.vercel.app", lastModified: new Date(), priority: 1 },
    { url: "https://reverienote.vercel.app/privacy", lastModified: new Date(), priority: 0.5 },
  ];
}
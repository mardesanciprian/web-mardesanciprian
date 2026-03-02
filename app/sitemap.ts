import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://mardesanciprian.org/",
      lastModified: new Date(),
    },
    {
      url: "https://mardesanciprian.org/gl/asociacion",
      lastModified: new Date(),
    },
    {
      url: "https://mardesanciprian.org/gl/hazte-socio",
      lastModified: new Date(),
    },
    {
      url: "https://mardesanciprian.org/gl/merchandising",
      lastModified: new Date(),
    },
    {
      url: "https://mardesanciprian.org/es/asociacion",
      lastModified: new Date(),
    },
    {
      url: "https://mardesanciprian.org/es/hazte-socio",
      lastModified: new Date(),
    },
    {
      url: "https://mardesanciprian.org/es/merchandising",
      lastModified: new Date(),
    },
  ];
}
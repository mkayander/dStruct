import type { GetServerSideProps } from "next";

import { db } from "#/server/db/client";
import { escapeXmlText, SITE_ORIGIN } from "#/shared/lib/seo";

/**
 * Dynamic sitemap at `/sitemap.xml`: lists the home page, daily and playground entry,
 * and all public playground projects. URLs are XML-escaped for safe `<loc>` values.
 */
type ProjectForSitemap = {
  slug: string;
  updatedAt: string;
};

/** Formats a date as `YYYY-MM-DD` for sitemap `lastmod` (date-only is widely accepted). */
function formatLastmod(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0] ?? "";
}

/**
 * Full absolute URL for sitemap XML, with special characters escaped for text content.
 *
 * @param pathname - `""` or `"/"` for home; otherwise path after origin, e.g. `"/daily"`.
 */
function absoluteLoc(pathname: string): string {
  const path =
    pathname === "" || pathname === "/"
      ? ""
      : pathname.startsWith("/")
        ? pathname
        : `/${pathname}`;
  return escapeXmlText(`${SITE_ORIGIN}${path}`);
}

/** Builds the complete `urlset` XML document for public crawlable URLs. */
function generateSiteMap(projects: ProjectForSitemap[]) {
  const now = formatLastmod(new Date());
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${absoluteLoc("")}</loc>
       <lastmod>${now}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${absoluteLoc("/daily")}</loc>
       <lastmod>${now}</lastmod>
       <changefreq>daily</changefreq>
       <priority>0.85</priority>
     </url>
     <url>
       <loc>${absoluteLoc("/playground")}</loc>
       <lastmod>${now}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.9</priority>
     </url>
     ${projects
       .map(({ slug, updatedAt }) => {
         const lastmod = formatLastmod(updatedAt);
         return `
     <url>
       <loc>${absoluteLoc(`/playground/${slug}`)}</loc>
       <lastmod>${lastmod}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

/** Placeholder page component; response body is written in `getServerSideProps`. */
function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const projects = await db.playgroundProject.findMany({
    where: { isPublic: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(projects);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;

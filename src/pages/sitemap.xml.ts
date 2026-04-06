import type { GetServerSideProps } from "next";

import { db } from "#/server/db/client";

const BASE_URL = "https://dstruct.pro";

type ProjectForSitemap = {
  slug: string;
  updatedAt: string;
};

function formatLastmod(date: Date | string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return parsedDate.toISOString().split("T")[0] ?? "";
}

function generateSiteMap(projects: ProjectForSitemap[]) {
  const now = formatLastmod(new Date());
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${BASE_URL}</loc>
       <lastmod>${now}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${BASE_URL}/playground</loc>
       <lastmod>${now}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.9</priority>
     </url>
     ${projects
       .map(({ slug, updatedAt }) => {
         const lastmod = formatLastmod(updatedAt);
         return `
     <url>
       <loc>${BASE_URL}/playground/${slug}</loc>
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

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // We make an API call to gather the URLs for our site
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

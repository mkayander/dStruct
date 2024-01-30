import type { PlaygroundProject } from "@prisma/client";
import type { GetServerSideProps } from "next";

import { prisma } from "#/server/db/client";

function generateSiteMap(projects: Partial<PlaygroundProject>[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>https://dstruct.app</loc>
     </url>
     <url>
       <loc>https://dstruct.app/playground</loc>
     </url>
     ${projects
       .map(({ slug }) => {
         return `
       <url>
           <loc>${`https://dstruct.app/playground/${slug}`}</loc>
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
  const projects = await prisma.playgroundProject.findMany({
    select: {
      slug: true,
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

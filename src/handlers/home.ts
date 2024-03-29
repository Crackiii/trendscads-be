import { Request, Response } from "express";
import _ from "lodash";
import { getPrismaClient } from "../client";
const prisma = getPrismaClient();

const createObject = (data: unknown, pick: number, type: string) => {
  const obj: {[key: string]: unknown} = {};

  Object.entries(data)
  .forEach(([key, value]) => {
    obj[key] = (value as unknown[])
                .slice(0, pick)
                .map(a => ({...(a as Record<string, unknown>), type}));
  });

  return obj;
};

export const homeHandler = async (
  req: Request,
  res: Response
) => {
  try{
    const country = req.query.country ?  String(req.query.country) : "US";

    const isAvailable = await prisma.countries.findFirst({
      where: {
        country_code: country
      }
    });

    const [articles_realtime, articles_daily, videos, links] = await Promise.all([
      prisma.google_realtime.findMany({
        where: {
          country: isAvailable.google_realtime === "true" ? country : "US"
        },
        distinct: "url",
        orderBy: {
          created_at: "desc"
        },
      }),
      prisma.google_daily.findMany({
        where: {
          country: isAvailable.google_daily === "true" ? country : "US"
        },
        distinct: "url",
        orderBy: {
          created_at: "desc"
        },
      }),
      prisma.youtube.findMany({
        where: {
          country: isAvailable.youtube === "true" ? country : "US",
          url: {
            startsWith: "/watch?v="
          }
        },
        distinct: "url",
        orderBy: {
          created_at: "desc"
        },
      }),
      prisma.duckduckgo.findMany({
        where: {
          country: isAvailable.duckduckgo === "true" ? country : "US"
        },
        distinct: "url",
        orderBy: {
          created_at: "desc"
        },
      })
    ]);

    const articlesRealtimeGroups = createObject(_.groupBy(articles_realtime, "category"), 8, "article");
    const videosGroups = createObject(_.groupBy(videos, "category"), 8, "video");
    const linksGroups = createObject(_.groupBy(links, "category"), 8, "search");
  
    const articles_daily_sliced =  [
      ...articles_daily.slice(0, 8)
        .map(a => ({...a, type: "article"}))
    ];

    res.status(200).json({
      results: {
        articles: articlesRealtimeGroups,
        daily_articles: articles_daily_sliced.length === 0 ? _.reverse(articles_realtime).slice(0, 8) : articles_daily_sliced,
        videos: videosGroups,
        links: linksGroups,
        queries: _.uniq([...articles_realtime, ...articles_daily].map(article => article.related_queries.split(",").slice(0, 3)).flatMap(a => a))
      }
    });
    
  } catch(error) {
    res.status(200).json({
      results: {
        articles: [],
        videos: [],
        links: [],
        queries: []
      }
    });
    console.log({ error });
  }
};

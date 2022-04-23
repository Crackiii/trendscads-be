import { Request, Response } from "express";
import _ from "lodash";
import { getPrismaClient } from "../client";
const prisma = getPrismaClient();

export const homeHandler = async (
  req: Request,
  res: Response
) => {
  try{
    const query = {
      where: {
        country: "DE"
      }
    };
    const [articles_realtime, articles_daily, videos, links] = await Promise.all([
      prisma.google_realtime.findMany({
        ...query,
        orderBy: {
          created_at: "desc"
        },
      }),
      prisma.google_daily.findMany({
        ...query,
        orderBy: {
          created_at: "desc"
        },
      }),
      prisma.youtube.findMany({
        where: {
          country: "DE",
          url: {
            contains: "watch"
          }
        },
        orderBy: {
          created_at: "desc"
        },
      }),
      prisma.duckduckgo.findMany({
        ...query,
        orderBy: {
          created_at: "desc"
        },
        
      })
    ]);
    const articlesRealtimeGroups = _.groupBy(articles_realtime, "category");
    const videosGroups = _.groupBy(videos, "category");
    const linkssGroups = _.groupBy(links, "category");
  
    const articles_realtime_sliced: {[key: string]: unknown} = {};
    Object.entries(articlesRealtimeGroups)
    .forEach(([key, value]) => {
      articles_realtime_sliced[key] = value.slice(0, 8).map(a => ({...a, type: "article"}));
    });

    const articles_daily_sliced =  [
      ...articles_daily.slice(0, 8)
        .map(a => ({...a, type: "article"}))
    ];

    const videos_sliced: {[key: string]: unknown} = {};
    Object.entries(videosGroups)
    .forEach(([key, value]) => {
      videos_sliced[key] = value.slice(0, 8).map(a => ({...a, type: "video"}));
    });

    const links_sliced: {[key: string]: unknown} = {};
    Object.entries(linkssGroups)
    .forEach(([key, value]) => {
      links_sliced[key] = value.slice(0, 8).map(a => ({...a, type: "link"}));
    });

    res.status(200).json({
      results: {
        articles: articles_realtime_sliced,
        daily_articles: articles_daily_sliced,
        videos: videos_sliced,
        links: links_sliced,
        queries: _.uniq([...articles_realtime, ...articles_daily].map(article => article.related_queries.split(",")).flatMap(a => a)).slice(0, 50)
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

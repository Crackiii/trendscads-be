import { Prisma } from "@prisma/client";
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
        country:  req.query.country ? String(req.query.country) : "US"
      }
    };
    const [articles_realtime, articles_daily, videos, links] = await Promise.all([
      prisma.google_realtime.findMany(query),
      prisma.google_daily.findMany(query),
      prisma.youtube.findMany(query),
      prisma.duckduckgo.findMany(query)
    ]);

    const groupedArticles = _.groupBy([...articles_realtime, ...articles_daily].map(a => ({...a, type: "article"})), "category");
    const groupedVideos = _.groupBy(videos.map(a => ({...a, type: "video"})).filter((v: Prisma.youtubeCreateInput) => /watch/.test(v.url)), "category");
    const groupedLinks =  _.groupBy(links.map(a => ({...a, type: "search"})), "category");
    const groupedQueries = _.uniq([...articles_realtime, ...articles_daily].map(article => article.related_queries.split(",")).flatMap(a => a)).slice(0, 50);

    res.status(200).json({
      results: {
        articles: groupedArticles, 
        videos: groupedVideos, 
        links: groupedLinks,
        queries: groupedQueries
      }
    });
    
  } catch(error) {
    res.status(200).json({
      results: {
        articles: [],
        videos: [],
        links: []
      }
    });
    console.log({ error });
  }
};

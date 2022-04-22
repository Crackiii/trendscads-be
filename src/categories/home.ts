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
    const [articles, videos, links] = await Promise.all([
      prisma.google.findMany(query),
      prisma.youtube.findMany(query),
      prisma.duckduckgo.findMany(query)
    ]);

    const groupedArticles = _.groupBy(articles.map((article: Prisma.googleCreateInput) => ({...article, catgory: article.category.split("-")[1].trim()})), "category");
    const groupedVideos = _.groupBy(videos.filter((v: Prisma.youtubeCreateInput) => /watch/.test(v.url)), "category");
    const groupedLinks =  _.groupBy(links, "category");
    const groupedQueries = _.uniq(articles.map(article => article.related_queries.split(",")).flatMap(a => a)).slice(0, 50);

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

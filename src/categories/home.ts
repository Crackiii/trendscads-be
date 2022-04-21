import { Request, Response } from "express";
import _ from "lodash";
import { getPrismaClient } from "../client";
const prisma = getPrismaClient();

export const homeHandler = async (
  req: Request,
  res: Response
) => {
  console.log("homeHandler");
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

    res.status(200).json({
      results: {
        articles: _.groupBy(articles.map((article: any) => ({...article, catgory: article.catgory.split("-")[1].trim()})), "catgory"), 
        videos: _.groupBy(videos.filter((v: any) => /watch/.test(v.url)), "catgory"), 
        links: _.groupBy(links, "category")} 
      }
    );
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

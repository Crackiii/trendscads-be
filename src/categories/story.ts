import axios from "axios";
import { Request, Response } from "express";
import { getPrismaClient } from "../client";
const prisma = getPrismaClient();

const getRelatedData = async (title: string) => {
  const relatedQuery: unknown = {
    where: {
      title: {
        search: title.replace(/[^a-zA-Z ]/g, "").split(" ").join(" | ")
      }
    }
  };
  const [articles, videos, search] = await Promise.all([
    prisma.google.findMany(relatedQuery),
    prisma.youtube.findMany(relatedQuery),
    prisma.duckduckgo.findMany(relatedQuery)
  ]);
  
  return {
    articles: articles.map(a => ({...a, type: "article"})),
    videos: videos.map(a => ({...a, type: "video"})),
    search: search.map(a => ({...a, type: "search"})),
  };
};

export const storyHandler = async (
  req: Request,
  res: Response
) => {
  try{
    const query = {
      where: {
        id: Number(req.query.id),
      }
    };

    switch(req.query.type) {
      case "video": {
        const video = await prisma.youtube.findFirst(query);
        const related = await getRelatedData(video.title);
        res.status(200).json({
          result: video,
          related
        });
        break;
      }
      case "article":
      case "search": {
        const article = await prisma.google.findFirst(query);
        const [website, related] = await Promise.all([
          axios.get(`https://google.trendscads.com/website?link=${article.url}`),
          getRelatedData(article.title)
        ]);
        
        res.status(200).json({
          result: website.data.result.websiteData,
          related
        });
        break;
      }
      default: {
        res.status(200).json({
          result: {},
          related: []
        });
      }
    }
    
  } catch(error) {
    res.status(200).json({
      results: {},
      related: []
    });
    console.log({ error });
  }
};

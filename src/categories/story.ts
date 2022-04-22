import axios from "axios";
import { Request, Response } from "express";
import { getPrismaClient } from "../client";
const prisma = getPrismaClient();

const getRelatedData = async (title: string) => {
  console.log("FUCK YOU BASTARD");
  try {
  const relatedQuery: unknown = {
    where: {
      title: {
        search: title.replace(/[^a-zA-Z ]/g, "").split(" ").filter(a => a.trim().length > 2).join(" | ")
      }
    }
  };
  const [articles, videos, search] = await Promise.all([
    prisma.google.findMany(relatedQuery),
    prisma.youtube.findMany(relatedQuery),
    prisma.duckduckgo.findMany(relatedQuery)
  ]);
  
  return {
    articles: articles.map(a => ({...a, type: "article"})).slice(0, 30),
    videos: videos.map(a => ({...a, type: "video"})).slice(0, 30),
    search: search.map(a => ({...a, type: "search"})).slice(0, 30),
  };
} catch(error) {
  return {
    articles: [],
    videos: [],
    search: []
  };
}
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

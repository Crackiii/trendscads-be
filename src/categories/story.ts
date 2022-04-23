import axios from "axios";
import { Request, Response } from "express";
import { getPrismaClient } from "../client";
const prisma = getPrismaClient();

const getRelatedData = async (title: string) => {

  try {
  const relatedQuery: Record<string, unknown> = {
    where: {
      title: {
        search: title.replace(/[^a-zA-Z ]/g, "").split(" ").filter(a => a.trim().length > 2).join(" | ")
      }
    }
  };
  const [articles_realtime, articles_daily, videos, search] = await Promise.all([
    prisma.google_realtime.findMany({
      ...relatedQuery,
      orderBy: {
        created_at: "desc"
      },
      take: 20
    }),
    prisma.google_daily.findMany({
      ...relatedQuery,
      orderBy: {
        created_at: "desc"
      },
      take: 20
    }),
    prisma.youtube.findMany({
      ...relatedQuery,
      orderBy: {
        created_at: "desc"
      },
      take: 20
    }),
    prisma.duckduckgo.findMany({
      ...relatedQuery,
      orderBy: {
        created_at: "desc"
      },
      take: 20
    })
  ]);
  
  return {
    articles: [...articles_realtime, ...articles_daily].map(a => ({...a, type: "article"})),
    videos: videos.map(a => ({...a, type: "video"})),
    search: search.map(a => ({...a, type: "search"})),
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
        if(!video) {
          res.status(404).send("Video not found");
          return;
        }
        const related = await getRelatedData(video.title);
        res.status(200).json({
          result: video,
          related
        });
        break;
      }
      case "article": {
        const article = await prisma.google_realtime.findFirst(query);
        if(!article) {
          res.status(404).send("Article not found");
          return;
        }
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
      case "search": {
        //TOOD: introduct another article type: realtime, daily
        const search = await prisma.duckduckgo.findFirst(query);
        if(!search) {
          res.status(404).send("Search not found");
          return;
        }
        const [website, related] = await Promise.all([
          axios.get(`https://google.trendscads.com/website?link=${search.url}`),
          getRelatedData(search.title)
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

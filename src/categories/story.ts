import axios from "axios";
import { Request, Response } from "express";
import { getPrismaClient } from "../client";
const prisma = getPrismaClient();

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
        res.status(200).json({
          result: video
        });
        break;
      }
      case "article":
      case "search": {
        const article = await prisma.google.findFirst(query);
        const data = await (await axios.get(`https://google.trendscads.com/website?link=${article.url}`)).data;
        res.status(200).json({
          result: data.result.websiteData
        });
        break;
      }
      default: {
        res.status(200).json({
          result: {}
        });
      }
    }
    
  } catch(error) {
    res.status(200).json({
      results: {}
    });
    console.log({ error });
  }
};

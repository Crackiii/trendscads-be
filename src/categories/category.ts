import { getPrismaClient } from "../client";
import { Request, Response } from "express";
const prisma = getPrismaClient();

export const categoryHandler = async (
  req: Request,
  res: Response
) =>  {
  console.log("CATEGORY HANDLER");
  try {
    const category = req.params.category;
    const country = req.query.country;

    if(!category) {
      res.status(404).send("Category not found");
      return;
    }

    const [articles_daily, articles_realtime, videos, search] = await Promise.all([
      prisma?.google_daily.findMany({
        where: {
          category: {
            contains: String(category)
          },
          country: country ? String(country) : "US"
        },
        orderBy: {
          created_at: "desc"
        },
        take: 50
      }),
      prisma?.google_realtime.findMany({
        where: {
          category: {
            contains: String(category)
          },
          country: country ? String(country) : "US"
        },
        orderBy: {
          created_at: "desc"
        },
        take: 50
      }),
      prisma?.youtube.findMany({
        where: {
          category: {
            contains: String(category)
          },
          country: country ? String(country) : "US"
        },
        orderBy: {
          created_at: "desc"
        },
        take: 50
      }),
      prisma?.duckduckgo.findMany({
        where: {
          category: {
            contains: String(category)
          },
          country: country ? String(country) : "US"
        },
        orderBy: {
          created_at: "desc"
        },
        take: 50
      }),
    ]);
  
    res.status(200).json([
      [...articles_realtime, ...articles_daily].map(a => ({...a, type: "article"})),
      videos.map(a => ({...a, type: "video"})),
      search.map(a => ({...a, type: "search"})),
    ]);
  } catch(error) {
    res.status(200).json([[], [], []]);
    console.log({ error });
  }
};

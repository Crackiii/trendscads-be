import { getPrismaClient } from "../client";
import { Request, Response } from "express";
import axios from "axios";
const prisma = getPrismaClient();

export const categoryHandler = async (
  req: Request,
  res: Response
) =>  {
  try {
    let url = "https://api.geoapify.com/v1/ipinfo?apiKey=589ae61973f3443faf4b13b2f1c57ae9";
    const ip = req.ip.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/)[0] ||
               String(req.headers["x-forwarded-for"]).split(" ")[0] || 
               req.connection.remoteAddress.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/)[0] ;

    if(ip) {
      url = `https://api.geoapify.com/v1/ipinfo?ip=${ip}&apiKey=589ae61973f3443faf4b13b2f1c57ae9`;
    }

    console.log("IP ===== > : ", ip);

    const geo = await (await axios.get(url)).data;
    const category = req.params.category;
    const country = geo.country.iso_code ? geo.country.iso_code : "US";

    if(!category) {
      res.status(404).send("Category not found");
      return;
    }

    const isAvailable = await prisma.countries.findFirst({
      where: {
        country_code: String(country)
      }
    });

    const [articles_daily, articles_realtime, videos, search] = await Promise.all([
      prisma?.google_daily.findMany({
        where: {
          category: {
            contains: String(category)
          },
          country: isAvailable.google_daily === "true" ? country : "US"
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
          country: isAvailable.google_realtime === "true" ? country : "US"
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
          country: isAvailable.youtube === "true" ? country : "US"
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
          country: isAvailable.duckduckgo === "true" ? country : "US"
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

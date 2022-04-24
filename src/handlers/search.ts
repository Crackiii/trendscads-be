// import axios from "axios";
import { Request, Response } from "express";
import { getPrismaClient } from "../client";
const prisma = getPrismaClient();

export const searchHandler = async (
  req: Request,
  res: Response
) => {
  try{
    const query = String(req.query.q).replace(/[^a-zA-Z0-9 ]/g, "").split(" ").join(" | ");

    if(!query) {
      const country = req.query.country ?  String(req.query.country) : "US";

      const isAvailable = await prisma.countries.findFirst({
        where: {
          country_code: country
        }
      });

      const [articles_realtime, articles_daily, videos, search] = await Promise.all([
        prisma.google_realtime.findMany({
          where: {
            country: isAvailable.google_realtime === "true" ? country : "US",
          },
          orderBy: {
            created_at: "desc"
          },
          take: 20
        }),
        prisma.google_daily.findMany({
          where: {
            country: isAvailable.google_daily === "true" ? country : "US",
          },
          orderBy: {
            created_at: "desc"
          },
          take: 20
        }),
        prisma.youtube.findMany({
          where: {
            country: isAvailable.youtube === "true" ? country : "US",
            url: {
              startsWith: "/watch?v="
            }
          },
          distinct: "url",
          orderBy: {
            created_at: "desc"
          },
          take: 20
        }),
        prisma.duckduckgo.findMany({
          where: {
            country: isAvailable.duckduckgo === "true" ? country : "US",
          },
          orderBy: {
            created_at: "desc"
          },
          take: 20
        })
      ]);
  
      res.status(200).json({
        results: {
          articles: [...articles_realtime, ...articles_daily].map(a => ({...a, type: "article"})),
          videos: videos.map(a => ({...a, type: "video"})),
          search: search.map(a => ({...a, type: "search"})),
        }
      });

      return;
    }

    const [articles_realtime, articles_daily, videos, search] = await Promise.all([
      prisma.google_realtime.findMany({
        where: {
          title: {
            search: query,
          }
        },
        orderBy: {
          created_at: "desc"
        },
        take: 20
      }),
      prisma.google_daily.findMany({
        where: {
          title: {
            search: query,
          }
        },
        orderBy: {
          created_at: "desc"
        },
        take: 20
      }),
      prisma.youtube.findMany({
        where: {
          title: {
            search: query,
          },
          url: {
            startsWith: "/watch?v="
          }
        },
        distinct: "url",
        orderBy: {
          created_at: "desc"
        },
        take: 20
      }),
      prisma.duckduckgo.findMany({
        where: {
          title: {
            search: query,
          }
        },
        orderBy: {
          created_at: "desc"
        },
        take: 20
      })
    ]);

    res.status(200).json({
      results: {
        articles: [...articles_realtime, ...articles_daily].map(a => ({...a, type: "article"})),
        videos: videos.map(a => ({...a, type: "video"})),
        search: search.map(a => ({...a, type: "search"})),
      }
    });

  } catch(error) {
    res.status(200).json({
      results: {
        articles: [],
        videos: [],
        search: [],
      }
    });
    console.log({ error });
  }
};

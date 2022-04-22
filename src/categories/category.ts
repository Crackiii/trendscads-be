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

    const data = await Promise.all([
      prisma?.google.findMany({
        where: {
          category: {
            contains: String(category)
          },
          country: country ? String(country) : "US"
        }
      }),
      prisma?.youtube.findMany({
        where: {
          category: {
            contains: String(category)
          },
          country: country ? String(country) : "US"
        }
      }),
      prisma?.duckduckgo.findMany({
        where: {
          category: {
            contains: String(category)
          },
          country: country ? String(country) : "US"
        }
      }),
    ]);
  
    res.status(200).json(data);
  } catch(error) {
    res.status(200).json([[], [], []]);
    console.log({ error });
  }
};

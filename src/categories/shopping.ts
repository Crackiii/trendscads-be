import { getPrismaClient } from "../client";
const prisma = getPrismaClient();

export const shoppingHandler = async (
  req: any,
  res: any
) =>  {
  try {
    const data = await Promise.all([
      prisma.google.findMany({
        where: {
          catgory: {
            contains: "shopping"
          },
          country: req.query.country ? String(req.query.country) : 'US'
        }
      }),
      prisma.youtube.findMany({
        where: {
          catgory: {
            contains: "shopping"
          },
          country: req.query.country ? String(req.query.country) : 'US'
        }
      }),
      prisma.duckduckgo.findMany({
        where: {
          category: {
            contains: "shopping"
          },
          country: req.query.country ? String(req.query.country) : 'US'
        }
      }),
    ]);
  
    res.status(200).json(data);
  } catch(error) {
    res.status(500).json({ error });
  }
};

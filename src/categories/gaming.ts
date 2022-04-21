import { getPrismaClient } from "../client";
const prisma = getPrismaClient();

export const gamingHandler = async (
  req: any,
  res: any
) =>  {
  const data = await Promise.all([
    prisma.google.findMany({
      where: {
        catgory: {
          contains: "gaming"
        },
        country: req.query.country ? String(req.query.country) : 'US'
      }
    }),
    prisma.youtube.findMany({
      where: {
        catgory: {
          contains: "gaming"
        },
        country: req.query.country ? String(req.query.country) : 'US'
      }
    }),
    prisma.duckduckgo.findMany({
      where: {
        category: {
          contains: "gaming"
        },
        country: req.query.country ? String(req.query.country) : 'US'
      }
    }),
  ]);

  res.status(200).json(data);
};
import { getPrismaClient } from "../client";
const prisma = getPrismaClient();

export const foodHandler = async (
  req: any,
  res: any
) =>  {
  const data = await Promise.all([
    prisma.google.findMany({
      where: {
        catgory: {
          contains: "food"
        },
        country: req.query.country ? String(req.query.country) : "US"
      }
    }),
    prisma.youtube.findMany({
      where: {
        catgory: {
          contains: "food"
        },
        country: req.query.country ? String(req.query.country) : "US"
      }
    }),
    prisma.duckduckgo.findMany({
      where: {
        category: {
          contains: "food"
        },
        country: req.query.country ? String(req.query.country) : "US"
      }
    }),
  ]);

  res.status(200).json(data);
};

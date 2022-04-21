import { getPrismaClient } from "../client";
const prisma = getPrismaClient();

export const fashionHandler = async (
  req: any,
  res: any
) =>  {
  const data = await Promise.all([
    prisma.google.findMany({
      where: {
        catgory: {
          contains: "fashion"
        },
        country: req.query.country ? String(req.query.country) : "US"
      }
    }),
    prisma.youtube.findMany({
      where: {
        catgory: {
          contains: "fashion"
        },
        country: req.query.country ? String(req.query.country) : "US"
      }
    }),
    prisma.duckduckgo.findMany({
      where: {
        category: {
          contains: "fashion"
        },
        country: req.query.country ? String(req.query.country) : "US"
      }
    }),
  ]);

  res.status(200).json(data);
};

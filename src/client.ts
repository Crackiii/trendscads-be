/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = null;

// @ts-ignore
if (!global.prisma) {
  console.log("[PRISMA CLIENT]: Created DB connection.");
  // @ts-ignore
  global.prisma = new PrismaClient();
}
console.log("[PRISMA CLIENT]: Returning DB connection.");
// @ts-ignore
prisma = global.prisma;

export default prisma;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/ban-ts-comment */
const client_1 = require("@prisma/client");
const prisma = null;
// @ts-ignore
if (!global.prisma) {
    console.log("[PRISMA CLIENT]: Created DB connection.");
    // @ts-ignore
    global.prisma = new client_1.PrismaClient();
}
console.log("[PRISMA CLIENT]: Returning DB connection.");
// @ts-ignore
prisma = global.prisma;
exports.default = prisma;
//# sourceMappingURL=client.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClient = void 0;
const client_1 = require("@prisma/client");
let prisma = null;
const getPrismaClient = () => {
    if (!prisma) {
        console.log("[PRISMA CLIENT]: Created DB connection.");
        prisma = new client_1.PrismaClient();
    }
    console.log("[PRISMA CLIENT]: Returning DB connection.");
    return prisma;
};
exports.getPrismaClient = getPrismaClient;
//# sourceMappingURL=client.js.map
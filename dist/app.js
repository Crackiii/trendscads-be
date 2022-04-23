"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_1 = require("./categories/category");
const home_1 = require("./categories/home");
const story_1 = require("./categories/story");
const client_1 = require("./client");
const prisma = (0, client_1.getPrismaClient)();
const app = (0, express_1.default)();
app.set("port", process.env.PORT || 3006);
app.use(express_1.default.json());
app.use(function (_, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    next();
});
app.get("/", (_, res) => res.status(200).send("<h1>[Trendscads Backend] app running...</h1>"));
app.get("/health", (_, res) => res.status(200).send("Health check works"));
app.get("/home", home_1.homeHandler);
app.get("/story", story_1.storyHandler);
app.get("/categories/:category", category_1.categoryHandler);
const byDate = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (prisma === null || prisma === void 0 ? void 0 : prisma.google.findMany({
        where: {
            country: "DE",
            category: "business",
        },
        orderBy: {
            created_at: "desc"
        },
        take: 100
    }));
    console.log(data.map(a => a.id));
});
byDate();
exports.default = app;
//# sourceMappingURL=app.js.map
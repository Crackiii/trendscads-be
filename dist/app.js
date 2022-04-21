"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.set("port", process.env.PORT || 3006);
app.use(express_1.default.json());
app.use(function (_, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    next();
});
app.get("/", (_, res) => res.status(200).send("<h1>Running app</h1>"));
app.get("/health", (_, res) => res.status(200).send("Health check works"));
exports.default = app;
//# sourceMappingURL=app.js.map
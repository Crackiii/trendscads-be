import express from "express";
import { Request, Response } from "express";
import { categoryHandler } from "./categories/category";
import { homeHandler } from "./categories/home";
import { storyHandler } from "./categories/story";

const app = express();

app.set("port", process.env.PORT || 3006);
app.use(express.json());

app.use(function (_: Request, res: Response, next: () => void) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  next();
});


app.get("/", (_, res) => res.status(200).send("<h1>[Trendscads Backend] app running...</h1>"));
app.get("/health", (_, res) => res.status(200).send("Health check works"));

app.get("/home", homeHandler);
app.get("/story", storyHandler);
app.get("/categories/:category", categoryHandler);

export default app;
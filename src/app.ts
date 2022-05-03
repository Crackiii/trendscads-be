import express from "express";
import { Request, Response } from "express";
import { categoryHandler } from "./handlers/category";
import { homeHandler } from "./handlers/home";
import { searchHandler } from "./handlers/search";
import { storyHandler } from "./handlers/story";

const app = express();

app.set("port", process.env.PORT || 3006);
app.use(express.json());

app.use(function (_: Request, res: Response, next: () => void) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  next();
});

//something new
app.get("/", (_, res) => res.status(200).send("<h1>[Trendscads Backend] app running...</h1>"));
app.get("/health", (_, res) => res.status(200).send("Health check works"));

app.get("/home", homeHandler);
app.get("/story", storyHandler);
app.get("/categories/:category", categoryHandler);
app.get("/search", searchHandler);


export default app;
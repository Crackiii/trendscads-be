import express from "express";
import { businessHandler } from "./categories/business";
import { homeHandler } from "./categories/home";
import { storyHandler } from "./categories/story";
import {cryptocurrencyHandler} from "./categories/cryptocurrency";
import {cultureHandler} from "./categories/culture";
import {entertainmentHandler} from "./categories/entertainment";
import {fashionHandler} from "./categories/fashion";
import {foodHandler} from "./categories/food";
import {gamingHandler} from "./categories/gaming";
import {healthHandler} from "./categories/health";
import {jobsHandler} from "./categories/jobs";
import {learningHandler} from "./categories/learning";
import {newsHandler} from "./categories/news";
import {shoppingHandler} from "./categories/shopping";
import {sportsHandler} from "./categories/sports";
import {technologyHandler} from "./categories/technology";
import {travelHandler} from "./categories/travel";
import {trendingHandler} from "./categories/trending";
const app = express();

app.set("port", process.env.PORT || 3006);
app.use(express.json());

app.use(function (_: any, res: { setHeader: (arg0: string, arg1: string) => void; }, next: () => void) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  next();
});


app.get("/", (_, res) => res.status(200).send("<h1>[Trendscads Backend] app running...</h1>"));
app.get("/health", (_, res) => res.status(200).send("Health check works"));

app.get("/home", homeHandler);
app.get("/story", storyHandler);
app.get("/categories/business", businessHandler);
app.get("/categories/cryptocurrency", cryptocurrencyHandler);
app.get("/categories/culture", cultureHandler);
app.get("/categories/entertainment", entertainmentHandler);
app.get("/categories/fashion", fashionHandler);
app.get("/categories/food", foodHandler);
app.get("/categories/gaming", gamingHandler);
app.get("/categories/health", healthHandler);
app.get("/categories/jobs", jobsHandler);
app.get("/categories/learning", learningHandler);
app.get("/categories/news", newsHandler);
app.get("/categories/shopping", shoppingHandler);
app.get("/categories/sports", sportsHandler);
app.get("/categories/technology", technologyHandler);
app.get("/categories/travel", travelHandler);
app.get("/categories/trending", trendingHandler);

export default app;
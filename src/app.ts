import express from "express";
const app = express();

app.set("port", process.env.PORT || 3006);
app.use(express.json());

app.use(function (_: any, res: { setHeader: (arg0: string, arg1: string) => void; }, next: () => void) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  next();
});


app.get("/", (_, res) => res.status(200).send("<h1>Running app</h1>"));
app.get("/health", (_, res) => res.status(200).send("Health check works"));

export default app;
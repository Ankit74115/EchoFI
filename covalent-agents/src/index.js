import "dotenv/config";
import cors from "cors";
import express from "express";
import { Agent, ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import { ethMemecoin } from "./agents/coinAgent.js";
import { scannerAgent } from "./agents/scannerAgent.js";
import { traderAgent } from "./agents/traderAgent.js";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/zee", async (req, res) => {
  const prompt = req.body.description;
  const op = req.body.output;
  const zee = new ZeeWorkflow({
    description: prompt,
    //output: "A memecoin is created and deployed",
    output: op,
    agents: { ethMemecoin, scannerAgent, traderAgent },
  });

  const result = await ZeeWorkflow.run(zee);
  console.log(result);
  console.log("executed");
  res.send(result);
});

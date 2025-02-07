import { Agent, ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import "dotenv/config";
import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(8000, () => {
  console.log("Server is running on port 3000");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

const agent1 = new Agent({
  name: "Agent1",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4o-mini",
  },
  description: "A helpful AI assistant that can engage in conversation.",
});

const agent2 = new Agent({
  name: "Agent2",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4o-mini",
  },
  description: "A helpful AI assistant that can engage in conversation.",
});

const zee = new ZeeWorkflow({
  description: "just say hi",
  output: "Just bunch of stuff",
  agents: { agent1, agent2 },
});

app.post("/zee", async (req, res) => {
  const body = req.body;

  const zee = new ZeeWorkflow({
    description: body.description,
    output: "Just bunch of stuff",
    agents: { agent1, agent2 },
  });

  const result = await ZeeWorkflow.run(zee);
  console.log(result);
  console.log("executed");
  res.send(result);
});

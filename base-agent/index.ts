import express from "express";
import {
  AgentKit,
  CdpWalletProvider,
  wethActionProvider,
  walletActionProvider,
  erc20ActionProvider,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  pythActionProvider,
} from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();

/**
 * Validates that required environment variables are set
 */
function validateEnvironment(): void {
  const missingVars: string[] = [];
  const requiredVars = ["OPENAI_API_KEY", "CDP_API_KEY_NAME", "CDP_API_KEY_PRIVATE_KEY"];

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error("Error: Required environment variables are not set");
    missingVars.forEach(varName => console.error(`${varName}=your_${varName.toLowerCase()}_here`));
    process.exit(1);
  }

  if (!process.env.NETWORK_ID) {
    console.warn("Warning: NETWORK_ID not set, defaulting to base-sepolia testnet");
  }
}

validateEnvironment();

const WALLET_DATA_FILE = "wallet_data.txt";

/**
 * Initialize the agent with CDP Agentkit
 */
async function initializeAgent() {
  try {
    const llm = new ChatOpenAI({ model: "gpt-4o-mini" });
    let walletDataStr: string | null = null;

    if (fs.existsSync(WALLET_DATA_FILE)) {
      try {
        walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
      } catch (error) {
        console.error("Error reading wallet data:", error);
      }
    }

    const config = {
      apiKeyName: process.env.CDP_API_KEY_NAME,
      apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      cdpWalletData: walletDataStr || undefined,
      networkId: process.env.NETWORK_ID || "base-sepolia",
    };

    const walletProvider = await CdpWalletProvider.configureWithWallet(config);

    const agentkit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        wethActionProvider(),
        pythActionProvider(),
        walletActionProvider(),
        erc20ActionProvider(),
        cdpApiActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
        cdpWalletActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      ],
    });

    const tools = await getLangChainTools(agentkit);
    const memory = new MemorySaver();
    const agentConfig = { configurable: { thread_id: "CDP AgentKit Chatbot Example!" } };

    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
       You are a helpful agent that can interact on-chain using the Coinbase Developer Platform AgentKit. 
        You are empowered to interact on-chain using your tools. If you ever need funds, you can request them from 
        the faucet if you are on network ID 'base-sepolia'. If not, you can provide your wallet details and request 
        funds from the user. Before executing your first action, get the wallet details to see what network you're on. 
        If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone asks you to do 
        something you can't do with your currently available tools, you must say so, and encourage them to implement 
        it themselves using the CDP SDK + Agentkit, recommending they go to docs.cdp.coinbase.com for more information. 
        Be concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is 
        explicitly requested.

        Additionally, you have the ability to fetch real-time token prices using Pyth. 
        If a user asks for token prices, you can fetch the price from the Pyth price feed. 
        Use the correct price feed ID for the requested token and ensure the response is accurate and clear.

        Additionally, The agent should have a wallet associated to register a Basename.
When your network ID is 'base-mainnet' (also sometimes known simply as 'base'), the name must end with .base.eth, and when your network ID is 'base-sepolia', it must ends with .basetest.eth.
Do not suggest any alternatives and never try to register a Basename with another postfix. The prefix of the name must be unique so if the registration of the
Basename fails, you should prompt to try again with a more unique name.
        `,
    });

    const exportedWallet = await walletProvider.exportWallet();
    fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));

    return { agent, config: agentConfig };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error;
  }
}

const app = express();
app.use(express.json());

let agentInstance: any;
let agentConfig: any;

initializeAgent()
  .then(({ agent, config }) => {
    agentInstance = agent;
    agentConfig = config;
    console.log("Agent initialized successfully");
  })
  .catch(error => {
    console.error("Agent initialization failed:", error);
  });

/**
 * POST /chat - Handle user chat input
 */
app.post("/chat", async (req:any, res:any) => {
  try {
    if (!agentInstance) {
      return res.status(500).json({ error: "Agent is not initialized yet." });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required in request body." });
    }

    const stream = await agentInstance.stream({ messages: [new HumanMessage(message)] }, agentConfig);
    let responseText = "";

    for await (const chunk of stream) {
      if ("agent" in chunk) {
        responseText += chunk.agent.messages[0].content;
      } else if ("tools" in chunk) {
        responseText += chunk.tools.messages[0].content;
      }
    }

    res.json({ response: responseText.trim() });
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

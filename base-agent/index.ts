import {
  AgentKit,
  CdpWalletProvider,
  wethActionProvider,
  walletActionProvider,
  erc20ActionProvider,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  pythActionProvider,
  ViemWalletProvider,
} from "@coinbase/agentkit";
import { Wallet } from "@coinbase/coinbase-sdk";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as readline from "readline";
import express from "express";
import cors from "cors";

// Viem-related imports for wallet management
import { createWalletClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

dotenv.config();

/**
 * Validates that required environment variables are set
 *
 * @throws {Error} - If required environment variables are missing
 * @returns {void}
 */
function validateEnvironment(): void {
  const missingVars: string[] = [];

  // Check required variables
  const requiredVars = ["OPENAI_API_KEY", "CDP_API_KEY_NAME", "CDP_API_KEY_PRIVATE_KEY"];
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // Exit if any required variables are missing
  if (missingVars.length > 0) {
    console.error("Error: Required environment variables are not set");
    missingVars.forEach((varName) => {
      console.error(`${varName}=your_${varName.toLowerCase()}_here`);
    });
    process.exit(1);
  }

  // Warn about optional NETWORK_ID
  if (!process.env.NETWORK_ID) {
    console.warn("Warning: NETWORK_ID not set, defaulting to base-sepolia testnet");
  }
}

// Add this right after imports and before any other code
validateEnvironment();

// Configure a file to persist the agent's CDP MPC Wallet Data
const ENV_FILE = ".env";

/**
 * Update .env file with new wallet data
 *
 * @param walletData - The wallet data string to store
 */
/**
 * Update .env file with new wallet data while preserving all other variables
 *
 * @param walletData - The wallet data string to store
 */
function updateEnvFile(walletData: string): void {
  try {
    const envPath = ".env";
    const lines = fs.readFileSync(envPath, "utf8").split("\n");

    // Find the CDP_WALLET_DATA line and update it
    const cdpWalletIndex = lines.findIndex((line) => line.startsWith("CDP_WALLET_DATA="));

    if (cdpWalletIndex !== -1) {
      // Update the existing line for CDP_WALLET_DATA
      lines[cdpWalletIndex] = `CDP_WALLET_DATA=${walletData}`;
    } else {
      // Add the line for CDP_WALLET_DATA if it doesn't exist
      lines.push(`CDP_WALLET_DATA=${walletData}`);
    }

    // Filter out empty lines and join them back with newlines
    const newContent = lines.filter((line) => line.trim() !== "").join("\n") + "\n";

    fs.writeFileSync(envPath, newContent);
    console.log("Successfully updated CDP_WALLET_DATA");
  } catch (error) {
    console.error("Error updating .env file:", error);
    throw error;
  }
}

// Add this interface definition
interface ConfigureCdpAgentkitWithWalletOptions {
  apiKeyName?: string;
  apiKeyPrivateKey?: string;
  cdpWalletData?: string;
  networkId?: string;
  mnemonicPhrase?: string;
}

/**
 * Initialize the agent with CDP Agentkit
 *
 * @returns Agent executor and config
 */
async function initializeAgent() {
  try {
    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
    });

    // Create a Viem wallet client using a hardcoded private key
    const account = privateKeyToAccount(
      (process.env.PRIVATE_KEY || "") as `0x${string}` // Type assertion to match expected format
    );

    const client = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(),
    });

    // Create a wallet provider that AgentKit can use
    const walletProvider = new ViemWalletProvider(client);

    // Initialize AgentKit with the wallet provider
    const agentKit = await AgentKit.from({
      walletProvider,
    });

    // Log wallet details
    console.log("\nWallet Details:");
    console.log("- Address:", account.address);
    console.log("- Network:", baseSepolia.name);

    // Configure CDP Wallet Provider first
    const config: ConfigureCdpAgentkitWithWalletOptions = {
      apiKeyName: process.env.CDP_API_KEY_NAME,
      apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      networkId: process.env.NETWORK_ID || "base-sepolia",
      cdpWalletData: process.env.CDP_WALLET_DATA,
    };

    //const walletProvider2 = await CdpWalletProvider.configureWithWallet(config);

    // Get wallet details directly from provider
    // console.log("\nWallet Details:");
    // console.log("- Address:", walletProvider2.getAddress());
    // console.log("- Network:", walletProvider2.getNetwork());
    // console.log("- Balance:", (await walletProvider2.getBalance()).toString());
    //console.log("- Exported Data:", await walletProvider2.exportWallet());

    // Initialize AgentKit
    const agentkit = await AgentKit.from({
      walletProvider: walletProvider,
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

    // Store buffered conversation history in memory
    const memory = new MemorySaver();
    const agentConfig = { configurable: { thread_id: "CDP AgentKit Chatbot Example!" } };

    // Create React Agent using the LLM and CDP AgentKit tools
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

    return { agent, config: agentConfig };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error; // Re-throw to be handled by caller
  }
}

/**
 * Fetch real-time price data from Pyth using a specified price feed ID
 *
 * @param pyth - Pyth action provider
 * @param priceFeedID - The Pyth price feed ID to fetch the data for
 */
async function fetchPythPrice(pyth: any, priceFeedID: string) {
  try {
    const price = await pyth.fetchPrice({ priceFeedID });
    console.log(`Fetched Pyth price: ${JSON.stringify(price, null, 2)}`);
  } catch (error) {
    console.error("Error fetching Pyth price:", error);
  }
}

/**
 * Run the agent autonomously with specified intervals
 *
 * @param agent - The agent executor
 * @param config - Agent configuration
 * @param interval - Time interval between actions in seconds
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function runAutonomousMode(agent: any, config: any, pyth: any, interval = 10) {
  console.log("Starting autonomous mode...");

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // Fetch Pyth price during autonomous mode
      const priceFeedID = "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace";
      await fetchPythPrice(pyth, priceFeedID);

      const thought =
        "Be creative and do something interesting on the blockchain. " +
        "Choose an action or set of actions and execute it that highlights your abilities.";

      const stream = await agent.stream({ messages: [new HumanMessage(thought)] }, config);

      for await (const chunk of stream) {
        if ("agent" in chunk) {
          console.log(chunk.agent.messages[0].content);
        } else if ("tools" in chunk) {
          console.log(chunk.tools.messages[0].content);
        }
        console.log("-------------------");
      }

      await new Promise((resolve) => setTimeout(resolve, interval * 1000));
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      }
      process.exit(1);
    }
  }
}

// Commenting out the command line input interface
/*
async function runChatMode(agent: any, config: any) {
  console.log("Starting chat mode... Type 'exit' to end.");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> =>
    new Promise(resolve => rl.question(prompt, resolve));

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const userInput = await question("\nPrompt: ");

      if (userInput.toLowerCase() === "exit") {
        break;
      }

      const stream = await agent.stream({ messages: [new HumanMessage(userInput)] }, config);

      for await (const chunk of stream) {
        if ("agent" in chunk) {
          console.log(chunk.agent.messages[0].content);
        } else if ("tools" in chunk) {
          console.log(chunk.tools.messages[0].content);
        }
        console.log("-------------------");
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
  }
}
*/

/**
 * Choose whether to run in autonomous or chat mode based on user input
 *
 * @returns Selected mode
 */
async function chooseMode(): Promise<"chat" | "auto"> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => rl.question(prompt, resolve));

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // console.log("\nAvailable modes:");
    // console.log("1. chat    - Interactive chat mode");
    // console.log("2. auto    - Autonomous action mode");

    const choice = (await question("\nChoose a mode (enter number or name): "))
      .toLowerCase()
      .trim();

    if (choice === "1" || choice === "chat") {
      rl.close();
      return "chat";
    } else if (choice === "2" || choice === "auto") {
      rl.close();
      return "auto";
    }
    console.log("Invalid choice. Please try again.");
  }
}

/**
 * Start the chatbot agent
 */
async function main() {
  try {
    const { agent, config } = await initializeAgent();
    const mode = await chooseMode();
    if (mode === "chat") {
      //await runChatMode(agent, config);
    } else {
      //await runAutonomousMode(agent, config, agent.pythActionProvider, 10);
    }
  } catch (error) {
    console.error("Error during agent initialization:", error);
  }
}

// Create an Express application
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define the /chat endpoint
app.post("/chat", async (req: any, res: any) => {
  const userInput = req.body.message; // Fetch user input from request body

  if (!userInput) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const { agent, config } = await initializeAgent();
    const stream = await agent.stream({ messages: [new HumanMessage(userInput)] }, config);

    let responseContent = "";
    for await (const chunk of stream) {
      if ("agent" in chunk) {
        responseContent += chunk.agent.messages[0].content + "\n";
      } else if ("tools" in chunk) {
        responseContent += chunk.tools.messages[0].content + "\n";
      }
    }

    res.json({ response: responseContent.trim() }); // Send the response back
  } catch (error) {
    console.error("Error during chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server on port 4080
app.listen(4090, () => {
  console.log("Server is running on http://localhost:4090");
});

main();

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const agentkit_1 = require("@coinbase/agentkit");
const agentkit_langchain_1 = require("@coinbase/agentkit-langchain");
const messages_1 = require("@langchain/core/messages");
const langgraph_1 = require("@langchain/langgraph");
const prebuilt_1 = require("@langchain/langgraph/prebuilt");
const openai_1 = require("@langchain/openai");
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const readline = __importStar(require("readline"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Viem-related imports for wallet management
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const accounts_1 = require("viem/accounts");
dotenv.config();
/**
 * Validates that required environment variables are set
 *
 * @throws {Error} - If required environment variables are missing
 * @returns {void}
 */
function validateEnvironment() {
    const missingVars = [];
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
function updateEnvFile(walletData) {
    try {
        const envPath = ".env";
        const lines = fs.readFileSync(envPath, "utf8").split("\n");
        // Find the CDP_WALLET_DATA line and update it
        const cdpWalletIndex = lines.findIndex((line) => line.startsWith("CDP_WALLET_DATA="));
        if (cdpWalletIndex !== -1) {
            // Update the existing line for CDP_WALLET_DATA
            lines[cdpWalletIndex] = `CDP_WALLET_DATA=${walletData}`;
        }
        else {
            // Add the line for CDP_WALLET_DATA if it doesn't exist
            lines.push(`CDP_WALLET_DATA=${walletData}`);
        }
        // Filter out empty lines and join them back with newlines
        const newContent = lines.filter((line) => line.trim() !== "").join("\n") + "\n";
        fs.writeFileSync(envPath, newContent);
        console.log("Successfully updated CDP_WALLET_DATA");
    }
    catch (error) {
        console.error("Error updating .env file:", error);
        throw error;
    }
}
/**
 * Initialize the agent with CDP Agentkit
 *
 * @returns Agent executor and config
 */
function initializeAgent() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const llm = new openai_1.ChatOpenAI({
                model: "gpt-4o-mini",
            });
            // Create a Viem wallet client using a hardcoded private key
            const account = (0, accounts_1.privateKeyToAccount)((process.env.PRIVATE_KEY || "") // Type assertion to match expected format
            );
            const client = (0, viem_1.createWalletClient)({
                account,
                chain: chains_1.baseSepolia,
                transport: (0, viem_1.http)(),
            });
            // Create a wallet provider that AgentKit can use
            const walletProvider = new agentkit_1.ViemWalletProvider(client);
            // Initialize AgentKit with the wallet provider
            const agentKit = yield agentkit_1.AgentKit.from({
                walletProvider,
            });
            // Log wallet details
            console.log("\nWallet Details:");
            console.log("- Address:", account.address);
            console.log("- Network:", chains_1.baseSepolia.name);
            // Configure CDP Wallet Provider first
            const config = {
                apiKeyName: process.env.CDP_API_KEY_NAME,
                apiKeyPrivateKey: (_a = process.env.CDP_API_KEY_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, "\n"),
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
            const agentkit = yield agentkit_1.AgentKit.from({
                walletProvider: walletProvider,
                actionProviders: [
                    (0, agentkit_1.wethActionProvider)(),
                    (0, agentkit_1.pythActionProvider)(),
                    (0, agentkit_1.walletActionProvider)(),
                    (0, agentkit_1.erc20ActionProvider)(),
                    (0, agentkit_1.cdpApiActionProvider)({
                        apiKeyName: process.env.CDP_API_KEY_NAME,
                        apiKeyPrivateKey: (_b = process.env.CDP_API_KEY_PRIVATE_KEY) === null || _b === void 0 ? void 0 : _b.replace(/\\n/g, "\n"),
                    }),
                    (0, agentkit_1.cdpWalletActionProvider)({
                        apiKeyName: process.env.CDP_API_KEY_NAME,
                        apiKeyPrivateKey: (_c = process.env.CDP_API_KEY_PRIVATE_KEY) === null || _c === void 0 ? void 0 : _c.replace(/\\n/g, "\n"),
                    }),
                ],
            });
            const tools = yield (0, agentkit_langchain_1.getLangChainTools)(agentkit);
            // Store buffered conversation history in memory
            const memory = new langgraph_1.MemorySaver();
            const agentConfig = { configurable: { thread_id: "CDP AgentKit Chatbot Example!" } };
            // Create React Agent using the LLM and CDP AgentKit tools
            const agent = (0, prebuilt_1.createReactAgent)({
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
        }
        catch (error) {
            console.error("Failed to initialize agent:", error);
            throw error; // Re-throw to be handled by caller
        }
    });
}
/**
 * Fetch real-time price data from Pyth using a specified price feed ID
 *
 * @param pyth - Pyth action provider
 * @param priceFeedID - The Pyth price feed ID to fetch the data for
 */
function fetchPythPrice(pyth, priceFeedID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const price = yield pyth.fetchPrice({ priceFeedID });
            console.log(`Fetched Pyth price: ${JSON.stringify(price, null, 2)}`);
        }
        catch (error) {
            console.error("Error fetching Pyth price:", error);
        }
    });
}
/**
 * Run the agent autonomously with specified intervals
 *
 * @param agent - The agent executor
 * @param config - Agent configuration
 * @param interval - Time interval between actions in seconds
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function runAutonomousMode(agent_1, config_1, pyth_1) {
    return __awaiter(this, arguments, void 0, function* (agent, config, pyth, interval = 10) {
        var _a, e_1, _b, _c;
        console.log("Starting autonomous mode...");
        // eslint-disable-next-line no-constant-condition
        while (true) {
            try {
                // Fetch Pyth price during autonomous mode
                const priceFeedID = "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace";
                yield fetchPythPrice(pyth, priceFeedID);
                const thought = "Be creative and do something interesting on the blockchain. " +
                    "Choose an action or set of actions and execute it that highlights your abilities.";
                const stream = yield agent.stream({ messages: [new messages_1.HumanMessage(thought)] }, config);
                try {
                    for (var _d = true, stream_1 = (e_1 = void 0, __asyncValues(stream)), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _d = true) {
                        _c = stream_1_1.value;
                        _d = false;
                        const chunk = _c;
                        if ("agent" in chunk) {
                            console.log(chunk.agent.messages[0].content);
                        }
                        else if ("tools" in chunk) {
                            console.log(chunk.tools.messages[0].content);
                        }
                        console.log("-------------------");
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                yield new Promise((resolve) => setTimeout(resolve, interval * 1000));
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Error:", error.message);
                }
                process.exit(1);
            }
        }
    });
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
function chooseMode() {
    return __awaiter(this, void 0, void 0, function* () {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));
        // eslint-disable-next-line no-constant-condition
        while (true) {
            // console.log("\nAvailable modes:");
            // console.log("1. chat    - Interactive chat mode");
            // console.log("2. auto    - Autonomous action mode");
            const choice = (yield question("\nChoose a mode (enter number or name): "))
                .toLowerCase()
                .trim();
            if (choice === "1" || choice === "chat") {
                rl.close();
                return "chat";
            }
            else if (choice === "2" || choice === "auto") {
                rl.close();
                return "auto";
            }
            console.log("Invalid choice. Please try again.");
        }
    });
}
/**
 * Start the chatbot agent
 */
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { agent, config } = yield initializeAgent();
            const mode = yield chooseMode();
            if (mode === "chat") {
                //await runChatMode(agent, config);
            }
            else {
                //await runAutonomousMode(agent, config, agent.pythActionProvider, 10);
            }
        }
        catch (error) {
            console.error("Error during agent initialization:", error);
        }
    });
}
// Create an Express application
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Define the /chat endpoint
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_2, _b, _c;
    const userInput = req.body.message; // Fetch user input from request body
    if (!userInput) {
        return res.status(400).json({ error: "Message is required" });
    }
    try {
        const { agent, config } = yield initializeAgent();
        const stream = yield agent.stream({ messages: [new messages_1.HumanMessage(userInput)] }, config);
        let responseContent = "";
        try {
            for (var _d = true, stream_2 = __asyncValues(stream), stream_2_1; stream_2_1 = yield stream_2.next(), _a = stream_2_1.done, !_a; _d = true) {
                _c = stream_2_1.value;
                _d = false;
                const chunk = _c;
                if ("agent" in chunk) {
                    responseContent += chunk.agent.messages[0].content + "\n";
                }
                else if ("tools" in chunk) {
                    responseContent += chunk.tools.messages[0].content + "\n";
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = stream_2.return)) yield _b.call(stream_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        res.json({ response: responseContent.trim() }); // Send the response back
    }
    catch (error) {
        console.error("Error during chat:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
// Start the server on port 4080
app.listen(4090, () => {
    console.log("Server is running on http://localhost:4090");
});
main();

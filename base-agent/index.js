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
const express_1 = __importDefault(require("express"));
const agentkit_1 = require("@coinbase/agentkit");
const agentkit_langchain_1 = require("@coinbase/agentkit-langchain");
const messages_1 = require("@langchain/core/messages");
const langgraph_1 = require("@langchain/langgraph");
const prebuilt_1 = require("@langchain/langgraph/prebuilt");
const openai_1 = require("@langchain/openai");
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const cors_1 = __importDefault(require("cors"));
dotenv.config();
/**
 * Validates that required environment variables are set
 */
function validateEnvironment() {
    const missingVars = [];
    const requiredVars = ["OPENAI_API_KEY", "CDP_API_KEY_NAME", "CDP_API_KEY_PRIVATE_KEY"];
    requiredVars.forEach((varName) => {
        if (!process.env[varName]) {
            missingVars.push(varName);
        }
    });
    if (missingVars.length > 0) {
        console.error("Error: Required environment variables are not set");
        missingVars.forEach((varName) => console.error(`${varName}=your_${varName.toLowerCase()}_here`));
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
function initializeAgent() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const llm = new openai_1.ChatOpenAI({ model: "gpt-4o-mini" });
            let walletDataStr = null;
            if (fs.existsSync(WALLET_DATA_FILE)) {
                try {
                    walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
                }
                catch (error) {
                    console.error("Error reading wallet data:", error);
                }
            }
            const config = {
                apiKeyName: process.env.CDP_API_KEY_NAME,
                apiKeyPrivateKey: (_a = process.env.CDP_API_KEY_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, "\n"),
                cdpWalletData: walletDataStr || undefined,
                networkId: process.env.NETWORK_ID || "base-sepolia",
            };
            const walletProvider = yield agentkit_1.CdpWalletProvider.configureWithWallet(config);
            const agentkit = yield agentkit_1.AgentKit.from({
                walletProvider,
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
            const memory = new langgraph_1.MemorySaver();
            const agentConfig = { configurable: { thread_id: "CDP AgentKit Chatbot Example!" } };
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
            const exportedWallet = yield walletProvider.exportWallet();
            fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));
            return { agent, config: agentConfig };
        }
        catch (error) {
            console.error("Failed to initialize agent:", error);
            throw error;
        }
    });
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
let agentInstance;
let agentConfig;
initializeAgent()
    .then(({ agent, config }) => {
    agentInstance = agent;
    agentConfig = config;
    console.log("Agent initialized successfully");
})
    .catch((error) => {
    console.error("Agent initialization failed:", error);
});
/**
 * POST /chat - Handle user chat input
 */
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        if (!agentInstance) {
            return res.status(500).json({ error: "Agent is not initialized yet." });
        }
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required in request body." });
        }
        const stream = yield agentInstance.stream({ messages: [new messages_1.HumanMessage(message)] }, agentConfig);
        let responseText = "";
        try {
            for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _d = true) {
                _c = stream_1_1.value;
                _d = false;
                const chunk = _c;
                if ("agent" in chunk) {
                    responseText += chunk.agent.messages[0].content;
                }
                else if ("tools" in chunk) {
                    responseText += chunk.tools.messages[0].content;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        res.json({ response: responseText.trim() });
    }
    catch (error) {
        console.error("Error processing chat:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

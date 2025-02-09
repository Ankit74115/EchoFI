import dotenv from "dotenv";
import { erc20 } from "@openzeppelin/wizard";
import axios from "axios";
dotenv.config();
import fs from "fs";
import path from "path";
import solc from "solc";
import url from "url";

const TWEET_MAX_TIME_MS = 24 * 60 * 60 * 1000;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createContract(name, symbol) {
  const contract = erc20.print({
    name: name.trim(),
    symbol: symbol.trim(),
    mintable: true,
    permit: true,
    burnable: true,
    pausable: true,
    votes: true,
    flashmint: true,
    snapshots: true,
    premint: "1000000000",
    roles: true,
  });

  const folderPath = path.join(process.cwd(), "generated_contracts");
  const filePath = path.join(folderPath, `memecoin.sol`);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  fs.writeFileSync(filePath, contract, { flag: "w" });

  if (!fs.existsSync(filePath)) {
    throw new Error("Contract file creation failed.");
  }

  console.log(`Smart contract saved at: ${filePath}`);

  const contractContent = fs.readFileSync(filePath, "utf-8");
  return contractContent;
}

async function getSingleTweet(userId) {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://twitter241.p.rapidapi.com/user-tweets?user=${userId}&count=20`,
    headers: {
      "x-rapidapi-host": "twitter241.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPID_API_KEY,
    },
  };

  const response = await axios.request(config);
  const tweets = [];

  const entries =
    response.data.result.timeline.instructions.find(
      (instruction) => instruction.entries
    )?.entries || [];

  entries.forEach((entry) => {
    try {
      if (entry.content?.itemContent?.__typename === "TimelineTweet") {
        const tweetResult = entry.content.itemContent.tweet_results.result;

        tweets.push({
          contents: tweetResult.legacy.full_text,
          id: tweetResult.rest_id,
          createdAt: tweetResult.legacy.created_at,
        });
      }
    } catch (e) {
      console.error("Tweet parsing error:", e);
    }
  });

  return tweets.filter(
    (x) => new Date(x.createdAt).getTime() > Date.now() - TWEET_MAX_TIME_MS
  );
}

export async function getTrends() {
  const results = {};
  const userIds = [
    "1545317129066405893",
    "1354400126857605121",
    "1591438878350589954",
  ];

  for (const userId of userIds) {
    await delay(1000); // Rate limiting
    try {
      const tweets = await getSingleTweet(userId);
      results[userId] = tweets;
    } catch (error) {
      console.error(`Error fetching tweets for user ${userId}:`, error.message);
      results[userId] = { error: "Failed to fetch tweets" };
    }
  }

  return JSON.stringify(results);
}

// export function compileContract(name) {
//   const contractPath = "./generated_contracts/memecoin.sol";
//   const source = fs.readFileSync(contractPath, "utf8");

//   const input = {
//     language: "Solidity",
//     sources: {
//       "memecoin.sol": { content: source },
//     },
//     settings: { outputSelection: { "": { "": ["abi", "evm.bytecode"] } } },
//   };

//   const output = JSON.parse(solc.compile(JSON.stringify(input)));
//   console.log(output);

//   const contractName = name;
//   const abi = output.contracts["memecoin.sol"][contractName].abi;
//   const bytecode =
//     output.contracts["memecoin.sol"][contractName].evm.bytecode.object;

//   // Save ABI and Bytecode
//   fs.writeFileSync("MemecoinABI.json", JSON.stringify(abi, null, 2));
//   fs.writeFileSync("MemecoinBytecode.bin", bytecode);

//   console.log("Compilation successful! ABI and Bytecode saved.");
// }

export function compileContract() {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const contractPath = path.join(
    __dirname,
    "../../generated_contracts/memecoin.sol"
  );

  if (!fs.existsSync(contractPath)) {
    console.error("Contract file not found at:", contractPath);
    return;
  }

  const source = fs.readFileSync(contractPath, "utf8");

  const input = {
    language: "Solidity",
    sources: {
      "memecoin.sol": { content: source },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
    },
  };

  try {
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (!output.contracts || !output.contracts["memecoin.sol"]) {
      console.error("Compilation failed:", output.errors || "Unknown error");
      return;
    }

    const contract = output.contracts["memecoin.sol"];
    const contractName = Object.keys(contract)[0]; // Get contract name dynamically
    const abi = contract[contractName].abi;
    const bytecode = contract[contractName].evm.bytecode.object;

    // Save ABI and Bytecode
    fs.writeFileSync(
      path.join(__dirname, "MemecoinABI.json"),
      JSON.stringify(abi, null, 2)
    );
    fs.writeFileSync(path.join(__dirname, "MemecoinBytecode.bin"), bytecode);

    console.log("✅ Compilation successful! ABI and Bytecode saved.");
  } catch (error) {
    console.error("❌ Compilation error:", error);
  }
}

// compileContract();

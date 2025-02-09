import dotenv from "dotenv";
import { erc20 } from "@openzeppelin/wizard";
import axios from "axios";
dotenv.config();
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import hre from "hardhat";

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

  const folderPath = path.join(process.cwd(), "contracts");
  const filePath = path.join(folderPath, `${name}.sol`);

  fs.writeFileSync(filePath, contract, { flag: "w" });

  console.log(`Smart contract saved at: ${filePath}`);

  const contractContent = fs.readFileSync(filePath, "utf-8");
  // Compile contract using Hardhat
  try {
    execSync("npx hardhat compile", { stdio: "inherit" });
    console.log("Compilation successful.");
  } catch (error) {
    console.error("Compilation failed:", error);
    return;
  }

  try {
    const [deployer] = await hre.ethers.getSigners();
    const initialOwner = deployer.address;
    const recipient = deployer.address;

    console.log("Deploying contract with owner:", initialOwner);
    console.log("Minting tokens to:", recipient);

    const meme = await hre.ethers.getContractFactory(name);
    const contract = await meme.deploy(initialOwner, recipient);

    await contract.waitForDeployment();
    console.log("Contract deployed to:", await contract.getAddress());

    cleanUpArtifacts();

    return contract;
  } catch (error) {
    console.error("Deployment failed:", error);
  }

  return contractContent;
}

function cleanUpArtifacts() {
  try {
    console.log("Cleaning up compiled artifacts...");
    execSync("rm -rf artifacts cache", { stdio: "inherit" });
    console.log("Artifacts removed successfully.");
  } catch (error) {
    console.error("Failed to remove artifacts:", error);
  }
}

// console.log(await createContract("Pepecoin", "$PEPE"));

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
    "794340244967538689",
    "5695632",
    "312230865",
    "1289342590299512832",
    "721155330",
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

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL, // Infura, Alchemy, or other provider
      accounts: [process.env.ETH_PRIVATE_KEY], // Your wallet private key
    },
  },
};

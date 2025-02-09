import hre from "hardhat";

async function main(name) {
  const [deployer] = await hre.ethers.getSigners();

  const initialOwner = deployer.address;
  const recipient = deployer.address;

  console.log("Deploying contract with owner:", initialOwner);
  console.log("Minting tokens to:", recipient);

  const meme = await hre.ethers.getContractFactory(name);
  const contract = await meme.deploy(initialOwner, recipient);

  await contract.waitForDeployment();
  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch(console.error);

main("GigaPep");

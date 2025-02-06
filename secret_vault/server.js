import "dotenv/config";
import cors from "cors";
import express from "express";
import { orgConfig } from "./nillionOrgConfig.js";
import { SecretVaultWrapper } from "nillion-sv-wrappers";

const port = process.env.PORT || 3000;
const SCHEMA_ID = "f6b8b4e9-f858-40d3-84cc-4f199978ef61";

const server = express();
const collection = new SecretVaultWrapper(orgConfig.nodes, orgConfig.orgCredentials, SCHEMA_ID);

server.use(
  cors({
    origin: "*",
  })
);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.listen(port, () => {
  console.log(`Server is Running at Port ${port}`);
});

server.get("/", (req, res) => {
  res.send("Nillion Secret Vault Server");
});

server.get("/data", async (req, res) => {
  try {
    await collection.init();

    const decryptedData = await collection.readFromNodes({});
    res.send(decryptedData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

server.post("/data", async (req, res) => {
  try {
    await collection.init();

    const dataWritten = await collection.writeToNodes(req.body);
    console.log("👀 Data written to nodes:", JSON.stringify(dataWritten, null, 2));

    const newIds = [...new Set(dataWritten.map((item) => item.result.data.created).flat())];
    console.log("uploaded record ids:", newIds);

    res.send(dataWritten);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

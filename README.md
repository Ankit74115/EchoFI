# EchoFi: The DeFi AI Agent

<h4 align="center">
  <a href="https://ai.sudeepgowda.tech/">Click here to visit EchoFi Webapp</a>
</h4>


## Overview
EchoFi is an advanced AI-powered DeFi agent that interacts with users like a human, providing real-time insights into decentralized finance (DeFi) and blockchain ecosystems. It is designed to simplify and automate complex blockchain operations while offering multilingual support to onboard millions of users into Web3.

<br/>
<img width="1108" alt="Screenshot 2025-02-09 at 9 41 51 PM" src="https://github.com/user-attachments/assets/f5d9e3a0-162c-4da8-b34e-6c0e662c2aec" />

## Key Capabilities
- **Conversational AI**: Communicates with users in multiple languages, including English, Hindi, Chinese, Dutch, and more.
- **DeFi Insights**: Provides details about DeFi trends, token analytics, and market conditions.
- **Automated Trading**: Executes trades based on market trends and user commands.
- **MemeCoin Creation**: Generates and deploys memecoins dynamically.
- **Rug Check & Security Analysis**: Analyzes tokens to detect potential scams and rug pulls.
- **Blockchain Transactions**: Executes transactions on Base Network, Solana, and Ethereum, with ongoing support for additional chains.
- **Oracle & Data Fetching**: Scrapes tweets, fetches real-time blockchain data, and integrates with oracle services for decision-making.

## System Architecture
<img width="1416" alt="Screenshot 2025-02-09 at 9 37 28 PM" src="https://github.com/user-attachments/assets/90772dba-93be-4f2e-88f6-21368f97df10" />


### Workflow
1. **User Input**: The user provides input via voice or text.
2. **Processing**: The input is analyzed using OpenAI and Assembly AI.
3. **Information & Trading Execution**:
   - If the user seeks information, OpenAI fetches relevant knowledge.
   - If the user wants to execute a trade, the request is processed via Covalent and a Transaction Agent.
4. **Security & Market Analysis**:
   - Scanner Agent performs rug checks and token analysis.
   - Data sources like Rapid API (tweets, news) and oracles enhance decision-making.
5. **Transaction Execution**:
   - The Transaction Agent processes token swaps, transfers, and NFT minting across supported blockchains.
   - Private transactions are handled separately through a Private Transaction Agent.
6. **Response & Interaction**:
   - The AI agent responds via text or voice, providing real-time updates to the user.
  
## Prompts

### **1. Check Balance on Base Network**
**Prompt:**  
> What is my balance on Base Network?

**Response:**  
Performing transaction on Base Network...

**Wallet Details:**  
- **Provider:** viem_wallet_provider  
- **Address:** 0xbEF9C1f9aCb9E8252edc0B8279A4eb10bEDCc6F7  
- **Network:**  
  - **Protocol Family:** EVM  
  - **Network ID:** base-sepolia  
  - **Chain ID:** 84532  
- **ETH Balance:** 1.509100 ETH  
- **Native Balance:** 1,509,099,916,492,252,270 WEI (equivalent to 1.509100 ETH)  

Your wallet is currently on the **Base Sepolia network (base-sepolia)** with the above balances.

---

### **2. Send ETH on Base Network**
**Prompt:**  
> Send 0.0001 ETH to 0xF297fb18353F3e5E5eAe07806F93316D3848e238 on Base Network.

**Response:**  
Performing transaction on Base Network...

**Wallet Details:**  
- **Provider:** viem_wallet_provider  
- **Address:** 0xbEF9C1f9aCb9E8252edc0B8279A4eb10bEDCc6F7  
- **Network:**  
  - **Protocol Family:** EVM  
  - **Network ID:** base-sepolia  
  - **Chain ID:** 84532  
- **ETH Balance:** 1.509100 ETH  
- **Native Balance:** 1509099916492252270 WEI  

Transferred 0.0001 ETH to **0xF297fb18353F3e5E5eAe07806F93316D3848e238**.  
Transaction hash: **0x60c5eded3a9bd225ab9135d6b08ac1fa0bcd7674ca137990d50c15d1e9266793**.

---

### **3. Get Ethereum Price**
**Prompt:**  
> What is the price of Ethereum?

**Response:**  
Performing transaction on Base Network...

The latest price of Ethereum (ETH) is **$1,850.00 USD**.

---

### **4. Request ETH from Faucet**
**Prompt:**  
> Request 0.0001 ETH to my wallet on Base Network via faucet.

**Response:**  
Received ETH from the faucet.  
Transaction: [View Transaction](https://sepolia.basescan.org/tx/0xd58a2e10bdb074b525f017de753798a9a579920bc6b99138916252dcd2de20c1)  

I have successfully received **0.0001 ETH** from the faucet.

  
### Demo
[![Watch the video](https://img.youtube.com/vi/raKDcZQEwQc/0.jpg)](https://youtu.be/raKDcZQEwQc)

## Technologies Used
- **AI & NLP**: OpenAI, Assembly AI
- **Blockchain & DeFi**: Solana, Ethereum, Base Network, Covalent API
- **Data & Analytics**: Rapid API, Oracle services
- **Backend & Infrastructure**: Express Js

## Hyperbolic AVS is used for speech synthesis

<img width="827" alt="Screenshot 2025-02-09 at 11 29 11 PM" src="https://github.com/user-attachments/assets/dd692bbd-968b-40af-83f0-bddad634637e" />


## All our AI Agents are deployed to autonome

1. Covalent Agent

<img width="1374" alt="Screenshot 2025-02-09 at 11 25 50 PM" src="https://github.com/user-attachments/assets/f4fe888b-ef2c-4a64-b323-153109df35f1" />

2. Base Agent
   
<img width="950" alt="Screenshot 2025-02-09 at 11 27 20 PM" src="https://github.com/user-attachments/assets/7ced8f34-3702-4509-abb7-fb57f54778e0" />

## Future Roadmap
- **Multi-chain Support**: Expanding to additional blockchains beyond Ethereum, Solana, and Base.
- **Improved AI Models**: Enhancing AI-driven financial analysis and trading strategies.
- **Enhanced Security**: Adding more robust fraud detection mechanisms.
- **Mobile & Web Integration**: Making EchoFi accessible via mobile and web apps.

## Contribution
We welcome contributions! If you’d like to contribute, fork the repository, create a pull request, and help us build the future of AI-driven DeFi.

## License
[MIT License](./LICENSE)

## Contact
For queries and collaborations, reach out at ankitgoni7411@gmail.com


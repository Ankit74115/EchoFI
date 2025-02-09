import dotenv from "dotenv";
dotenv.config();
import {
  AddressLookupTableProgram,
  VersionedTransaction,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import bs58 from "bs58";
import axios from "axios";
import { NATIVE_MINT, getAssociatedTokenAddress } from "@solana/spl-token";
import { API_URLS } from "@raydium-io/raydium-sdk-v2";
const isV0Tx = true;
import { TRADE_AMOUNT, MAX_SLIPPAGE } from "../config.js";

const connection = new Connection(process.env.RPC_ENDPOINT);

const owner = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY));

const slippage = 5;

// export async function executeTrade(tokenAddress) {
//   // const { data } = await axios.get<{
//   //   id: string
//   //   success: boolean
//   //   data: { default: { vh: number; h: number; m: number } }
//   // }>(`${API_URLS.BASE_HOST}${API_URLS.PRIORITY_FEE}`);

//   const { swapResponse } = await axios.get(
//       `${
//         API_URLS.SWAP_HOST
//       }/compute/swap-base-in?inputMint=${NATIVE_MINT}&outputMint=${tokenAddress}&amount=${amount}&slippageBps=${
//         slippage * 100}&txVersion=V0`
//   );

//   const { swapTransactions } = await axios.post(`${API_URLS.SWAP_HOST}/transaction/swap-base-in`, {
//     computeUnitPriceMicroLamports: String(data.data.default.h),
//     swapResponse,
//     txVersion: 'V0',
//     wallet: owner.publicKey.toBase58(),
//     wrapSol: true,
//     unwrapSol: false,
//   })

//   console.log(swapTransactions)
// }

// export async function executeTrade(tokenAddress) {
//   const amount = 0.01;
//   try {
//     // Fetch priority fee
//     const { data } = await axios.get(`${API_URLS.BASE_HOST}${API_URLS.PRIORITY_FEE}`);

//     // Compute swap route
//     const { swapResponse } = await axios.get(
//       `${API_URLS.SWAP_HOST}/compute/swap-base-in?inputMint=${NATIVE_MINT}&outputMint=${tokenAddress}&amount=${amount}&slippageBps=${slippage * 100}&txVersion=V0`
//     );

//     // Execute swap transaction
//     const { swapTransactions } = await axios.post(
//       `${API_URLS.SWAP_HOST}/transaction/swap-base-in`,
//       {
//         computeUnitPriceMicroLamports: String(data.data.default.h),
//         swapResponse,
//         txVersion: "V0",
//         wallet: owner.publicKey.toBase58(),
//         wrapSol: true,
//         unwrapSol: false,
//       }
//     );

//     console.log(swapTransactions);
//     return swapTransactions;
//   } catch (error) {
//     console.error("Trade execution failed:", error.message);
//     return null;
//   }
// }

// export async function executeTrade(tokenAddress) {
//   const amount = 0.01 * LAMPORTS_PER_SOL;;
//   try {
//     // Fetch priority fee
//     const priorityFeeResponse = await axios.get(`${API_URLS.BASE_HOST}${API_URLS.PRIORITY_FEE}`);
//     const priorityFee = priorityFeeResponse.data.data.default.h;

//     // Compute swap route
//     const swapRouteResponse = await axios.get(
//       `${API_URLS.SWAP_HOST}/compute/swap-base-in?inputMint=${NATIVE_MINT}&outputMint=${tokenAddress}&amount=${amount}&slippageBps=${slippage * 100}&txVersion=V0`
//     );
//     const swapResponse = swapRouteResponse.data;

//     // Execute swap transaction
//     const swapResult = await axios.post(
//       `${API_URLS.SWAP_HOST}/transaction/swap-base-in`,
//       {
//         computeUnitPriceMicroLamports: String(priorityFee),
//         swapResponse,
//         txVersion: "V0",
//         wallet: owner.publicKey.toBase58(),
//         wrapSol: true,
//         unwrapSol: false,
//       }
//     );

//     const swapTransactions = swapResult.data;
//     console.log('Swap Transactions:', swapTransactions);

//     const ata = await getAssociatedTokenAddress(new PublicKey(tokenAddress), owner.publicKey);

//     console.log({
//         computeUnitPriceMicroLamports: String(priorityFee),
//         swapResponse,
//         txVersion: 'V0',
//         wallet: owner.publicKey.toBase58(),
//         wrapSol: true,
//         unwrapSol: false,
//         // outputMint: ata.toBase58()
//     })
//     console.log(swapTransactions)
//     const allTxBuf = swapTransactions.data.map((tx) => Buffer.from(tx.transaction, 'base64'))
//     const allTransactions = allTxBuf.map((txBuf) =>
//       isV0Tx ? VersionedTransaction.deserialize(txBuf) : Transaction.from(txBuf)
//     )

//     let idx = 0
//     for (const tx of allTransactions) {
//         idx++
//         const transaction = tx;
//         transaction.sign([owner]);

//         const txId = await connection.sendTransaction(transaction, { skipPreflight: true });

//         console.log("after sending txn");
//         const { lastValidBlockHeight, blockhash } = await connection.getLatestBlockhash({
//           commitment: 'finalized',
//         })
//         console.log(`${idx} transaction sending..., txId: ${txId}`)
//         await connection.confirmTransaction(
//           {
//             blockhash,
//             lastValidBlockHeight,
//             signature: txId,
//           },
//           'confirmed'
//         )
//         console.log(`${idx} transaction confirmed`)
//     }

//     return swapTransactions;
//   } catch (error) {
//     console.error("Trade execution failed:", error);
//     return null;
//   }
// }

export async function executeTrade(tokenAddress) {
  const amount = 0.01 * LAMPORTS_PER_SOL;

  try {
    // 🛠 Fetch priority fee
    const priorityFeeResponse = await axios.get(
      `${API_URLS.BASE_HOST}${API_URLS.PRIORITY_FEE}`
    );
    const priorityFee = priorityFeeResponse.data.data.default.h;

    // 🔄 Compute swap route
    const swapRouteResponse = await axios.get(
      `${
        API_URLS.SWAP_HOST
      }/compute/swap-base-in?inputMint=${NATIVE_MINT}&outputMint=${tokenAddress}&amount=${amount}&slippageBps=${
        slippage * 100
      }&txVersion=V0`
    );
    const swapResponse = swapRouteResponse.data;

    // 📩 Execute swap transaction
    const swapResult = await axios.post(
      `${API_URLS.SWAP_HOST}/transaction/swap-base-in`,
      {
        computeUnitPriceMicroLamports: String(priorityFee),
        swapResponse,
        txVersion: "V0",
        wallet: owner.publicKey.toBase58(),
        wrapSol: true,
        unwrapSol: false,
      }
    );

    const swapTransactions = swapResult.data;
    console.log("Swap Transactions:", swapTransactions);

    // 🏦 Get Associated Token Address (ATA)
    const ata = await getAssociatedTokenAddress(
      new PublicKey(tokenAddress),
      owner.publicKey
    );

    console.log({
      computeUnitPriceMicroLamports: String(priorityFee),
      swapResponse,
      txVersion: "V0",
      wallet: owner.publicKey.toBase58(),
      wrapSol: true,
      unwrapSol: false,
    });

    // 📦 Decode transactions
    const allTxBuf = swapTransactions.data.map((tx) =>
      Buffer.from(tx.transaction, "base64")
    );
    const allTransactions = allTxBuf.map((txBuf) =>
      isV0Tx ? VersionedTransaction.deserialize(txBuf) : Transaction.from(txBuf)
    );

    let idx = 0;
    for (const tx of allTransactions) {
      idx++;
      const transaction = tx;

      // 🛠 Fetch Address Lookup Table (ALT)
      const lookupTableKeys = transaction.message.addressTableLookups?.map(
        (lookup) => lookup.accountKey
      );
      if (lookupTableKeys && lookupTableKeys.length > 0) {
        const lookupTables = await Promise.all(
          lookupTableKeys.map(async (key) => {
            const lookupTableAccount = await connection.getAddressLookupTable(
              new PublicKey(key)
            );
            return lookupTableAccount.value; // Ensure the lookup table is found
          })
        );

        // 🚀 Append Lookup Tables to Transaction
        transaction.addressTableLookups = lookupTables.filter(Boolean);
      }

      // 🔏 Sign the transaction
      transaction.sign([owner]);

      // 🚀 Send the transaction
      const txId = await connection.sendTransaction(transaction, {
        skipPreflight: true,
      });

      console.log(`${idx} transaction sending..., txId: ${txId}`);

      // 🔄 Confirm transaction
      const { lastValidBlockHeight, blockhash } =
        await connection.getLatestBlockhash({ commitment: "finalized" });
      await connection.confirmTransaction(
        {
          blockhash,
          lastValidBlockHeight,
          signature: txId,
        },
        "confirmed"
      );
      console.log(`${idx} transaction confirmed`);
    }

    return swapTransactions;
  } catch (error) {
    console.error("Trade execution failed:", error);

    if (error.logs) {
      console.error("Transaction Logs:", error.logs);
    }

    return null;
  }
}

// executeTrade("h5NciPdMZ5QCB5BYETJMYBMpVx9ZuitR6HcVjyBhood");

import { Connection, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction, Keypair } from '@solana/web3.js';
import { TRADE_AMOUNT, MAX_SLIPPAGE } from '../config';

export class TradingService {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async executeTrade(tokenAddress: string): Promise<string> {
    try {
      console.log(`Preparing trade for token: ${tokenAddress}`);
      console.log(`Trade amount: ${TRADE_AMOUNT} SOL`);
      console.log(`Max slippage: ${MAX_SLIPPAGE * 100}%`);

      // Create a new keypair for the transaction
      const feePayer = Keypair.generate();

      // Request airdrop for testing (remove in production)
      const airdropSignature = await this.connection.requestAirdrop(
        feePayer.publicKey,
        TRADE_AMOUNT * 1e9 // Convert SOL to lamports
      );
      await this.connection.confirmTransaction(airdropSignature);

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: feePayer.publicKey,
          toPubkey: new PublicKey(tokenAddress),
          lamports: TRADE_AMOUNT * 1e9,
        })
      );

      // Send and confirm transaction
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [feePayer]
      );

      console.log(`Trade executed successfully! Signature: ${signature}`)
      return signature;

    } catch (error) {
      console.error('Error executing trade:', error);
      throw error;
    }
  }
}
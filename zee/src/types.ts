export interface Tweet {
    contents: string;
    id: string;
    createdAt: string;
  }
  
  export interface TokenData {
    lpSignature: string;
    creator: string;
    timestamp: string;
    baseInfo: {
      baseAddress: string;
      baseDecimals: number;
      baseLpAmount: number;
    };
    quoteInfo: {
      quoteAddress: string;
      quoteDecimals: number;
      quoteLpAmount: number;
    };
    logs: string[];
    rugCheckResult: any;
  }
  
  export interface MemecoinAnalysis {
    tokenAddress: string;
    tweetId: string;
    rugCheckScore: number;
    isScam: boolean;
    liquidityAmount: number;
    recommendation: 'BUY' | 'AVOID';
    confidence: number;
  }
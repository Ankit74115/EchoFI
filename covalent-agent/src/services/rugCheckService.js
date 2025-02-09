import axios from "axios";

export async function checkRug(mint) {
  try {
    console.log(`Checking rug risk for token: ${mint}`);
    const response = await axios.get(
      `https://api.rugcheck.xyz/v1/tokens/${mint}/report/summary`
    );

    if (response.data) {
      console.log(`RugCheck successful for ${mint}`);
      return {
        score: response.data.score || 0,
        risk: response.data.risks || "unknown",
        warnings: response.data.warnings || [],
        lastUpdated: response.data.lastUpdated || new Date().toISOString(),
      };
    }

    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `RugCheck API error: ${error.response?.status} - ${JSON.stringify(
          error.response?.data
        )}`
      );
    } else {
      console.error(`RugCheck error: ${error}`);
    }
    return null;
  }
}

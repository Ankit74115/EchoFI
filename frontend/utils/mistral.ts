// @ts-nocheck
import { Mistral } from "@mistralai/mistralai";

const mistral = new Mistral({ apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY });

const mistralReasoning = async (transcriptText: string) => {
  const response = await mistral.agents.complete({
    agentId: process.env.NEXT_PUBLIC_MISTRAL_AGENT_ID as string,
    messages: [{ role: "user", content: transcriptText }],
  });

  return JSON.parse(response.choices[0].message.content as string);
};

export default mistralReasoning;

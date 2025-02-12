// @ts-nocheck
import { createClient } from "@deepgram/sdk";

export async function POST(request: Request): Promise<Response> {
  const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);

  const reqBody = await request.json();
  const response = await deepgram.speak.request(
    { text: reqBody.text },
    {
      model: "aura-asteria-en",
      encoding: "linear16",
      container: "wav",
    }
  );

  const audioStream = await response.getStream();
  const reader = audioStream.getReader();
  const chunks = [];

  // Read all chunks from the stream
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const audio = new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], []));

  return new Response(audio);
}

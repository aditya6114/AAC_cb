import type { NextApiRequest, NextApiResponse } from "next";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { CohereEmbeddings } from "@langchain/cohere";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const pineconeIndex = pinecone.Index("lang");

const embeddings = new CohereEmbeddings({
  model: "embed-english-v3.0",
  apiKey: process.env.COHERE_API_KEY!,
});

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-pro",
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { namespace, query } = req.body;
      if (!namespace || !query) {
        return res.status(400).json({ error: "Missing namespace or query" });
      }

      const vectorStore = new PineconeStore(embeddings, {
        pineconeIndex,
        namespace,
      });

      const retrievedDocs = await vectorStore.similaritySearch(query, 3);
      const context = retrievedDocs.map((d) => d.pageContent).join("\n\n");

    const response = await llm.invoke([
    new SystemMessage(
        `You are a medical assistant. The following context comes from a patient’s medical report. 
    Summarize the patient’s full medical history, including chronic conditions, hospitalizations, 
    diagnoses, and functional impairments. Be concise but comprehensive.
    
    \n\n${context}`
    ),
    new HumanMessage(query),

    ]);
      res.status(200).json({ answer: response.content, context: retrievedDocs });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Query failed" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}



import type { NextApiRequest, NextApiResponse } from "next";
import type { Request, Response } from "express";
import multer from "multer";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { CohereEmbeddings } from "@langchain/cohere";
import fs from "fs";

const upload = multer({ dest: "uploads/" });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const pineconeIndex = pinecone.Index("lang");

const embeddings = new CohereEmbeddings({
  model: "embed-english-v3.0",
  apiKey: process.env.COHERE_API_KEY!,
});

// Extend NextApiRequest to include multer's file
interface MulterNextApiRequest extends NextApiRequest {
  file: Express.Multer.File;
}

// Tell Next.js not to use the default bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return new Promise<void>((resolve, reject) => {
      upload.single("file")(req as unknown as Request, res as unknown as Response, async (err: unknown) => {
        if (err instanceof Error) {
          res.status(500).json({ error: err.message });
          return reject(err);
        }

        try {
          const filePath = (req as MulterNextApiRequest).file.path;
          const originalName = (req as MulterNextApiRequest).file.originalname;
          const loader = new PDFLoader(filePath);
          const docs = await loader.load();

          const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
          });
          const allSplits = await splitter.splitDocuments(docs);

          // Use the PDF filename (without extension) as the namespace
          const namespace = originalName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
          const vectorStore = new PineconeStore(embeddings, {
            pineconeIndex,
            namespace,
          });

          await vectorStore.addDocuments(allSplits);

          // remove uploaded file after processing
          fs.unlinkSync(filePath);

          res.status(200).json({ namespace });
          resolve();
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Upload failed" });
          reject(error);
        }
      });
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

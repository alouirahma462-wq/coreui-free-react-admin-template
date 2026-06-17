import { loadPDF } from "./pdfLoader.js";
import { chunkLaw } from "./chunker.js";
import { embedText } from "./embeddings.js";
import { VectorStore } from "../retrieval/vectorStore.js";

class CleanRAG {
  constructor() {
    this.store = new VectorStore(384);
    this.ready = false;
  }

  async build(filePath) {
    const pages = await loadPDF(filePath);
    const chunks = chunkLaw(pages);

    const items = [];

    for (const c of chunks) {
      try {
        const vector = await embedText(c.text);

        items.push({
          vector,
          metadata: {
            text: c.text,
            page: c.page,
            type: c.type
          }
        });
      } catch (e) {}
    }

    this.store.add(items);
    this.ready = true;

    console.log("✅ CLEAN RAG READY:", items.length);
  }

  search(queryVector, k = 5) {
    return this.store.search(queryVector, k);
  }
}

export const cleanRAG = new CleanRAG();
